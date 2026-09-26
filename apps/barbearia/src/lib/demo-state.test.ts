import { describe, expect, it } from "vitest";
import {
  addVisitorBooking,
  allowedTransitions,
  changeBookingStatus,
  createInitialState,
  parseStoredState,
  STATE_VERSION,
  type DemoState,
} from "@/lib/demo-state";
import { addDays } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

const now: BusinessNow = { date: "2026-09-30", minutes: 10 * 60 };
// Estado sem agenda de exemplo, para testes previsíveis.
const empty: DemoState = { version: STATE_VERSION, seedDate: now.date, nextNumber: 1001, bookings: [] };
const input = { serviceId: "combo", professionalId: "leo", date: addDays(now.date, 1), startMin: 14 * 60 };

describe("agendamento do visitante", () => {
  it("cria um agendamento confirmado, com identidade fictícia e valor do serviço", () => {
    const result = addVisitorBooking(empty, input, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      id: "BRV-1001",
      status: "confirmado",
      origin: "visitor",
      customerName: "Cliente de demonstração",
      endMin: 14 * 60 + 70,
      priceCents: 7000,
    });
    expect(result.state.nextNumber).toBe(1002);
    expect(empty.bookings).toHaveLength(0); // não altera o estado anterior
  });

  it("recusa o mesmo horário duas vezes", () => {
    const first = addVisitorBooking(empty, input, now);
    if (!first.ok) throw new Error("primeiro agendamento deveria passar");
    const second = addVisitorBooking(first.state, { ...input, serviceId: "barba", startMin: 14 * 60 + 20 }, now);
    expect(second.ok).toBe(false);
  });
});

describe("painel: mudança de estado", () => {
  const created = addVisitorBooking(empty, input, now);
  if (!created.ok) throw new Error("setup");
  const id = created.value.id;

  it("permite concluir e cancelar um confirmado, e só reativar um cancelado", () => {
    expect(allowedTransitions("confirmado")).toEqual(["concluido", "cancelado"]);
    expect(allowedTransitions("cancelado")).toEqual(["confirmado"]);
    expect(allowedTransitions("concluido")).toEqual([]);
  });

  it("cancelar libera o horário; reativar volta a ocupá-lo se ainda estiver livre", () => {
    const cancelled = changeBookingStatus(created.state, id, "cancelado", now);
    if (!cancelled.ok) throw new Error(cancelled.error);
    const other = addVisitorBooking(cancelled.state, input, now);
    expect(other.ok).toBe(true);
    if (!other.ok) return;
    // O horário foi reaproveitado: reativar o cancelado agora é recusado.
    const reactivate = changeBookingStatus(other.state, id, "confirmado", now);
    expect(reactivate.ok).toBe(false);
    // Sem conflito, a reativação funciona.
    const ok = changeBookingStatus(cancelled.state, id, "confirmado", now);
    expect(ok.ok).toBe(true);
  });

  it("recusa transições inválidas e ids inexistentes", () => {
    const done = changeBookingStatus(created.state, id, "concluido", now);
    if (!done.ok) throw new Error(done.error);
    expect(changeBookingStatus(done.state, id, "cancelado", now).ok).toBe(false);
    expect(changeBookingStatus(created.state, "nao-existe", "cancelado", now).ok).toBe(false);
  });
});

describe("estado salvo no navegador", () => {
  it("aceita o estado do dia e da versão atuais", () => {
    const state = createInitialState(now);
    expect(parseStoredState(JSON.stringify(state), now.date)).toEqual(state);
  });

  it("descarta estado de outro dia, outra versão, corrompido ou com formato inválido", () => {
    const state = createInitialState(now);
    expect(parseStoredState(JSON.stringify(state), addDays(now.date, 1))).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...state, version: 99 }), now.date)).toBeNull();
    expect(parseStoredState("{quebrado", now.date)).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...state, bookings: [{ id: 1 }] }), now.date)).toBeNull();
    expect(parseStoredState(null, now.date)).toBeNull();
  });
});
