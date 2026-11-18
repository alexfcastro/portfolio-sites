"use client";

import { createLocalStore } from "@/lib/local-store";

/** Atendimentos marcados e vagas reservadas nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  /** Reservas de vaga feitas na turma atual (cada uma tira uma vaga). */
  reservas: { codigo: string; nome: string; turma: string }[];
  atendimentos: { codigo: string; nome: string; tecnica: string; date: string; minutes: number }[];
}

export const STORAGE_KEY = "ax-lash-lab-demo";

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, reservas: [], atendimentos: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !Array.isArray(e.reservas) || !Array.isArray(e.atendimentos)) return null;
    return { versao: 1, reservas: e.reservas.slice(-10), atendimentos: e.atendimentos.slice(-5) };
  },
});
