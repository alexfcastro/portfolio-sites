"use client";

import { useState } from "react";
import { Comparador } from "@/components/comparador";
import { galeria, type CasoGaleria } from "@/data/studio";

/** Galeria de antes e depois separada por tipo de sobrancelha. Cada tipo abre o próprio comparador. */
export function Galeria() {
  const primeiro = galeria[0] as CasoGaleria;
  const [ativo, setAtivo] = useState(primeiro.id);
  const caso = galeria.find((item) => item.id === ativo) ?? primeiro;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-start">
      <fieldset>
        <legend className="text-sm font-semibold text-muted">Escolha o tipo de sobrancelha</legend>
        <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
          {galeria.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === ativo}
              onClick={() => setAtivo(item.id)}
              className="min-h-11 rounded-full border border-line px-4 text-left transition-colors aria-pressed:border-cacau aria-pressed:bg-cacau aria-pressed:text-white hover:border-cacau lg:rounded-card lg:py-3"
            >
              {item.tipo}
            </button>
          ))}
        </div>
      </fieldset>

      <div key={caso.id} className="troca">
        <Comparador
          antes={caso.antes}
          depois={caso.depois}
          rotulo={`sobrancelha ${caso.tipo.toLowerCase()}`}
          sizes="(min-width: 1024px) 760px, 100vw"
          className="aspect-[4/3] rounded-card"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <p className="leading-relaxed">
            <span className="block text-xs font-semibold tracking-[0.16em] text-cacau uppercase">Como estava</span>
            {caso.descricao}
          </p>
          <p className="leading-relaxed">
            <span className="block text-xs font-semibold tracking-[0.16em] text-cacau uppercase">O que foi feito</span>
            {caso.procedimento}
          </p>
        </div>
        <p className="mt-4 text-sm text-muted">Imagens ilustrativas, geradas por IA para esta demonstração. Não são resultados de clientes.</p>
      </div>
    </div>
  );
}
