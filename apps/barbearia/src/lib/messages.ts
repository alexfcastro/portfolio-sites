import { getProfessional, getService } from "@/data/business";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime } from "@/lib/time";
import type { Booking } from "@/types/booking";

/** Como foi (ou será) pago, em uma linha. */
export function paymentLabel(booking: Booking): string {
  switch (booking.payment) {
    case "plano":
      return "incluso no plano";
    case "recompensa":
      return "cortesia do cartão fidelidade";
    case "local":
      return "na barbearia";
    case "sinal":
      return booking.pixStatus === "pago"
        ? `sinal de ${formatBRL(booking.pixCents)} pago por Pix, resto na barbearia`
        : `sinal de ${formatBRL(booking.pixCents)} por Pix (pendente)`;
    case "total":
      return booking.pixStatus === "pago" ? "pago por Pix" : "Pix pendente";
  }
}

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
    `Pagamento: ${paymentLabel(booking)}`,
    ...(booking.note ? [`Recado: ${booking.note}`] : []),
    `Código: ${booking.id}`,
  ].join("\n");
}

export const genericGreeting = "Olá, Bravus! Gostaria de tirar uma dúvida sobre os serviços.";

/** Lembrete automático que o cliente receberia. Só prévia: nada é enviado. */
export function buildReminderMessage(booking: Booking, when: "vespera" | "hora"): string {
  const service = getService(booking.serviceId);
  const professional = getProfessional(booking.professionalId);
  const dia = when === "vespera" ? "amanhã" : "daqui a 1 hora";
  return [
    `Oi! Passando para lembrar do seu horário ${dia}, ${formatDateLong(booking.date)}, às ${formatTime(booking.startMin)}.`,
    `${service?.name ?? "Atendimento"} com ${professional?.shortName ?? "a equipe"}.`,
    "",
    "Toque em Confirmo para garantir, ou remarque pelo link se precisar.",
  ].join("\n");
}

/** Mensagem para chamar de volta um cliente sumido. */
export function buildComebackMessage(name: string, serviceName: string, professionalName: string, days: number): string {
  const first = name.split(" ")[0];
  return [
    `Fala, ${first}! Aqui é da Bravus.`,
    `Faz ${days} dias desde o seu último ${serviceName.toLowerCase()} com o ${professionalName}. Bora dar um trato?`,
    "",
    "Agende pelo link e escolha o horário que preferir: bravus.exemplo/agendar",
  ].join("\n");
}

/** Aviso para quem está na lista de espera quando abre uma vaga. */
export function buildOpeningMessage(name: string, serviceName: string, date: string, startMin: number): string {
  const first = name.split(" ")[0];
  return [
    `${first}, abriu uma vaga! ${serviceName} ${formatDateLong(date)}, às ${formatTime(startMin)}.`,
    "Quer que a gente reserve para você? Responda SIM em até 15 minutos.",
  ].join("\n");
}
