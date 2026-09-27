"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, occasions } from "@/data/shop";
import { filterProducts, type CatalogFilters } from "@/lib/order";

const priceRanges = [
  { value: "", label: "Qualquer preço" },
  { value: "11000", label: "Até R$ 110" },
  { value: "15000", label: "Até R$ 150" },
];

export function Catalog({ initialOccasion }: { initialOccasion: string }) {
  const [filters, setFilters] = useState<CatalogFilters>({ query: "", occasionId: initialOccasion, categoryId: "todas", maxPriceCents: null });
  const set = (patch: Partial<CatalogFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const results = filterProducts(filters);
  const active = filters.query || filters.occasionId !== "todas" || filters.categoryId !== "todas" || filters.maxPriceCents !== null;

  return (
    <div>
      <form role="search" aria-label="Filtrar produtos" onSubmit={(event) => event.preventDefault()} className="rounded-card border border-line bg-paper p-5">
        <div role="group" aria-label="Ocasião" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {[{ id: "todas", name: "Todas as ocasiões" }, ...occasions].map((occasion) => (
            <button
              key={occasion.id}
              type="button"
              aria-pressed={filters.occasionId === occasion.id}
              onClick={() => set({ occasionId: occasion.id })}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-4 whitespace-nowrap aria-pressed:border-rose aria-pressed:bg-rose aria-pressed:text-white"
            >
              {occasion.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium">
            Buscar
            <span className="relative mt-1.5 block">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={filters.query}
                onChange={(event) => set({ query: event.target.value })}
                placeholder="Ex.: rosas, orquídea"
                className="field !mt-0 !pl-9 font-normal"
              />
            </span>
          </label>
          <label className="block text-sm font-medium">
            Tipo
            <select value={filters.categoryId} onChange={(event) => set({ categoryId: event.target.value as CatalogFilters["categoryId"] })} className="field font-normal">
              <option value="todas">Todos</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Faixa de preço
            <select
              value={filters.maxPriceCents ?? ""}
              onChange={(event) => set({ maxPriceCents: event.target.value ? Number(event.target.value) : null })}
              className="field font-normal"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="font-medium">
          {results.length === 1 ? "1 produto" : `${results.length} produtos`}
        </p>
        {active && (
          <button
            type="button"
            className="min-h-11 text-sm text-rose underline underline-offset-4"
            onClick={() => setFilters({ query: "", occasionId: "todas", categoryId: "todas", maxPriceCents: null })}
          >
            Limpar filtros
          </button>
        )}
      </div>
      {results.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-line bg-paper p-8 text-center text-muted">
          Nenhum produto com esses filtros. Tente outra ocasião ou limpe os filtros.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {results.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
