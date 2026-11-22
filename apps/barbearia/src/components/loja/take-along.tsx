"use client";

import { ArrowRight, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductPhoto } from "@/components/loja/product-photo";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { suggestionsFor } from "@/lib/loja";
import { formatBRL } from "@/lib/money";
import type { Booking } from "@/types/booking";

/** "Leve junto": produtos que combinam com o serviço, para retirar no próprio horário. */
export function TakeAlong({ booking }: { booking: Booking }) {
  const demo = useDemoState();
  const [message, setMessage] = useState("");
  const items = suggestionsFor(booking.serviceId);
  if (!demo || items.length === 0) return null;
  const inCart = demo.cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <section aria-labelledby="leve-junto" className="mt-8 rounded-card border border-edge bg-coal p-5 sm:p-6">
      <p className="kicker flex items-center gap-2">
        <ShoppingBag aria-hidden className="size-4" /> Leve junto
      </p>
      <h3 id="leve-junto" className="mt-1 text-2xl font-semibold">
        Quer retirar algum produto neste horário?
      </h3>
      <p className="mt-1 text-sm text-smoke">O barbeiro deixa separado na bancada. Você paga por Pix agora ou junto com o corte.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((product) => (
          <li key={product.id} className="flex items-center gap-3 rounded-lg border border-edge p-3 sm:flex-col sm:items-stretch">
            <span className="w-16 shrink-0 overflow-hidden rounded-md sm:w-full">
              <ProductPhoto product={product} sizes="(min-width: 640px) 200px, 64px" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{product.name}</span>
              <span className="text-sm text-gold">{formatBRL(product.priceCents)}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                const result = demoActions.addToCart(product.id);
                setMessage(result.ok ? `${product.name} na sacola.` : result.error);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-edge px-3 text-sm font-semibold hover:border-gold"
            >
              <Plus aria-hidden className="size-4" />
              Adicionar<span className="sr-only"> {product.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="mt-3 min-h-5 text-sm font-semibold text-ok">
        {message}
      </p>
      {inCart > 0 && (
        <Link href={`/loja/sacola?horario=${booking.id}`} className="btn btn-gold mt-2">
          Retirar {inCart} {inCart === 1 ? "item" : "itens"} neste horário
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </section>
  );
}
