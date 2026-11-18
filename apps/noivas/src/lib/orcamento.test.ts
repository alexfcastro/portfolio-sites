import { describe, expect, it } from "vitest";
import { calcular, dataDisponivel, diasDoMes, grupoInicial, ocupada, proximoMes, resumoGrupo, type Grupo } from "@/lib/orcamento";

const H = (h: number, m = 0) => h * 60 + m;

describe("orçamento em grupo", () => {
  it("grupo padrão: noiva, mãe e duas madrinhas com cabelo e maquiagem", () => {
    const c = calcular(grupoInicial(), H(17), false);
    expect(c.pessoas).toBe(4);
    expect(c.minutosCabelo).toBe(90 + 50 + 45 * 2);
    expect(c.minutosMaquiagem).toBe(75 + 45 + 40 * 2);
    expect(c.cabeleireiras).toBe(1);
    expect(c.maquiadoras).toBe(1);
    // fila mais longa (230) + 30 de margem = 260 → 4h30 arredondado para 15 min
    expect(c.duracao).toBe(270);
    expect(c.fim).toBe(H(16));
    expect(c.inicio).toBe(H(11, 30));
    expect(c.total).toBe(165000 + 49000 + 2 * 44000);
  });

  it("grupo grande ganha uma profissional extra em cada fila", () => {
    const grupo: Grupo = { ...grupoInicial(), madrinha: { quantidade: 6, servico: "ambos" } };
    const c = calcular(grupo, H(16), false);
    expect(c.cabeleireiras).toBe(2);
    expect(c.maquiadoras).toBe(2);
    expect(c.extras).toBe(2 * 30000);
    expect(c.avisos.join(" ")).toMatch(/mais uma profissional/);
  });

  it("avisa quando o grupo teria de começar antes das 6h", () => {
    const grupo: Grupo = { ...grupoInicial(), madrinha: { quantidade: 6, servico: "ambos" } };
    const c = calcular(grupo, H(10), false);
    expect(c.inicio).toBeLessThan(H(6));
    expect(c.avisos.join(" ")).toMatch(/antes das 6h/);
  });

  it("daminha só faz cabelo e deslocamento soma quando é no local da festa", () => {
    const grupo: Grupo = { ...grupoInicial(), daminha: { quantidade: 2, servico: "maquiagem" } };
    const semLocal = calcular(grupo, H(17), false);
    const comLocal = calcular(grupo, H(17), true);
    expect(semLocal.minutosMaquiagem).toBe(75 + 45 + 80);
    expect(comLocal.total - semLocal.total).toBe(40000);
  });

  it("resume o grupo em linguagem simples", () => {
    expect(resumoGrupo(grupoInicial())).toEqual(["Noiva: cabelo e maquiagem", "Mãe: cabelo e maquiagem", "2 madrinhas: cabelo e maquiagem"]);
  });
});

describe("disponibilidade", () => {
  it("lista os dias do mês e avança de mês corretamente", () => {
    expect(diasDoMes("2027-02")).toHaveLength(28);
    expect(proximoMes("2026-12")).toBe("2027-01");
    expect(proximoMes("2026-11", 14)).toBe("2028-01");
  });

  it("ocupação é estável e só libera datas a partir de 30 dias", () => {
    expect(ocupada("2027-05-15")).toBe(ocupada("2027-05-15"));
    expect(dataDisponivel("2026-11-20", "2026-11-17")).toBe(false);
    const livres = diasDoMes("2027-05").filter((d) => dataDisponivel(d, "2026-11-17"));
    expect(livres.length).toBeGreaterThan(10);
  });
});
