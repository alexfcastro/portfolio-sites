"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useDemoState } from "@/lib/demo-store";

/** Ícone da sacola no cabeçalho, com a quantidade de itens. */
export function CartLink() {
  const demo = useDemoState();
  const count = demo?.cart.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  return (
    <Link href="/loja/sacola" className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-smoke hover:text-cream">
      <ShoppingBag aria-hidden className="size-5" />
      <span className="sr-only">Sacola{count ? `, ${count} ${count === 1 ? "item" : "itens"}` : ", vazia"}</span>
      {count > 0 && (
        <span aria-hidden className="absolute top-0.5 right-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-coal">
          {count}
        </span>
      )}
    </Link>
  );
}
