import { addDays, formatDateLong, formatTime, getWeekday } from "@/lib/time";

/*
 * Agenda de atendimentos do Lash Lab (fictício): terça a sábado. Aplicação leva cerca de 2 horas, então os
 * horários de início são espaçados. Ocupação simulada e estável. Domingo e segunda: dias de turma ou folga.
 */

export interface Horario {
  date: string;
  minutes: number;
  livre: boolean;
}

const INICIOS = [9, 11, 14, 16, 18].map((h) => h * 60);

function ocupado(date: string, minutes: number): boolean {
  let hash = 5;
  for (const char of `${date}~${minutes}`) hash = (hash * 41 + char.charCodeAt(0)) % 991;
  return hash % 3 === 0;
}

export function proximosDias(hoje: string, quantidade = 8): string[] {
  const dias: string[] = [];
  for (let offset = 1; dias.length < quantidade && offset < 40; offset += 1) {
    const date = addDays(hoje, offset);
    const dia = getWeekday(date);
    if (dia >= 2 && dia <= 6) dias.push(date);
  }
  return dias;
}

export function horariosDoDia(date: string): Horario[] {
  return INICIOS.map((minutes) => ({ date, minutes, livre: !ocupado(date, minutes) }));
}

export function formatarWhatsapp(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function quando(date: string, minutes: number): string {
  return `${formatDateLong(date)}, às ${formatTime(minutes)}`;
}
