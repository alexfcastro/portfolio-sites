"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/catalog";
import { shopStore } from "@/lib/demo-store";

export function FavoritesList() {
  const state = shopStore.useStore();
  if (!state) {
    return (
      <p role="status" className="rounded-card border border-line bg-paper p-6 text-muted">
        Carregando…
      </p>
    );
  }
  const items = products.filter((p) => state.favorites.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
        <p className="font-display text-2xl">Nenhum favorito ainda</p>
        <p className="mt-2 text-muted">Toque no coração de um produto para salvá-lo aqui.</p>
        <Link href="/produtos" className="btn btn-primary mt-5">
          Ver produtos
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
