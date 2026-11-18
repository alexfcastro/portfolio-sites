"use client";

import { createLocalStore } from "@/lib/local-store";
import { catalogo, combinacaoInicial, comprimentos, cores, decoracoes, formatos, type Combinacao } from "@/lib/unhas";

/** Combinação montada e agendamentos feitos nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  combinacao: Combinacao;
  /** De qual foto do catálogo a combinação veio (se veio). */
  origem: string | null;
  agendamentos: { codigo: string; nome: string; plano: string; date: string; minutes: number }[];
}

export const STORAGE_KEY = "ax-meia-lua-demo";

function valida(c: Partial<Combinacao> | undefined): Combinacao {
  if (!c) return combinacaoInicial;
  return {
    formato: formatos.some((f) => f.id === c.formato) ? c.formato! : combinacaoInicial.formato,
    comprimento: comprimentos.some((f) => f.id === c.comprimento) ? c.comprimento! : combinacaoInicial.comprimento,
    tecnica: c.tecnica === "fibra" ? "fibra" : "gel",
    cor: cores.some((f) => f.id === c.cor) ? c.cor! : combinacaoInicial.cor,
    decoracao: decoracoes.some((f) => f.id === c.decoracao) ? c.decoracao! : combinacaoInicial.decoracao,
  };
}

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, combinacao: combinacaoInicial, origem: null, agendamentos: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !Array.isArray(e.agendamentos)) return null;
    const origem = typeof e.origem === "string" && catalogo.some((c) => c.id === e.origem) ? e.origem : null;
    return { versao: 1, combinacao: valida(e.combinacao), origem, agendamentos: e.agendamentos.slice(-5) };
  },
});
