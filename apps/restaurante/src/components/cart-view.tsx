"use client";

import { CheckCircle2, Info, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { deliveryAreas, demoCustomer, getGroup, getItem, MIN_DELIVERY_CENTS } from "@/data/menu";
import { lineTotalCents, summarize, type CartLine } from "@/lib/cart";
import { cartActions, useRestaurantState, type PlacedOrder } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";

function describeAddons(line: CartLine): string {
  return Object.entries(line.addons)
    .flatMap(([groupId, ids]) => ids.map((id) => getGroup(groupId)?.options.find((option) => option.id === id)?.name ?? id))
    .join(", ");
}

function orderMessage(order: PlacedOrder): string {
  const { fulfillment } = order;
  const area = fulfillment.type === "entrega" ? deliveryAreas.find((a) => a.id === fulfillment.areaId) : null;
  return [
    `Olá, Sabor & Brasa! Pedido ${order.id}:`,
    "",
    ...order.lines.map((line) => {
      const extras = describeAddons(line);
      return `${line.quantity}× ${getItem(line.itemId)?.name}${extras ? ` (${extras})` : ""}${line.note ? ` — ${line.note}` : ""} — ${formatBRL(lineTotalCents(line))}`;
    }),
    "",
    order.fulfillment.type === "entrega" ? `Entrega: ${area?.name} — taxa ${formatBRL(order.deliveryFeeCents)}` : "Retirada no balcão",
    `Total: ${formatBRL(order.totalCents)}`,
  ].join("\n");
}

export function CartView() {
  const state = useRestaurantState();
  const [reviewing, setReviewing] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [reviewing, order]);

  if (!state) {
    return (
      <p role="status" className="text-muted">
        Carregando o carrinho…
      </p>
    );
  }

  if (order) {
    return (
      <section aria-labelledby="pedido-ok" className="rounded-card border border-leaf/30 bg-paper p-6 sm:p-10">
        <CheckCircle2 aria-hidden className="size-10 text-leaf" />
        <h2 id="pedido-ok" ref={headingRef} tabIndex={-1} className="mt-4 text-3xl outline-none">
          Pedido de demonstração gerado
        </h2>
        <p className="mt-2 text-muted">
          Código <strong className="text-ink">{order.id}</strong> · total {formatBRL(order.totalCents)}. Nada foi enviado ao
          restaurante (ele é fictício) e nenhum pagamento foi feito.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName="Sabor & Brasa" message={orderMessage(order)} triggerLabel="Prévia do pedido no WhatsApp" triggerClassName="btn btn-primary" />
          <Link href="/" className="btn btn-secondary">
            Fazer outro pedido
          </Link>
        </div>
      </section>
    );
  }

  const { lines, fulfillment } = state;
  const summary = summarize(lines, fulfillment);

  if (lines.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-muted">Seu carrinho está vazio.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Ver cardápio
        </Link>
      </div>
    );
  }

  const confirm = () => {
    const result = cartActions.placeOrder();
    if (!result.ok) {
      setError(result.error);
      setReviewing(false);
      return;
    }
    setOrder(result.order);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="itens">
        <h2 id="itens" ref={reviewing ? undefined : headingRef} tabIndex={-1} className="text-2xl outline-none">
          Itens
        </h2>
        <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-paper">
          {lines.map((line) => {
            const item = getItem(line.itemId);
            const extras = describeAddons(line);
            return (
              <li key={line.key} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{item?.name}</p>
                  {extras && <p className="text-sm text-muted">{extras}</p>}
                  {line.note && <p className="text-sm text-muted">Obs.: {line.note}</p>}
                  <p className="mt-1 text-sm font-semibold">{formatBRL(lineTotalCents(line))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cartActions.setQuantity(line.key, line.quantity - 1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line"
                  >
                    {line.quantity === 1 ? <Trash2 aria-hidden className="size-4" /> : <Minus aria-hidden className="size-4" />}
                    <span className="sr-only">{line.quantity === 1 ? `Remover ${item?.name}` : `Diminuir ${item?.name}`}</span>
                  </button>
                  <span className="w-7 text-center font-semibold tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cartActions.setQuantity(line.key, line.quantity + 1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line"
                  >
                    <Plus aria-hidden className="size-4" />
                    <span className="sr-only">Aumentar {item?.name}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brick">
          + Adicionar mais itens
        </Link>
      </section>

      <section aria-labelledby="entrega" className="h-fit rounded-card border border-line bg-paper p-5">
        <h2 id="entrega" className="text-2xl">
          Como receber
        </h2>
        <fieldset className="mt-4 min-w-0">
          <legend className="sr-only">Retirada ou entrega</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["retirada", "entrega"] as const).map((type) => (
              <label key={type} className="option justify-center">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillment.type === type}
                  onChange={() => {
                    setError("");
                    setReviewing(false);
                    cartActions.setFulfillment(type === "retirada" ? { type } : { type, areaId: "" });
                  }}
                  className="sr-only"
                />
                {type === "retirada" ? "Retirada" : "Entrega"}
              </label>
            ))}
          </div>
        </fieldset>

        {fulfillment.type === "entrega" && (
          <label className="mt-4 block">
            <span className="font-semibold">Bairro</span>
            <select
              value={fulfillment.areaId}
              onChange={(event) => {
                setError("");
                cartActions.setFulfillment({ type: "entrega", areaId: event.target.value });
              }}
              className="mt-2 block w-full rounded-xl border border-line bg-paper px-3.5 py-3"
            >
              <option value="">Selecione</option>
              {deliveryAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} — {formatBRL(area.feeCents)}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-sm text-muted">
              Bairros ilustrativos. Pedido mínimo para entrega: {formatBRL(MIN_DELIVERY_CENTS)}.
            </span>
          </label>
        )}

        <dl className="mt-6 space-y-2 border-t border-line pt-4">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatBRL(summary.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Entrega</dt>
            <dd>{fulfillment.type === "retirada" ? "Grátis (retirada)" : formatBRL(summary.deliveryFeeCents)}</dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total</dt>
            <dd>{formatBRL(summary.totalCents)}</dd>
          </div>
        </dl>

        <p role="alert" className="mt-3 min-h-5 text-sm font-semibold text-brick">
          {error}
        </p>

        {!reviewing ? (
          <button
            type="button"
            className="btn btn-primary mt-2 w-full"
            onClick={() => {
              if (summary.error) {
                setError(summary.error);
                return;
              }
              setReviewing(true);
            }}
          >
            Revisar pedido
          </button>
        ) : (
          <div className="mt-2">
            <h3 ref={headingRef} tabIndex={-1} className="text-xl outline-none">
              Confira antes de gerar
            </h3>
            <p className="mt-2 text-sm text-muted">
              Cliente: {demoCustomer.name}
              {fulfillment.type === "entrega" && (
                <>
                  <br />
                  Endereço: {demoCustomer.address}
                </>
              )}
            </p>
            <p className="mt-3 flex gap-2 rounded-xl bg-crust p-3 text-sm">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brick" />
              Pedido de demonstração: nada é enviado e não há pagamento.
            </p>
            <button type="button" className="btn btn-primary mt-4 w-full" onClick={confirm}>
              Gerar pedido de demonstração
            </button>
            <button type="button" className="btn btn-secondary mt-2 w-full" onClick={() => setReviewing(false)}>
              Voltar e editar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
