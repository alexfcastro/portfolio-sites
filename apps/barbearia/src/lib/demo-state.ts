import { demoCustomerName, getService } from "@/data/business";
import { generateSeedBookings, validateNewBooking, type NewBookingInput } from "@/lib/schedule";
import type { Booking, BookingStatus, BusinessNow } from "@/types/booking";

/*
 * Estado da demo: apenas dados fictícios, guardados só neste navegador.
 * Não há reserva real nem sincronização entre visitantes.
 */

export const STORAGE_KEY = "ax-bravus-demo";
export const STATE_VERSION = 1;

export interface DemoState {
  version: typeof STATE_VERSION;
  /** Dia em que a agenda de exemplo foi gerada; em outro dia ela é recriada. */
  seedDate: string;
  nextNumber: number;
  bookings: Booking[];
}

export type Outcome<T> = { ok: true; state: DemoState; value: T } | { ok: false; error: string };

export function createInitialState(now: BusinessNow): DemoState {
  return { version: STATE_VERSION, seedDate: now.date, nextNumber: 1001, bookings: generateSeedBookings(now) };
}

const STATUSES: BookingStatus[] = ["confirmado", "concluido", "cancelado"];

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.serviceId === "string" &&
    typeof b.professionalId === "string" &&
    typeof b.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    Number.isInteger(b.startMin) &&
    Number.isInteger(b.endMin) &&
    Number.isInteger(b.priceCents) &&
    typeof b.customerName === "string" &&
    STATUSES.includes(b.status as BookingStatus) &&
    (b.origin === "seed" || b.origin === "visitor")
  );
}

/** Aceita o estado salvo só se tiver a versão atual, for do dia de hoje e tiver formato válido. */
export function parseStoredState(raw: string | null, today: string): DemoState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<DemoState>;
    if (value.version !== STATE_VERSION || value.seedDate !== today) return null;
    if (!Number.isInteger(value.nextNumber) || !Array.isArray(value.bookings)) return null;
    if (!value.bookings.every(isBooking)) return null;
    return value as DemoState;
  } catch {
    return null;
  }
}

export function addVisitorBooking(state: DemoState, input: NewBookingInput, now: BusinessNow): Outcome<Booking> {
  const error = validateNewBooking(input, state.bookings, now);
  if (error) return { ok: false, error };

  const service = getService(input.serviceId);
  if (!service) return { ok: false, error: "Serviço inválido." };

  const booking: Booking = {
    id: `BRV-${state.nextNumber}`,
    serviceId: service.id,
    professionalId: input.professionalId,
    date: input.date,
    startMin: input.startMin,
    endMin: input.startMin + service.durationMin,
    priceCents: service.priceCents,
    customerName: demoCustomerName,
    status: "confirmado",
    origin: "visitor",
  };

  return {
    ok: true,
    value: booking,
    state: { ...state, nextNumber: state.nextNumber + 1, bookings: [...state.bookings, booking] },
  };
}

/** Transições permitidas no painel demonstrativo. */
export function allowedTransitions(status: BookingStatus): BookingStatus[] {
  if (status === "confirmado") return ["concluido", "cancelado"];
  if (status === "cancelado") return ["confirmado"];
  return [];
}

export function changeBookingStatus(
  state: DemoState,
  id: string,
  next: BookingStatus,
  now: BusinessNow,
): Outcome<Booking> {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return { ok: false, error: "Agendamento não encontrado." };
  if (!allowedTransitions(booking.status).includes(next)) {
    return { ok: false, error: "Esta alteração não é permitida para o estado atual." };
  }

  if (next === "confirmado") {
    // Reativar exige que o horário continue livre e no futuro.
    const error = validateNewBooking(
      { serviceId: booking.serviceId, professionalId: booking.professionalId, date: booking.date, startMin: booking.startMin },
      state.bookings,
      now,
      booking.id,
    );
    if (error) return { ok: false, error: `Não foi possível reativar: ${error.toLowerCase()}` };
  }

  const updated: Booking = { ...booking, status: next };
  return {
    ok: true,
    value: updated,
    state: { ...state, bookings: state.bookings.map((item) => (item.id === id ? updated : item)) },
  };
}
