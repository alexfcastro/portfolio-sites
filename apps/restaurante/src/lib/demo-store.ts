"use client";

import { useSyncExternalStore } from "react";
import { addToCart, setQuantity, summarize, type AddonSelection, type CartLine, type Fulfillment } from "@/lib/cart";

/*
 * Carrinho de demonstração guardado só neste navegador (chave própria, versão e
 * reset). Gerar o pedido não envia nada: só cria um código e uma prévia local.
 */

export const STORAGE_KEY = "ax-sabor-demo";
const VERSION = 1;

export interface RestaurantState {
  version: typeof VERSION;
  nextNumber: number;
  lines: CartLine[];
  fulfillment: Fulfillment;
}

const initialState = (): RestaurantState => ({ version: VERSION, nextNumber: 1001, lines: [], fulfillment: { type: "retirada" } });

export function parseStored(raw: string | null): RestaurantState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<RestaurantState>;
    if (value.version !== VERSION || !Number.isInteger(value.nextNumber) || !Array.isArray(value.lines)) return null;
    const linesOk = value.lines.every(
      (line) => typeof line?.key === "string" && typeof line.itemId === "string" && Number.isInteger(line.quantity),
    );
    const fulfillmentOk = value.fulfillment?.type === "retirada" || value.fulfillment?.type === "entrega";
    return linesOk && fulfillmentOk ? (value as RestaurantState) : null;
  } catch {
    return null;
  }
}

let state: RestaurantState | null = null;
const listeners = new Set<() => void>();

function load(): RestaurantState {
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY)) ?? initialState();
  } catch {
    return initialState();
  }
}

function setState(next: RestaurantState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: segue em memória.
  }
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): RestaurantState {
  if (!state) state = load();
  return state;
}

export function useRestaurantState(): RestaurantState | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export interface PlacedOrder {
  id: string;
  lines: CartLine[];
  fulfillment: Fulfillment;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}

export const cartActions = {
  add(itemId: string, addons: AddonSelection, quantity: number, note: string) {
    const current = getSnapshot();
    const result = addToCart(current.lines, itemId, addons, quantity, note);
    if (result.ok) setState({ ...current, lines: result.lines });
    return result;
  },
  setQuantity(key: string, quantity: number) {
    const current = getSnapshot();
    setState({ ...current, lines: setQuantity(current.lines, key, quantity) });
  },
  setFulfillment(fulfillment: Fulfillment) {
    setState({ ...getSnapshot(), fulfillment });
  },
  /** Gera o pedido de demonstração (sem envio) e esvazia o carrinho. */
  placeOrder(): { ok: true; order: PlacedOrder } | { ok: false; error: string } {
    const current = getSnapshot();
    const summary = summarize(current.lines, current.fulfillment);
    if (summary.error) return { ok: false, error: summary.error };
    const order: PlacedOrder = {
      id: `SB-${current.nextNumber}`,
      lines: current.lines,
      fulfillment: current.fulfillment,
      subtotalCents: summary.subtotalCents,
      deliveryFeeCents: summary.deliveryFeeCents,
      totalCents: summary.totalCents,
    };
    setState({ ...current, nextNumber: current.nextNumber + 1, lines: [] });
    return { ok: true, order };
  },
  reset() {
    setState(initialState());
  },
};
