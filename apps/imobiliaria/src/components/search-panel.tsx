"use client";

import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { neighborhoods, purposeLabels, typeLabels, type Purpose, type PropertyType } from "@/data/listings";
import { emptyFilters, priceRangeError, search, type Filters, type Sort } from "@/lib/search";

function parseNumber(value: string): number | null {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

export function SearchPanelWithParams() {
  const params = useSearchParams();
  const purpose = params.get("finalidade");
  const initial: Filters = {
    ...emptyFilters,
    purpose: purpose === "venda" || purpose === "aluguel" ? purpose : "",
    query: (params.get("q") ?? "").slice(0, 60),
  };
  return <SearchPanel key={params.toString()} initial={initial} />;
}

export function SearchPanel({ initial = emptyFilters }: { initial?: Filters }) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [prices, setPrices] = useState({ min: "", max: "" });
  const [sort, setSort] = useState<Sort>("relevancia");
  const results = search(filters, sort);
  const rangeError = priceRangeError(filters);
  const active = JSON.stringify(filters) !== JSON.stringify(emptyFilters);

  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));

  const clear = () => {
    setFilters(emptyFilters);
    setPrices({ min: "", max: "" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <form
        aria-label="Filtros de busca"
        onSubmit={(event) => event.preventDefault()}
        className="h-fit space-y-5 rounded-card border border-line bg-paper p-5 lg:sticky lg:top-24"
      >
        <p className="flex items-center gap-2 font-bold">
          <SlidersHorizontal aria-hidden className="size-4" /> Filtros
        </p>

        <label className="block text-sm font-semibold">
          Buscar
          <input
            type="search"
            value={filters.query}
            maxLength={60}
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Bairro, código ou característica"
            className="field font-normal"
          />
        </label>

        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold">Finalidade</legend>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-blue-soft p-1">
            {(["", "venda", "aluguel"] as const).map((purpose) => (
              <label key={purpose || "todas"} className="cursor-pointer rounded-lg px-2 py-2 text-center text-sm font-semibold has-checked:bg-blue has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-blue">
                <input type="radio" name="purpose" className="sr-only" checked={filters.purpose === purpose} onChange={() => update({ purpose: purpose as Purpose | "" })} />
                {purpose ? purposeLabels[purpose] : "Todas"}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-semibold">
          Tipo
          <select value={filters.type} onChange={(event) => update({ type: event.target.value as PropertyType | "" })} className="field font-normal">
            <option value="">Todos</option>
            {(Object.keys(typeLabels) as PropertyType[]).map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold">
          Bairro
          <select value={filters.neighborhood} onChange={(event) => update({ neighborhood: event.target.value })} className="field font-normal">
            <option value="">Todos</option>
            {neighborhoods.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold">Faixa de preço (R$)</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(["min", "max"] as const).map((key) => (
              <label key={key} className="text-xs text-muted">
                {key === "min" ? "Mínimo" : "Máximo"}
                <input
                  inputMode="numeric"
                  value={prices[key]}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d.]/g, "").slice(0, 11);
                    setPrices((current) => ({ ...current, [key]: value }));
                    update(key === "min" ? { minPrice: parseNumber(value) } : { maxPrice: parseNumber(value) });
                  }}
                  aria-invalid={rangeError ? true : undefined}
                  className="field text-base text-ink"
                />
              </label>
            ))}
          </div>
          {rangeError && <p className="mt-1 text-sm font-semibold text-alert">{rangeError}</p>}
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold">Quartos</legend>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((count) => (
              <label key={count} className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-line text-sm font-semibold has-checked:border-blue has-checked:bg-blue has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-blue">
                <input type="radio" name="bedrooms" className="sr-only" checked={filters.minBedrooms === count} onChange={() => update({ minBedrooms: count })} />
                {count === 0 ? "Todos" : `${count}+`}
              </label>
            ))}
          </div>
        </fieldset>

        {active && (
          <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-blue">
            <X aria-hidden className="size-4" /> Limpar filtros
          </button>
        )}
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="font-semibold">
            {results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </p>
          <label className="flex items-center gap-2 text-sm">
            Ordenar por
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="rounded-lg border border-line bg-paper px-2 py-2">
              <option value="relevancia">Destaques</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="maior-area">Maior área</option>
            </select>
          </label>
        </div>
        {results.length > 0 ? (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((listing) => (
              <li key={listing.code}>
                <ListingCard listing={listing} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 flex flex-col items-center rounded-card border border-dashed border-line bg-paper p-12 text-center">
            <SearchX aria-hidden className="size-8 text-muted" />
            <p className="mt-3 font-semibold">Nenhum imóvel com esses filtros.</p>
            <button type="button" onClick={clear} className="btn btn-primary mt-5">
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
