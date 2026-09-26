import { business } from "@/data/business";
import type { BusinessNow } from "@/types/booking";

/*
 * Datas são tratadas como texto AAAA-MM-DD no fuso do negócio (America/Sao_Paulo)
 * e horários como minutos desde a meia-noite. Assim, o fuso do visitante não
 * altera a agenda. Para aritmética de datas usamos UTC, que não tem horário de verão.
 */

export function getBusinessNow(instant: Date = new Date()): BusinessNow {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: business.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function toUtcDate(date: string): Date {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(date: string, days: number): string {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

/** 0 = domingo … 6 = sábado. */
export function getWeekday(date: string): number {
  return toUtcDate(date).getUTCDay();
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

const longFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const shortWeekday = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", weekday: "short" });
const dayMonth = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit" });

/** "sexta-feira, 14 de março" */
export function formatDateLong(date: string): string {
  return longFormatter.format(toUtcDate(date));
}

/** { weekday: "sex", dayMonth: "14/03" } */
export function formatDateParts(date: string): { weekday: string; dayMonth: string } {
  const value = toUtcDate(date);
  return { weekday: shortWeekday.format(value).replace(".", ""), dayMonth: dayMonth.format(value) };
}

export function relativeDayLabel(date: string, today: string): string | null {
  if (date === today) return "Hoje";
  if (date === addDays(today, 1)) return "Amanhã";
  return null;
}
