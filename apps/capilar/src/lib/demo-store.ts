"use client";

import { createLocalStore } from "@/lib/local-store";
import { perguntas, type Respostas } from "@/lib/questionario";

/** Respostas do questionário e avaliações marcadas nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  respostas: Respostas;
  avaliacoes: { codigo: string; nome: string; date: string; minutes: number }[];
}

export const STORAGE_KEY = "ax-fio-nobre-demo";

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, respostas: {}, avaliacoes: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !Array.isArray(e.avaliacoes)) return null;
    const respostas: Respostas = {};
    for (const p of perguntas) {
      const v = e.respostas?.[p.id];
      if (typeof v === "string" && p.opcoes.some((o) => o.id === v)) respostas[p.id] = v;
    }
    return { versao: 1, respostas, avaliacoes: e.avaliacoes.slice(-5) };
  },
});
