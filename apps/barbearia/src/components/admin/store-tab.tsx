"use client";

import { AlertTriangle, PackageCheck } from "lucide-react";
import { useState } from "react";
import { Badge, FeedbackLine, Tile, type Feedback } from "@/components/admin/shared";
import { getProfessional } from "@/data/business";
import { getProduct, LOW_STOCK, products } from "@/data/loja";
import type { DemoState } from "@/lib/demo-state";
import { demoActions } from "@/lib/demo-store";
import { pickupDate, stockLeft } from "@/lib/loja";
import { formatBRL } from "@/lib/money";
import { formatDateParts, formatTime, relativeDayLabel } from "@/lib/time";
import type { BusinessNow, Order } from "@/types/booking";

export function StoreTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const active = demo.orders.filter((o) => o.status !== "cancelado");
  const toPrepare = active.filter((o) => o.status === "separar").sort(byPickup(demo));
  const ready = active.filter((o) => o.status === "pronto").sort(byPickup(demo));
  const sold = active.reduce((sum, o) => sum + o.totalCents, 0);
  const pix = active.filter((o) => o.pixStatus === "pago").reduce((sum, o) => sum + o.totalCents, 0);
  const low = products.filter((p) => stockLeft(demo, p.id) <= LOW_STOCK);

  const advance = (order: Order) => {
    const result = demoActions.advanceOrder(order.id);
    setFeedback(
      result.ok
        ? { tone: "ok", text: result.value.status === "pronto" ? `${order.id} separado e pronto para retirada.` : `${order.id} entregue ao cliente.` }
        : { tone: "error", text: result.error },
    );
  };

  return (
    <div className="grid gap-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Para separar" value={String(toPrepare.length)} hint="pedidos novos" />
        <Tile label="Prontos para retirar" value={String(ready.length)} hint="na bancada ou no balcão" />
        <Tile label="Vendido na loja" value={formatBRL(sold)} hint={`${formatBRL(pix)} já pago por Pix`} />
        <Tile label="Estoque baixo" value={String(low.length)} hint={`${LOW_STOCK} unidades ou menos`} />
      </div>

      <FeedbackLine feedback={feedback} />

      <OrderList
        title="Para separar"
        empty="Nada para separar agora."
        orders={toPrepare}
        demo={demo}
        now={now}
        action="Marcar como separado"
        onAction={advance}
      />
      <OrderList
        title="Prontos para retirar"
        empty="Nenhum pedido esperando retirada."
        orders={ready}
        demo={demo}
        now={now}
        action="Entregue ao cliente"
        onAction={advance}
      />

      <section aria-labelledby="estoque-title">
        <h2 id="estoque-title" className="text-3xl font-bold">
          Estoque
        </h2>
        <div className="mt-5 overflow-x-auto rounded-card border border-edge">
          <table className="w-full min-w-[30rem] text-left">
            <caption className="sr-only">Estoque dos produtos da loja</caption>
            <thead className="bg-coal-2 text-xs tracking-wider text-smoke uppercase">
              <tr>
                <th scope="col" className="p-4">
                  Produto
                </th>
                <th scope="col" className="p-4 text-right">
                  Preço
                </th>
                <th scope="col" className="p-4 text-right">
                  Vendidos
                </th>
                <th scope="col" className="p-4 text-right">
                  Em estoque
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {products.map((product) => {
                const left = stockLeft(demo, product.id);
                return (
                  <tr key={product.id}>
                    <th scope="row" className="p-4 font-semibold">
                      {product.name}
                    </th>
                    <td className="p-4 text-right tabular-nums">{formatBRL(product.priceCents)}</td>
                    <td className="p-4 text-right tabular-nums">{product.stock - left}</td>
                    <td className="p-4 text-right tabular-nums">
                      {left <= LOW_STOCK ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-warn">
                          <AlertTriangle aria-hidden className="size-4" />
                          {left === 0 ? "Esgotado" : `${left} · repor`}
                        </span>
                      ) : (
                        left
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function byPickup(demo: DemoState) {
  return (a: Order, b: Order) => (pickupDate(demo, a) ?? "").localeCompare(pickupDate(demo, b) ?? "");
}

function OrderList({
  title,
  empty,
  orders,
  demo,
  now,
  action,
  onAction,
}: {
  title: string;
  empty: string;
  orders: Order[];
  demo: DemoState;
  now: BusinessNow;
  action: string;
  onAction: (order: Order) => void;
}) {
  return (
    <section aria-label={title}>
      <h2 className="text-3xl font-bold">{title}</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-smoke">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className={`flex flex-col gap-4 rounded-card border p-4 sm:flex-row sm:items-center sm:justify-between ${
                order.origin === "visitor" ? "border-gold/50 bg-coal-3" : "border-edge bg-coal-2"
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold">
                  {order.customerName} <span className="font-normal text-smoke">· {order.id} · {formatBRL(order.totalCents)}</span>
                </p>
                <p className="text-sm">
                  {order.items.map((item) => `${item.qty}× ${getProduct(item.productId)?.name}`).join(", ")}
                </p>
                <p className="mt-1 text-sm text-smoke">{pickupText(order, demo, now)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className={order.pixStatus === "pago" ? "border-ok/40 text-ok" : order.pixStatus === "pendente" ? "border-warn/40 text-warn" : "border-edge text-smoke"}>
                    {order.pixStatus === "pago" ? "Pago por Pix" : order.pixStatus === "pendente" ? "Pix pendente" : "Paga na retirada"}
                  </Badge>
                  {order.origin === "visitor" && <Badge className="border-cream/30 text-cream">Criado por você</Badge>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAction(order)}
                disabled={order.pixStatus === "pendente"}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-edge px-3 text-sm font-semibold hover:border-gold hover:text-gold-bright disabled:opacity-40"
              >
                <PackageCheck aria-hidden className="size-4" />
                {action}
                <span className="sr-only"> {order.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function pickupText(order: Order, demo: DemoState, now: BusinessNow): string {
  if (order.pickup.mode === "balcao") {
    const parts = formatDateParts(order.pickup.date);
    return `Retira no balcão · ${relativeDayLabel(order.pickup.date, now.date) ?? parts.weekday} ${parts.dayMonth}`;
  }
  const bookingId = order.pickup.bookingId;
  const booking = demo.bookings.find((b) => b.id === bookingId);
  if (!booking) return "Retira no horário";
  const parts = formatDateParts(booking.date);
  return `Leva no horário · ${relativeDayLabel(booking.date, now.date) ?? parts.weekday} ${parts.dayMonth}, ${formatTime(booking.startMin)}, com ${getProfessional(booking.professionalId)?.shortName}`;
}
