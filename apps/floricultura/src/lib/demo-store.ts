"use client";

import { createLocalStore } from "@/lib/local-store";
import { MAX_CART_ITEMS, type OrderDraft } from "@/lib/order";

/*
 * Carrinho e numeração dos pedidos de demonstração, guardados só neste navegador.
 * Os itens têm apenas dados fictícios (nome de quem recebe, bairro de exemplo).
 */

interface FlowerState {
  version: 2;
  nextNumber: number;
  cart: OrderDraft[];
}

const isItem = (value: unknown): value is OrderDraft => {
  const v = value as Partial<OrderDraft>;
  return (
    typeof v?.productId === "string" &&
    typeof v.sizeId === "string" &&
    Array.isArray(v.addonIds) &&
    v.addonIds.every((id) => typeof id === "string") &&
    typeof v.card === "string" &&
    typeof v.fulfillment === "string" &&
    typeof v.regionId === "string" &&
    typeof v.date === "string" &&
    typeof v.period === "string" &&
    typeof v.personName === "string"
  );
};

export const flowerStore = createLocalStore<FlowerState>({
  key: "ax-flor-demo",
  initial: () => ({ version: 2, nextNumber: 1001, cart: [] }),
  parse: (value) => {
    const v = value as { version?: number; nextNumber?: unknown; cart?: unknown };
    if (!Number.isInteger(v?.nextNumber)) return null;
    // Versão 1 só tinha a numeração: mantém o número e começa com o carrinho vazio.
    if (v.version === 1) return { version: 2, nextNumber: v.nextNumber as number, cart: [] };
    if (v.version !== 2 || !Array.isArray(v.cart) || !v.cart.every(isItem)) return null;
    return v as FlowerState;
  },
});

export const flowerActions = {
  add(item: OrderDraft): { ok: true } | { ok: false; error: string } {
    const state = flowerStore.get();
    if (state.cart.length >= MAX_CART_ITEMS) return { ok: false, error: `O carrinho aceita no máximo ${MAX_CART_ITEMS} itens.` };
    flowerStore.set({ ...state, cart: [...state.cart, { ...item, card: item.card.trim(), personName: item.personName.trim() }] });
    return { ok: true };
  },
  remove(index: number) {
    const state = flowerStore.get();
    flowerStore.set({ ...state, cart: state.cart.filter((_, i) => i !== index) });
  },
  /** Fecha o pedido de demonstração: devolve o código e esvazia o carrinho. */
  checkout(): string {
    const state = flowerStore.get();
    flowerStore.set({ ...state, nextNumber: state.nextNumber + 1, cart: [] });
    return `FA-${state.nextNumber}`;
  },
};
