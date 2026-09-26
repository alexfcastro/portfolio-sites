import { describe, expect, it } from "vitest";
import { getModality, getTeacher, modalities, plans, teachers, weeklyClasses } from "@/data/studio";
import {
  buildTrialMessage,
  filterOccurrences,
  findOccurrence,
  listOccurrences,
  periodOf,
  seedEnrolled,
  spotsLeft,
  validateTrial,
  type Trial,
} from "@/lib/schedule";

const TODAY = "2026-09-28"; // segunda
const now = { date: TODAY, minutes: 8 * 60 };
const all = { date: "todos", modalityId: "todos", teacherId: "todos", period: "todos" } as const;

describe("dados", () => {
  it("cada aula referencia modalidade e professor existentes, e o professor dá essa modalidade", () => {
    for (const c of weeklyClasses) {
      expect(getModality(c.modalityId), c.id).toBeDefined();
      expect(getTeacher(c.teacherId)?.modalityIds, c.id).toContain(c.modalityId);
      expect(c.capacity).toBeGreaterThan(0);
    }
    expect(new Set(weeklyClasses.map((c) => c.id)).size).toBe(weeklyClasses.length);
    expect(weeklyClasses.some((c) => c.weekday === 0)).toBe(false);
    for (const m of modalities) expect(weeklyClasses.some((c) => c.modalityId === m.id), m.id).toBe(true);
    expect(teachers.every((t) => weeklyClasses.some((c) => c.teacherId === t.id))).toBe(true);
    expect(plans.every((p) => Number.isInteger(p.monthlyCents))).toBe(true);
  });
});

describe("grade", () => {
  const week = listOccurrences(TODAY);

  it("lista a semana em ordem, sem domingo", () => {
    expect(week).toHaveLength(weeklyClasses.length);
    expect(week.some((o) => o.date === "2026-10-04")).toBe(false);
    expect(week[0]!.key).toBe("seg-0630-funcional@2026-09-28");
  });

  it("filtros combinam dia, modalidade, professor e período", () => {
    expect(filterOccurrences(week, { ...all, modalityId: "bike" }).every((o) => o.template.modalityId === "bike")).toBe(true);
    const noiteNina = filterOccurrences(week, { ...all, teacherId: "nina", period: "noite" });
    expect(noiteNina.map((o) => o.template.id)).toEqual(["ter-1800-hiit", "sex-1830-funcional"]);
    expect(filterOccurrences(week, { ...all, date: "2026-10-03" })).toHaveLength(3);
    expect(filterOccurrences(week, { ...all, modalityId: "yoga", teacherId: "caio" })).toEqual([]);
    expect([periodOf(6 * 60 + 30), periodOf(12 * 60), periodOf(18 * 60)]).toEqual(["manha", "tarde", "noite"]);
  });

  it("vagas de exemplo respeitam a capacidade e algumas aulas lotam", () => {
    for (const o of week) {
      const enrolled = seedEnrolled(o);
      expect(enrolled).toBeGreaterThanOrEqual(0);
      expect(enrolled).toBeLessThanOrEqual(o.template.capacity);
    }
    const nextWeeks = listOccurrences(TODAY, 28);
    expect(nextWeeks.some((o) => spotsLeft(o, []) === 0)).toBe(true);
    expect(nextWeeks.filter((o) => spotsLeft(o, []) > 0).length).toBeGreaterThan(nextWeeks.length / 2);
  });

  it("chave de aula inválida ou com dia da semana errado não é aceita", () => {
    expect(findOccurrence("seg-0630-funcional@2026-09-29")).toBeNull();
    expect(findOccurrence("inexistente@2026-09-28")).toBeNull();
    expect(findOccurrence("seg-0630-funcional@2026-09-28")?.template.teacherId).toBe("nina");
  });
});

describe("aula experimental", () => {
  const week = listOccurrences(TODAY);
  const open = week.find((o) => o.date > TODAY && spotsLeft(o, []) > 0)!;
  const full = listOccurrences(TODAY, 28).find((o) => spotsLeft(o, []) === 0)!;
  const input = { occurrenceKey: open.key, nickname: "Jô", level: "Nunca treinei" };

  it("aceita reserva válida e mostra a mensagem com código e aula", () => {
    expect(validateTrial(input, [], now)).toBeNull();
    const trial: Trial = { id: "PS-1001", occurrenceKey: open.key, nickname: "Jô", level: "Nunca treinei", status: "reservada" };
    const message = buildTrialMessage(trial);
    expect(message).toContain("PS-1001");
    expect(message).toContain(getModality(open.template.modalityId)!.name);
  });

  it("uma reserva ativa por vez; a reserva ocupa vaga", () => {
    const trial: Trial = { id: "PS-1001", occurrenceKey: open.key, nickname: "Jô", level: "Nunca treinei", status: "reservada" };
    expect(validateTrial(input, [trial], now)).toMatch(/já tem uma aula experimental/);
    expect(validateTrial(input, [{ ...trial, status: "cancelada" }], now)).toBeNull();
    expect(spotsLeft(open, [trial])).toBe(spotsLeft(open, []) - 1);
  });

  it("recusa aula lotada, já começada ou dentro dos 30 minutos finais, e apelido vazio", () => {
    expect(validateTrial({ ...input, occurrenceKey: full.key }, [], { date: addDaysBefore(full.date), minutes: 0 })).toMatch(/lotada/);
    const first = week[0]!; // segunda 06:30
    expect(validateTrial({ ...input, occurrenceKey: first.key }, [], { date: TODAY, minutes: 6 * 60 + 5 })).toMatch(/fecharam/);
    expect(validateTrial({ ...input, occurrenceKey: first.key }, [], { date: TODAY, minutes: 6 * 60 + 1 })).toMatch(/fecharam/);
    expect(validateTrial({ ...input, occurrenceKey: first.key }, [], { date: TODAY, minutes: 6 * 60 })).toBeNull();
    expect(validateTrial({ ...input, nickname: "  " }, [], now)).toMatch(/como podemos/);
    expect(validateTrial({ ...input, level: "Atleta" }, [], now)).toMatch(/nível/);
    expect(validateTrial({ ...input, occurrenceKey: "sab-1100-bike@2026-10-10" }, [], now)).toMatch(/não encontrada/);
  });
});

function addDaysBefore(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
