import { getProfessional, getService } from "@/data/business";
import type { Booking } from "@/types/booking";

/*
 * Arquivo de calendário (.ics) para o cliente salvar o horário no celular.
 * O horário de Brasília não tem horário de verão desde 2019: UTC−3 o ano todo.
 */

const OFFSET_HOURS = 3;

/** "20261123T124000Z" a partir da data local e dos minutos desde a meia-noite. */
export function toUtcStamp(date: string, minutes: number): string {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60) + OFFSET_HOURS, minutes % 60));
  return utc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Texto em ICS: barra, ponto e vírgula, vírgula e quebra de linha precisam de escape. */
function escape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(booking: Booking, createdStamp = "20260101T000000Z"): string {
  const service = getService(booking.serviceId)?.name ?? "Atendimento";
  const pro = getProfessional(booking.professionalId)?.shortName ?? "";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bravus Barbearia (demonstração)//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@bravus.exemplo`,
    `DTSTAMP:${createdStamp}`,
    `DTSTART:${toUtcStamp(booking.date, booking.startMin)}`,
    `DTEND:${toUtcStamp(booking.date, booking.endMin)}`,
    `SUMMARY:${escape(`${service} com ${pro} · Bravus`)}`,
    `DESCRIPTION:${escape(`Código ${booking.id}. Agendamento de demonstração: a barbearia é fictícia.`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(`${service} daqui a 1 hora`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
