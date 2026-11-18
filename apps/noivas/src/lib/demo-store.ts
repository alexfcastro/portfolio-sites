"use client";

import { createLocalStore } from "@/lib/local-store";
import { grupoInicial, tipos, type Grupo, type Servico } from "@/lib/orcamento";

/** Montagem do grupo, data escolhida e pedidos feitos nesta demonstração (só neste navegador). */
export interface Estado {
  versao: 1;
  grupo: Grupo;
  /** Horário da cerimônia em minutos desde 0h. */
  cerimonia: number;
  noLocal: boolean;
  data: string | null;
  pedidos: { codigo: string; nome: string; data: string; total: number }[];
}

export const STORAGE_KEY = "ax-atelie-veu-demo";
const SERVICOS = new Set<Servico>(["cabelo", "maquiagem", "ambos"]);

export const demoStore = createLocalStore<Estado>({
  key: STORAGE_KEY,
  initial: () => ({ versao: 1, grupo: grupoInicial(), cerimonia: 17 * 60, noLocal: false, data: null, pedidos: [] }),
  parse: (value) => {
    const e = value as Partial<Estado> | null;
    if (!e || e.versao !== 1 || !e.grupo || !Array.isArray(e.pedidos)) return null;
    const grupo = grupoInicial();
    for (const tipo of tipos) {
      const linha = e.grupo[tipo.id];
      if (linha && Number.isInteger(linha.quantidade) && SERVICOS.has(linha.servico)) {
        grupo[tipo.id] = { quantidade: Math.max(0, Math.min(tipo.max, linha.quantidade)), servico: linha.servico };
      }
    }
    grupo.noiva.quantidade = 1;
    const cerimonia = Number.isInteger(e.cerimonia) ? Math.min(Math.max(e.cerimonia!, 8 * 60), 22 * 60) : 17 * 60;
    const data = typeof e.data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.data) ? e.data : null;
    return { versao: 1, grupo, cerimonia, noLocal: Boolean(e.noLocal), data, pedidos: e.pedidos.slice(-5) };
  },
});
