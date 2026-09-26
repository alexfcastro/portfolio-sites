"use client";

import { useSyncExternalStore } from "react";
import type { NewBookingInput } from "@/lib/schedule";
import {
  addVisitorBooking,
  changeBookingStatus,
  createInitialState,
  parseStoredState,
  STORAGE_KEY,
  type DemoState,
  type Outcome,
} from "@/lib/demo-state";
import { getBusinessNow } from "@/lib/time";
import type { Booking, BookingStatus } from "@/types/booking";

/*
 * Store do navegador. Persiste no localStorage com chave própria (ax-bravus-demo),
 * para que o painel veja os agendamentos feitos em outra aba do mesmo navegador.
 * Se o armazenamento estiver bloqueado, funciona só em memória.
 */

let state: DemoState | null = null;
const listeners = new Set<() => void>();

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Armazenamento indisponível: segue em memória.
  }
}

function load(): DemoState {
  const now = getBusinessNow();
  const stored = parseStoredState(readStorage(), now.date);
  if (stored) return stored;
  const fresh = createInitialState(now);
  writeStorage(fresh);
  return fresh;
}

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: DemoState) {
  state = next;
  writeStorage(next);
  emit();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): DemoState {
  if (!state) state = load();
  return state;
}

/** No servidor não há estado: a agenda só existe no navegador. */
function getServerSnapshot(): null {
  return null;
}

export function useDemoState(): DemoState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function apply(outcome: Outcome<Booking>): Outcome<Booking> {
  if (outcome.ok) setState(outcome.state);
  return outcome;
}

export const demoActions = {
  book(input: NewBookingInput): Outcome<Booking> {
    return apply(addVisitorBooking(getSnapshot(), input, getBusinessNow()));
  },
  setStatus(id: string, status: BookingStatus): Outcome<Booking> {
    return apply(changeBookingStatus(getSnapshot(), id, status, getBusinessNow()));
  },
  /** Apaga os agendamentos criados aqui e recria a agenda de exemplo. */
  reset() {
    setState(createInitialState(getBusinessNow()));
  },
};
