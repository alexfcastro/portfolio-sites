"use client";

import { ChevronDown, SlidersHorizontal, SearchX, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
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

/**
 * Lê `?segmento=<id>` (link enviado numa abordagem, ex.: /projetos?segmento=beleza): o catálogo abre filtrado
 * por esse segmento e, ao limpar o filtro, os projetos dele continuam aparecendo primeiro.
 * Só aceita segmentos que existem no catálogo.
 */
export function ProjectExplorerWithParams(props: ProjectExplorerProps) {
  const requested = useSearchParams().get("segmento");
  const initialCategory = props.categories.find((option) => option.id === requested)?.id ?? null;
  return <ProjectExplorer key={initialCategory ?? "todos"} {...props} initialCategory={initialCategory} />;
}

export function ProjectExplorer({
  items,
  cards,
  categories,
  solutions,
  initialCategory = null,
}: ProjectExplorerProps & { initialCategory?: CategoryId | null }) {
  const [category, setCategory] = useState<CategoryId | null>(initialCategory);
  const [solution, setSolution] = useState<SolutionId | null>(null);
  const [open, setOpen] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  // O segmento vindo do link fica na frente mesmo depois de limpar o filtro (ordem estável no resto).
  const ordered = initialCategory
    ? [...items.filter((item) => item.categoryId === initialCategory), ...items.filter((item) => item.categoryId !== initialCategory)]
    : items;
  const visible = ordered.filter(
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
      {/* No celular os filtros ficam recolhidos atrás de um botão, para os projetos aparecerem logo. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="filtros-projetos"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center gap-3 rounded-card border border-line bg-paper px-5 text-left font-semibold shadow-card md:hidden"
      >
        <SlidersHorizontal aria-hidden className="size-5 text-accent" />
        <span className="flex-1">
          Filtrar projetos
          {activeLabels.length > 0 && (
            <span className="block text-sm font-normal text-muted">{activeLabels.join(" + ")}</span>
          )}
        </span>
        <ChevronDown aria-hidden className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id="filtros-projetos"
        className={`${open ? "grid" : "hidden"} gap-6 rounded-card border border-line bg-paper p-5 shadow-card max-md:mt-3 sm:p-6 md:grid lg:grid-cols-[1.4fr_1fr]`}
      >
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
