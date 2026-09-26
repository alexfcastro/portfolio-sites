"use client";

import { createAppointment, validateBooking, type Appointment, type BookingInput } from "@/lib/booking";
import { createLocalStore } from "@/lib/local-store";
import type { BusinessNow } from "@/lib/time";

/*
 * Agendamentos feitos pelo visitante, guardados só neste navegador.
 * A ocupação de exemplo é gerada a partir da data e não é salva.
 */

interface PetState {
  version: 1;
  nextNumber: number;
  appointments: Appointment[];
}

export const petStore = createLocalStore<PetState>({
  key: "ax-petville-demo",
  initial: () => ({ version: 1, nextNumber: 1001, appointments: [] }),
  parse: (value) => {
    const v = value as Partial<PetState>;
    if (v?.version !== 1 || !Number.isInteger(v.nextNumber) || !Array.isArray(v.appointments)) return null;
    const ok = v.appointments.every(
      (a) => typeof a?.id === "string" && typeof a.date === "string" && Number.isInteger(a.startMin) && (a.status === "agendado" || a.status === "cancelado"),
    );
    return ok ? (v as PetState) : null;
  },
});

export const petActions = {
  book(input: BookingInput, taken: readonly Appointment[], now: BusinessNow): { ok: true; appointment: Appointment } | { ok: false; error: string } {
    const error = validateBooking(input, taken, now);
    if (error) return { ok: false, error };
    const state = petStore.get();
    const appointment = createAppointment(input, state.nextNumber);
    petStore.set({ ...state, nextNumber: state.nextNumber + 1, appointments: [...state.appointments, appointment] });
    return { ok: true, appointment };
  },
  cancel(id: string) {
    const state = petStore.get();
    petStore.set({
      ...state,
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a)),
    });
  },
};
