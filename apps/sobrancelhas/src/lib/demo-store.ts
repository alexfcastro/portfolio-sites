"use client";

import type { Anterior, Historico, ProcedimentoId } from "@/lib/avaliacao";
import { createLocalStore } from "@/lib/local-store";

/** Avaliação marcada nesta demonstração (só neste navegador; nada é enviado). */
export interface Marcacao {
  codigo: string;
  nome: string;
  procedimento: ProcedimentoId;
  anterior: Anterior;
  historico: Historico;
  date: string;
  minutes: number;
}

interface Estado {
  versao: 1;
  marcacoes: Marcacao[];
}

export const STORAGE_KEY = "ax-linha-fina-demo";

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, marcacoes: [] }),
  parse: (value) => {
    const estado = value as Partial<Estado> | null;
    if (!estado || estado.versao !== 1 || !Array.isArray(estado.marcacoes)) return null;
    const validas = estado.marcacoes.filter(
      (m) => typeof m?.codigo === "string" && typeof m.date === "string" && Number.isInteger(m.minutes),
    );
    return { versao: 1, marcacoes: validas.slice(-5) };
  },
});
