import { business, demoCustomerName, getPlan, getService, loyalty, periods } from "@/data/business";
import {
  generateSeedBlocks,
  generateSeedBookings,
  getOpeningWindow,
  listAvailableStarts,
  overlaps,
  validateNewBooking,
  type NewBookingInput,
} from "@/lib/schedule";
import { addDays } from "@/lib/time";
import { generateSeedOrders, movePickupsToCounter, sweepExpiredOrders } from "@/lib/loja";
import type {
  Block,
  Booking,
  CartItem,
  Order,
  BookingStatus,
  BusinessNow,
  PaymentMode,
  Period,
  Subscription,
  WaitEntry,
} from "@/types/booking";

/*
 * Estado da demo: apenas dados fictícios, guardados só neste navegador.
 * Não há reserva real, cobrança real nem sincronização entre visitantes.
 */

export const STORAGE_KEY = "ax-bravus-demo";
/** Tamanho máximo da observação para o barbeiro. */
export const NOTE_MAX = 140;
export const STATE_VERSION = 3;

export interface DemoState {
  version: typeof STATE_VERSION;
  /** Dia em que a agenda de exemplo foi gerada; em outro dia ela é recriada. */
  seedDate: string;
  nextNumber: number;
  bookings: Booking[];
  blocks: Block[];
  waitlist: WaitEntry[];
  /** Clientes sumidos que já receberam a mensagem de retorno. */
  contacted: string[];
  /** Assinatura do cliente de demonstração. */
  subscription: Subscription | null;
  /** Sacola da loja. */
  cart: CartItem[];
  /** Pedidos da loja para retirar na barbearia. */
  orders: Order[];
}

export type Outcome<T> = { ok: true; state: DemoState; value: T } | { ok: false; error: string };

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export function createInitialState(now: BusinessNow): DemoState {
  const blocks = generateSeedBlocks(now);
  const bookings = generateSeedBookings(now, blocks);
  const base: Omit<DemoState, "waitlist"> = {
    version: STATE_VERSION,
    seedDate: now.date,
    nextNumber: 1001,
    bookings,
    blocks,
    contacted: [],
    subscription: null,
    cart: [],
    orders: generateSeedOrders(bookings, now),
  };
  return { ...base, waitlist: generateSeedWaitlist(base, now) };
}

const STATUSES: BookingStatus[] = ["confirmado", "concluido", "cancelado"];
const PAYMENTS: PaymentMode[] = ["sinal", "total", "local", "plano", "recompensa"];

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.serviceId === "string" &&
    typeof b.professionalId === "string" &&
    typeof b.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    Number.isInteger(b.startMin) &&
    Number.isInteger(b.endMin) &&
    Number.isInteger(b.priceCents) &&
    typeof b.customerName === "string" &&
    STATUSES.includes(b.status as BookingStatus) &&
    (b.origin === "seed" || b.origin === "visitor") &&
    PAYMENTS.includes(b.payment as PaymentMode) &&
    Number.isInteger(b.pixCents) &&
    (b.pixStatus === null || b.pixStatus === "pendente" || b.pixStatus === "pago") &&
    (b.presence === "pendente" || b.presence === "confirmada")
  );
}

/** Aceita o estado salvo só se tiver a versão atual, for do dia de hoje e tiver formato válido. */
export function parseStoredState(raw: string | null, today: string): DemoState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<DemoState>;
    if (value.version !== STATE_VERSION || value.seedDate !== today) return null;
    if (!Number.isInteger(value.nextNumber) || !Array.isArray(value.bookings)) return null;
    if (!Array.isArray(value.blocks) || !Array.isArray(value.waitlist) || !Array.isArray(value.contacted)) return null;
    if (!Array.isArray(value.cart) || !Array.isArray(value.orders)) return null;
    if (!value.bookings.every(isBooking)) return null;
    return value as DemoState;
  } catch {
    return null;
  }
}

/* ---------- Pagamento, plano e fidelidade ---------- */

/** Selos do cartão fidelidade do cliente de demonstração. */
export function loyaltyStatus(state: DemoState): { stamps: number; rewardsAvailable: number } {
  const mine = state.bookings.filter((b) => b.origin === "visitor");
  const earned =
    loyalty.demoStartingStamps +
    mine.filter((b) => b.status === "concluido" && (loyalty.stampServiceIds as readonly string[]).includes(b.serviceId))
      .length;
  const redeemed = mine.filter((b) => b.payment === "recompensa" && b.status !== "cancelado").length;
  const total = Math.max(0, earned - redeemed * loyalty.stampsForReward);
  const rewardsAvailable = Math.floor(total / loyalty.stampsForReward);
  // Com recompensa liberada, o cartão aparece cheio até ela ser usada.
  return { stamps: rewardsAvailable > 0 ? loyalty.stampsForReward : total % loyalty.stampsForReward, rewardsAvailable };
}

/** Usos que ainda restam no plano neste mês (0 sem assinatura ativa). */
export function planUsesLeft(state: DemoState): number {
  const sub = state.subscription;
  if (!sub || sub.pixStatus !== "pago") return 0;
  const plan = getPlan(sub.planId);
  return plan ? Math.max(0, plan.usesPerMonth - sub.used) : 0;
}

export function planCovers(state: DemoState, serviceId: string): boolean {
  const plan = state.subscription ? getPlan(state.subscription.planId) : undefined;
  return Boolean(plan && (plan.serviceIds as readonly string[]).includes(serviceId) && planUsesLeft(state) > 0);
}

/** Formas de pagamento disponíveis para o serviço, na ordem em que aparecem para o cliente. */
export function paymentOptions(state: DemoState, serviceId: string): PaymentMode[] {
  const options: PaymentMode[] = [];
  if (planCovers(state, serviceId)) options.push("plano");
  if (serviceId === loyalty.rewardServiceId && loyaltyStatus(state).rewardsAvailable > 0) options.push("recompensa");
  options.push("sinal", "total", "local");
  return options;
}

/** Quanto vai por Pix no agendamento. */
export function pixAmount(mode: PaymentMode, priceCents: number): number {
  if (mode === "sinal") return Math.min(business.depositCents, priceCents);
  if (mode === "total") return priceCents;
  return 0;
}

/** Quanto falta pagar na barbearia. */
export function dueAtShop(booking: Pick<Booking, "payment" | "priceCents" | "pixCents" | "pixStatus">): number {
  if (booking.payment === "plano" || booking.payment === "recompensa") return 0;
  return booking.priceCents - (booking.pixStatus === "pago" ? booking.pixCents : 0);
}

/* ---------- Agendamento do visitante ---------- */

export function addVisitorBooking(
  state: DemoState,
  input: NewBookingInput,
  now: BusinessNow,
  payment: PaymentMode = "local",
  nowMs = 0,
): Outcome<Booking> {
  const error = validateNewBooking(input, state.bookings, now, undefined, state.blocks);
  if (error) return fail(error);

  const service = getService(input.serviceId);
  if (!service) return fail("Serviço inválido.");
  if (!paymentOptions(state, service.id).includes(payment)) return fail("Esta forma de pagamento não está disponível.");

  const pixCents = pixAmount(payment, service.priceCents);
  const booking: Booking = {
    id: `BRV-${state.nextNumber}`,
    serviceId: service.id,
    professionalId: input.professionalId,
    date: input.date,
    startMin: input.startMin,
    endMin: input.startMin + service.durationMin,
    priceCents: service.priceCents,
    customerName: demoCustomerName,
    status: "confirmado",
    origin: "visitor",
    payment,
    pixCents,
    pixStatus: pixCents > 0 ? "pendente" : null,
    presence: "pendente",
    ...(pixCents > 0 ? { pixExpiresAt: nowMs + business.pixExpiresMin * 60_000 } : {}),
    ...(input.note?.trim() ? { note: input.note.trim().slice(0, NOTE_MAX) } : {}),
  };

  const subscription =
    payment === "plano" && state.subscription ? { ...state.subscription, used: state.subscription.used + 1 } : state.subscription;

  return {
    ok: true,
    value: booking,
    state: { ...state, subscription, nextNumber: state.nextNumber + 1, bookings: [...state.bookings, booking] },
  };
}

function updateBooking(state: DemoState, id: string, change: (booking: Booking) => Booking | string): Outcome<Booking> {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return fail("Agendamento não encontrado.");
  const updated = change(booking);
  if (typeof updated === "string") return fail(updated);
  return {
    ok: true,
    value: updated,
    state: { ...state, bookings: state.bookings.map((item) => (item.id === id ? updated : item)) },
  };
}

export function payPix(state: DemoState, id: string): Outcome<Booking> {
  return updateBooking(state, id, (booking) =>
    booking.pixStatus === "pendente" && booking.status === "confirmado" ? { ...booking, pixStatus: "pago" } : "Não há Pix pendente.",
  );
}

/** O Pix não foi pago no prazo: o horário volta para a agenda. */
export function expirePix(state: DemoState, id: string): Outcome<Booking> {
  const result = updateBooking(state, id, (booking) =>
    booking.pixStatus === "pendente" && booking.status === "confirmado"
      ? { ...booking, status: "cancelado", cancelledBy: "sistema" }
      : "Não há Pix pendente.",
  );
  return result.ok ? { ...result, state: afterCancel(result.state, result.value) } : result;
}

/** Libera os horários cujo Pix venceu sem pagamento. */
export function sweepExpiredPix(state: DemoState, nowMs: number): DemoState {
  let next = sweepExpiredOrders(state, nowMs);
  for (const booking of state.bookings) {
    if (booking.pixStatus === "pendente" && booking.status === "confirmado" && (booking.pixExpiresAt ?? 0) <= nowMs) {
      const result = expirePix(next, booking.id);
      if (result.ok) next = result.state;
    }
  }
  return next;
}

/** Minutos que faltam para o horário começar. */
function minutesUntil(booking: Booking, now: BusinessNow): number {
  const days = Math.round((Date.parse(booking.date) - Date.parse(now.date)) / 86_400_000);
  return days * 24 * 60 + booking.startMin - now.minutes;
}

/** O cliente ainda pode remarcar ou cancelar sozinho? */
export function canChangeOnline(booking: Booking, now: BusinessNow): boolean {
  return booking.status === "confirmado" && minutesUntil(booking, now) >= business.changeDeadlineMin;
}

/** Ao cancelar um horário: devolve o uso do plano e passa as compras dele para o balcão. */
function afterCancel(state: DemoState, booking: Booking): DemoState {
  return movePickupsToCounter(returnPlanUse(state, booking), booking);
}

function returnPlanUse(state: DemoState, booking: Booking): DemoState {
  if (booking.payment !== "plano" || booking.origin !== "visitor" || !state.subscription) return state;
  return { ...state, subscription: { ...state.subscription, used: Math.max(0, state.subscription.used - 1) } };
}

export function cancelByCustomer(state: DemoState, id: string, now: BusinessNow): Outcome<Booking> {
  const result = updateBooking(state, id, (booking) => {
    if (booking.status !== "confirmado") return "Este agendamento não está ativo.";
    if (!canChangeOnline(booking, now)) {
      return `Pelo site, só dá para cancelar até ${business.changeDeadlineMin / 60} horas antes. Fale com a barbearia.`;
    }
    return { ...booking, status: "cancelado", cancelledBy: "cliente", refunded: booking.pixStatus === "pago" };
  });
  return result.ok ? { ...result, state: afterCancel(result.state, result.value) } : result;
}

export function reschedule(state: DemoState, id: string, date: string, startMin: number, now: BusinessNow): Outcome<Booking> {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return fail("Agendamento não encontrado.");
  if (!canChangeOnline(booking, now)) {
    return fail(`Pelo site, só dá para remarcar até ${business.changeDeadlineMin / 60} horas antes. Fale com a barbearia.`);
  }
  const error = validateNewBooking(
    { serviceId: booking.serviceId, professionalId: booking.professionalId, date, startMin },
    state.bookings,
    now,
    booking.id,
    state.blocks,
  );
  if (error) return fail(error);
  return updateBooking(state, id, (current) => ({
    ...current,
    date,
    startMin,
    endMin: startMin + (current.endMin - current.startMin),
    presence: "pendente",
  }));
}

export function confirmPresence(state: DemoState, id: string): Outcome<Booking> {
  return updateBooking(state, id, (booking) =>
    booking.status === "confirmado" ? { ...booking, presence: "confirmada" } : "Este agendamento não está ativo.",
  );
}

/* ---------- Painel: situação do agendamento ---------- */

/** Transições permitidas no painel demonstrativo. */
export function allowedTransitions(status: BookingStatus): BookingStatus[] {
  if (status === "confirmado") return ["concluido", "cancelado"];
  if (status === "cancelado") return ["confirmado"];
  return [];
}

export function changeBookingStatus(
  state: DemoState,
  id: string,
  next: BookingStatus,
  now: BusinessNow,
): Outcome<Booking> {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return fail("Agendamento não encontrado.");
  if (!allowedTransitions(booking.status).includes(next)) {
    return fail("Esta alteração não é permitida para o estado atual.");
  }

  if (next === "confirmado") {
    // Reativar exige que o horário continue livre e no futuro.
    const error = validateNewBooking(
      { serviceId: booking.serviceId, professionalId: booking.professionalId, date: booking.date, startMin: booking.startMin },
      state.bookings,
      now,
      booking.id,
      state.blocks,
    );
    if (error) return fail(`Não foi possível reativar: ${error.toLowerCase()}`);
  }

  const updated: Booking =
    next === "cancelado"
      ? { ...booking, status: next, cancelledBy: "barbearia", refunded: booking.pixStatus === "pago" }
      : next === "confirmado"
        ? { ...booking, status: next, cancelledBy: undefined, refunded: undefined }
        : { ...booking, status: next };
  const bookings = state.bookings.map((item) => (item.id === id ? updated : item));
  const after = { ...state, bookings };
  return { ok: true, value: updated, state: next === "cancelado" ? afterCancel(after, updated) : after };
}

/* ---------- Bloqueios ---------- */

export interface NewBlockInput {
  professionalId: string;
  date: string;
  startMin: number;
  endMin: number;
  reason: string;
}

export function addBlock(state: DemoState, input: NewBlockInput, now?: BusinessNow): Outcome<Block> {
  const window = getOpeningWindow(input.date);
  if (!window) return fail("A barbearia está fechada neste dia.");
  if (now && (input.date < now.date || (input.date === now.date && input.endMin <= now.minutes))) {
    return fail("Esse horário já passou.");
  }
  if (input.endMin <= input.startMin) return fail("O fim do bloqueio precisa ser depois do início.");
  if (input.startMin < window.openMin || input.endMin > window.closeMin) return fail("O bloqueio precisa estar dentro do horário de funcionamento.");
  const clash = state.bookings.filter(
    (b) =>
      b.status === "confirmado" &&
      b.professionalId === input.professionalId &&
      b.date === input.date &&
      overlaps(input.startMin, input.endMin, b.startMin, b.endMin),
  );
  if (clash.length > 0) {
    return fail(
      `Há ${clash.length} ${clash.length === 1 ? "agendamento" : "agendamentos"} nesse intervalo. Cancele ou remarque antes de bloquear.`,
    );
  }
  const block: Block = { id: `BLQ-${state.nextNumber}`, ...input, reason: input.reason.trim() || "Bloqueado" };
  return { ok: true, value: block, state: { ...state, nextNumber: state.nextNumber + 1, blocks: [...state.blocks, block] } };
}

export function removeBlock(state: DemoState, id: string): Outcome<Block> {
  const block = state.blocks.find((item) => item.id === id);
  if (!block) return fail("Bloqueio não encontrado.");
  return { ok: true, value: block, state: { ...state, blocks: state.blocks.filter((item) => item.id !== id) } };
}

/* ---------- Lista de espera ---------- */

export interface Opening {
  entry: WaitEntry;
  professionalId: string;
  startMin: number;
}

/** Primeiro horário livre que atende ao pedido da lista de espera, ou `null`. */
export function findOpening(state: DemoState, entry: WaitEntry, now: BusinessNow): Omit<Opening, "entry"> | null {
  const service = getService(entry.serviceId);
  if (!service) return null;
  const period = periods[entry.period];
  const pros = entry.professionalId === "qualquer" ? service.professionalIds : [entry.professionalId];
  for (const professionalId of pros) {
    const starts = listAvailableStarts({
      date: entry.date,
      service,
      professionalId,
      bookings: state.bookings,
      now,
      blocks: state.blocks,
    }).filter((start) => start >= period.startMin && start < period.endMin);
    if (starts[0] !== undefined) return { professionalId, startMin: starts[0] };
  }
  return null;
}

/** Pedidos da lista de espera que já têm vaga, na ordem de chegada. */
export function waitlistOpenings(state: DemoState, now: BusinessNow): Opening[] {
  return state.waitlist
    .filter((entry) => entry.status !== "encaixado" && entry.date >= now.date)
    .flatMap((entry) => {
      const opening = findOpening(state, entry, now);
      return opening ? [{ entry, ...opening }] : [];
    });
}

export interface NewWaitInput {
  serviceId: string;
  professionalId: string;
  date: string;
  period: Period;
}

export function joinWaitlist(state: DemoState, input: NewWaitInput, now: BusinessNow): Outcome<WaitEntry> {
  const service = getService(input.serviceId);
  if (!service) return fail("Serviço inválido.");
  if (input.professionalId !== "qualquer" && !service.professionalIds.includes(input.professionalId)) {
    return fail("Este profissional não realiza o serviço escolhido.");
  }
  if (input.date < now.date || input.date > addDays(now.date, business.bookingWindowDays - 1)) {
    return fail("Data fora da agenda disponível.");
  }
  if (!getOpeningWindow(input.date)) return fail("A barbearia está fechada neste dia.");
  const duplicate = state.waitlist.some(
    (entry) =>
      entry.origin === "visitor" &&
      entry.status !== "encaixado" &&
      entry.date === input.date &&
      entry.period === input.period &&
      entry.serviceId === input.serviceId,
  );
  if (duplicate) return fail("Você já está na lista de espera para este dia e período.");
  const entry: WaitEntry = {
    id: `ESP-${state.nextNumber}`,
    customerName: demoCustomerName,
    ...input,
    status: "aguardando",
    origin: "visitor",
  };
  return { ok: true, value: entry, state: { ...state, nextNumber: state.nextNumber + 1, waitlist: [...state.waitlist, entry] } };
}

export function leaveWaitlist(state: DemoState, id: string): Outcome<WaitEntry> {
  const entry = state.waitlist.find((item) => item.id === id);
  if (!entry) return fail("Pedido não encontrado.");
  return { ok: true, value: entry, state: { ...state, waitlist: state.waitlist.filter((item) => item.id !== id) } };
}

export function notifyWaiting(state: DemoState, id: string): Outcome<WaitEntry> {
  const entry = state.waitlist.find((item) => item.id === id);
  if (!entry) return fail("Pedido não encontrado.");
  const updated: WaitEntry = { ...entry, status: "avisado" };
  return { ok: true, value: updated, state: { ...state, waitlist: state.waitlist.map((e) => (e.id === id ? updated : e)) } };
}

/** Encaixa o pedido da lista de espera no primeiro horário livre do período. */
export function fitFromWaitlist(state: DemoState, id: string, now: BusinessNow): Outcome<Booking> {
  const entry = state.waitlist.find((item) => item.id === id);
  if (!entry || entry.status === "encaixado") return fail("Pedido não encontrado.");
  const opening = findOpening(state, entry, now);
  if (!opening) return fail("Ainda não há horário livre para este pedido.");
  const service = getService(entry.serviceId)!;
  const booking: Booking = {
    id: entry.origin === "visitor" ? `BRV-${state.nextNumber}` : `ENC-${state.nextNumber}`,
    serviceId: service.id,
    professionalId: opening.professionalId,
    date: entry.date,
    startMin: opening.startMin,
    endMin: opening.startMin + service.durationMin,
    priceCents: service.priceCents,
    customerName: entry.customerName,
    status: "confirmado",
    origin: entry.origin,
    payment: "local",
    pixCents: 0,
    pixStatus: null,
    presence: "confirmada",
    fromWaitlist: true,
  };
  return {
    ok: true,
    value: booking,
    state: {
      ...state,
      nextNumber: state.nextNumber + 1,
      bookings: [...state.bookings, booking],
      waitlist: state.waitlist.map((item) => (item.id === id ? { ...item, status: "encaixado" } : item)),
    },
  };
}

/** Pedidos de exemplo na lista de espera: em dias e períodos que estão cheios agora. */
function generateSeedWaitlist(state: Omit<DemoState, "waitlist">, now: BusinessNow): WaitEntry[] {
  const wishes: Array<{ customerName: string; serviceId: string; professionalId: string; period: Period }> = [
    { customerName: "Caio M.", serviceId: "degrade", professionalId: "leo", period: "noite" },
    { customerName: "Igor N.", serviceId: "corte", professionalId: "qualquer", period: "manha" },
    { customerName: "Rodrigo B.", serviceId: "combo", professionalId: "rafa", period: "tarde" },
  ];
  const full = { ...state, waitlist: [] } as DemoState;
  const entries: WaitEntry[] = [];
  wishes.forEach((wish, index) => {
    // Procura, a partir de amanhã, o primeiro dia em que o pedido ainda não cabe.
    let date = addDays(now.date, 1 + index);
    for (let offset = 1; offset < 7; offset += 1) {
      const candidate = addDays(now.date, offset);
      if (!getOpeningWindow(candidate)) continue;
      const probe: WaitEntry = { id: "", ...wish, date: candidate, status: "aguardando", origin: "seed" };
      if (!findOpening(full, probe, now)) {
        date = candidate;
        break;
      }
    }
    entries.push({ id: `ESP-${index + 1}`, ...wish, date, status: "aguardando", origin: "seed" });
  });
  return entries;
}

/* ---------- Clientes e assinatura ---------- */

export function markContacted(state: DemoState, name: string): DemoState {
  return state.contacted.includes(name) ? state : { ...state, contacted: [...state.contacted, name] };
}

export function subscribe(state: DemoState, planId: string): Outcome<Subscription> {
  if (!getPlan(planId)) return fail("Plano não encontrado.");
  if (state.subscription?.pixStatus === "pago") return fail("Você já tem um plano ativo. Cancele antes de trocar.");
  const subscription: Subscription = { planId, used: 0, pixStatus: "pendente" };
  return { ok: true, value: subscription, state: { ...state, subscription } };
}

export function paySubscription(state: DemoState): Outcome<Subscription> {
  if (!state.subscription || state.subscription.pixStatus !== "pendente") return fail("Não há mensalidade pendente.");
  const subscription: Subscription = { ...state.subscription, pixStatus: "pago" };
  return { ok: true, value: subscription, state: { ...state, subscription } };
}

export function cancelSubscription(state: DemoState): DemoState {
  return { ...state, subscription: null };
}
