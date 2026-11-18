import { describe, expect, it } from "vitest";
import { horariosDoDia, mensagemAvaliacao, proximosDias, validarContato } from "@/lib/agenda";
import { formatBRL } from "@/lib/money";
import { descontoPacote, montarProtocolo, objetivos, respondidas, resumoProtocolo } from "@/lib/protocolo";
import { getWeekday } from "@/lib/time";

describe("montador de protocolo", () => {
  it("só monta quando todas as perguntas do objetivo têm resposta válida", () => {
    const pos = objetivos.find((o) => o.id === "pos-operatorio")!;
    expect(respondidas(pos, { cirurgia: "lipo", dias: "ate-7" })).toBe(false);
    expect(respondidas(pos, { cirurgia: "lipo", dias: "ate-7", liberacao: "sim" })).toBe(true);
    expect(respondidas(pos, { cirurgia: "xx", dias: "ate-7", liberacao: "sim" })).toBe(false);
  });

  it("aplica desconto de pacote por faixa", () => {
    expect(descontoPacote(4)).toBe(0);
    expect(descontoPacote(6)).toBe(0.1);
    expect(descontoPacote(10)).toBe(0.15);
  });

  it("pós-operatório: sessões pela cirurgia e total com desconto", () => {
    const p = montarProtocolo("pos-operatorio", { cirurgia: "lipo", dias: "ate-7", liberacao: "sim" });
    expect(p.sessoes).toBe(10);
    expect(p.total).toBe(127500); // 10 × R$ 150 com 15%
    expect(p.semanas).toBe(4);
    expect(p.avisos.join(" ")).not.toMatch(/liberação de quem operou/);
  });

  it("pós-operatório sem liberação: avisa e não promete começar já", () => {
    const p = montarProtocolo("pos-operatorio", { cirurgia: "mama", dias: "ate-7", liberacao: "nao" });
    expect(p.sessoes).toBe(6);
    expect(p.inicio).toMatch(/liberação/);
    expect(p.avisos.join(" ")).toMatch(/liberação de quem operou/);
  });

  it("melasma é tratado como controle, não cura", () => {
    const p = montarProtocolo("manchas", { tipo: "melasma", tempo: "mais-1" });
    expect(p.sessoes).toBe(8);
    expect(p.avisos.join(" ")).toMatch(/não tem cura/);
  });

  it("acne inflamada sem dermatologista recomenda acompanhamento médico", () => {
    const p = montarProtocolo("acne", { grau: "inflamada", medico: "nao" });
    expect(p.avisos.join(" ")).toMatch(/dermatologista/);
    expect(montarProtocolo("acne", { grau: "leve", medico: "nao" }).avisos.join(" ")).not.toMatch(/dermatologista/);
  });

  it("resumo leva sessões, intervalo e investimento", () => {
    const p = montarProtocolo("flacidez", { area: "rosto", intensidade: "leve" });
    const texto = resumoProtocolo(p, formatBRL);
    expect(texto).toContain("8 sessões");
    expect(texto).toContain("1 por semana");
    expect(texto).toMatch(/R\$\s?1\.296,00/);
  });
});

describe("agenda da avaliação", () => {
  it("não oferece domingo e sábado tem só manhã", () => {
    const dias = proximosDias("2026-11-17", 10);
    for (const dia of dias) expect(getWeekday(dia)).not.toBe(0);
    const sabado = dias.find((d) => getWeekday(d) === 6)!;
    expect(horariosDoDia(sabado).every((h) => h.minutes < 12 * 60)).toBe(true);
  });

  it("valida contato e monta a mensagem com o protocolo", () => {
    expect(Object.keys(validarContato({ nome: "", whatsapp: "1", horario: null })).sort()).toEqual(["horario", "nome", "whatsapp"]);
    const texto = mensagemAvaliacao({ nome: "Paula", whatsapp: "11999990000", horario: { date: "2026-11-20", minutes: 540 } }, "Protocolo sugerido: X");
    expect(texto).toContain("Protocolo sugerido: X");
    expect(texto).toContain("às 09:00");
    expect(texto).toContain("Nome: Paula");
  });
});
