"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface ShowcaseItem {
  slug: string;
  name: string;
  category: string;
  href: string;
  src: string;
  width: number;
  height: number;
}

/*
 * Faixa de capturas das demos em movimento contínuo. Pausa no hover, no foco e pelo botão;
 * com "reduzir movimento" ativo, vira uma lista rolável (regra no globals.css).
 * A segunda cópia existe só para o laço visual: fica fora da leitura e do teclado.
 */
export function ShowcaseMarquee({ items }: { items: ShowcaseItem[] }) {
  const [paused, setPaused] = useState(false);

  const renderItem = (item: ShowcaseItem, clone: boolean) => (
    <li key={`${item.slug}-${clone ? "b" : "a"}`} aria-hidden={clone || undefined} className="w-[19rem] shrink-0 sm:w-[26rem]">
      <Link
        href={item.href}
        tabIndex={clone ? -1 : undefined}
        className="browser-frame group block shadow-raised transition-transform duration-300 hover:-translate-y-1.5"
      >
        <span className="browser-bar">
          <i />
          <i />
          <i />
          <span className="ml-2 truncate text-xs font-medium text-muted-on-dark">
            {item.name} <span aria-hidden>·</span> {item.category}
          </span>
        </span>
        <span className="block aspect-[16/10] overflow-hidden">
          <Image
            src={item.src}
            alt=""
            width={item.width}
            height={item.height}
            sizes="(min-width: 640px) 416px, 304px"
            loading="eager"
            className="h-auto w-full transition-transform duration-700 group-hover:scale-110"
          />
        </span>
        <span className="sr-only">Ver o projeto {item.name}</span>
      </Link>
    </li>
  );

  return (
    <div className="relative">
      <div className="marquee" data-paused={paused}>
        <ul className="marquee-track">
          {items.map((item) => renderItem(item, false))}
          {items.map((item) => renderItem(item, true))}
        </ul>
      </div>
      <div className="container-page flex items-center justify-between gap-4 text-sm text-muted-on-dark">
        <p>Capturas das demonstrações. São projetos conceituais, com negócios fictícios.</p>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 font-medium text-canvas transition-colors hover:border-white/40 motion-reduce:hidden"
        >
          {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
          {paused ? "Retomar movimento" : "Pausar movimento"}
        </button>
      </div>
    </div>
  );
}
