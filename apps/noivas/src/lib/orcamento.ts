import { addDays, getWeekday } from "@/lib/time";

/*
 * Orçamento em grupo do Ateliê Véu (salão fictício) para o dia da noiva.
 * A partir de quem vai se arrumar e do horário da cerimônia, calcula o tempo de produção, a que horas o grupo
 * precisa começar e o valor estimado. Valores em centavos, tempos em minutos. Tudo puro, para ser testado.
 */

export type Servico = "cabelo" | "maquiagem" | "ambos";
export type PessoaId = "noiva" | "mae" | "madrinha" | "convidada" | "daminha";

export interface TipoPessoa {
  id: PessoaId;
  nome: string;
  plural: string;
  max: number;
  /** Serviços possíveis (daminha: só cabelo). */
  servicos: Servico[];
  minutos: Record<"cabelo" | "maquiagem", number>;
  precos: Record<Servico, number>;
}

export const tipos: TipoPessoa[] = [
  {
    id: "noiva",
    nome: "Noiva",
    plural: "Noiva",
    max: 1,
    servicos: ["ambos", "cabelo", "maquiagem"],
    minutos: { cabelo: 90, maquiagem: 75 },
    precos: { cabelo: 95000, maquiagem: 85000, ambos: 165000 },
  },
  {
    id: "mae",
    nome: "Mãe",
    plural: "Mães",
    max: 2,
    servicos: ["ambos", "cabelo", "maquiagem"],
    minutos: { cabelo: 50, maquiagem: 45 },
    precos: { cabelo: 28000, maquiagem: 26000, ambos: 49000 },
  },
  {
    id: "madrinha",
    nome: "Madrinha",
    plural: "Madrinhas",
    max: 10,
    servicos: ["ambos", "cabelo", "maquiagem"],
    minutos: { cabelo: 45, maquiagem: 40 },
    precos: { cabelo: 25000, maquiagem: 23000, ambos: 44000 },
  },
  {
    id: "convidada",
    nome: "Convidada",
    plural: "Outras convidadas",
    max: 6,
    servicos: ["ambos", "cabelo", "maquiagem"],
    minutos: { cabelo: 45, maquiagem: 40 },
    precos: { cabelo: 25000, maquiagem: 23000, ambos: 44000 },
  },
  {
    id: "daminha",
    nome: "Daminha",
    plural: "Daminhas",
    max: 4,
    servicos: ["cabelo"],
    minutos: { cabelo: 25, maquiagem: 0 },
    precos: { cabelo: 12000, maquiagem: 0, ambos: 12000 },
  },
];

export interface Linha {
  quantidade: number;
  servico: Servico;
}

export type Grupo = Record<PessoaId, Linha>;

export function grupoInicial(): Grupo {
  return {
    noiva: { quantidade: 1, servico: "ambos" },
    mae: { quantidade: 1, servico: "ambos" },
    madrinha: { quantidade: 2, servico: "ambos" },
    convidada: { quantidade: 0, servico: "maquiagem" },
    daminha: { quantidade: 0, servico: "cabelo" },
  };
}

/** Cada profissional atende até 4 horas seguidas; acima disso, entra mais uma (cabelo ou maquiagem). */
const LIMITE_POR_PROFISSIONAL = 240;
export const PROFISSIONAL_EXTRA = 30000;
export const DESLOCAMENTO = 40000;
/** A noiva termina 1h antes da cerimônia (fotos, vestido e deslocamento). */
export const FOLGA_ANTES = 60;
/** Intervalo de segurança entre uma produção e outra. */
const MARGEM = 30;

export interface Calculo {
  pessoas: number;
  minutosCabelo: number;
  minutosMaquiagem: number;
  cabeleireiras: number;
  maquiadoras: number;
  /** Duração total da produção do grupo. */
  duracao: number;
  /** Horário de início (minutos desde 0h) e fim. */
  inicio: number;
  fim: number;
  servicos: number;
  extras: number;
  deslocamento: number;
  total: number;
  avisos: string[];
}

export function calcular(grupo: Grupo, cerimonia: number, noLocal: boolean): Calculo {
  let minutosCabelo = 0;
  let minutosMaquiagem = 0;
  let servicos = 0;
  let pessoas = 0;
  for (const tipo of tipos) {
    const linha = grupo[tipo.id];
    const qtd = Math.max(0, Math.min(tipo.max, Math.round(linha.quantidade)));
    if (qtd === 0) continue;
    const servico = tipo.servicos.includes(linha.servico) ? linha.servico : tipo.servicos[0]!;
    pessoas += qtd;
    if (servico !== "maquiagem") minutosCabelo += qtd * tipo.minutos.cabelo;
    if (servico !== "cabelo") minutosMaquiagem += qtd * tipo.minutos.maquiagem;
    servicos += qtd * tipo.precos[servico];
  }

  const cabeleireiras = minutosCabelo > 0 ? Math.ceil(minutosCabelo / LIMITE_POR_PROFISSIONAL) : 0;
  const maquiadoras = minutosMaquiagem > 0 ? Math.ceil(minutosMaquiagem / LIMITE_POR_PROFISSIONAL) : 0;
  const extras = (Math.max(0, cabeleireiras - 1) + Math.max(0, maquiadoras - 1)) * PROFISSIONAL_EXTRA;

  // Cabelo e maquiagem correm em paralelo; o tempo do grupo é o da fila mais longa, mais a margem.
  const filaCabelo = cabeleireiras ? minutosCabelo / cabeleireiras : 0;
  const filaMaquiagem = maquiadoras ? minutosMaquiagem / maquiadoras : 0;
  const duracao = pessoas === 0 ? 0 : Math.ceil((Math.max(filaCabelo, filaMaquiagem) + MARGEM) / 15) * 15;

  const fim = cerimonia - FOLGA_ANTES;
  const inicio = Math.floor((fim - duracao) / 15) * 15;
  const deslocamento = noLocal && pessoas > 0 ? DESLOCAMENTO : 0;

  const avisos: string[] = [];
  if (inicio < 6 * 60 && pessoas > 0) {
    avisos.push("O grupo começaria antes das 6h. Dá para dividir em dois turnos ou incluir mais uma profissional; isso é combinado no orçamento.");
  }
  if (cabeleireiras > 1 || maquiadoras > 1) {
    avisos.push("Pelo tamanho do grupo, entra mais uma profissional para todas ficarem prontas a tempo.");
  }

  return {
    pessoas,
    minutosCabelo,
    minutosMaquiagem,
    cabeleireiras,
    maquiadoras,
    duracao,
    inicio,
    fim,
    servicos,
    extras,
    deslocamento,
    total: servicos + extras + deslocamento,
    avisos,
  };
}

/** Disponibilidade simulada e estável: sábados quase sempre ocupados, sextas e domingos às vezes. */
export function ocupada(date: string): boolean {
  let hash = 3;
  for (const char of date) hash = (hash * 29 + char.charCodeAt(0)) % 1013;
  const dia = getWeekday(date);
  const chance = dia === 6 ? 0.6 : dia === 5 || dia === 0 ? 0.3 : 0.08;
  return hash / 1013 < chance;
}

/** Dias de um mês (YYYY-MM) com a semana em que caem, para montar o calendário. */
export function diasDoMes(mes: string): string[] {
  const dias: string[] = [];
  let data = `${mes}-01`;
  while (data.startsWith(mes)) {
    dias.push(data);
    data = addDays(data, 1);
  }
  return dias;
}

export function proximoMes(mes: string, quantos = 1): string {
  const [ano, m] = mes.split("-").map(Number) as [number, number];
  const total = ano * 12 + (m - 1) + quantos;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

/** A data só pode ser escolhida se for a partir de 30 dias e estiver livre. */
export function dataDisponivel(date: string, hoje: string): boolean {
  return date >= addDays(hoje, 30) && !ocupada(date);
}

export function resumoGrupo(grupo: Grupo): string[] {
  const nomesServico: Record<Servico, string> = { cabelo: "cabelo", maquiagem: "maquiagem", ambos: "cabelo e maquiagem" };
  return tipos.flatMap((tipo) => {
    const linha = grupo[tipo.id];
    if (linha.quantidade <= 0) return [];
    const quem = linha.quantidade === 1 ? tipo.nome : `${linha.quantidade} ${tipo.plural.toLowerCase()}`;
    return [`${quem}: ${nomesServico[linha.servico]}`];
  });
}
