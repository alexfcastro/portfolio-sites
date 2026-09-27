"use client";

import { createLocalStore } from "@/lib/local-store";

/* Numeração dos pedidos de demonstração, guardada só neste navegador. Nenhum dado do pedido é salvo. */

interface FlowerState {
  version: 1;
  nextNumber: number;
}

export const flowerStore = createLocalStore<FlowerState>({
  key: "ax-flor-demo",
  initial: () => ({ version: 1, nextNumber: 1001 }),
  parse: (value) => {
    const v = value as Partial<FlowerState>;
    return v?.version === 1 && Number.isInteger(v.nextNumber) ? (v as FlowerState) : null;
  },
});

export function takeOrderNumber(): string {
  const state = flowerStore.get();
  flowerStore.set({ ...state, nextNumber: state.nextNumber + 1 });
  return `FA-${state.nextNumber}`;
}
