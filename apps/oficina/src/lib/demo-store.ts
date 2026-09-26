"use client";

import { createLocalStore } from "@/lib/local-store";
import { estimateRange, likelyServices, nextStage, STAGES, type Stage, type Vehicle } from "@/lib/quote";

/*
 * Solicitações de orçamento de demonstração. As fotos NÃO são guardadas:
 * só a quantidade, para mostrar no acompanhamento.
 */

export interface QuoteRequest {
  id: string;
  vehicle: Vehicle;
  categoryId: string;
  symptomIds: string[];
  description: string;
  photoCount: number;
  estimate: { minCents: number; maxCents: number };
  stage: Stage;
}

interface GarageState {
  version: 1;
  nextNumber: number;
  requests: QuoteRequest[];
}

export const garageStore = createLocalStore<GarageState>({
  key: "ax-torque-demo",
  initial: () => ({ version: 1, nextNumber: 1001, requests: [] }),
  parse: (value) => {
    const v = value as Partial<GarageState>;
    if (v?.version !== 1 || !Number.isInteger(v.nextNumber) || !Array.isArray(v.requests)) return null;
    const ok = v.requests.every((r) => typeof r?.id === "string" && STAGES.includes(r.stage) && typeof r.vehicle?.model === "string");
    return ok ? (v as GarageState) : null;
  },
});

export const garageActions = {
  submit(input: Omit<QuoteRequest, "id" | "estimate" | "stage">): QuoteRequest {
    const state = garageStore.get();
    const request: QuoteRequest = {
      ...input,
      id: `OF-${state.nextNumber}`,
      estimate: estimateRange(likelyServices(input.categoryId, input.symptomIds)),
      stage: "recebido",
    };
    garageStore.set({ ...state, nextNumber: state.nextNumber + 1, requests: [...state.requests, request] });
    return request;
  },
  advance(id: string) {
    const state = garageStore.get();
    garageStore.set({
      ...state,
      requests: state.requests.map((r) => {
        const next = r.id === id ? nextStage(r.stage) : null;
        return next ? { ...r, stage: next } : r;
      }),
    });
  },
  reset: garageStore.reset,
};
