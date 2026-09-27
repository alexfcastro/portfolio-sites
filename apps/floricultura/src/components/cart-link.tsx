"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { flowerStore } from "@/lib/demo-store";

export function CartLink() {
  const state = flowerStore.useStore();
  const count = state?.cart.length ?? 0;
  return (
    <Link href="/carrinho" className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-rose-soft">
      <ShoppingBag aria-hidden className="size-5" />
      <span className="sr-only">Carrinho{count > 0 ? ` (${count === 1 ? "1 item" : `${count} itens`})` : ""}</span>
      {count > 0 && (
        <span aria-hidden className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-rose px-1 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
