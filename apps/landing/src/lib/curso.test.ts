import { describe, expect, it } from "vitest";
import { CURSO, dataTurma, economiaPix, parcela, proximaTurma, vagasRestantes } from "@/lib/curso";

describe("Curso Volume Perfeito", () => {
  it("turma no primeiro sábado a pelo menos 21 dias, com domingo em seguida", () => {
    expect(proximaTurma("2026-11-17")).toEqual({ sabado: "2026-12-12", domingo: "2026-12-13" });
    expect(dataTurma({ sabado: "2026-12-12", domingo: "2026-12-13" })).toBe("12 e 13 de dezembro");
    expect(dataTurma({ sabado: "2027-01-30", domingo: "2027-01-31" })).toBe("30 e 31 de janeiro");
    expect(dataTurma({ sabado: "2027-07-31", domingo: "2027-08-01" })).toBe("31 de julho e 1 de agosto");
  });

  it("vagas começam em 4 de 6 e nunca ficam negativas", () => {
    expect(vagasRestantes(0)).toBe(4);
    expect(vagasRestantes(3)).toBe(1);
    expect(vagasRestantes(10)).toBe(0);
  });

  it("parcelamento sem juros e economia no Pix", () => {
    expect(parcela(12)).toBe(24917);
    expect(parcela(1)).toBe(CURSO.cartao);
    expect(parcela(40)).toBe(parcela(12));
    expect(economiaPix()).toBe(20000);
  });
});
