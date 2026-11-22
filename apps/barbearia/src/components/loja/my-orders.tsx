"use client";

import { Package, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { PixCheckout } from "@/components/pix-checkout";
import { getProfessional } from "@/data/business";
import { getProduct } from "@/data/loja";
import type { DemoState } from "@/lib/demo-state";
import { demoActions } from "@/lib/demo-store";
import { orderStatusLabel } from "@/lib/loja";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime } from "@/lib/time";
import type { Order } from "@/types/booking";

export function MyOrders({ demo, onFeedback }: { demo: DemoState; onFeedback: (f: { tone: "ok" | "error"; text: string }) => void }) {
  const mine = demo.orders.filter((o) => o.origin === "visitor").sort((a, b) => b.id.localeCompare(a.id));

  return (
    <section aria-labelledby="pedidos-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="pedidos-title" className="text-3xl font-bold">
          Meus pedidos da loja
        </h2>
        <Link href="/loja" className="btn btn-line">
          <Package aria-hidden className="size-4" />
          Ir para a loja
        </Link>
      </div>
      {mine.length === 0 ? (
        <p className="mt-5 rounded-card border border-dashed border-edge p-6 text-smoke">
          Nenhum pedido ainda. Na loja, você compra pomada, shampoo e cuidados com a barba e retira no seu horário.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {mine.map((order) => (
            <OrderCard key={order.id} order={order} demo={demo} onFeedback={onFeedback} />
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderCard({
  order,
  demo,
  onFeedback,
}: {
  order: Order;
  demo: DemoState;
  onFeedback: (f: { tone: "ok" | "error"; text: string }) => void;
}) {
  const [paying, setPaying] = useState(false);
  const expire = useCallback(() => demoActions.sweepPix(), []);
  const booking = order.pickup.mode === "horario" ? demo.bookings.find((b) => order.pickup.mode === "horario" && b.id === order.pickup.bookingId) : undefined;
  const where =
    order.pickup.mode === "balcao"
      ? `No balcão, ${formatDateLong(order.pickup.date)}`
      : booking
        ? `No horário de ${formatDateLong(booking.date)}, às ${formatTime(booking.startMin)}, com ${getProfessional(booking.professionalId)?.shortName}`
        : "No seu horário";
  const open = order.status === "separar" || order.status === "pronto";

  return (
    <li className={`rounded-card border p-5 ${open ? "border-gold/50 bg-coal-2" : "border-edge bg-coal-2 opacity-80"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {order.id} · {formatBRL(order.totalCents)}{" "}
            <span className="font-normal text-smoke">
              · {order.payment === "pix" ? (order.pixStatus === "pago" ? "pago por Pix" : "Pix") : "paga na retirada"}
            </span>
          </p>
          <p className="text-sm text-smoke">{where}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${order.status === "cancelado" ? "border-warn/40 text-warn" : order.status === "pronto" ? "border-ok/40 text-ok" : "border-gold/50 text-gold"}`}>
          {orderStatusLabel(order)}
        </span>
      </div>
      <ul className="mt-3 text-sm">
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.qty}× {getProduct(item.productId)?.name}
          </li>
        ))}
      </ul>
      {order.pixStatus === "pendente" && order.status !== "cancelado" && !paying && (
        <button type="button" onClick={() => setPaying(true)} className="btn btn-gold mt-4 !min-h-11">
          Pagar {formatBRL(order.totalCents)} por Pix
        </button>
      )}
      {paying && order.pixStatus === "pendente" && (
        <div className="mt-4">
          <PixCheckout
            reference={order.id}
            cents={order.totalCents}
            description={`Pedido ${order.id} da loja.`}
            expiresAt={order.pixExpiresAt}
            onPaid={() => {
              demoActions.payOrder(order.id);
              setPaying(false);
              onFeedback({ tone: "ok", text: `Pedido ${order.id} pago.` });
            }}
            onExpired={expire}
          />
        </div>
      )}
      {open && (
        <button
          type="button"
          onClick={() => {
            const result = demoActions.cancelOrder(order.id);
            onFeedback(
              result.ok
                ? { tone: "ok", text: result.value.refunded ? `Pedido cancelado. O Pix de ${formatBRL(order.totalCents)} seria devolvido.` : "Pedido cancelado." }
                : { tone: "error", text: result.error },
            );
          }}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-smoke hover:text-cream"
        >
          <X aria-hidden className="size-4" />
          Cancelar pedido<span className="sr-only"> {order.id}</span>
        </button>
      )}
    </li>
  );
}
