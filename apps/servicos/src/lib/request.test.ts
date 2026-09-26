import { describe, expect, it } from "vitest";
import { portfolioWorks, regions, serviceTypes } from "@/data/services";
import {
  buildRequestMessage,
  checkRegion,
  MAX_PREFERENCES,
  periodsOn,
  togglePreference,
  validateAnswers,
  validatePreferences,
  visitDates,
} from "@/lib/request";

const TODAY = "2026-09-30"; // quarta
const SATURDAY = "2026-10-03";
const SUNDAY = "2026-10-04";

describe("dados", () => {
  it("toda pergunta tem opções e todo trabalho do portfólio aponta para um serviço", () => {
    for (const service of serviceTypes) for (const q of service.questions) expect(q.options.length).toBeGreaterThan(1);
    const ids = new Set(serviceTypes.map((s) => s.id));
    expect(portfolioWorks.every((w) => ids.has(w.serviceId))).toBe(true);
    expect(regions.some((r) => !r.served)).toBe(true);
  });
});

describe("região", () => {
  it("aceita regiões atendidas com a taxa e recusa as demais", () => {
    expect(checkRegion("centro")).toEqual({ ok: true, feeCents: 0 });
    expect(checkRegion("zona-leste")).toEqual({ ok: true, feeCents: 3000 });
    const outside = checkRegion("zona-oeste");
    expect(outside.ok).toBe(false);
    expect(checkRegion("").ok).toBe(false);
  });
});

describe("respostas guiadas", () => {
  const answers = { problema: "Vazamento", local: "Cozinha", urgencia: "Nesta semana" };

  it("exige todas as perguntas do serviço com opções válidas", () => {
    expect(validateAnswers("hidraulica", answers, "")).toBeNull();
    expect(validateAnswers("hidraulica", { ...answers, local: "" }, "")).toMatch(/onde/);
    expect(validateAnswers("hidraulica", { ...answers, local: "Garagem" }, "")).toMatch(/inválida/);
    expect(validateAnswers("hidraulica", answers, "x".repeat(401))).toMatch(/400/);
    expect(validateAnswers("nada", answers, "")).toMatch(/serviço/);
  });
});

describe("disponibilidade", () => {
  it("oferece dias a partir de amanhã, sem domingos, e só manhã aos sábados", () => {
    const dates = visitDates(TODAY);
    expect(dates[0]! > TODAY).toBe(true);
    expect(dates).not.toContain(SUNDAY);
    expect(periodsOn(SATURDAY)).toEqual(["manha"]);
  });

  it("alterna preferências e limita a três", () => {
    let list = togglePreference([], { date: "2026-10-02", period: "tarde" });
    list = togglePreference(list, { date: "2026-10-01", period: "manha" });
    expect(list[0]!.date).toBe("2026-10-01");
    list = togglePreference(list, { date: "2026-10-05", period: "manha" });
    const full = togglePreference(list, { date: "2026-10-06", period: "manha" });
    expect(full).toHaveLength(MAX_PREFERENCES);
    expect(togglePreference(full, { date: "2026-10-01", period: "manha" })).toHaveLength(2);
  });

  it("valida as preferências contra os dias e períodos oferecidos", () => {
    expect(validatePreferences([], TODAY)).toMatch(/ao menos/);
    expect(validatePreferences([{ date: SUNDAY, period: "manha" }], TODAY)).toMatch(/não está disponível/);
    expect(validatePreferences([{ date: SATURDAY, period: "tarde" }], TODAY)).toMatch(/não está disponível/);
    expect(validatePreferences([{ date: SATURDAY, period: "manha" }], TODAY)).toBeNull();
  });
});

describe("mensagem", () => {
  it("reúne serviço, região, respostas e preferências", () => {
    const text = buildRequestMessage({
      code: "RS-1001",
      serviceId: "eletrica",
      regionId: "centro",
      answers: { problema: "Disjuntor desarmando", imovel: "Casa", urgencia: "Hoje (urgente)" },
      details: "Desarma ao ligar o chuveiro",
      preferences: [{ date: "2026-10-01", period: "manha" }],
    });
    expect(text).toContain("Serviço: Elétrica");
    expect(text).toContain("Região: Centro");
    expect(text).toContain("Detalhes: Desarma ao ligar o chuveiro");
    expect(text).toContain("quinta-feira, 1 de outubro, manhã");
  });
});
