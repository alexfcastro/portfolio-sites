"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getProduct } from "@/data/loja";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { stockLeft } from "@/lib/loja";

/** Botão "Adicionar à sacola" com aviso de estoque. */
export function AddToCart({ productId, compact = false }: { productId: string; compact?: boolean }) {
  const demo = useDemoState();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const product = getProduct(productId);
  if (!product) return null;

  const left = demo ? stockLeft(demo, productId, true) : product.stock;
  const inCart = demo?.cart.find((item) => item.productId === productId)?.qty ?? 0;
  const soldOut = demo ? stockLeft(demo, productId) === 0 : false;

  const add = () => {
    const result = demoActions.addToCart(productId);
    setMessage(result.ok ? { ok: true, text: "Adicionado à sacola." } : { ok: false, text: result.error });
  };

  return (
    <div>
      {demo && !soldOut && left <= 3 && <p className="mb-2 text-xs font-semibold text-warn">Últimas {left} unidades</p>}
      <button
        type="button"
        onClick={add}
        disabled={!demo || soldOut || left === 0}
        className={`btn ${inCart ? "btn-line" : "btn-gold"} w-full ${compact ? "!min-h-11 !text-sm" : ""}`}
      >
        {inCart ? <Check aria-hidden className="size-4" /> : <ShoppingBag aria-hidden className="size-4" />}
        {soldOut ? "Esgotado" : inCart ? `Na sacola (${inCart}) · mais 1` : "Adicionar à sacola"}
        <span className="sr-only"> {product.name}</span>
      </button>
      <p role="status" className={`mt-2 min-h-5 text-xs font-semibold ${message?.ok ? "text-ok" : "text-warn"}`}>
        {message?.text}{" "}
        {message?.ok && (
          <Link href="/loja/sacola" className="text-gold underline underline-offset-4">
            Ver sacola
          </Link>
        )}
      </p>
    </div>
  );
}
