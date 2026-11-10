"use client";

import { SearchX, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { CategoryId, SolutionId } from "@/types/project";

interface FilterOption<T extends string> {
  id: T;
  label: string;
}

interface ExplorerItem {
  slug: string;
  categoryId: CategoryId;
  solutionIds: SolutionId[];
}

interface ProjectExplorerProps {
  items: ExplorerItem[];
  cards: Record<string, ReactNode>;
  categories: FilterOption<CategoryId>[];
  solutions: FilterOption<SolutionId>[];
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
}) {
  const chip =
    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-canvas";

  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={`${chip} border-line bg-paper text-ink hover:border-ink`}
        >
          Todos
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
            className={`${chip} border-line bg-paper text-ink hover:border-ink`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProjectExplorer({ items, cards, categories, solutions }: ProjectExplorerProps) {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [solution, setSolution] = useState<SolutionId | null>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const visible = items.filter(
    (item) =>
      (category === null || item.categoryId === category) &&
      (solution === null || item.solutionIds.includes(solution)),
  );
  const hasFilters = category !== null || solution !== null;

  const clear = () => {
    setCategory(null);
    setSolution(null);
    // O botão acionado some após limpar; o foco vai para o resumo dos resultados.
    summaryRef.current?.focus();
  };

  const activeLabels = [
    categories.find((option) => option.id === category)?.label,
    solutions.find((option) => option.id === solution)?.label,
  ].filter(Boolean);

  return (
    <div>
      <div className="grid gap-6 rounded-card border border-line bg-paper p-5 shadow-card sm:p-6 lg:grid-cols-[1.4fr_1fr]">
        <FilterGroup label="Segmento" options={categories} value={category} onChange={setCategory} />
        <FilterGroup label="Tipo de solução" options={solutions} value={solution} onChange={setSolution} />
      </div>

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p ref={summaryRef} tabIndex={-1} role="status" aria-live="polite" className="text-sm text-muted">
          Mostrando <strong className="text-ink">{visible.length}</strong> de {items.length} projetos
          {activeLabels.length > 0 && <> · Filtros: {activeLabels.join(" + ")}</>}
        </p>
        {hasFilters && (
          <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong">
            <X aria-hidden className="size-4" />
            Limpar filtros
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>{cards[item.slug]}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-line bg-paper px-6 py-16 text-center">
          <SearchX aria-hidden className="size-8 text-muted" />
          <h2 className="mt-4 text-xl font-bold">Nenhum projeto com essa combinação</h2>
          <p className="mt-2 max-w-md text-muted">
            Tente outro segmento ou tipo de solução. Se o seu negócio não aparece aqui, isso não é um problema: cada
            projeto é desenvolvido sob medida.
          </p>
          <button type="button" onClick={clear} className="btn btn-primary mt-6">
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
