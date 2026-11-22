import { describe, expect, it } from "vitest";
import { business, loyalty } from "@/data/business";
import {
  addBlock,
  addVisitorBooking,
  cancelByCustomer,
  changeBookingStatus,
  confirmPresence,
  createInitialState,
  dueAtShop,
  findOpening,
  fitFromWaitlist,
  joinWaitlist,
  loyaltyStatus,
  paymentOptions,
  paySubscription,
  payPix,
  planUsesLeft,
  reschedule,
  STATE_VERSION,
  subscribe,
  sweepExpiredPix,
  type DemoState,
} from "@/lib/demo-state";
import { missingCustomers, monthByProfessional, subscribersSummary, summarizeDay } from "@/lib/insights";
import { demoPixCode, illustrativeQr } from "@/lib/pix";
import { listAvailableStarts } from "@/lib/schedule";
import { getService } from "@/data/business";
import { addDays } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

// Quarta-feira, 10:00.
const now: BusinessNow = { date: "2026-09-30", minutes: 10 * 60 };
const tomorrow = addDays(now.date, 1);
const empty: DemoState = {
  version: STATE_VERSION,
  seedDate: now.date,
  nextNumber: 1001,
  bookings: [],
  blocks: [],
  waitlist: [],
  contacted: [],
  subscription: null,
  cart: [],
  orders: [],
};
const corte = { serviceId: "corte", professionalId: "rafa", date: tomorrow, startMin: 14 * 60 };

function book(state: DemoState, payment: Parameters<typeof addVisitorBooking>[3], input = corte) {
  const result = addVisitorBooking(state, input, now, payment, 1_000);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe("Pix antecipado", () => {
  it("sinal cobra o valor fixo por Pix e deixa o resto para o balcão", () => {
    const { value } = book(empty, "sinal");
    expect(value).toMatchObject({ pixCents: business.depositCents, pixStatus: "pendente" });
    expect(value.pixExpiresAt).toBe(1_000 + business.pixExpiresMin * 60_000);
    expect(dueAtShop(value)).toBe(4500); // ainda não pagou o sinal
  });

  it("pagar o Pix confirma; depois disso só falta o restante", () => {
    const created = book(empty, "sinal");
    const paid = payPix(created.state, created.value.id);
    if (!paid.ok) throw new Error(paid.error);
    expect(paid.value.pixStatus).toBe("pago");
    expect(dueAtShop(paid.value)).toBe(4500 - business.depositCents);
  });

  it("Pix vencido libera o horário", () => {
    const created = book(empty, "total");
    const swept = sweepExpiredPix(created.state, created.value.pixExpiresAt! + 1);
    expect(swept.bookings[0]).toMatchObject({ status: "cancelado", cancelledBy: "sistema" });
    // Antes do prazo, nada muda.
    expect(sweepExpiredPix(created.state, 2_000)).toBe(created.state);
  });

  it("pagar na barbearia não gera Pix", () => {
    const { value } = book(empty, "local");
    expect(value).toMatchObject({ pixCents: 0, pixStatus: null });
  });

  it("o código copia e cola é claramente falso e o desenho tem os três cantos", () => {
    expect(demoPixCode("BRV-1", 1000)).toContain("NAO-E-UM-PAGAMENTO-REAL");
    const qr = illustrativeQr("x");
    expect(qr).toHaveLength(29);
    expect(qr[0]!.slice(0, 7).every(Boolean)).toBe(true);
    expect(qr[0]!.slice(22).every(Boolean)).toBe(true);
  });
});

describe("remarcar e cancelar pelo site", () => {
  it("cancelar no prazo devolve o Pix pago", () => {
    const created = book(empty, "total");
    const paid = payPix(created.state, created.value.id);
    if (!paid.ok) throw new Error();
    const cancelled = cancelByCustomer(paid.state, created.value.id, now);
    expect(cancelled.ok && cancelled.value).toMatchObject({ status: "cancelado", cancelledBy: "cliente", refunded: true });
  });

  it("recusa mudar com menos de 2 horas de antecedência", () => {
    const soon = book(empty, "local", { ...corte, date: now.date, startMin: 11 * 60 });
    expect(cancelByCustomer(soon.state, soon.value.id, now).ok).toBe(false);
    expect(reschedule(soon.state, soon.value.id, tomorrow, 15 * 60, now).ok).toBe(false);
  });

  it("remarca para um horário livre, mantendo a duração e pedindo nova confirmação", () => {
    const created = book(empty, "local");
    const confirmed = confirmPresence(created.state, created.value.id);
    if (!confirmed.ok) throw new Error();
    const moved = reschedule(confirmed.state, created.value.id, tomorrow, 16 * 60, now);
    expect(moved.ok && moved.value).toMatchObject({ startMin: 16 * 60, endMin: 16 * 60 + 40, presence: "pendente" });
  });
});

describe("bloqueios do dono", () => {
  it("o horário bloqueado some do site", () => {
    const blocked = addBlock(empty, { professionalId: "rafa", date: tomorrow, startMin: 14 * 60, endMin: 16 * 60, reason: "" });
    if (!blocked.ok) throw new Error(blocked.error);
    const starts = listAvailableStarts({
      date: tomorrow,
      service: getService("corte")!,
      professionalId: "rafa",
      bookings: [],
      now,
      blocks: blocked.state.blocks,
    });
    expect(starts.some((start) => start >= 14 * 60 && start < 16 * 60)).toBe(false);
    expect(addVisitorBooking(blocked.state, corte, now).ok).toBe(false);
  });

  it("não bloqueia horário que já passou", () => {
    expect(addBlock(empty, { professionalId: "rafa", date: now.date, startMin: 9 * 60, endMin: 10 * 60, reason: "" }, now).ok).toBe(false);
  });

  it("não bloqueia por cima de um agendamento confirmado", () => {
    const created = book(empty, "local");
    expect(addBlock(created.state, { professionalId: "rafa", date: tomorrow, startMin: 14 * 60, endMin: 15 * 60, reason: "" }).ok).toBe(
      false,
    );
  });
});

describe("lista de espera", () => {
  it("quando alguém cancela, o pedido da fila encontra a vaga e é encaixado", () => {
    // Ocupa a tarde inteira do Rafa com um bloqueio, menos o horário das 14:00.
    const blocked = addBlock(empty, { professionalId: "rafa", date: tomorrow, startMin: 14 * 60 + 40, endMin: 17 * 60, reason: "" });
    if (!blocked.ok) throw new Error(blocked.error);
    const taken = book(blocked.state, "local");
    const joined = joinWaitlist(taken.state, { serviceId: "corte", professionalId: "rafa", date: tomorrow, period: "tarde" }, now);
    if (!joined.ok) throw new Error(joined.error);
    const afterBlock = addBlock(joined.state, { professionalId: "rafa", date: tomorrow, startMin: 13 * 60, endMin: 14 * 60, reason: "" });
    if (!afterBlock.ok) throw new Error(afterBlock.error);
    expect(findOpening(afterBlock.state, joined.value, now)).toBeNull();

    const cancelled = changeBookingStatus(afterBlock.state, taken.value.id, "cancelado", now);
    if (!cancelled.ok) throw new Error();
    expect(findOpening(cancelled.state, joined.value, now)).toMatchObject({ startMin: 14 * 60, professionalId: "rafa" });
    const fitted = fitFromWaitlist(cancelled.state, joined.value.id, now);
    expect(fitted.ok && fitted.value).toMatchObject({ startMin: 14 * 60, fromWaitlist: true });
    expect(fitted.ok && fitted.state.waitlist[0]!.status).toBe("encaixado");
  });

  it("a agenda de exemplo já vem com pedidos na fila", () => {
    expect(createInitialState(now).waitlist.length).toBeGreaterThan(0);
  });
});

describe("plano e fidelidade", () => {
  it("o plano só vale depois da primeira mensalidade paga e desconta um uso", () => {
    const subscribed = subscribe(empty, "clube-corte");
    if (!subscribed.ok) throw new Error();
    expect(paymentOptions(subscribed.state, "corte")).not.toContain("plano");
    const paid = paySubscription(subscribed.state);
    if (!paid.ok) throw new Error();
    expect(paymentOptions(paid.state, "corte")[0]).toBe("plano");
    expect(paymentOptions(paid.state, "barba")).not.toContain("plano");
    const used = book(paid.state, "plano");
    expect(planUsesLeft(used.state)).toBe(3);
    expect(dueAtShop(used.value)).toBe(0);
    // Cancelar devolve o uso.
    const back = cancelByCustomer(used.state, used.value.id, now);
    expect(back.ok && planUsesLeft(back.state)).toBe(4);
  });

  it("cada corte concluído vale um selo; no décimo, libera a barba", () => {
    expect(loyaltyStatus(empty).stamps).toBe(loyalty.demoStartingStamps);
    let state = empty;
    for (const startMin of [14 * 60, 15 * 60]) {
      const created = book(state, "local", { ...corte, startMin });
      const done = changeBookingStatus(created.state, created.value.id, "concluido", now);
      if (!done.ok) throw new Error();
      state = done.state;
    }
    expect(loyaltyStatus(state)).toEqual({ stamps: 10, rewardsAvailable: 1 });
    expect(paymentOptions(state, "barba")[0]).toBe("recompensa");
    const reward = book(state, "recompensa", { serviceId: "barba", professionalId: "rafa", date: tomorrow, startMin: 16 * 60 });
    expect(loyaltyStatus(reward.state)).toEqual({ stamps: 0, rewardsAvailable: 0 });
  });
});

describe("números do painel", () => {
  const state = createInitialState(now);

  it("o resumo do dia soma previsto e recebido sem valores negativos", () => {
    const day = summarizeDay(state.bookings, now);
    expect(day.total).toBeGreaterThan(0);
    expect(day.receivedCents).toBeGreaterThanOrEqual(day.pixCents);
    expect(day.dueCents).toBeGreaterThanOrEqual(0);
  });

  it("calcula a comissão de cada barbeiro sobre o mês", () => {
    const rows = monthByProfessional(state.bookings, now);
    expect(rows).toHaveLength(3);
    for (const row of rows) expect(row.commissionCents).toBe(Math.round((row.servedCents * business.commissionPct) / 100));
    expect(rows.some((row) => row.count > 0)).toBe(true);
  });

  it("lista clientes sumidos há mais de 30 dias, do mais antigo ao mais recente", () => {
    const missing = missingCustomers(state, now);
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every((item) => item.daysAway > business.missingAfterDays)).toBe(true);
    expect([...missing].sort((a, b) => b.daysAway - a.daysAway)).toEqual(missing);
  });

  it("soma a receita fixa dos assinantes", () => {
    const subs = subscribersSummary(state);
    expect(subs.count).toBe(7);
    expect(subs.monthlyCents).toBe(4 * 12990 + 3 * 21990);
  });
});
