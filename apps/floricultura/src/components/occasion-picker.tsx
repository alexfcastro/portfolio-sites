"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FlowerArt } from "@/components/flower-art";
import { occasions, products } from "@/data/shop";
import { formatBRL } from "@/lib/money";
import { minPrice } from "@/lib/order";

/*
 * "Para cada momento": a pessoa escolhe a ocasião e a vitrine muda na hora, mostrando as flores
 * indicadas com foto grande, preço e o caminho para personalizar.
 */
export function OccasionPicker() {
  const [occasionId, setOccasionId] = useState(occasions[0]!.id);
  const matches = products.filter((product) => product.occasionIds.includes(occasionId));
  const [main, ...others] = matches;
  const occasion = occasions.find((item) => item.id === occasionId)!;

  return (
    <div className="mt-8">
      <div role="group" aria-label="Escolha a ocasião" className="flex flex-wrap gap-2">
        {occasions.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === occasionId}
            onClick={() => setOccasionId(item.id)}
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-blush px-5 transition-colors hover:border-rose aria-pressed:border-rose aria-pressed:bg-rose aria-pressed:text-white"
          >
            {item.name}
          </button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {matches.length} {matches.length === 1 ? "opção" : "opções"} para {occasion.name}.
      </p>

      {main && (
        // A chave refaz a entrada (animação curta) a cada ocasião escolhida.
        <div key={occasionId} className="troca mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
          <Link
            href={`/produto/${main.id}`}
            className="painel-foto flex min-h-[26rem] flex-col justify-end rounded-card p-7 text-white sm:min-h-[32rem]"
          >
            <FlowerArt art={main.art} id={main.id} scene={1} sizes="(min-width: 1024px) 620px, 100vw" className="foto" />
            <span className="painel-texto block">
              <span className="block text-sm tracking-[0.2em] uppercase">Para {occasion.name.toLowerCase()}</span>
              <span className="mt-2 block font-display text-4xl sm:text-5xl">{main.name}</span>
              <span className="mt-2 block max-w-md text-white/90">{main.description}</span>
              <span className="mt-4 inline-flex items-center gap-2 font-medium">
                a partir de {formatBRL(minPrice(main))}
                <ArrowRight aria-hidden className="size-4" />
              </span>
            </span>
          </Link>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {others.slice(0, 3).map((product) => (
              <li key={product.id}>
                <Link
                  href={`/produto/${product.id}`}
                  className="group flex h-full items-center gap-4 overflow-hidden rounded-card border border-line bg-blush pr-4 transition-colors hover:border-rose"
                >
                  <FlowerArt art={product.art} id={product.id} sizes="140px" className="w-28 shrink-0 sm:w-36" />
                  <span>
                    <span className="block font-display text-2xl leading-tight">{product.name}</span>
                    <span className="mt-1 block text-sm text-muted">a partir de {formatBRL(minPrice(product))}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/catalogo?ocasiao=${occasionId}`}
                className="inline-flex min-h-11 items-center gap-2 font-medium text-rose-dark underline underline-offset-4"
              >
                Ver tudo para {occasion.name.toLowerCase()}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
