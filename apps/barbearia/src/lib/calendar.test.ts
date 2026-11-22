import { describe, expect, it } from "vitest";
import { buildIcs, toUtcStamp } from "@/lib/calendar";
import { addVisitorBooking, NOTE_MAX, STATE_VERSION, type DemoState } from "@/lib/demo-state";
import type { BusinessNow } from "@/types/booking";

const now: BusinessNow = { date: "2026-09-30", minutes: 10 * 60 };
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
const input = { serviceId: "corte", professionalId: "rafa", date: "2026-10-01", startMin: 22 * 60 - 40 };

describe("salvar na agenda do celular (.ics)", () => {
  it("converte o horário de Brasília para UTC, inclusive virando o dia", () => {
    expect(toUtcStamp("2026-11-23", 9 * 60 + 40)).toBe("20261123T124000Z");
    expect(toUtcStamp("2026-11-23", 22 * 60)).toBe("20261124T010000Z");
  });

  it("gera um evento com início, fim, lembrete de 1 hora e linhas CRLF", () => {
    const booking = addVisitorBooking(empty, { ...input, startMin: 14 * 60 }, now);
    if (!booking.ok) throw new Error(booking.error);
    const ics = buildIcs(booking.value);
    expect(ics).toContain("DTSTART:20261001T170000Z");
    expect(ics).toContain("DTEND:20261001T174000Z");
    expect(ics).toContain("TRIGGER:-PT1H");
    expect(ics).toContain("UID:BRV-1001@bravus.exemplo");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
    // Vírgula no texto precisa de escape.
    expect(ics).toMatch(/Agendamento de demonstração: a barbearia é fictícia\./);
  });
});

describe("recado para o barbeiro", () => {
  it("guarda o recado sem espaços nas pontas e limitado ao tamanho máximo", () => {
    const long = "  " + "a".repeat(NOTE_MAX + 20) + "  ";
    const result = addVisitorBooking(empty, { ...input, startMin: 14 * 60, note: long }, now);
    if (!result.ok) throw new Error(result.error);
    expect(result.value.note).toHaveLength(NOTE_MAX);
  });

  it("recado vazio não é salvo", () => {
    const result = addVisitorBooking(empty, { ...input, startMin: 14 * 60, note: "   " }, now);
    expect(result.ok && result.value.note).toBeUndefined();
  });
});
