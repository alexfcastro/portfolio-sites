"use client";

import { useState } from "react";
import { WorkArt } from "@/components/work-art";
import { workCategories, works, type WorkCategory } from "@/data/profile";

export function PortfolioGrid() {
  const [filter, setFilter] = useState<WorkCategory | "todos">("todos");
  const visible = works.filter((work) => filter === "todos" || work.category === filter);
  const chip =
    "inline-flex min-h-11 items-center rounded-full border border-ink/25 px-4 text-sm font-semibold aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

  return (
    <div>
      <div role="group" aria-label="Filtrar trabalhos" className="flex flex-wrap gap-2">
        <button type="button" className={chip} aria-pressed={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </button>
        {workCategories.map((category) => (
          <button key={category.id} type="button" className={chip} aria-pressed={filter === category.id} onClick={() => setFilter(category.id)}>
            {category.name}
          </button>
        ))}
      </div>
      <p role="status" className="mt-4 text-sm text-muted">
        {visible.length} {visible.length === 1 ? "trabalho" : "trabalhos"}
      </p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((work) => (
          <li key={work.id}>
            <figure>
              <WorkArt variant={work.art} className="h-auto w-full" />
              <figcaption className="mt-3">
                <span className="block font-serif text-xl">{work.title}</span>
                <span className="block text-sm text-muted">
                  {workCategories.find((c) => c.id === work.category)?.name} · {work.context}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
