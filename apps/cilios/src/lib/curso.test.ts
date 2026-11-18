import { describe, expect, it } from "vitest";
import { horariosDoDia, proximosDias } from "@/lib/agenda";
import { TURMA, parcela, proximaTurma, vagasRestantes, validarReserva } from "@/lib/curso";
import { getWeekday } from "@/lib/time";

describe("turma do curso", () => {
  it("é num sábado e domingo, a pelo menos 14 dias de hoje", () => {
    const turma = proximaTurma("2026-11-17");
    expect(getWeekday(turma.sabado)).toBe(6);
    expect(getWeekday(turma.domingo)).toBe(0);
    expect(turma.sabado >= "2026-12-01").toBe(true);
    expect(turma.sabado).toBe("2026-12-05");
  });

  it("vagas diminuem a cada reserva e nunca ficam negativas", () => {
    expect(vagasRestantes(0)).toBe(TURMA.vagasTotal - TURMA.ocupadasIniciais);
    expect(vagasRestantes(1)).toBe(1);
    expect(vagasRestantes(5)).toBe(0);
  });

  it("parcela sem juros dentro do limite", () => {
    expect(parcela(10)).toBe(19900);
    expect(parcela(1)).toBe(TURMA.cartao);
    expect(parcela(30)).toBe(19900);
  });

  it("valida a reserva de vaga", () => {
    const erros = validarReserva({ nome: "", whatsapp: "", experiencia: "", pagamento: "", parcelas: 1 });
    expect(Object.keys(erros).sort()).toEqual(["experiencia", "nome", "pagamento", "whatsapp"]);
    expect(validarReserva({ nome: "Bia", whatsapp: "11988887777", experiencia: "nunca", pagamento: "pix", parcelas: 1 })).toEqual({});
  });
});

describe("agenda de atendimento", () => {
  it("atende de terça a sábado, com horários de início espaçados", () => {
    for (const dia of proximosDias("2026-11-17", 10)) expect([2, 3, 4, 5, 6]).toContain(getWeekday(dia));
    expect(horariosDoDia("2026-11-20").map((h) => h.minutes)).toEqual([540, 660, 840, 960, 1080]);
  });
});
