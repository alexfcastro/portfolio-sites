"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, tagLabels, type Tag } from "@/data/catalog";
import { searchProducts, type CatalogFilters, type Sort } from "@/lib/cart";

const TAGS = Object.keys(tagLabels) as Tag[];
const sortLabels: Record<Sort, string> = {
  relevancia: "Relevância",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  nome: "Nome (A–Z)",
};

export function Catalog({ initialCategory, initialPromo }: { initialCategory: string; initialPromo: boolean }) {
  const [filters, setFilters] = useState<CatalogFilters>({
    query: "",
    categoryId: initialCategory,
    tags: [],
    onlyPromo: initialPromo,
    sort: "relevancia",
  });
  const set = (patch: Partial<CatalogFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const results = searchProducts(filters);
  const active = filters.query || filters.categoryId !== "todas" || filters.tags.length > 0 || filters.onlyPromo;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <form role="search" aria-label="Filtrar produtos" onSubmit={(event) => event.preventDefault()} className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <label className="block text-sm font-semibold">
          Buscar
          <span className="relative mt-1.5 block">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={filters.query}
              onChange={(event) => set({ query: event.target.value })}
              placeholder="Ex.: castanha, chá"
              className="field !mt-0 !pl-9 font-normal"
            />
          </span>
        </label>
        <label className="block text-sm font-semibold">
          Categoria
          <select value={filters.categoryId} onChange={(event) => set({ categoryId: event.target.value })} className="field font-normal">
            <option value="todas">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold">Características</legend>
          <div className="mt-2 space-y-1">
            {TAGS.map((tag) => (
              <label key={tag} className="flex min-h-11 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(event) =>
                    set({ tags: event.target.checked ? [...filters.tags, tag] : filters.tags.filter((t) => t !== tag) })
                  }
                  className="size-5 accent-olive"
                />
                {tagLabels[tag]}
              </label>
            ))}
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.onlyPromo}
                onChange={(event) => set({ onlyPromo: event.target.checked })}
                className="size-5 accent-olive"
              />
              Só promoções
            </label>
          </div>
        </fieldset>
        <label className="block text-sm font-semibold">
          Ordenar por
          <select value={filters.sort} onChange={(event) => set({ sort: event.target.value as Sort })} className="field font-normal">
            {(Object.keys(sortLabels) as Sort[]).map((sort) => (
              <option key={sort} value={sort}>
                {sortLabels[sort]}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="font-semibold">
            {results.length === 1 ? "1 produto" : `${results.length} produtos`}
          </p>
          {active && (
            <button
              type="button"
              className="min-h-11 text-sm font-semibold text-olive-dark underline underline-offset-4"
              onClick={() => setFilters({ query: "", categoryId: "todas", tags: [], onlyPromo: false, sort: filters.sort })}
            >
              Limpar filtros
            </button>
          )}
        </div>
        {results.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-line bg-paper p-8 text-center text-muted">
            Nenhum produto encontrado. Tente outra palavra ou limpe os filtros.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {results.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
