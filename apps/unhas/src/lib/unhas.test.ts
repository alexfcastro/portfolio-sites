import { describe, expect, it } from "vitest";
import { calcular, catalogo, combinacaoInicial, datasDoPlano, descreverCombinacao, precoPlano, proximosDias } from "@/lib/unhas";
import { getWeekday } from "@/lib/time";

describe("montador da combinação", () => {
  it("combinação inicial: alongamento em gel médio, amendoado e nude", () => {
    const r = calcular(combinacaoInicial);
    expect(r.servico).toBe("Alongamento em gel, formato amendoado");
    expect(r.minutos).toBe(120);
    expect(r.preco).toBe(18000);
    expect(r.manutencaoDias).toBe(15);
  });

  it("unha curta vira banho em gel, com manutenção a cada 21 dias", () => {
    const r = calcular({ ...combinacaoInicial, comprimento: "curta" });
    expect(r.servico).toMatch(/^Banho em gel/);
    expect(r.manutencaoDias).toBe(21);
    expect(r.preco).toBe(11000);
  });

  it("soma formato, cor e decoração no preço e no tempo", () => {
    const r = calcular({ formato: "stiletto", comprimento: "longa", tecnica: "fibra", cor: "francesinha", decoracao: "desenho" });
    expect(r.minutos).toBe(165 + 15 + 15 + 25);
    expect(r.preco).toBe(24000 + 2000 + 1500 + 3000);
  });

  it("stiletto em unha curta vira amendoado, com aviso", () => {
    const r = calcular({ ...combinacaoInicial, formato: "stiletto", comprimento: "curta" });
    expect(r.servico).toContain("amendoado");
    expect(r.avisos.join(" ")).toMatch(/Stiletto/);
  });

  it("descreve a combinação em linguagem simples", () => {
    expect(descreverCombinacao({ ...combinacaoInicial, decoracao: "glitter" })).toBe("média, nude, glitter em 2 unhas");
  });

  it("todas as fotos do catálogo têm uma combinação válida", () => {
    for (const item of catalogo) expect(calcular(item.combinacao).preco).toBeGreaterThan(0);
  });
});

describe("planos de manutenção", () => {
  it("aplica o desconto do plano", () => {
    expect(precoPlano(14000, "15")).toBe(12600);
    expect(precoPlano(9000, "21")).toBe(8600);
  });

  it("gera as próximas datas no intervalo, sem cair em domingo ou segunda", () => {
    const datas = datasDoPlano("2026-11-21", "15", 4);
    expect(datas).toHaveLength(4);
    expect(datas[1]).toBe("2026-12-08");
    for (const d of datas) expect([0, 1]).not.toContain(getWeekday(d));
  });

  it("agenda só de terça a sábado", () => {
    for (const d of proximosDias("2026-11-17", 10)) expect([2, 3, 4, 5, 6]).toContain(getWeekday(d));
  });
});
