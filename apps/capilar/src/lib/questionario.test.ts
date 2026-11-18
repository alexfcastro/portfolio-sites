import { describe, expect, it } from "vitest";
import { completo, orientar, precoMega, type Respostas } from "@/lib/questionario";

const base: Respostas = { incomodo: "queda", tempo: "meses", quimica: "nenhuma", mudanca: "nada", objetivo: "recuperar", historico: "nunca" };

describe("questionário", () => {
  it("só orienta com as seis respostas", () => {
    expect(completo({ ...base, historico: undefined })).toBe(false);
    expect(completo(base)).toBe(true);
  });

  it("queda com objetivo de recuperar: tratamento", () => {
    const o = orientar(base);
    expect(o.caminho).toBe("tratamento");
    expect(o.porques.join(" ")).toMatch(/causa no couro cabeludo/);
  });

  it("cabelo saudável querendo volume: mega hair", () => {
    const o = orientar({ ...base, incomodo: "volume", objetivo: "rapido" });
    expect(o.caminho).toBe("mega");
    expect(o.cuidados).toHaveLength(0);
  });

  it("quer mega mas o fio está fragilizado: tratamento primeiro, mega depois", () => {
    const o = orientar({ ...base, incomodo: "quebra", quimica: "descoloracao", objetivo: "rapido" });
    expect(o.caminho).toBe("ambos");
    expect(o.cuidados.join(" ")).toMatch(/mega hair espera/);
  });

  it("pós-parto recente: avisa que costuma ser passageiro e indica médico junto", () => {
    const o = orientar({ ...base, tempo: "recente", mudanca: "parto" });
    expect(o.porques.join(" ")).toMatch(/passageira/);
    expect(o.cuidados.join(" ")).toMatch(/médico/);
  });

  it("afinamento com mega pede técnica leve", () => {
    const o = orientar({ ...base, incomodo: "afinamento", objetivo: "ambos" });
    expect(o.caminho).toBe("ambos");
    expect(o.cuidados.join(" ")).toMatch(/fita ou microlink/);
  });
});

describe("mega hair", () => {
  it("preço cresce com comprimento e quantidade", () => {
    expect(precoMega(40, 100)).toBe(175000);
    expect(precoMega(70, 200)).toBeGreaterThan(precoMega(60, 200));
    expect(precoMega(50, 150)).toBeGreaterThan(precoMega(50, 100));
  });
});
