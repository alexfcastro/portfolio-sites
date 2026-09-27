"use client";

import { Heart, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { shopActions, shopStore } from "@/lib/demo-store";

export function CartLink() {
  const state = shopStore.useStore();
  const count = state?.cart.reduce((sum, l) => sum + l.quantity, 0) ?? 0;
  return (
    <Link href="/carrinho" className="btn btn-primary relative shrink-0 !px-3.5">
      <ShoppingBasket aria-hidden className="size-5" />
      <span className="max-sm:sr-only">Carrinho</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex min-w-6 items-center justify-center rounded-full bg-terra px-1.5 text-xs font-bold text-white">
          {count}
          <span className="sr-only"> {count === 1 ? "item" : "itens"}</span>
        </span>
      )}
    </Link>
  );
}

export function FavoritesLink() {
  return (
    <Link href="/favoritos" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-olive-soft">
      <Heart aria-hidden className="size-5" />
      <span className="sr-only">Favoritos</span>
    </Link>
  );
}

export function FavoriteButton({ productId, name }: { productId: string; name: string }) {
  const state = shopStore.useStore();
  const active = state?.favorites.includes(productId) ?? false;
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={!state}
      onClick={() => shopActions.toggleFavorite(productId)}
      className="inline-flex size-11 items-center justify-center rounded-full bg-paper/90 text-terra shadow-sm hover:bg-paper"
    >
      <Heart aria-hidden className={`size-5 ${active ? "fill-terra" : ""}`} />
      <span className="sr-only">Favoritar {name}</span>
    </button>
  );
}
