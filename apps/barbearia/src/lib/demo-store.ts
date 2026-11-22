"use client";

import { useSyncExternalStore } from "react";
import type { NewBookingInput } from "@/lib/schedule";
import {
  addBlock,
  addVisitorBooking,
  cancelByCustomer,
  cancelSubscription,
  changeBookingStatus,
  confirmPresence,
  createInitialState,
  fitFromWaitlist,
  joinWaitlist,
  leaveWaitlist,
  markContacted,
  notifyWaiting,
  parseStoredState,
  payPix,
  paySubscription,
  removeBlock,
  reschedule,
  STORAGE_KEY,
  subscribe as subscribePlan,
  sweepExpiredPix,
  type DemoState,
  type NewBlockInput,
  type NewWaitInput,
  type Outcome,
} from "@/lib/demo-state";
import { addToCart, advanceOrder, cancelOrder, payOrderPix, placeOrder, setCartQty } from "@/lib/loja";
import { getBusinessNow } from "@/lib/time";
import type { BookingStatus, Order, PaymentMode, Pickup } from "@/types/booking";

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
  if (stored) return sweepExpiredPix(stored, Date.now());
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

function apply<T>(outcome: Outcome<T>): Outcome<T> {
  if (outcome.ok) setState(outcome.state);
  return outcome;
}

const now = () => getBusinessNow();

export const demoActions = {
  book(input: NewBookingInput, payment: PaymentMode = "local") {
    return apply(addVisitorBooking(getSnapshot(), input, now(), payment, Date.now()));
  },
  payPix(id: string) {
    return apply(payPix(getSnapshot(), id));
  },
  /** Libera horários com Pix vencido (chamado pelo contador do pagamento). */
  sweepPix() {
    const next = sweepExpiredPix(getSnapshot(), Date.now());
    if (next !== getSnapshot()) setState(next);
  },
  setStatus(id: string, status: BookingStatus) {
    return apply(changeBookingStatus(getSnapshot(), id, status, now()));
  },
  cancelByCustomer(id: string) {
    return apply(cancelByCustomer(getSnapshot(), id, now()));
  },
  reschedule(id: string, date: string, startMin: number) {
    return apply(reschedule(getSnapshot(), id, date, startMin, now()));
  },
  confirmPresence(id: string) {
    return apply(confirmPresence(getSnapshot(), id));
  },
  addBlock(input: NewBlockInput) {
    return apply(addBlock(getSnapshot(), input, now()));
  },
  removeBlock(id: string) {
    return apply(removeBlock(getSnapshot(), id));
  },
  joinWaitlist(input: NewWaitInput) {
    return apply(joinWaitlist(getSnapshot(), input, now()));
  },
  leaveWaitlist(id: string) {
    return apply(leaveWaitlist(getSnapshot(), id));
  },
  notifyWaiting(id: string) {
    return apply(notifyWaiting(getSnapshot(), id));
  },
  fitFromWaitlist(id: string) {
    return apply(fitFromWaitlist(getSnapshot(), id, now()));
  },
  markContacted(name: string) {
    setState(markContacted(getSnapshot(), name));
  },
  subscribe(planId: string) {
    return apply(subscribePlan(getSnapshot(), planId));
  },
  paySubscription() {
    return apply(paySubscription(getSnapshot()));
  },
  cancelSubscription() {
    setState(cancelSubscription(getSnapshot()));
  },
  addToCart(productId: string, qty = 1) {
    return apply(addToCart(getSnapshot(), productId, qty));
  },
  setCartQty(productId: string, qty: number) {
    return apply(setCartQty(getSnapshot(), productId, qty));
  },
  placeOrder(pickup: Pickup, payment: Order["payment"]) {
    return apply(placeOrder(getSnapshot(), { pickup, payment }, now(), Date.now()));
  },
  payOrder(id: string) {
    return apply(payOrderPix(getSnapshot(), id));
  },
  advanceOrder(id: string) {
    return apply(advanceOrder(getSnapshot(), id));
  },
  cancelOrder(id: string) {
    return apply(cancelOrder(getSnapshot(), id));
  },
  /** Apaga o que foi criado aqui e recria a agenda de exemplo. */
  reset() {
    setState(createInitialState(now()));
  },
};
