"use client";

import { CalendarPlus, CheckCircle2, Minus, Plus, ShoppingBag, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PixCheckout } from "@/components/pix-checkout";
import { ProductPhoto } from "@/components/loja/product-photo";
import { getProfessional, getService } from "@/data/business";
import { getProduct, PIX_DISCOUNT_PCT } from "@/data/loja";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { cartTotals, counterDays, MAX_PER_ITEM, orderStatusLabel, pickupBookings, stockLeft } from "@/lib/loja";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";
import type { Order } from "@/types/booking";

/** Lê `?horario=<código>` (vindo da confirmação do agendamento) para já marcar a retirada nele. */
export function CheckoutWithParams() {
  const bookingId = useSearchParams().get("horario") ?? "";
  return <Checkout key={bookingId} initialBookingId={bookingId} />;
}

export function Checkout({ initialBookingId = "" }: { initialBookingId?: string }) {
  const demo = useDemoState();
  const [now] = useState(getBusinessNow);
  const [pickupChoice, setPickupChoice] = useState<string>(initialBookingId ? `horario:${initialBookingId}` : "");
  const [payment, setPayment] = useState<Order["payment"]>("pix");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const expire = useCallback(() => demoActions.sweepPix(), []);

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando a sacola…
      </p>
    );
  }

  const order = orderId ? demo.orders.find((o) => o.id === orderId) : undefined;
  if (order) return <OrderDone order={order} onExpired={expire} />;

  const bookings = pickupBookings(demo, now);
  const days = counterDays(now);
  const options = [
    ...bookings.map((b) => `horario:${b.id}`),
    ...days.map((date) => `balcao:${date}`),
  ];
  const chosen = options.includes(pickupChoice) ? pickupChoice : (options[0] ?? "");
  const totals = cartTotals(demo.cart, payment);

  if (demo.cart.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-edge p-10 text-center">
        <ShoppingBag aria-hidden className="mx-auto size-10 text-gold" />
        <p className="mt-3 text-lg">Sua sacola está vazia.</p>
        <Link href="/loja" className="btn btn-gold mt-6">
          Ver produtos
        </Link>
      </div>
    );
  }

  const finish = () => {
    const [mode, value] = chosen.split(":") as ["horario" | "balcao", string];
    if (!value) return setError("Escolha onde retirar.");
    const result = demoActions.placeOrder(
      mode === "horario" ? { mode, bookingId: value } : { mode, date: value },
      payment,
    );
    if (!result.ok) return setError(result.error);
    setError("");
    setOrderId(result.value.id);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div className="grid gap-10">
        <section aria-labelledby="itens-title">
          <h2 id="itens-title" className="text-3xl font-bold">
            Itens
          </h2>
          <ul className="mt-5 divide-y divide-edge rounded-card border border-edge bg-coal-2">
            {demo.cart.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              const canAdd = item.qty < MAX_PER_ITEM && stockLeft(demo, item.productId) > item.qty;
              return (
                <li key={item.productId} className="flex gap-4 p-4">
                  <span className="w-20 shrink-0 overflow-hidden rounded-lg border border-edge">
                    <ProductPhoto product={product} sizes="80px" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-smoke">
                      {product.size} · {formatBRL(product.priceCents)} cada
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-lg border border-edge">
                        <button
                          type="button"
                          onClick={() => demoActions.setCartQty(item.productId, item.qty - 1)}
                          className="grid size-11 place-items-center hover:text-gold"
                        >
                          <Minus aria-hidden className="size-4" />
                          <span className="sr-only">Tirar uma unidade de {product.name}</span>
                        </button>
                        <span className="w-8 text-center font-semibold" aria-label={`${item.qty} unidades`}>
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          disabled={!canAdd}
                          onClick={() => {
                            const result = demoActions.setCartQty(item.productId, item.qty + 1);
                            setError(result.ok ? "" : result.error);
                          }}
                          className="grid size-11 place-items-center hover:text-gold disabled:opacity-40"
                        >
                          <Plus aria-hidden className="size-4" />
                          <span className="sr-only">Mais uma unidade de {product.name}</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => demoActions.setCartQty(item.productId, 0)}
                        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-smoke hover:text-cream"
                      >
                        <Trash2 aria-hidden className="size-4" />
                        Remover<span className="sr-only"> {product.name}</span>
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-display text-xl font-semibold text-gold">{formatBRL(product.priceCents * item.qty)}</p>
                </li>
              );
            })}
          </ul>
          <Link href="/loja" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-gold hover:text-gold-bright">
            + Continuar comprando
          </Link>
        </section>

        <fieldset className="min-w-0">
          <legend className="font-display text-3xl font-bold uppercase">
            Onde retirar
          </legend>
          <div className="mt-5 grid gap-3">
            {bookings.map((booking) => (
              <label key={booking.id} className="choice p-4">
                <input
                  type="radio"
                  name="pickup"
                  value={`horario:${booking.id}`}
                  checked={chosen === `horario:${booking.id}`}
                  onChange={(e) => setPickupChoice(e.target.value)}
                  className="sr-only"
                />
                <span className="flex items-start gap-3">
                  <CalendarPlus aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    <span className="block font-semibold">
                      No seu horário: {relativeDayLabel(booking.date, now.date) ?? formatDateLong(booking.date)}, às{" "}
                      {formatTime(booking.startMin)}
                    </span>
                    <span className="text-sm text-smoke">
                      {getService(booking.serviceId)?.name} com {getProfessional(booking.professionalId)?.shortName}. Os produtos
                      ficam separados na bancada dele.
                    </span>
                  </span>
                </span>
              </label>
            ))}
            {bookings.length === 0 && (
              <p className="rounded-card border border-dashed border-edge p-4 text-sm text-smoke">
                Vai cortar em breve?{" "}
                <Link href="/agendar" className="font-semibold text-gold underline underline-offset-4">
                  Agende primeiro
                </Link>{" "}
                e retire os produtos no mesmo horário.
              </p>
            )}
            <div className="choice p-4 has-[input:checked]:border-gold">
              <span className="flex items-start gap-3">
                <Store aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">No balcão, sem horário marcado</span>
                  <span className="text-sm text-smoke">Passe quando quiser no dia escolhido, dentro do horário de funcionamento.</span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    {days.map((date) => {
                      const parts = formatDateParts(date);
                      return (
                        <label key={date} className="choice px-3 py-2 text-center">
                          <input
                            type="radio"
                            name="pickup"
                            value={`balcao:${date}`}
                            checked={chosen === `balcao:${date}`}
                            onChange={(e) => setPickupChoice(e.target.value)}
                            className="sr-only"
                          />
                          <span className="block text-xs font-semibold text-smoke uppercase">
                            {relativeDayLabel(date, now.date) ?? parts.weekday}
                          </span>
                          <span className="font-display text-lg font-semibold">{parts.dayMonth}</span>
                        </label>
                      );
                    })}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </fieldset>
      </div>

      <aside aria-labelledby="resumo-title" className="rounded-card border border-gold/50 bg-coal-2 p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 id="resumo-title" className="text-3xl font-bold">
          Pagamento
        </h2>
        <fieldset className="mt-4 min-w-0">
          <legend className="sr-only">Como pagar</legend>
          <div className="grid gap-3">
            <label className="choice p-4">
              <input
                type="radio"
                name="order-payment"
                value="pix"
                checked={payment === "pix"}
                onChange={() => setPayment("pix")}
                className="sr-only"
              />
              <span className="block font-semibold">Pix agora, com {PIX_DISCOUNT_PCT}% de desconto</span>
              <span className="text-sm text-smoke">Chega e só pega, sem fila no balcão.</span>
            </label>
            <label className="choice p-4">
              <input
                type="radio"
                name="order-payment"
                value="retirada"
                checked={payment === "retirada"}
                onChange={() => setPayment("retirada")}
                className="sr-only"
              />
              <span className="block font-semibold">Pagar na retirada</span>
              <span className="text-sm text-smoke">Dinheiro, cartão ou Pix, junto com o corte.</span>
            </label>
          </div>
        </fieldset>
        <dl className="mt-6 space-y-2 border-t border-edge pt-4">
          <div className="flex justify-between gap-4">
            <dt className="text-smoke">
              Subtotal ({totals.count} {totals.count === 1 ? "item" : "itens"})
            </dt>
            <dd>{formatBRL(totals.subtotalCents)}</dd>
          </div>
          {totals.discountCents > 0 && (
            <div className="flex justify-between gap-4 text-ok">
              <dt>Desconto do Pix</dt>
              <dd>− {formatBRL(totals.discountCents)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-edge pt-2 text-xl font-semibold">
            <dt>Total</dt>
            <dd className="font-display text-2xl text-gold">{formatBRL(totals.totalCents)}</dd>
          </div>
        </dl>
        <div role="alert" className="mt-3 min-h-5 text-sm font-semibold text-warn">
          {error}
        </div>
        <button type="button" onClick={finish} className="btn btn-gold mt-2 w-full">
          <ShoppingBag aria-hidden className="size-4" />
          {payment === "pix" ? `Pagar ${formatBRL(totals.totalCents)} por Pix` : "Reservar e pagar na retirada"}
        </button>
        <p className="mt-3 text-xs text-smoke">Demonstração: nenhum produto é vendido e nenhum valor é cobrado.</p>
      </aside>
    </div>
  );
}

function OrderDone({ order, onExpired }: { order: Order; onExpired: () => void }) {
  const demo = useDemoState();
  const booking =
    order.pickup.mode === "horario" ? demo?.bookings.find((b) => order.pickup.mode === "horario" && b.id === order.pickup.bookingId) : undefined;

  if (order.pixStatus === "pendente" && order.status !== "cancelado") {
    return (
      <PixCheckout
        reference={order.id}
        cents={order.totalCents}
        description={`Pedido ${order.id}: ${order.items.length} ${order.items.length === 1 ? "produto" : "produtos"}, já com ${PIX_DISCOUNT_PCT}% de desconto.`}
        expiresAt={order.pixExpiresAt}
        onPaid={() => demoActions.payOrder(order.id)}
        onExpired={onExpired}
      />
    );
  }

  const where =
    order.pickup.mode === "balcao"
      ? `no balcão, ${formatDateLong(order.pickup.date)}`
      : booking
        ? `no seu horário de ${formatDateLong(booking.date)}, às ${formatTime(booking.startMin)}, com ${getProfessional(booking.professionalId)?.shortName}`
        : "no seu horário";

  return (
    <section className="rounded-card border border-gold/50 bg-coal-2 p-6 sm:p-10">
      <CheckCircle2 aria-hidden className={`size-10 ${order.status === "cancelado" ? "text-warn" : "text-ok"}`} />
      <h2 className="mt-4 text-4xl font-bold">{order.status === "cancelado" ? "O Pix venceu e o pedido foi cancelado" : "Pedido recebido"}</h2>
      <p className="mt-2 text-smoke">
        Código <strong className="font-display text-lg tracking-wider text-gold">{order.id}</strong> · {orderStatusLabel(order)}
      </p>
      {order.status !== "cancelado" && (
        <p className="mt-4 text-lg">
          Retire {where}. {order.payment === "pix" ? "Já está pago." : `Pague ${formatBRL(order.totalCents)} na retirada.`}
        </p>
      )}
      <ul className="mt-4 space-y-1 text-smoke">
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.qty}× {getProduct(item.productId)?.name}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/meus-horarios" className="btn btn-gold">
          Acompanhar em Meus horários
        </Link>
        <Link href="/loja" className="btn btn-line">
          Voltar para a loja
        </Link>
      </div>
    </section>
  );
}
