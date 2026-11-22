import { business, demoCustomerName, getPlan, plans, professionals } from "@/data/business";
import { dueAtShop, type DemoState } from "@/lib/demo-state";
import { customerProfiles, generateHistory } from "@/lib/history";
import { addDays } from "@/lib/time";
import type { Booking, BusinessNow } from "@/types/booking";

/*
 * Números do painel do dono. Tudo é calculado a partir da agenda deste navegador
 * e do histórico fictício; não há dado real.
 */

export interface DaySummary {
  /** Atendimentos de hoje que não foram cancelados. */
  total: number;
  done: number;
  /** Valor de tabela de tudo o que está marcado para hoje. */
  expectedCents: number;
  /** Já recebido: Pix pago antecipado + o que foi pago no local dos concluídos. */
  receivedCents: number;
  /** Desse recebido, quanto entrou por Pix antecipado. */
  pixCents: number;
  /** Ainda vão pagar na barbearia (agendamentos confirmados). */
  dueCents: number;
  awaitingPresence: Booking[];
  pendingPix: Booking[];
  next: Booking | null;
}

export function summarizeDay(bookings: readonly Booking[], now: BusinessNow): DaySummary {
  const today = bookings
    .filter((b) => b.date === now.date && b.status !== "cancelado")
    .sort((a, b) => a.startMin - b.startMin);
  const pix = today.filter((b) => b.pixStatus === "pago").reduce((sum, b) => sum + b.pixCents, 0);
  const paidAtShop = today.filter((b) => b.status === "concluido").reduce((sum, b) => sum + dueAtShop(b), 0);
  return {
    total: today.length,
    done: today.filter((b) => b.status === "concluido").length,
    expectedCents: today.filter((b) => b.payment !== "plano" && b.payment !== "recompensa").reduce((s, b) => s + b.priceCents, 0),
    receivedCents: pix + paidAtShop,
    pixCents: pix,
    dueCents: today.filter((b) => b.status === "confirmado").reduce((sum, b) => sum + dueAtShop(b), 0),
    awaitingPresence: today.filter((b) => b.status === "confirmado" && b.presence === "pendente" && b.startMin >= now.minutes),
    pendingPix: today.filter((b) => b.status === "confirmado" && b.pixStatus === "pendente"),
    next: today.find((b) => b.status === "confirmado" && b.endMin > now.minutes) ?? null,
  };
}

export interface ProfessionalMonth {
  professionalId: string;
  name: string;
  count: number;
  /** Valor de tabela dos atendimentos do mês (inclui os cobertos por plano). */
  servedCents: number;
  commissionCents: number;
  averageCents: number;
}

/** Atendimentos do mês corrente (do dia 1 até agora) por barbeiro. */
export function monthByProfessional(bookings: readonly Booking[], now: BusinessNow): ProfessionalMonth[] {
  const monthStart = `${now.date.slice(0, 8)}01`;
  const history = generateHistory(now.date).filter((visit) => visit.date >= monthStart);
  const todayDone = bookings.filter((b) => b.date === now.date && b.status === "concluido");

  return professionals.map((professional) => {
    const values = [
      ...history.filter((v) => v.professionalId === professional.id).map((v) => v.priceCents),
      ...todayDone.filter((b) => b.professionalId === professional.id).map((b) => b.priceCents),
    ];
    const served = values.reduce((sum, value) => sum + value, 0);
    return {
      professionalId: professional.id,
      name: professional.name,
      count: values.length,
      servedCents: served,
      commissionCents: Math.round((served * business.commissionPct) / 100),
      averageCents: values.length ? Math.round(served / values.length) : 0,
    };
  });
}

export interface MissingCustomer {
  name: string;
  lastDate: string;
  daysAway: number;
  serviceId: string;
  professionalId: string;
  contacted: boolean;
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

/** Clientes sem visita há mais de 30 dias e sem horário marcado. */
export function missingCustomers(state: DemoState, now: BusinessNow): MissingCustomer[] {
  const history = generateHistory(now.date);
  const booked = new Set(state.bookings.filter((b) => b.status !== "cancelado" && b.date >= now.date).map((b) => b.customerName));
  const result: MissingCustomer[] = [];
  for (const profile of customerProfiles()) {
    if (booked.has(profile.name)) continue;
    const last = history.find((visit) => visit.customerName === profile.name);
    if (!last) continue;
    const daysAway = daysBetween(last.date, now.date);
    if (daysAway <= business.missingAfterDays) continue;
    result.push({
      name: profile.name,
      lastDate: last.date,
      daysAway,
      serviceId: last.serviceId,
      professionalId: last.professionalId,
      contacted: state.contacted.includes(profile.name),
    });
  }
  return result.sort((a, b) => b.daysAway - a.daysAway);
}

export interface SubscribersSummary {
  count: number;
  monthlyCents: number;
  byPlan: Array<{ planId: string; name: string; count: number }>;
}

export function subscribersSummary(state: DemoState): SubscribersSummary {
  const ids = customerProfiles().flatMap((profile) => (profile.planId ? [profile.planId] : []));
  if (state.subscription?.pixStatus === "pago") ids.push(state.subscription.planId);
  return {
    count: ids.length,
    monthlyCents: ids.reduce((sum, id) => sum + (getPlan(id)?.priceCents ?? 0), 0),
    byPlan: plans.map((plan) => ({ planId: plan.id, name: plan.name, count: ids.filter((id) => id === plan.id).length })),
  };
}

/** Último atendimento do cliente de demonstração, para "repetir meu último corte". */
export function lastVisitOfDemoCustomer(
  bookings: readonly Booking[],
  now: BusinessNow,
): { serviceId: string; professionalId: string; date: string } | null {
  const mine = bookings
    .filter((b) => b.origin === "visitor" && b.status === "concluido")
    .sort((a, b) => b.date.localeCompare(a.date) || b.startMin - a.startMin)[0];
  if (mine) return mine;
  const visit = generateHistory(now.date).find((v) => v.customerName === demoCustomerName);
  return visit ?? null;
}

/** Quando o lembrete automático vai, ou foi, enviado. */
export function reminderText(booking: Booking, now: BusinessNow): string {
  if (booking.status !== "confirmado") return "";
  if (booking.presence === "confirmada") return "Presença confirmada pelo cliente";
  const eve = addDays(booking.date, -1);
  const eveSent = now.date > eve || (now.date === eve && now.minutes >= 18 * 60);
  const hourBefore = booking.date === now.date && now.minutes >= booking.startMin - 60;
  if (hourBefore) return "Lembrete de 1 hora antes enviado · aguardando resposta";
  if (eveSent) return "Lembrete da véspera enviado · aguardando resposta";
  return "Lembrete automático na véspera, às 18:00";
}
