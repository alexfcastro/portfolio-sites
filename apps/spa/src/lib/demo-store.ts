"use client";

import { createLocalStore } from "@/lib/local-store";

/** Vales emitidos e reservas feitas nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  vales: { codigo: string; para: string; total: number; validoAte: string }[];
  reservas: { codigo: string; nome: string; experiencia: string; date: string; minutes: number }[];
}

export const STORAGE_KEY = "ax-casa-serena-demo";

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, vales: [], reservas: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !Array.isArray(e.vales) || !Array.isArray(e.reservas)) return null;
    return { versao: 1, vales: e.vales.slice(-5), reservas: e.reservas.slice(-5) };
  },
});
