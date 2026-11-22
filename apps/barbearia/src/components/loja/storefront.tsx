"use client";

import Link from "next/link";
import { useState } from "react";
import { AddToCart } from "@/components/loja/add-to-cart";
import { ProductPhoto } from "@/components/loja/product-photo";
import { categories, products, type Product, type ProductCategory } from "@/data/loja";
import { formatBRL } from "@/lib/money";

type Filter = "todos" | ProductCategory;

export function Storefront() {
  const [filter, setFilter] = useState<Filter>("todos");
  const visible = filter === "todos" ? products : products.filter((p) => p.category === filter);

  return (
    <div>
      <fieldset className="min-w-0">
        <legend className="sr-only">Filtrar por categoria</legend>
        <div className="flex flex-wrap gap-2">
          {(["todos", ...Object.keys(categories)] as Filter[]).map((key) => (
            <label key={key} className="choice px-4 py-2">
              <input
                type="radio"
                name="categoria"
                value={key}
                checked={filter === key}
                onChange={() => setFilter(key)}
                className="sr-only"
              />
              <span className="font-display text-lg tracking-wider uppercase">
                {key === "todos" ? "Todos" : categories[key as ProductCategory]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p role="status" className="mt-4 text-sm text-smoke">
        {visible.length} {visible.length === 1 ? "produto" : "produtos"}
      </p>
      <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-edge bg-coal-2">
      <Link href={`/loja/${product.id}`} className="relative block overflow-hidden" tabIndex={-1} aria-hidden>
        <ProductPhoto product={product} sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw" />
        {product.bestseller && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-coal">Mais vendido</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wider text-smoke uppercase">
          {categories[product.category]} · {product.size}
        </p>
        <h3 className="mt-1 text-2xl font-semibold">
          <Link href={`/loja/${product.id}`} className="hover:text-gold-bright">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex-1 text-sm text-smoke">{product.tagline}</p>
        <p className="mt-4">
          {product.listPriceCents && (
            <span className="mr-2 text-sm text-smoke line-through">{formatBRL(product.listPriceCents)}</span>
          )}
          <span className="font-display text-2xl font-semibold text-gold">{formatBRL(product.priceCents)}</span>
        </p>
        <div className="mt-4">
          <AddToCart productId={product.id} compact />
        </div>
      </div>
    </article>
  );
}
