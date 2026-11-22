import { business, professionals } from "@/data/business";
import type { DemoState } from "@/lib/demo-state";
import { generateHistory } from "@/lib/history";
import { subscribersSummary } from "@/lib/insights";
import { pickupDate } from "@/lib/loja";
import { getOpeningWindow } from "@/lib/schedule";
import { addDays, getWeekday } from "@/lib/time";
import type { Booking, BusinessNow } from "@/types/booking";

/*
 * Faturamento do mês e estimativa, a partir da agenda deste navegador e do histórico fictício.
 * Serviços cobertos por plano ou fidelidade não entram como faturamento do serviço: o plano
 * entra uma vez, como receita das assinaturas.
 */

/** O atendimento gera faturamento próprio? (plano e fidelidade não) */
export function billable(booking: Pick<Booking, "payment">): boolean {
  return booking.payment !== "plano" && booking.payment !== "recompensa";
}

export interface DayRevenue {
  date: string;
  closed: boolean;
  /** Já atendido (dias passados e concluídos de hoje). */
  realizedCents: number;
  /** Marcado e confirmado, ainda não atendido. */
  bookedCents: number;
  /** O que ainda costuma entrar nesse dia além do agendado (média do mesmo dia da semana). */
  projectedCents: number;
  /** Média dos últimos 4 iguais dias da semana. */
  averageCents: number;
  bookedCount: number;
}

export interface ProfessionalForecast {
  professionalId: string;
  name: string;
  realizedCents: number;
  bookedCents: number;
  projectedCents: number;
}

export interface MonthForecast {
  monthStart: string;
  monthEnd: string;
  days: DayRevenue[];
  realizedCents: number;
  bookedCents: number;
  projectedCents: number;
  storeCents: number;
  plansCents: number;
  /** Realizado + agendado + projeção + loja + assinaturas. */
  estimateCents: number;
  /** Só o que é certo: realizado + agendado + loja + assinaturas. */
  conservativeCents: number;
  byProfessional: ProfessionalForecast[];
}

function lastDayOfMonth(date: string): string {
  const [year, month] = date.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

/** Faturamento de serviços em cada dia passado, por barbeiro (histórico fictício). */
function historyByDay(today: string): Map<string, Map<string, number>> {
  const map = new Map<string, Map<string, number>>();
  for (const visit of generateHistory(today)) {
    if (visit.viaPlan) continue;
    const day = map.get(visit.date) ?? new Map<string, number>();
    day.set(visit.professionalId, (day.get(visit.professionalId) ?? 0) + visit.priceCents);
    map.set(visit.date, day);
  }
  return map;
}

function sum(values: Iterable<number>): number {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

/** Média de faturamento dos últimos 4 dias iguais da semana, por barbeiro. */
function weekdayAverage(history: Map<string, Map<string, number>>, date: string, today: string, professionalId?: string): number {
  const values: number[] = [];
  for (let back = 7; values.length < 4 && back <= 63; back += 7) {
    const past = addDays(date, -back);
    if (past >= today) continue;
    const day = history.get(past);
    if (!day) continue;
    values.push(professionalId ? (day.get(professionalId) ?? 0) : sum(day.values()));
  }
  return values.length ? Math.round(sum(values) / values.length) : 0;
}

export function monthForecast(state: DemoState, now: BusinessNow): MonthForecast {
  const monthStart = `${now.date.slice(0, 8)}01`;
  const monthEnd = lastDayOfMonth(now.date);
  const history = historyByDay(now.date);
  const days: DayRevenue[] = [];
  const perPro = new Map(professionals.map((p) => [p.id, { realizedCents: 0, bookedCents: 0, projectedCents: 0 }]));

  for (let date = monthStart; date <= monthEnd; date = addDays(date, 1)) {
    const window = getOpeningWindow(date);
    const closed = !window;
    const day: DayRevenue = { date, closed, realizedCents: 0, bookedCents: 0, projectedCents: 0, averageCents: 0, bookedCount: 0 };
    if (!closed) {
      const dayBookings = state.bookings.filter((b) => b.date === date && b.status !== "cancelado" && billable(b));
      for (const professional of professionals) {
        const acc = perPro.get(professional.id)!;
        let realized = 0;
        let booked = 0;
        if (date < now.date) {
          realized = history.get(date)?.get(professional.id) ?? 0;
        } else {
          const mine = dayBookings.filter((b) => b.professionalId === professional.id);
          realized = sum(mine.filter((b) => b.status === "concluido").map((b) => b.priceCents));
          booked = sum(mine.filter((b) => b.status === "confirmado").map((b) => b.priceCents));
          day.bookedCount += mine.filter((b) => b.status === "confirmado").length;
        }
        let projected = 0;
        const average = weekdayAverage(history, date, now.date, professional.id);
        day.averageCents += average;
        if (date >= now.date) {
          // Não depende do relógio: o número só muda quando a agenda muda (ou o dia vira).
          // Antes, hoje contava só "a parte do expediente que falta", e a estimativa mudava a cada minuto.
          projected = Math.max(0, average - realized - booked);
        }
        acc.realizedCents += realized;
        acc.bookedCents += booked;
        acc.projectedCents += projected;
        day.realizedCents += realized;
        day.bookedCents += booked;
        day.projectedCents += projected;
      }
    }
    days.push(day);
  }

  const storeCents = sum(
    state.orders
      .filter((o) => o.status !== "cancelado")
      .filter((o) => {
        const date = pickupDate(state, o);
        return date !== null && date >= monthStart && date <= monthEnd;
      })
      .map((o) => o.totalCents),
  );
  const plansCents = subscribersSummary(state).monthlyCents;
  const realizedCents = sum(days.map((d) => d.realizedCents));
  const bookedCents = sum(days.map((d) => d.bookedCents));
  const projectedCents = sum(days.map((d) => d.projectedCents));

  return {
    monthStart,
    monthEnd,
    days,
    realizedCents,
    bookedCents,
    projectedCents,
    storeCents,
    plansCents,
    estimateCents: realizedCents + bookedCents + projectedCents + storeCents + plansCents,
    conservativeCents: realizedCents + bookedCents + storeCents + plansCents,
    byProfessional: professionals.map((p) => ({ professionalId: p.id, name: p.name, ...perPro.get(p.id)! })),
  };
}

export interface Occupancy {
  professionalId: string;
  /** Minutos ocupados por agendamentos ativos. */
  busyMin: number;
  /** Minutos disponíveis (expediente − almoço − bloqueios). */
  openMin: number;
  pct: number;
}

/** Quanto da agenda de cada barbeiro está ocupado no dia. */
export function occupancy(state: DemoState, date: string): Occupancy[] {
  const window = getOpeningWindow(date);
  return professionals.map((professional) => {
    if (!window) return { professionalId: professional.id, busyMin: 0, openMin: 0, pct: 0 };
    const lunch = business.lunch.endMin - business.lunch.startMin;
    const blocked = sum(
      state.blocks.filter((b) => b.professionalId === professional.id && b.date === date).map((b) => b.endMin - b.startMin),
    );
    const openMin = Math.max(0, window.closeMin - window.openMin - lunch - blocked);
    const busyMin = sum(
      state.bookings
        .filter((b) => b.professionalId === professional.id && b.date === date && b.status !== "cancelado")
        .map((b) => b.endMin - b.startMin),
    );
    return { professionalId: professional.id, busyMin, openMin, pct: openMin ? Math.min(100, Math.round((busyMin / openMin) * 100)) : 0 };
  });
}

/** Dias da semana por extenso, para explicar a projeção. */
export function weekdayName(date: string): string {
  return ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][getWeekday(date)] ?? "";
}

