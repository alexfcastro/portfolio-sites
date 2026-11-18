import { describe, expect, it } from "vitest";
import { codigoVale, mensagemPedido, totalVale, tituloDoPresente, validade, validarVale, valeVazio, valorDoVale, type ValeConfig } from "./vale";

const config: ValeConfig = {
  negocio: "Spa Teste",
  experiencias: [
    { id: "a", nome: "Massagem", descricao: "", valor: 20000 },
    { id: "b", nome: "Day spa", descricao: "", valor: 60000 },
  ],
  valorMin: 10000,
  valorMax: 100000,
  sugestoes: [15000, 30000, 50000],
  validadeMeses: 6,
  entrega: {
    email: { rotulo: "Por e-mail", detalhe: "", taxa: 0 },
    impresso: { rotulo: "Cartão impresso", detalhe: "", taxa: 1500 },
  },
  maxMensagem: 200,
};

describe("vale-presente", () => {
  it("começa com a primeira experiência e entrega por e-mail", () => {
    const v = valeVazio(config);
    expect(v.experienciaId).toBe("a");
    expect(v.valor).toBe(30000);
    expect(totalVale(v, config)).toBe(20000);
  });

  it("valor livre respeita os limites e o cartão impresso soma a taxa", () => {
    const v = { ...valeVazio(config), tipo: "valor" as const, valor: 40000, entrega: "impresso" as const };
    expect(valorDoVale(v, config)).toBe(40000);
    expect(totalVale(v, config)).toBe(41500);
    expect(tituloDoPresente(v, config)).toMatch(/400,00 em experiências/);
    expect(validarVale({ ...v, valor: 500 }, config).valor).toBeDefined();
  });

  it("valida nomes, mensagem e e-mail de quem recebe", () => {
    const erros = validarVale({ ...valeVazio(config), mensagem: "x".repeat(201), emailPara: "sem-arroba" }, config);
    expect(Object.keys(erros).sort()).toEqual(["de", "emailPara", "mensagem", "para"]);
    const ok = validarVale({ ...valeVazio(config), de: "Ana", para: "Bia", emailPara: "bia@exemplo.com.br" }, config);
    expect(ok).toEqual({});
  });

  it("validade cai no mesmo dia N meses depois, ou no último dia do mês", () => {
    expect(validade("2026-11-17", 6)).toBe("2027-05-17");
    expect(validade("2026-08-31", 6)).toBe("2027-02-28");
  });

  it("código tem três blocos e é estável para a mesma semente", () => {
    expect(codigoVale(42)).toMatch(/^[A-Z2-9]{3}-[A-Z2-9]{3}-[A-Z2-9]{3}$/);
    expect(codigoVale(42)).toBe(codigoVale(42));
    expect(codigoVale(42)).not.toBe(codigoVale(43));
  });

  it("mensagem do pedido leva presente, entrega, total e o texto do cartão", () => {
    const v = { ...valeVazio(config), de: "Ana", para: "Mãe", mensagem: "Para você descansar.", emailPara: "mae@exemplo.com" };
    const m = mensagemPedido(v, config);
    expect(m).toContain("Presente: Massagem");
    expect(m).toContain("Por e-mail (mae@exemplo.com)");
    expect(m).toContain('"Para você descansar."');
  });
});
