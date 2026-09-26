"use client";

import { createLocalStore } from "@/lib/local-store";
import { validateTrial, type Trial } from "@/lib/schedule";
import type { BusinessNow } from "@/lib/time";

/*
 * Aulas experimentais de demonstração, guardadas só neste navegador.
 * As matrículas de exemplo são calculadas a partir da data e não são salvas.
 */

interface StudioState {
  version: 1;
  nextNumber: number;
  trials: Trial[];
}

const STATUSES: Trial["status"][] = ["reservada", "presente", "cancelada"];

export const studioStore = createLocalStore<StudioState>({
  key: "ax-pulse-demo",
  initial: () => ({ version: 1, nextNumber: 1001, trials: [] }),
  parse: (value) => {
    const v = value as Partial<StudioState>;
    if (v?.version !== 1 || !Number.isInteger(v.nextNumber) || !Array.isArray(v.trials)) return null;
    const ok = v.trials.every((t) => typeof t?.id === "string" && typeof t.occurrenceKey === "string" && STATUSES.includes(t.status));
    return ok ? (v as StudioState) : null;
  },
});

export const studioActions = {
  book(
    input: { occurrenceKey: string; nickname: string; level: string },
    now: BusinessNow,
  ): { ok: true; trial: Trial } | { ok: false; error: string } {
    const state = studioStore.get();
    const error = validateTrial(input, state.trials, now);
    if (error) return { ok: false, error };
    const trial: Trial = {
      id: `PS-${state.nextNumber}`,
      occurrenceKey: input.occurrenceKey,
      nickname: input.nickname.trim(),
      level: input.level as Trial["level"],
      status: "reservada",
    };
    studioStore.set({ ...state, nextNumber: state.nextNumber + 1, trials: [...state.trials, trial] });
    return { ok: true, trial };
  },
  setStatus(id: string, status: Trial["status"]) {
    const state = studioStore.get();
    studioStore.set({ ...state, trials: state.trials.map((t) => (t.id === id ? { ...t, status } : t)) });
  },
};
