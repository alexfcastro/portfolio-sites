import { business, getService, plans, professionals, services } from "@/data/business";
import { activeCustomers, subscriberPlan } from "@/lib/history";
import { createRandom } from "@/lib/random";
import { addDays, getWeekday } from "@/lib/time";
import type { Block, Booking, BusinessNow, PaymentMode, Service } from "@/types/booking";

export interface OpeningWindow {
  openMin: number;
  closeMin: number;
}

export function getOpeningWindow(date: string): OpeningWindow | null {
  return business.hours[getWeekday(date)] ?? null;
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Datas exibidas no agendamento: de hoje até o fim da janela. */
export function getBookableDates(today: string): string[] {
  return Array.from({ length: business.bookingWindowDays }, (_, index) => addDays(today, index));
}

function fitsOpeningHours(date: string, startMin: number, endMin: number): boolean {
  const window = getOpeningWindow(date);
  if (!window) return false;
  if (startMin < window.openMin || endMin > window.closeMin) return false;
  if (overlaps(startMin, endMin, business.lunch.startMin, business.lunch.endMin)) return false;
  return (startMin - window.openMin) % business.slotStepMin === 0;
}

function isInPast(date: string, startMin: number, now: BusinessNow): boolean {
  if (date < now.date) return true;
  return date === now.date && startMin < now.minutes + business.minLeadMin;
}

function conflicts(
  bookings: readonly Booking[],
  professionalId: string,
  date: string,
  startMin: number,
  endMin: number,
  ignoreId?: string,
  blocks: readonly Block[] = [],
): boolean {
  const busy = bookings.some(
    (booking) =>
      booking.id !== ignoreId &&
      booking.status !== "cancelado" &&
      booking.professionalId === professionalId &&
      booking.date === date &&
      overlaps(startMin, endMin, booking.startMin, booking.endMin),
  );
  return busy || isBlocked(blocks, professionalId, date, startMin, endMin);
}

/** O horário cai num bloqueio feito pelo dono? */
export function isBlocked(
  blocks: readonly Block[],
  professionalId: string,
  date: string,
  startMin: number,
  endMin: number,
): boolean {
  return blocks.some(
    (block) =>
      block.professionalId === professionalId && block.date === date && overlaps(startMin, endMin, block.startMin, block.endMin),
  );
}

export interface SlotQuery {
  date: string;
  service: Service;
  professionalId: string;
  bookings: readonly Booking[];
  now: BusinessNow;
  blocks?: readonly Block[];
  /** Ignora este agendamento (usado ao remarcar). */
  ignoreId?: string;
}

/** Inícios livres (minutos) para o serviço e profissional na data. */
export function listAvailableStarts({
  date,
  service,
  professionalId,
  bookings,
  now,
  blocks = [],
  ignoreId,
}: SlotQuery): number[] {
  const window = getOpeningWindow(date);
  if (!window || !service.professionalIds.includes(professionalId)) return [];

  const starts: number[] = [];
  for (let start = window.openMin; start + service.durationMin <= window.closeMin; start += business.slotStepMin) {
    const end = start + service.durationMin;
    if (!fitsOpeningHours(date, start, end)) continue;
    if (isInPast(date, start, now)) continue;
    if (conflicts(bookings, professionalId, date, start, end, ignoreId, blocks)) continue;
    starts.push(start);
  }
  return starts;
}

export interface NewBookingInput {
  serviceId: string;
  professionalId: string;
  date: string;
  startMin: number;
  /** Observação opcional para o barbeiro. */
  note?: string;
}

/** Revalida tudo no momento de confirmar. Retorna a mensagem de erro ou `null`. */
export function validateNewBooking(
  input: NewBookingInput,
  bookings: readonly Booking[],
  now: BusinessNow,
  ignoreId?: string,
  blocks: readonly Block[] = [],
): string | null {
  const service = getService(input.serviceId);
  if (!service) return "Serviço inválido.";
  if (!service.professionalIds.includes(input.professionalId)) {
    return "Este profissional não realiza o serviço escolhido.";
  }
  const lastDate = addDays(now.date, business.bookingWindowDays - 1);
  if (input.date > lastDate) return "Data fora da agenda disponível.";

  const endMin = input.startMin + service.durationMin;
  if (!fitsOpeningHours(input.date, input.startMin, endMin)) return "Horário fora do funcionamento.";
  if (isInPast(input.date, input.startMin, now)) return "Este horário já passou. Escolha outro.";
  if (isBlocked(blocks, input.professionalId, input.date, input.startMin, endMin)) {
    return "Este horário foi bloqueado pela barbearia. Escolha outro.";
  }
  if (conflicts(bookings, input.professionalId, input.date, input.startMin, endMin, ignoreId)) {
    return "Este horário acabou de ser ocupado. Escolha outro.";
  }
  return null;
}

/** Existe algum início livre (ignorando o relógio) para a duração, no dia do profissional? */
export function hasFreeWindow(
  date: string,
  professionalId: string,
  durationMin: number,
  bookings: readonly Booking[],
  blocks: readonly Block[] = [],
): boolean {
  const window = getOpeningWindow(date);
  if (!window) return false;
  for (let start = window.openMin; start + durationMin <= window.closeMin; start += business.slotStepMin) {
    const end = start + durationMin;
    if (fitsOpeningHours(date, start, end) && !conflicts(bookings, professionalId, date, start, end, undefined, blocks)) {
      return true;
    }
  }
  return false;
}

/**
 * Agenda de exemplo para os próximos 7 dias, sempre relativa à data atual,
 * para que a demo nunca apresente horários vencidos. Sem sobreposição, mais
 * cheia nos primeiros dias e com garantia de vaga: em todo dia futuro, cada
 * profissional mantém ao menos uma janela para o seu serviço mais longo.
 */
export function generateSeedBookings(now: BusinessNow, blocks: readonly Block[] = []): Booking[] {
  const bookings: Booking[] = [];
  const customers = activeCustomers();
  let counter = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    const date = addDays(now.date, offset);
    const window = getOpeningWindow(date);
    if (!window) continue;
    const busyChance = Math.max(0.2, 0.55 - offset * 0.05);
    const namesOfDay = new Set<string>();

    for (const professional of professionals) {
      const random = createRandom(`${date}:${professional.id}`);
      const options = services.filter((service) => service.professionalIds.includes(professional.id));
      const longest = Math.max(...options.map((service) => service.durationMin));
      const dayStartIndex = bookings.length;
      let start = window.openMin;

      while (start < window.closeMin) {
        const service = options[Math.floor(random() * options.length)];
        if (!service) break;
        const end = start + service.durationMin;
        const busy = random() < busyChance;

        if (
          busy &&
          fitsOpeningHours(date, start, end) &&
          !conflicts(bookings, professional.id, date, start, end, undefined, blocks)
        ) {
          const finished = date === now.date && end <= now.minutes;
          // Cada cliente aparece no máximo uma vez por dia.
          const free = customers.filter((name) => !namesOfDay.has(name));
          const pool = free.length > 0 ? free : customers;
          const customerName = pool[Math.floor(random() * pool.length)] ?? "Cliente";
          namesOfDay.add(customerName);
          counter += 1;
          bookings.push({
            id: `EX-${String(counter).padStart(3, "0")}`,
            serviceId: service.id,
            professionalId: professional.id,
            date,
            startMin: start,
            endMin: end,
            priceCents: service.priceCents,
            customerName,
            status: finished ? "concluido" : random() < 0.06 ? "cancelado" : "confirmado",
            origin: "seed",
            ...seedPayment(service, customerName, random()),
            presence: offset === 0 || (offset === 1 && random() < 0.6) ? "confirmada" : "pendente",
          });
          start = end;
          // Mantém o encaixe na grade de horários.
          const offsetFromOpen = (start - window.openMin) % business.slotStepMin;
          if (offsetFromOpen) start += business.slotStepMin - offsetFromOpen;
        } else {
          start += business.slotStepMin;
        }
      }

      // Garantia de vaga nos dias futuros: remove os últimos exemplos até sobrar uma janela.
      if (offset > 0) {
        while (bookings.length > dayStartIndex && !hasFreeWindow(date, professional.id, longest, bookings, blocks)) {
          bookings.pop();
        }
      }
    }
  }

  return bookings.sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
}

/** Forma de pagamento da agenda de exemplo: mistura de sinal, Pix total, plano e pagamento no local. */
function seedPayment(
  service: Service,
  customerName: string,
  roll: number,
): { payment: PaymentMode; pixCents: number; pixStatus: Booking["pixStatus"] } {
  const plan = plans.find((item) => item.id === subscriberPlan(customerName));
  if (plan && (plan.serviceIds as readonly string[]).includes(service.id)) {
    return { payment: "plano", pixCents: 0, pixStatus: null };
  }
  if (roll < 0.4) return { payment: "sinal", pixCents: business.depositCents, pixStatus: "pago" };
  if (roll < 0.6) return { payment: "total", pixCents: service.priceCents, pixStatus: "pago" };
  return { payment: "local", pixCents: 0, pixStatus: null };
}

/** Bloqueio de exemplo: o Davi tem um compromisso num dos próximos dias. */
export function generateSeedBlocks(now: BusinessNow): Block[] {
  for (let offset = 2; offset < 7; offset += 1) {
    const date = addDays(now.date, offset);
    const window = getOpeningWindow(date);
    if (!window || window.closeMin < 17 * 60) continue;
    return [{ id: "BLQ-1", professionalId: "davi", date, startMin: 15 * 60, endMin: 17 * 60, reason: "Consulta médica" }];
  }
  return [];
}
