import { addDays, formatDateLong, formatTime, getWeekday } from "@/lib/time";

/*
 * Regras da marcação de avaliação do Studio Linha Fina (negócio fictício).
 * Tudo aqui é puro (sem navegador), para poder ser testado.
 */

export type ProcedimentoId = "design" | "fio-a-fio" | "nano" | "correcao";

/** Já tem micropigmentação (ou tatuagem) de sobrancelha feita antes? */
export type Anterior = "nao" | "sim" | "nao-sei";
export type Tempo = "menos-1" | "1-2" | "mais-2";
export type CorAtual = "marrom" | "acinzentada" | "avermelhada" | "esverdeada" | "nao-sei";

export interface Historico {
  tempo: Tempo | "";
  cor: CorAtual | "";
  /** Fez remoção (laser ou removedor) depois? */
  removeu: "sim" | "nao" | "";
}

export const tempoLabels: Record<Tempo, string> = {
  "menos-1": "Menos de 1 ano",
  "1-2": "Entre 1 e 2 anos",
  "mais-2": "Mais de 2 anos",
};

export const corLabels: Record<CorAtual, string> = {
  marrom: "Marrom, parecida com o fio",
  acinzentada: "Acinzentada ou azulada",
  avermelhada: "Avermelhada ou alaranjada",
  esverdeada: "Esverdeada",
  "nao-sei": "Não sei dizer",
};

/** Avaliações: terça a sábado, das 9h às 17h, de hora em hora, sem o horário de almoço. */
const ATENDE = new Set([2, 3, 4, 5, 6]);
const HORARIOS = [9, 10, 11, 14, 15, 16, 17].map((hora) => hora * 60);

export interface Horario {
  date: string;
  minutes: number;
  livre: boolean;
}

/** Ocupação simulada e estável: o mesmo dia mostra sempre os mesmos horários ocupados. */
function ocupado(date: string, minutes: number): boolean {
  let hash = 7;
  for (const char of `${date}|${minutes}`) hash = (hash * 31 + char.charCodeAt(0)) % 1009;
  return hash % 3 === 0;
}

/** Próximos dias de atendimento a partir de amanhã (avaliação nunca é no mesmo dia). */
export function proximosDias(hoje: string, quantidade = 8): string[] {
  const dias: string[] = [];
  for (let offset = 1; dias.length < quantidade && offset < 40; offset += 1) {
    const date = addDays(hoje, offset);
    if (ATENDE.has(getWeekday(date))) dias.push(date);
  }
  return dias;
}

export function horariosDoDia(date: string): Horario[] {
  return HORARIOS.map((minutes) => ({ date, minutes, livre: !ocupado(date, minutes) }));
}

/**
 * O que a profissional precisa saber (e o que a cliente deve trazer), conforme o histórico.
 * Quem já tem pigmento antigo passa por uma avaliação diferente: cor e tempo mudam o plano.
 */
export function orientacoes(anterior: Anterior | "", historico: Historico): string[] {
  if (anterior === "nao") {
    return ["Venha sem maquiagem na sobrancelha, para a profissional ver os fios naturais."];
  }
  const itens = [
    "Venha sem maquiagem na sobrancelha, para a profissional ver o pigmento que ficou.",
    "Se tiver, traga uma foto de como ficou logo depois do procedimento antigo.",
  ];
  if (anterior === "nao-sei") {
    itens.push("Na avaliação, a profissional confere se há pigmento antigo na pele antes de indicar o procedimento.");
    return itens;
  }
  if (historico.tempo === "menos-1") {
    itens.push("Com menos de um ano, o pigmento ainda está assentando: a profissional pode sugerir esperar antes de refazer.");
  }
  if (historico.cor === "acinzentada" || historico.cor === "avermelhada" || historico.cor === "esverdeada") {
    itens.push("Cor alterada pede correção de cor (neutralização) antes de um novo fio a fio; isso entra no plano da avaliação.");
  }
  if (historico.removeu === "sim") {
    itens.push("Conte quantas sessões de remoção fez e quando foi a última: a pele precisa estar recuperada.");
  }
  return itens;
}

/** Com pigmento antigo, o procedimento indicado para avaliar é a correção. */
export function procedimentoSugerido(escolhido: ProcedimentoId | "", anterior: Anterior | "", historico: Historico): ProcedimentoId | "" {
  if (anterior !== "sim" || escolhido === "design" || escolhido === "correcao") return escolhido;
  const corAlterada = historico.cor !== "" && historico.cor !== "marrom" && historico.cor !== "nao-sei";
  return corAlterada ? "correcao" : escolhido;
}

export interface Pedido {
  nome: string;
  whatsapp: string;
  procedimento: ProcedimentoId | "";
  anterior: Anterior | "";
  historico: Historico;
  horario: { date: string; minutes: number } | null;
}

export type Erros = Partial<Record<"nome" | "whatsapp" | "procedimento" | "anterior" | "historico" | "horario", string>>;

export function validar(pedido: Pedido): Erros {
  const erros: Erros = {};
  if (!pedido.procedimento) erros.procedimento = "Escolha o procedimento que você quer avaliar.";
  if (!pedido.anterior) erros.anterior = "Conte se você já tem micropigmentação na sobrancelha.";
  if (pedido.anterior === "sim" && (!pedido.historico.tempo || !pedido.historico.cor)) {
    erros.historico = "Informe há quanto tempo foi feita e a cor que está hoje.";
  }
  if (!pedido.horario) erros.horario = "Escolha um dia e um horário livre.";
  if (pedido.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (pedido.whatsapp.replace(/\D/g, "").length < 10) erros.whatsapp = "Informe um WhatsApp com DDD.";
  return erros;
}

export function formatarWhatsapp(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const tempoNaMensagem: Record<Tempo, string> = {
  "menos-1": "feita há menos de 1 ano",
  "1-2": "feita entre 1 e 2 anos atrás",
  "mais-2": "feita há mais de 2 anos",
};

/** Mensagem pronta para o WhatsApp do estúdio, com tudo o que a cliente escolheu. */
export function mensagem(pedido: Pedido, nomesProcedimentos: Record<ProcedimentoId, string>): string {
  const linhas = ["Olá, Studio Linha Fina! Quero marcar uma avaliação."];
  if (pedido.procedimento) linhas.push(`Procedimento: ${nomesProcedimentos[pedido.procedimento]}`);
  if (pedido.anterior === "nao") linhas.push("Nunca fiz micropigmentação na sobrancelha.");
  if (pedido.anterior === "nao-sei") linhas.push("Não sei se tenho micropigmentação antiga.");
  if (pedido.anterior === "sim") {
    const partes = ["Já tenho micropigmentação"];
    if (pedido.historico.tempo) partes.push(tempoNaMensagem[pedido.historico.tempo]);
    if (pedido.historico.cor) partes.push(`cor hoje: ${corLabels[pedido.historico.cor].toLowerCase()}`);
    if (pedido.historico.removeu === "sim") partes.push("já fiz sessões de remoção");
    linhas.push(`${partes.join(", ")}.`);
  }
  if (pedido.horario) {
    linhas.push(`Horário: ${formatDateLong(pedido.horario.date)}, às ${formatTime(pedido.horario.minutes)}`);
  }
  if (pedido.nome.trim()) linhas.push(`Nome: ${pedido.nome.trim()}`);
  return linhas.join("\n");
}
