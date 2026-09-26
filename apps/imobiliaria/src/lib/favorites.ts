"use client";

import { createLocalStore } from "@/lib/local-store";
import { toggleFavorite } from "@/lib/search";

/** Favoritos demonstrativos: só códigos de imóveis, só neste navegador. */
export const favoritesStore = createLocalStore<{ version: 1; codes: string[] }>({
  key: "ax-horizonte-demo",
  initial: () => ({ version: 1, codes: [] }),
  parse: (value) => {
    const v = value as { version?: number; codes?: unknown };
    return v?.version === 1 && Array.isArray(v.codes) && v.codes.every((c) => typeof c === "string")
      ? { version: 1, codes: v.codes as string[] }
      : null;
  },
});

export function toggle(code: string) {
  const state = favoritesStore.get();
  favoritesStore.set({ ...state, codes: toggleFavorite(state.codes, code) });
}
