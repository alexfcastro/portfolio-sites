"use client";

import { CheckCircle2, Info, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { ProductArt } from "@/components/product-art";
import { FREE_DELIVERY_FROM_CENTS, getProduct, MAX_QUANTITY, regions } from "@/data/catalog";
import { buildOrderMessage, computeTotals, formatWeight, lineTotal, unitPrice, validateLine, validateOrder, type Fulfillment } from "@/lib/cart";
import { shopActions, shopStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";

export function CartView() {
  const state = shopStore.useStore();
  const [mode, setMode] = useState<"retirada" | "entrega" | "">("");
  const [regionId, setRegionId] = useState("");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ code: string; message: string } | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (placed) doneRef.current?.focus();
  }, [placed]);

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-line bg-paper p-6 text-muted">
        Carregando o carrinho…
      </p>
    );
  }

  if (placed) {
    return (
      <section aria-labelledby="done-title" className="rounded-card border border-line bg-paper p-6 sm:p-8">
        <CheckCircle2 aria-hidden className="size-10 text-olive" />
        <h2 id="done-title" ref={doneRef} tabIndex={-1} className="mt-3 text-3xl">
          Pedido de demonstração {placed.code} montado
        </h2>
        <p className="mt-2 text-muted">
          Nenhum pedido foi enviado e nada foi cobrado. Veja como a mensagem chegaria à loja em um site real.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName="Raiz & Grão" message={placed.message} triggerLabel="Ver mensagem do pedido" triggerClassName="btn btn-primary" />
          <Link href="/produtos" className="btn btn-secondary">
            Voltar ao catálogo
          </Link>
        </div>
      </section>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
        <p className="font-display text-2xl">Seu carrinho está vazio</p>
        <p className="mt-2 text-muted">Escolha produtos e pesos no catálogo.</p>
        <Link href="/produtos" className="btn btn-primary mt-5">
          Ver produtos
        </Link>
      </div>
    );
  }

  const fulfillment: Fulfillment | null = mode === "retirada" ? { kind: "retirada" } : mode === "entrega" ? { kind: "entrega", regionId } : null;
  const totals = computeTotals(state.cart, fulfillment);
  const missing = FREE_DELIVERY_FROM_CENTS - totals.subtotal;

  const finish = () => {
    const problem = validateOrder(state.cart, fulfillment);
    setError(problem ?? "");
    if (problem || !fulfillment) return;
    const code = `RG-${state.nextNumber}`;
    setPlaced({ code, message: buildOrderMessage(state.cart, fulfillment, code) });
    shopActions.completeOrder();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="itens-title" className="min-w-0">
        <h2 id="itens-title" className="sr-only">
          Itens
        </h2>
        <ul className="divide-y divide-line rounded-card border border-line bg-paper">
          {state.cart.map((line, index) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            const size = product.sale.kind === "unidade" ? product.sale.unitLabel : formatWeight(line.grams ?? 0);
            const problem = validateLine(line);
            return (
              <li key={`${line.productId}-${line.grams}`} className="flex gap-3 p-4 sm:gap-4">
                <ProductArt product={product} className="size-16 shrink-0 rounded-xl sm:size-20" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3">
                    <p className="font-semibold">
                      <Link href={`/produtos/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </p>
                    <p className="font-bold whitespace-nowrap">{problem ? "—" : formatBRL(lineTotal(line))}</p>
                  </div>
                  <p className="text-sm text-muted">
                    {size} · {formatBRL(unitPrice(product, line.grams))} cada
                  </p>
                  {problem && <p className="mt-1 text-sm text-alert">{problem}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <div role="group" aria-label={`Quantidade de ${product.name}`} className="inline-flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => shopActions.setQuantity(index, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        className="inline-flex size-11 items-center justify-center rounded-full disabled:opacity-40"
                      >
                        <Minus aria-hidden className="size-4" />
                        <span className="sr-only">Diminuir</span>
                      </button>
                      <output className="w-8 text-center font-bold">{line.quantity}</output>
                      <button
                        type="button"
                        onClick={() => shopActions.setQuantity(index, line.quantity + 1)}
                        disabled={line.quantity >= MAX_QUANTITY}
                        className="inline-flex size-11 items-center justify-center rounded-full disabled:opacity-40"
                      >
                        <Plus aria-hidden className="size-4" />
                        <span className="sr-only">Aumentar</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => shopActions.setQuantity(index, 0)}
                      className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-terra-soft hover:text-alert"
                    >
                      <Trash2 aria-hidden className="size-4" />
                      <span className="sr-only">Remover {product.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="mt-4 min-h-11 text-sm font-semibold text-muted underline underline-offset-4" onClick={() => shopActions.clearCart()}>
          Esvaziar carrinho
        </button>
      </section>

      <aside aria-labelledby="resumo-title" className="h-fit space-y-5 rounded-card border border-line bg-paper p-5 lg:sticky lg:top-24">
        <h2 id="resumo-title" className="text-2xl">
          Resumo
        </h2>
        <fieldset className="min-w-0">
          <legend className="font-semibold">Como quer receber?</legend>
          <div className="mt-2 grid gap-2">
            {(
              [
                ["retirada", "Retirar na loja", "Sem taxa"],
                ["entrega", "Entrega", "Taxa por bairro"],
              ] as const
            ).map(([value, label, hint]) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  name="recebimento"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    setError("");
                  }}
                  className="sr-only"
                />
                <span className="font-semibold">{label}</span> <span className="text-sm text-muted">· {hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {mode === "entrega" && (
          <label className="block text-sm font-semibold">
            Bairro
            <select value={regionId} onChange={(event) => setRegionId(event.target.value)} className="field font-normal">
              <option value="">Escolha o bairro</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} ({formatBRL(region.feeCents)})
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-muted">Bairros fictícios. Não pedimos endereço nesta demonstração.</span>
          </label>
        )}
        <dl className="space-y-2 border-t border-line pt-4">
          <div className="flex justify-between gap-4">
            <dt>Subtotal</dt>
            <dd>{formatBRL(totals.subtotal)}</dd>
          </div>
          {mode === "entrega" && (
            <div className="flex justify-between gap-4">
              <dt>Entrega</dt>
              <dd>{!regionId ? "—" : totals.delivery === 0 ? "Grátis" : formatBRL(totals.delivery)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatBRL(totals.total)}</dd>
          </div>
          {totals.savings > 0 && <p className="text-sm text-olive-dark">Você economizou {formatBRL(totals.savings)} em promoções.</p>}
          {totals.grams > 0 && <p className="text-xs text-muted">Itens a granel: {formatWeight(totals.grams)} no total.</p>}
        </dl>
        {mode === "entrega" && missing > 0 && (
          <p className="rounded-xl bg-olive-soft p-3 text-sm">Faltam {formatBRL(missing)} para a entrega grátis.</p>
        )}
        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-alert">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
        <button type="button" className="btn btn-primary w-full" onClick={finish}>
          Finalizar pedido (demonstração)
        </button>
        <p className="text-xs text-muted">Nada é enviado nem cobrado. Você verá uma prévia da mensagem do pedido.</p>
      </aside>
    </div>
  );
}
