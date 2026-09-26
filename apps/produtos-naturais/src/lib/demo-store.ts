"use client";

import { addLine, setQuantity, type CartLine } from "@/lib/cart";
import { createLocalStore } from "@/lib/local-store";

/* Carrinho, favoritos e numeração de pedidos de demonstração, só neste navegador. */

interface ShopState {
  version: 1;
  nextNumber: number;
  cart: CartLine[];
  favorites: string[];
}

export const shopStore = createLocalStore<ShopState>({
  key: "ax-raiz-demo",
  initial: () => ({ version: 1, nextNumber: 1001, cart: [], favorites: [] }),
  parse: (value) => {
    const v = value as Partial<ShopState>;
    if (v?.version !== 1 || !Number.isInteger(v.nextNumber) || !Array.isArray(v.cart) || !Array.isArray(v.favorites)) return null;
    const ok =
      v.cart.every((l) => typeof l?.productId === "string" && Number.isInteger(l.quantity) && (l.grams === null || Number.isInteger(l.grams))) &&
      v.favorites.every((f) => typeof f === "string");
    return ok ? (v as ShopState) : null;
  },
});

export const shopActions = {
  add(line: CartLine): { ok: true } | { ok: false; error: string } {
    const state = shopStore.get();
    const result = addLine(state.cart, line);
    if (!result.ok) return result;
    shopStore.set({ ...state, cart: result.cart });
    return { ok: true };
  },
  setQuantity(index: number, quantity: number) {
    const state = shopStore.get();
    shopStore.set({ ...state, cart: setQuantity(state.cart, index, quantity) });
  },
  clearCart() {
    shopStore.set({ ...shopStore.get(), cart: [] });
  },
  /** Registra o pedido de demonstração: avança a numeração e esvazia o carrinho. */
  completeOrder() {
    const state = shopStore.get();
    shopStore.set({ ...state, nextNumber: state.nextNumber + 1, cart: [] });
  },
  toggleFavorite(id: string) {
    const state = shopStore.get();
    const favorites = state.favorites.includes(id) ? state.favorites.filter((f) => f !== id) : [...state.favorites, id];
    shopStore.set({ ...state, favorites });
  },
};
