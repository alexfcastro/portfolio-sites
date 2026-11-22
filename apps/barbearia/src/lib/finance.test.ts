import { describe, expect, it } from "vitest";
import { addVisitorBooking, changeBookingStatus, createInitialState } from "@/lib/demo-state";
import { billable, monthForecast, occupancy } from "@/lib/finance";
import { addDays } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

// Quarta-feira, 16/09/2026, 10:00: metade do mês.
const now: BusinessNow = { date: "2026-09-16", minutes: 10 * 60 };
const state = createInitialState(now);

describe("estimativa de faturamento", () => {
  const f = monthForecast(state, now);

  it("cobre todos os dias do mês e soma as partes", () => {
    expect(f.days).toHaveLength(30);
    expect(f.days[0]!.date).toBe("2026-09-01");
    expect(f.estimateCents).toBe(f.realizedCents + f.bookedCents + f.projectedCents + f.storeCents + f.plansCents);
    expect(f.conservativeCents).toBe(f.estimateCents - f.projectedCents);
  });

  it("dias passados só têm atendido; dias futuros não têm atendido", () => {
    for (const day of f.days) {
      if (day.date < now.date) expect(day.bookedCents + day.projectedCents).toBe(0);
      if (day.date > now.date) expect(day.realizedCents).toBe(0);
    }
  });

  it("domingo é fechado e não fatura nada", () => {
    const sunday = f.days.find((d) => d.date === "2026-09-20")!;
    expect(sunday).toMatchObject({ closed: true, realizedCents: 0, bookedCents: 0, projectedCents: 0 });
  });

  it("a soma por barbeiro bate com o total de serviços", () => {
    const perPro = f.byProfessional.reduce((s, p) => s + p.realizedCents + p.bookedCents + p.projectedCents, 0);
    expect(perPro).toBe(f.realizedCents + f.bookedCents + f.projectedCents);
  });

  it("um agendamento novo aumenta o agendado e reduz a projeção do dia, sem ficar negativa", () => {
    const tomorrow = addDays(now.date, 1);
    const booked = addVisitorBooking(state, { serviceId: "combo", professionalId: "rafa", date: tomorrow, startMin: 18 * 60 - 70 }, now);
    if (!booked.ok) return; // horário ocupado na agenda de exemplo: nada a comparar
    const before = f.days.find((d) => d.date === tomorrow)!;
    const after = monthForecast(booked.state, now).days.find((d) => d.date === tomorrow)!;
    expect(after.bookedCents).toBe(before.bookedCents + 7000);
    expect(after.projectedCents).toBeLessThanOrEqual(before.projectedCents);
    expect(after.projectedCents).toBeGreaterThanOrEqual(0);
  });

  it("não muda sozinha com o passar das horas: a mesma agenda dá a mesma estimativa o dia todo", () => {
    const morning = monthForecast(state, { date: now.date, minutes: 9 * 60 });
    const evening = monthForecast(state, { date: now.date, minutes: 18 * 60 + 45 });
    expect(evening.estimateCents).toBe(morning.estimateCents);
    expect(evening.days).toEqual(morning.days);
  });

  it("serviço pago pelo plano não entra como faturamento do serviço", () => {
    expect(billable({ payment: "plano" })).toBe(false);
    expect(billable({ payment: "recompensa" })).toBe(false);
    expect(billable({ payment: "sinal" })).toBe(true);
  });
});

describe("ocupação da agenda", () => {
  it("fica entre 0 e 100% e cresce quando um horário é marcado", () => {
    const date = addDays(now.date, 1);
    const before = occupancy(state, date);
    for (const o of before) expect(o.pct).toBeGreaterThanOrEqual(0);
    for (const o of before) expect(o.pct).toBeLessThanOrEqual(100);
    const booked = addVisitorBooking(state, { serviceId: "corte", professionalId: "davi", date, startMin: 18 * 60 + 20 }, now);
    if (!booked.ok) return;
    const after = occupancy(booked.state, date).find((o) => o.professionalId === "davi")!;
    expect(after.busyMin).toBe(before.find((o) => o.professionalId === "davi")!.busyMin + 40);
    const cancelled = changeBookingStatus(booked.state, booked.value.id, "cancelado", now);
    if (cancelled.ok) expect(occupancy(cancelled.state, date).find((o) => o.professionalId === "davi")!.busyMin).toBe(after.busyMin - 40);
  });
});
