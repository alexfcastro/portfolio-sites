"use client";

import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { Foto, temFoto } from "@/components/foto";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { calcular, catalogo, estilos, formatos, type Estilo, type FormatoId } from "@/lib/unhas";

const chip =
  "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line bg-paper px-4 text-sm font-medium transition-colors aria-pressed:border-rosa-escuro aria-pressed:bg-rosa-escuro aria-pressed:text-white";

/**
 * Catálogo visual filtrável por formato e estilo. Cada foto mostra o nome do serviço, o preço e a duração, e
 * "Quero esta" leva a combinação para o montador (resolve o "trouxe uma foto do Pinterest e não sei o que é").
 */
export function Catalogo() {
  const [formato, setFormato] = useState<FormatoId | null>(null);
  const [estilo, setEstilo] = useState<Estilo | null>(null);
  const lista = catalogo.filter((item) => (!formato || item.combinacao.formato === formato) && (!estilo || item.estilo === estilo));

  const escolher = (id: string) => {
    const item = catalogo.find((c) => c.id === id)!;
    demoStore.set({ ...demoStore.get(), combinacao: item.combinacao, origem: item.id });
    document.getElementById("montador")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    requestAnimationFrame(() => document.getElementById("montador-titulo")?.focus({ preventScroll: true }));
  };

  return (
    <div className="mt-8">
      <div className="space-y-3">
        <div role="group" aria-label="Filtrar por formato" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" aria-pressed={formato === null} onClick={() => setFormato(null)} className={chip}>
            Todos os formatos
          </button>
          {formatos.map((f) => (
            <button key={f.id} type="button" aria-pressed={formato === f.id} onClick={() => setFormato(formato === f.id ? null : f.id)} className={chip}>
              {f.nome}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filtrar por estilo" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" aria-pressed={estilo === null} onClick={() => setEstilo(null)} className={chip}>
            Todos os estilos
          </button>
          {estilos.map((e) => (
            <button key={e.id} type="button" aria-pressed={estilo === e.id} onClick={() => setEstilo(estilo === e.id ? null : e.id)} className={chip}>
              {e.nome}
            </button>
          ))}
        </div>
      </div>

      <p role="status" className="mt-4 text-sm text-muted">
        {lista.length} {lista.length === 1 ? "inspiração" : "inspirações"}
      </p>
      {lista.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-line p-6 text-center text-muted">
          Nenhuma foto com esse formato e esse estilo. Tente outro filtro ou monte do zero logo abaixo.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {lista.map((item) => {
            const r = calcular(item.combinacao);
            return (
              <li key={item.id} className="flex flex-col overflow-hidden rounded-card border border-line bg-paper">
                {temFoto(item.id) ? (
                  <Foto id={item.id} sizes="(min-width: 1024px) 280px, 50vw" className="aspect-square" />
                ) : (
                  <div aria-hidden className="aspect-square bg-rosa-suave" />
                )}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="font-semibold leading-tight">{item.nome}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">{r.servico}</p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatBRL(r.preco)} <span className="font-normal text-muted">· {Math.floor(r.minutos / 60)}h{String(r.minutos % 60).padStart(2, "0")}</span>
                  </p>
                  <button type="button" onClick={() => escolher(item.id)} className="btn btn-secondary mt-3 !min-h-11 !px-3 text-sm">
                    Quero esta<span className="sr-only">: {item.nome}</span>
                    <ArrowDown aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
