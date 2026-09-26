import { describe, expect, it } from "vitest";
import { professionals, specialties } from "@/data/clinic";
import {
  canCancel,
  createRequest,
  datesFor,
  periodsFor,
  professionalsAvailable,
  REQUEST_WINDOW_DAYS,
  simulateConfirmation,
  validateRequest,
  type RequestInput,
} from "@/lib/requests";
import { addDays, getWeekday } from "@/lib/time";

// Quarta-feira.
const TODAY = "2026-09-30";
const MONDAY = "2026-10-05";
const SUNDAY = "2026-10-04";

describe("dados da clínica", () => {
  it("toda especialidade tem ao menos um profissional com agenda", () => {
    for (const specialty of specialties) {
      const pros = professionals.filter((p) => p.specialtyId === specialty.id);
      expect(pros.length, specialty.id).toBeGreaterThan(0);
      expect(pros.some((p) => Object.keys(p.schedule).length > 0), specialty.id).toBe(true);
    }
  });

  it("não atende aos domingos", () => {
    for (const professional of professionals) expect(professional.schedule[0]).toBeUndefined();
  });
});

describe("disponibilidade", () => {
  it("considera só o profissional escolhido ou qualquer um da especialidade", () => {
    expect(professionalsAvailable("clinica-geral", "helena", MONDAY, "manha").map((p) => p.id)).toEqual(["helena"]);
    expect(professionalsAvailable("clinica-geral", "rui", MONDAY, "manha")).toEqual([]);
    expect(professionalsAvailable("clinica-geral", null, MONDAY, "tarde").map((p) => p.id)).toEqual(["helena"]);
  });

  it("começa amanhã, respeita a janela e ignora domingos", () => {
    const dates = datesFor("clinica-geral", null, TODAY);
    expect(dates[0]! > TODAY).toBe(true);
    expect(dates.every((d) => d <= addDays(TODAY, REQUEST_WINDOW_DAYS))).toBe(true);
    expect(dates).not.toContain(SUNDAY);
    expect(periodsFor("clinica-geral", null, TODAY, TODAY)).toEqual([]);
  });

  it("mostra só os dias em que a profissional escolhida atende", () => {
    for (const date of datesFor("dermatologia", "paula", TODAY)) {
      expect([2, 4]).toContain(getWeekday(date));
    }
  });
});

describe("validação da solicitação", () => {
  const input: RequestInput = {
    specialtyId: "clinica-geral",
    professionalId: "helena",
    date: MONDAY,
    period: "manha",
    payment: "particular",
    firstVisit: true,
  };

  it("aceita uma solicitação válida", () => {
    expect(validateRequest(input, TODAY)).toBeNull();
  });

  it("recusa especialidade, profissional, período e forma de atendimento inválidos", () => {
    expect(validateRequest({ ...input, specialtyId: "x" }, TODAY)).toMatch(/especialidade/);
    expect(validateRequest({ ...input, professionalId: "paula" }, TODAY)).toMatch(/não atende/);
    expect(validateRequest({ ...input, professionalId: "rui" }, TODAY)).toMatch(/Não há atendimento/);
    expect(validateRequest({ ...input, date: TODAY }, TODAY)).toMatch(/Não há atendimento/);
    expect(validateRequest({ ...input, payment: "outro" as never }, TODAY)).toMatch(/forma/);
  });
});

describe("ciclo da solicitação", () => {
  const request = createRequest(
    { specialtyId: "nutricao", professionalId: null, date: MONDAY, period: "tarde", payment: "convenio", firstVisit: false },
    1001,
  );

  it("nasce enviada, com identidade fictícia e sem horário", () => {
    expect(request).toMatchObject({ id: "VTA-1001", status: "enviada", patientName: "Paciente de demonstração", confirmedStartMin: null });
  });

  it("a confirmação simulada escolhe profissional disponível e horário dentro do período", () => {
    const confirmed = simulateConfirmation(request)!;
    expect(confirmed.status).toBe("confirmada");
    expect(confirmed.confirmedProfessionalId).toBe("marina");
    expect(confirmed.confirmedStartMin!).toBeGreaterThanOrEqual(13 * 60);
    expect(confirmed.confirmedStartMin! + 50).toBeLessThanOrEqual(18 * 60 + 10);
    expect(simulateConfirmation(confirmed)).toBeNull();
    expect(simulateConfirmation(confirmed)).toBeNull();
  });

  it("só permite cancelar solicitações futuras e ativas", () => {
    expect(canCancel(request, TODAY)).toBe(true);
    expect(canCancel(request, MONDAY)).toBe(false);
    expect(canCancel({ ...request, status: "cancelada" }, TODAY)).toBe(false);
  });
});
