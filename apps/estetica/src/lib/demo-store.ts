"use client";

import type { ObjetivoId, Respostas } from "@/lib/protocolo";
import { createLocalStore } from "@/lib/local-store";

/** Protocolo montado na página e avaliações marcadas nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  objetivo: ObjetivoId | null;
  respostas: Respostas;
  avaliacoes: { codigo: string; nome: string; objetivo: ObjetivoId | null; date: string; minutes: number }[];
}

export const STORAGE_KEY = "ax-nucleo-demo";
const OBJETIVOS = new Set(["pos-operatorio", "manchas", "flacidez", "acne"]);

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, objetivo: null, respostas: {}, avaliacoes: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !Array.isArray(e.avaliacoes)) return null;
    const objetivo = typeof e.objetivo === "string" && OBJETIVOS.has(e.objetivo) ? e.objetivo : null;
    const respostas: Respostas = {};
    if (e.respostas && typeof e.respostas === "object") {
      for (const [k, v] of Object.entries(e.respostas)) if (typeof v === "string") respostas[k] = v;
    }
    return { versao: 1, objetivo, respostas, avaliacoes: e.avaliacoes.slice(-5) };
  },
});
