"use client";

import { CheckCircle2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getProduct, MAX_QUANTITY } from "@/data/catalog";
import { formatWeight, listPrice, unitPrice } from "@/lib/cart";
import { shopActions, shopStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";

export function AddToCart({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const state = shopStore.useStore();
  const options = product.sale.kind === "peso" ? product.sale.options : null;
  const [grams, setGrams] = useState<number | null>(options ? (options[1] ?? options[0]!) : null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const soldOut = product.stock === "esgotado";
  const price = unitPrice(product, grams);

  const add = () => {
    const result = shopActions.add({ productId, grams, quantity });
    setFeedback(
      result.ok
        ? { ok: true, text: `${quantity}× ${product.name}${grams ? ` (${formatWeight(grams)})` : ""} no carrinho.` }
        : { ok: false, text: result.error },
    );
  };

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      {options && (
        <fieldset className="min-w-0">
          <legend className="font-semibold">Peso</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {options.map((option) => (
              <label key={option} className="choice text-center">
                <input
                  type="radio"
                  name="peso"
                  value={option}
                  checked={grams === option}
                  onChange={() => {
                    setGrams(option);
                    setFeedback(null);
                  }}
                  className="sr-only"
                />
                <span className="block font-bold">{formatWeight(option)}</span>
                <span className="text-sm text-muted">{formatBRL(unitPrice(product, option))}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p id="qty-label" className="font-semibold">
            Quantidade
          </p>
          <div role="group" aria-labelledby="qty-label" className="mt-2 inline-flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="inline-flex size-11 items-center justify-center rounded-full disabled:opacity-40"
            >
              <Minus aria-hidden className="size-4" />
              <span className="sr-only">Diminuir quantidade</span>
            </button>
            <output aria-live="polite" className="w-10 text-center font-bold">
              {quantity}
            </output>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={quantity >= MAX_QUANTITY}
              className="inline-flex size-11 items-center justify-center rounded-full disabled:opacity-40"
            >
              <Plus aria-hidden className="size-4" />
              <span className="sr-only">Aumentar quantidade</span>
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Total deste item</p>
          <p className="text-2xl font-bold text-olive-dark">
            {product.promoPercent ? (
              <span className="mr-2 text-base font-normal text-muted line-through">
                <span className="sr-only">De </span>
                {formatBRL(listPrice(product, grams) * quantity)}
              </span>
            ) : null}
            {formatBRL(price * quantity)}
          </p>
        </div>
      </div>

      <button type="button" className="btn btn-primary mt-5 w-full" onClick={add} disabled={soldOut || !state}>
        {soldOut ? "Esgotado no momento" : "Adicionar ao carrinho"}
      </button>
      <div aria-live="polite">
        {feedback && (
          <p className={`mt-3 flex flex-wrap items-center gap-2 text-sm ${feedback.ok ? "text-olive-dark" : "text-alert"}`}>
            {feedback.ok && <CheckCircle2 aria-hidden className="size-4" />}
            {feedback.text}
            {feedback.ok && (
              <Link href="/carrinho" className="font-semibold underline underline-offset-4">
                Ver carrinho
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
