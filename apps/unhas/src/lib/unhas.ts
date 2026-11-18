import { addDays, getWeekday } from "@/lib/time";

/*
 * Montador de combinação da Esmalteria Meia-Lua (fictícia): formato, comprimento, técnica, cor e decoração viram
 * um serviço com nome, preço e duração. Depois, a cliente escolhe marcar uma vez ou entrar num plano de
 * manutenção com dia e horário fixos. Valores em centavos e minutos. Tudo puro, para ser testado.
 */

export type FormatoId = "quadrado" | "redondo" | "amendoado" | "bailarina" | "stiletto";
export type ComprimentoId = "curta" | "media" | "longa";
export type TecnicaId = "gel" | "fibra";
export type CorId = "nude" | "rosa" | "vermelho" | "leitoso" | "francesinha" | "preto";
export type DecoracaoId = "nenhuma" | "glitter" | "cromado" | "desenho" | "pedrarias";

export const formatos: { id: FormatoId; nome: string; extraMin: number; extraPreco: number }[] = [
  { id: "quadrado", nome: "Quadrado", extraMin: 0, extraPreco: 0 },
  { id: "redondo", nome: "Redondo", extraMin: 0, extraPreco: 0 },
  { id: "amendoado", nome: "Amendoado", extraMin: 0, extraPreco: 0 },
  { id: "bailarina", nome: "Bailarina", extraMin: 10, extraPreco: 1000 },
  { id: "stiletto", nome: "Stiletto", extraMin: 15, extraPreco: 2000 },
];

export const comprimentos: { id: ComprimentoId; nome: string; detalhe: string }[] = [
  { id: "curta", nome: "Curta", detalhe: "Na ponta do dedo: banho em gel na unha natural" },
  { id: "media", nome: "Média", detalhe: "Um pouco além da ponta: alongamento" },
  { id: "longa", nome: "Longa", detalhe: "Bem além da ponta: alongamento" },
];

export const cores: { id: CorId; nome: string; amostra: string; extraMin: number; extraPreco: number }[] = [
  { id: "nude", nome: "Nude", amostra: "#e8c9b5", extraMin: 0, extraPreco: 0 },
  { id: "rosa", nome: "Rosa claro", amostra: "#f2b8c6", extraMin: 0, extraPreco: 0 },
  { id: "vermelho", nome: "Vermelho", amostra: "#b3122e", extraMin: 0, extraPreco: 0 },
  { id: "leitoso", nome: "Branco leitoso", amostra: "#f4efe9", extraMin: 0, extraPreco: 0 },
  { id: "preto", nome: "Preto", amostra: "#1d1b1c", extraMin: 0, extraPreco: 0 },
  { id: "francesinha", nome: "Francesinha", amostra: "linear-gradient(180deg,#f3d7cf 70%,#ffffff 70%)", extraMin: 15, extraPreco: 1500 },
];

export const decoracoes: { id: DecoracaoId; nome: string; extraMin: number; extraPreco: number }[] = [
  { id: "nenhuma", nome: "Sem decoração", extraMin: 0, extraPreco: 0 },
  { id: "glitter", nome: "Glitter em 2 unhas", extraMin: 10, extraPreco: 1500 },
  { id: "cromado", nome: "Efeito cromado", extraMin: 15, extraPreco: 2500 },
  { id: "desenho", nome: "Desenho à mão em 2 unhas", extraMin: 25, extraPreco: 3000 },
  { id: "pedrarias", nome: "Pedrarias em 2 unhas", extraMin: 20, extraPreco: 3500 },
];

export interface Combinacao {
  formato: FormatoId;
  comprimento: ComprimentoId;
  tecnica: TecnicaId;
  cor: CorId;
  decoracao: DecoracaoId;
}

export const combinacaoInicial: Combinacao = { formato: "amendoado", comprimento: "media", tecnica: "gel", cor: "nude", decoracao: "nenhuma" };

export interface Resultado {
  servico: string;
  minutos: number;
  preco: number;
  /** Manutenção recomendada (dias) e preço de cada manutenção. */
  manutencaoDias: 15 | 21;
  precoManutencao: number;
  avisos: string[];
}

/** Base por técnica e comprimento: unha curta é banho em gel; média e longa, alongamento. */
function base(c: Combinacao): { servico: string; minutos: number; preco: number; manutencao: number } {
  if (c.comprimento === "curta") return { servico: "Banho em gel", minutos: 60, preco: 11000, manutencao: 9000 };
  const longa = c.comprimento === "longa";
  if (c.tecnica === "fibra") {
    return { servico: "Alongamento em fibra de vidro", minutos: longa ? 165 : 135, preco: longa ? 24000 : 20000, manutencao: 16000 };
  }
  return { servico: "Alongamento em gel", minutos: longa ? 150 : 120, preco: longa ? 22000 : 18000, manutencao: 14000 };
}

export function calcular(c: Combinacao): Resultado {
  const b = base(c);
  const formato = formatos.find((f) => f.id === c.formato)!;
  const cor = cores.find((x) => x.id === c.cor)!;
  const decoracao = decoracoes.find((d) => d.id === c.decoracao)!;
  const avisos: string[] = [];
  // Stiletto em unha curta não se sustenta: vira amendoado.
  const formatoValido = c.comprimento === "curta" && c.formato === "stiletto" ? formatos.find((f) => f.id === "amendoado")! : formato;
  if (formatoValido !== formato) avisos.push("Stiletto pede unha média ou longa. Em unha curta, o formato mais próximo é o amendoado.");
  if (c.comprimento === "longa" && c.tecnica === "gel") avisos.push("Em unha longa, a fibra fica mais fina e natural; o gel é mais resistente para quem usa muito as mãos.");
  return {
    servico: `${b.servico}, formato ${formatoValido.nome.toLowerCase()}`,
    minutos: b.minutos + formatoValido.extraMin + cor.extraMin + decoracao.extraMin,
    preco: b.preco + formatoValido.extraPreco + cor.extraPreco + decoracao.extraPreco,
    manutencaoDias: c.comprimento === "curta" ? 21 : 15,
    precoManutencao: b.manutencao + (c.decoracao === "nenhuma" ? 0 : Math.round(decoracao.extraPreco / 2)),
    avisos,
  };
}

export function descreverCombinacao(c: Combinacao): string {
  const cor = cores.find((x) => x.id === c.cor)!.nome.toLowerCase();
  const deco = decoracoes.find((d) => d.id === c.decoracao)!;
  const comp = comprimentos.find((x) => x.id === c.comprimento)!.nome.toLowerCase();
  return `${comp}, ${cor}${c.decoracao === "nenhuma" ? "" : `, ${deco.nome.toLowerCase()}`}`;
}

/** Planos de manutenção com horário fixo. Desconto sobre o preço de cada manutenção. */
export const planos = [
  { id: "15", dias: 15, nome: "A cada 15 dias", desconto: 0.1, vantagem: "Horário fixo garantido e 10% de desconto em cada manutenção." },
  { id: "21", dias: 21, nome: "A cada 21 dias", desconto: 0.05, vantagem: "Horário fixo garantido e 5% de desconto. Bom para banho em gel." },
] as const;

export type PlanoId = (typeof planos)[number]["id"];

export function precoPlano(precoManutencao: number, plano: PlanoId): number {
  const p = planos.find((x) => x.id === plano)!;
  return Math.round((precoManutencao * (1 - p.desconto)) / 100) * 100;
}

/** Próximas datas do plano a partir da primeira data escolhida (mesmo dia da semana quando o intervalo permite). */
export function datasDoPlano(primeira: string, plano: PlanoId, quantas = 4): string[] {
  const dias = planos.find((x) => x.id === plano)!.dias;
  const datas = [primeira];
  for (let i = 1; i < quantas; i += 1) {
    let proxima = addDays(datas[i - 1]!, dias);
    // A esmalteria não abre domingo nem segunda: empurra para terça.
    while (getWeekday(proxima) === 0 || getWeekday(proxima) === 1) proxima = addDays(proxima, 1);
    datas.push(proxima);
  }
  return datas;
}

export type Estilo = "classica" | "delicada" | "colorida" | "ousada";
export const estilos: { id: Estilo; nome: string }[] = [
  { id: "classica", nome: "Clássica" },
  { id: "delicada", nome: "Delicada" },
  { id: "colorida", nome: "Colorida" },
  { id: "ousada", nome: "Ousada" },
];

/** Catálogo de inspirações: cada foto já vem com a combinação que ela representa. */
export const catalogo: { id: string; nome: string; estilo: Estilo; combinacao: Combinacao }[] = [
  { id: "cat-nude-amendoado", nome: "Nude amendoado", estilo: "classica", combinacao: { formato: "amendoado", comprimento: "media", tecnica: "gel", cor: "nude", decoracao: "nenhuma" } },
  { id: "cat-francesinha", nome: "Francesinha bailarina", estilo: "classica", combinacao: { formato: "bailarina", comprimento: "media", tecnica: "gel", cor: "francesinha", decoracao: "nenhuma" } },
  { id: "cat-leitosa-curta", nome: "Leitosa curtinha", estilo: "delicada", combinacao: { formato: "redondo", comprimento: "curta", tecnica: "gel", cor: "leitoso", decoracao: "nenhuma" } },
  { id: "cat-rosa-glitter", nome: "Rosa com glitter", estilo: "delicada", combinacao: { formato: "amendoado", comprimento: "media", tecnica: "fibra", cor: "rosa", decoracao: "glitter" } },
  { id: "cat-vermelho-quadrado", nome: "Vermelho quadrado", estilo: "colorida", combinacao: { formato: "quadrado", comprimento: "curta", tecnica: "gel", cor: "vermelho", decoracao: "nenhuma" } },
  { id: "cat-desenho", nome: "Desenho floral", estilo: "colorida", combinacao: { formato: "amendoado", comprimento: "media", tecnica: "gel", cor: "nude", decoracao: "desenho" } },
  { id: "cat-cromado", nome: "Cromado longo", estilo: "ousada", combinacao: { formato: "stiletto", comprimento: "longa", tecnica: "fibra", cor: "leitoso", decoracao: "cromado" } },
  { id: "cat-preto-pedrarias", nome: "Preto com pedrarias", estilo: "ousada", combinacao: { formato: "bailarina", comprimento: "longa", tecnica: "gel", cor: "preto", decoracao: "pedrarias" } },
];

/** Agenda: terça a sábado, horários de início a cada 30 min; ocupação simulada e estável. */
export function proximosDias(hoje: string, quantidade = 8): string[] {
  const dias: string[] = [];
  for (let offset = 1; dias.length < quantidade && offset < 40; offset += 1) {
    const d = addDays(hoje, offset);
    const w = getWeekday(d);
    if (w >= 2 && w <= 6) dias.push(d);
  }
  return dias;
}

export function horariosDoDia(date: string): { date: string; minutes: number; livre: boolean }[] {
  const inicios = [9, 10, 11, 13, 14, 15, 16, 17].map((h) => h * 60);
  return inicios.map((minutes) => {
    let hash = 17;
    for (const ch of `${date}@${minutes}`) hash = (hash * 43 + ch.charCodeAt(0)) % 977;
    return { date, minutes, livre: hash % 3 !== 0 };
  });
}
