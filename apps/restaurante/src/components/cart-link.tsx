"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRestaurantState } from "@/lib/demo-store";

export function CartLink() {
  const state = useRestaurantState();
  const count = state?.lines.reduce((total, line) => total + line.quantity, 0) ?? 0;
  return (
    <Link href="/carrinho" className="btn btn-primary shrink-0 !px-4">
      <ShoppingBag aria-hidden className="size-4" />
      Carrinho
      <span className="rounded-full bg-white/20 px-2 text-sm tabular-nums" aria-label={`${count} itens`}>
        {count}
      </span>
    </Link>
  );
}
