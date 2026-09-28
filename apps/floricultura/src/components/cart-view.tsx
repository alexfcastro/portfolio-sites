"use client";

import { CheckCircle2, Info, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FlowerArt } from "@/components/flower-art";
import { MessagePreview } from "@/components/message-preview";
import { addons, getProduct, regions } from "@/data/shop";
import { flowerActions, flowerStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { buildCartMessage, cartTotals, describeWhen, itemSubtotal, validateCart } from "@/lib/order";
import { getBusinessNow } from "@/lib/time";

export function CartView() {
  const state = flowerStore.useStore();
  const [now] = useState(getBusinessNow);
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
        <CheckCircle2 aria-hidden className="size-10 text-sage" />
        <h2 id="done-title" ref={doneRef} tabIndex={-1} className="mt-3 text-4xl">
          Pedido de demonstração {placed.code} revisado
        </h2>
        <p className="mt-2 text-muted">Nada foi enviado nem cobrado. Veja como a mensagem do pedido chegaria à floricultura.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName="Flor & Afeto" message={placed.message} triggerLabel="Ver mensagem do pedido" triggerClassName="btn btn-primary" />
          <Link href="/catalogo" className="btn btn-secondary">
            Voltar ao catálogo
          </Link>
        </div>
      </section>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
        <p className="font-display text-3xl">Seu carrinho está vazio</p>
        <p className="mt-2 text-muted">Escolha um produto e personalize para adicioná-lo aqui.</p>
        <Link href="/catalogo" className="btn btn-primary mt-5">
          Escolher flores
        </Link>
      </div>
    );
  }

  const check = validateCart(state.cart, now);
  const invalid = check.cart !== null || check.items.some((errors) => Object.keys(errors).length > 0);
  const totals = cartTotals(state.cart);

  const finish = () => {
    if (invalid) return;
    const items = state.cart;
    const code = flowerActions.checkout();
    setPlaced({ code, message: buildCartMessage(items, code) });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="itens-title" className="min-w-0">
        <h2 id="itens-title" className="sr-only">
          Itens
        </h2>
        <ul className="space-y-4">
          {state.cart.map((item, index) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const size = product.sizes.find((s) => s.id === item.sizeId);
            const problems = Object.values(check.items[index] ?? {});
            const region = regions.find((r) => r.id === item.regionId);
            return (
              <li key={index} className="flex gap-4 rounded-card border border-line bg-paper p-4">
                <FlowerArt art={product.art} id={product.id} sizes="112px" className="size-16 shrink-0 rounded-xl sm:size-28" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3">
                    <h3 className="text-2xl">
                      <Link href={`/produto/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="font-medium whitespace-nowrap">{size ? formatBRL(itemSubtotal(item)) : "—"}</p>
                  </div>
                  <dl className="mt-1 space-y-0.5 text-sm text-muted">
                    <div>
                      <dt className="sr-only">Tamanho</dt>
                      <dd>
                        {size?.label} ({size?.detail})
                        {item.addonIds.length > 0 && ` · ${item.addonIds.map((id) => addons.find((a) => a.id === id)?.name).join(", ")}`}
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Cartão</dt>
                      <dd className="break-words">{item.card ? `Cartão: “${item.card.replace(/\n/g, " ")}”` : "Cartão sem mensagem"}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Entrega</dt>
                      <dd>
                        {item.fulfillment === "entrega" ? `Entrega para ${item.personName} em ${region?.name}` : `Retirada por ${item.personName}`}
                        {problems.length === 0 && ` · ${describeWhen(item)}`}
                      </dd>
                    </div>
                  </dl>
                  {problems.length > 0 && (
                    <p className="mt-2 flex items-start gap-2 text-sm text-alert">
                      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {problems[0]} Remova o item e personalize de novo.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => flowerActions.remove(index)}
                    className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-muted hover:text-alert"
                  >
                    <Trash2 aria-hidden className="size-4" />
                    Remover<span className="sr-only"> {product.name}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/catalogo" className="mt-4 inline-flex min-h-11 items-center text-rose underline underline-offset-4">
          Adicionar outro presente
        </Link>
      </section>

      <aside aria-labelledby="resumo-title" className="h-fit space-y-4 rounded-card border border-line bg-paper p-5 lg:sticky lg:top-24">
        <h2 id="resumo-title" className="text-3xl">
          Resumo
        </h2>
        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt>Produtos</dt>
            <dd>{formatBRL(totals.products)}</dd>
          </div>
          {totals.extras > 0 && (
            <div className="flex justify-between gap-4">
              <dt>Adicionais</dt>
              <dd>{formatBRL(totals.extras)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>{totals.deliveries === 1 ? "1 entrega" : `${totals.deliveries} entregas`}</dt>
            <dd>{formatBRL(totals.delivery)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-2 text-xl font-medium">
            <dt>Total</dt>
            <dd>{formatBRL(totals.total)}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted">Itens com o mesmo bairro, dia, período e destinatário saem na mesma entrega e pagam uma taxa só.</p>
        {check.cart && (
          <p role="alert" className="text-sm text-alert">
            {check.cart}
          </p>
        )}
        <button type="button" className="btn btn-primary w-full" onClick={finish} disabled={invalid} aria-describedby={invalid ? "cart-invalid" : undefined}>
          Finalizar pedido (demonstração)
        </button>
        {invalid && (
          <p id="cart-invalid" className="text-sm text-alert">
            Revise os itens marcados antes de finalizar.
          </p>
        )}
        <p className="text-xs text-muted">Nada é enviado nem cobrado. Você verá uma prévia da mensagem do pedido.</p>
      </aside>
    </div>
  );
}
