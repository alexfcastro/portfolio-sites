import { describe, expect, it } from "vitest";
import {
  formatarWhatsapp,
  horariosDoDia,
  mensagem,
  orientacoes,
  procedimentoSugerido,
  proximosDias,
  validar,
  type Pedido,
} from "@/lib/avaliacao";
import { getWeekday } from "@/lib/time";

const nomes = { design: "Design de sobrancelhas", "fio-a-fio": "Micropigmentação fio a fio", nano: "Nanopigmentação", correcao: "Correção de trabalho antigo" };
const semHistorico = { tempo: "", cor: "", removeu: "" } as const;

const pedido = (extra: Partial<Pedido> = {}): Pedido => ({
  nome: "Ana",
  whatsapp: "(11) 98888-7777",
  procedimento: "fio-a-fio",
  anterior: "nao",
  historico: { ...semHistorico },
  horario: { date: "2026-11-25", minutes: 600 },
  ...extra,
});

describe("agenda de avaliação", () => {
  it("só oferece dias de terça a sábado, a partir de amanhã", () => {
    const dias = proximosDias("2026-11-17", 8);
    expect(dias).toHaveLength(8);
    expect(dias[0]).toBe("2026-11-18");
    for (const dia of dias) expect([2, 3, 4, 5, 6]).toContain(getWeekday(dia));
  });

  it("mostra sempre os mesmos horários ocupados para o mesmo dia", () => {
    expect(horariosDoDia("2026-11-20")).toEqual(horariosDoDia("2026-11-20"));
    expect(horariosDoDia("2026-11-20").some((h) => h.livre)).toBe(true);
  });
});

describe("micropigmentação anterior", () => {
  it("pede foto e cuidado extra quando já existe pigmento", () => {
    const itens = orientacoes("sim", { tempo: "menos-1", cor: "acinzentada", removeu: "sim" });
    expect(itens.join(" ")).toMatch(/foto/);
    expect(itens.join(" ")).toMatch(/neutralização/);
    expect(itens.join(" ")).toMatch(/remoção/);
    expect(itens.join(" ")).toMatch(/esperar/);
  });

  it("sugere correção quando a cor antiga está alterada", () => {
    expect(procedimentoSugerido("fio-a-fio", "sim", { tempo: "mais-2", cor: "acinzentada", removeu: "" })).toBe("correcao");
    expect(procedimentoSugerido("fio-a-fio", "sim", { tempo: "mais-2", cor: "marrom", removeu: "" })).toBe("fio-a-fio");
    expect(procedimentoSugerido("fio-a-fio", "nao", { ...semHistorico })).toBe("fio-a-fio");
  });

  it("exige tempo e cor de quem já tem micropigmentação", () => {
    expect(validar(pedido({ anterior: "sim" })).historico).toBeDefined();
    expect(validar(pedido({ anterior: "sim", historico: { tempo: "1-2", cor: "marrom", removeu: "" } }))).toEqual({});
  });
});

describe("pedido", () => {
  it("valida campos obrigatórios", () => {
    const erros = validar(pedido({ nome: "", whatsapp: "123", procedimento: "", anterior: "", horario: null }));
    expect(Object.keys(erros).sort()).toEqual(["anterior", "horario", "nome", "procedimento", "whatsapp"]);
  });

  it("formata o WhatsApp enquanto a pessoa digita", () => {
    expect(formatarWhatsapp("11988887777")).toBe("(11) 98888-7777");
    expect(formatarWhatsapp("1133334444")).toBe("(11) 3333-4444");
  });

  it("monta a mensagem com procedimento, histórico e horário", () => {
    const texto = mensagem(pedido({ anterior: "sim", historico: { tempo: "mais-2", cor: "acinzentada", removeu: "nao" } }), nomes);
    expect(texto).toContain("Micropigmentação fio a fio");
    expect(texto).toContain("feita há mais de 2 anos");
    expect(texto).toContain("acinzentada");
    expect(texto).toContain("às 10:00");
    expect(texto).toContain("Nome: Ana");
  });
});
