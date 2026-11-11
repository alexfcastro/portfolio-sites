import { CandyOff, Leaf, Wheat, WheatOff, type LucideIcon } from "lucide-react";
import { tagLabels, type Tag } from "@/data/catalog";

/* Símbolos das características do produto. Sempre acompanhados de texto: no cartão, para leitores de tela; na legenda, visível. */
const icons: Record<Tag, LucideIcon> = {
  vegano: Leaf,
  "sem-gluten": WheatOff,
  "sem-acucar": CandyOff,
  integral: Wheat,
};

export function TagSymbols({ tags }: { tags: readonly Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex gap-1.5">
      {tags.map((tag) => {
        const Icon = icons[tag];
        return (
          <li
            key={tag}
            title={tagLabels[tag]}
            className="flex size-7 items-center justify-center rounded-full bg-olive-soft text-olive-dark"
          >
            <Icon aria-hidden className="size-4" />
            <span className="sr-only">{tagLabels[tag]}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function TagLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
      {(Object.keys(icons) as Tag[]).map((tag) => {
        const Icon = icons[tag];
        return (
          <li key={tag} className="inline-flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-olive-soft text-olive-dark">
              <Icon aria-hidden className="size-4" />
            </span>
            {tagLabels[tag]}
          </li>
        );
      })}
    </ul>
  );
}
