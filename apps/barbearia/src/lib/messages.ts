import { getProfessional, getService } from "@/data/business";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime } from "@/lib/time";
import type { Booking } from "@/types/booking";

/** Texto exibido na prévia local de WhatsApp. Nunca é enviado a ninguém. */
export function buildBookingMessage(booking: Booking): string {
  const service = getService(booking.serviceId);
  const professional = getProfessional(booking.professionalId);
  return [
    "Olá, Bravus! Acabei de agendar pelo site:",
    "",
    `Serviço: ${service?.name ?? booking.serviceId}`,
    `Profissional: ${professional?.shortName ?? booking.professionalId}`,
    `Data: ${formatDateLong(booking.date)}`,
    `Horário: ${formatTime(booking.startMin)}`,
    `Valor: ${formatBRL(booking.priceCents)}`,
    `Código: ${booking.id}`,
  ].join("\n");
}

export const genericGreeting = "Olá, Bravus! Gostaria de tirar uma dúvida sobre os serviços.";
