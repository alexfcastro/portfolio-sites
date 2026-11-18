import { addDays, formatDateLong, formatTime, getWeekday } from "@/lib/time";

/*
 * Agenda de avaliações da Clínica Núcleo (fictícia): segunda a sábado; sábado só de manhã.
 * Ocupação simulada e estável para a demonstração.
 */

export interface Horario {
  date: string;
  minutes: number;
  livre: boolean;
}

const SEMANA = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18].map((h) => h * 60);
const SABADO = [8, 9, 10, 11].map((h) => h * 60);

function ocupado(date: string, minutes: number): boolean {
  let hash = 11;
  for (const char of `${date}#${minutes}`) hash = (hash * 37 + char.charCodeAt(0)) % 997;
  return hash % 3 === 0;
}

/** Próximos dias de atendimento a partir de amanhã (domingo fechado). */
export function proximosDias(hoje: string, quantidade = 8): string[] {
  const dias: string[] = [];
  for (let offset = 1; dias.length < quantidade && offset < 40; offset += 1) {
    const date = addDays(hoje, offset);
    if (getWeekday(date) !== 0) dias.push(date);
  }
  return dias;
}

export function horariosDoDia(date: string): Horario[] {
  const lista = getWeekday(date) === 6 ? SABADO : SEMANA;
  return lista.map((minutes) => ({ date, minutes, livre: !ocupado(date, minutes) }));
}

export function formatarWhatsapp(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export interface Contato {
  nome: string;
  whatsapp: string;
  horario: { date: string; minutes: number } | null;
}

export type Erros = Partial<Record<"nome" | "whatsapp" | "horario", string>>;

export function validarContato(contato: Contato): Erros {
  const erros: Erros = {};
  if (!contato.horario) erros.horario = "Escolha um dia e um horário livre.";
  if (contato.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (contato.whatsapp.replace(/\D/g, "").length < 10) erros.whatsapp = "Informe um WhatsApp com DDD.";
  return erros;
}

/** Mensagem pronta para o WhatsApp da clínica, levando o resumo do protocolo montado na página. */
export function mensagemAvaliacao(contato: Contato, resumo: string | null): string {
  const linhas = ["Olá, Clínica Núcleo! Quero agendar uma avaliação."];
  if (resumo) linhas.push("", "Montei este protocolo no site:", resumo);
  if (contato.horario) {
    linhas.push("", `Horário: ${formatDateLong(contato.horario.date)}, às ${formatTime(contato.horario.minutes)}`);
  }
  if (contato.nome.trim()) linhas.push(`Nome: ${contato.nome.trim()}`);
  return linhas.join("\n");
}
