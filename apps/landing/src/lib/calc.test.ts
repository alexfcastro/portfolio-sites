import { describe, expect, it } from "vitest";
import { landings } from "@/data/landings";
import { agendaPrice, coffeePlan, formatBRL, solarEstimate, SOLAR_MAX_BILL, SOLAR_MIN_BILL } from "@/lib/calc";

describe("clube de café", () => {
  it("cobra o preço cheio na entrega mensal", () => {
    const plan = coffeePlan("500", "mensal");
    expect(plan.perDeliveryCents).toBe(6900);
    expect(plan.monthlyCents).toBe(6900);
  });

  it("dá 10% por pacote na entrega quinzenal e soma as duas entregas", () => {
    const plan = coffeePlan("250", "quinzenal");
    expect(plan.perDeliveryCents).toBe(3510);
    expect(plan.monthlyCents).toBe(7020);
  });

  it("usa o primeiro plano quando recebe valores desconhecidos", () => {
    const plan = coffeePlan("x", "y");
    expect(plan.size.id).toBe("250");
    expect(plan.frequency.id).toBe("mensal");
  });
});

describe("simulação solar", () => {
  it("estima 85% da conta e a economia anual", () => {
    const estimate = solarEstimate(40000);
    expect(estimate.monthlySavingCents).toBe(34000);
    expect(estimate.yearlySavingCents).toBe(408000);
    expect(estimate.panels).toBe(6);
  });

  it("limita a conta à faixa do controle", () => {
    expect(solarEstimate(100).billCents).toBe(SOLAR_MIN_BILL);
    expect(solarEstimate(99999999).billCents).toBe(SOLAR_MAX_BILL);
  });

  it("nunca sugere menos de 4 painéis", () => {
    expect(solarEstimate(SOLAR_MIN_BILL).panels).toBe(4);
  });
});

describe("planos do aplicativo", () => {
  it("no anual, cobra o equivalente a 10 meses", () => {
    expect(agendaPrice(3900, false)).toBe(3900);
    expect(agendaPrice(3900, true)).toBe(3250);
  });
});

describe("dados", () => {
  it("formata valores em reais", () => {
    expect(formatBRL(123456).replace(/\s/g, " ")).toBe("R$ 1.234,56");
  });

  it("tem sete landing pages com endereços únicos", () => {
    expect(landings).toHaveLength(7);
    expect(new Set(landings.map((landing) => landing.slug)).size).toBe(landings.length);
  });
});
