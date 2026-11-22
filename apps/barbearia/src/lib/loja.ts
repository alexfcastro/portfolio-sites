import { business, demoCustomerName } from "@/data/business";
import { getProduct, PIX_DISCOUNT_PCT, products } from "@/data/loja";
import type { DemoState, Outcome } from "@/lib/demo-state";
import { createRandom } from "@/lib/random";
import { getOpeningWindow } from "@/lib/schedule";
import { addDays } from "@/lib/time";
import type { Booking, BusinessNow, CartItem, Order, OrderStatus, Pickup } from "@/types/booking";

/*
 * Loja da demo: sacola, pedido para retirar na barbearia e estoque.
 * Tudo fictício e guardado só neste navegador; nenhum produto é vendido de verdade.
 */

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Máximo de unidades de um mesmo produto num pedido. */
export const MAX_PER_ITEM = 5;

/** Estoque que sobra, descontando pedidos não cancelados e o que está na sacola (opcional). */
export function stockLeft(state: DemoState, productId: string, includeCart = false): number {
  const product = getProduct(productId);
  if (!product) return 0;
  const sold = state.orders
    .filter((order) => order.status !== "cancelado")
    .flatMap((order) => order.items)
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.qty, 0);
  const inCart = includeCart ? (state.cart.find((item) => item.productId === productId)?.qty ?? 0) : 0;
  return Math.max(0, product.stock - sold - inCart);
}

export function setCartQty(state: DemoState, productId: string, qty: number): Outcome<CartItem[]> {
  const product = getProduct(productId);
  if (!product) return fail("Produto não encontrado.");
  const wanted = Math.max(0, Math.min(MAX_PER_ITEM, Math.floor(qty)));
  const available = stockLeft(state, productId);
  if (wanted > available) {
    return fail(available === 0 ? "Produto esgotado." : `Só ${available === 1 ? "resta 1 unidade" : `restam ${available} unidades`}.`);
  }
  const exists = state.cart.some((item) => item.productId === productId);
  // Mantém a ordem em que os produtos entraram na sacola.
  const cart = exists
    ? state.cart.flatMap((item) => (item.productId !== productId ? [item] : wanted > 0 ? [{ productId, qty: wanted }] : []))
    : wanted > 0
      ? [...state.cart, { productId, qty: wanted }]
      : state.cart;
  return { ok: true, value: cart, state: { ...state, cart } };
}

export function addToCart(state: DemoState, productId: string, qty = 1): Outcome<CartItem[]> {
  const current = state.cart.find((item) => item.productId === productId)?.qty ?? 0;
  return setCartQty(state, productId, current + qty);
}

export interface Totals {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  count: number;
}

export function cartTotals(items: readonly CartItem[], payment: Order["payment"]): Totals {
  const subtotal = items.reduce((sum, item) => sum + (getProduct(item.productId)?.priceCents ?? 0) * item.qty, 0);
  const discount = payment === "pix" ? Math.round((subtotal * PIX_DISCOUNT_PCT) / 100) : 0;
  return {
    subtotalCents: subtotal,
    discountCents: discount,
    totalCents: subtotal - discount,
    count: items.reduce((sum, item) => sum + item.qty, 0),
  };
}

/** Horários do cliente de demonstração que ainda servem para retirar uma compra. */
export function pickupBookings(state: DemoState, now: BusinessNow): Booking[] {
  return state.bookings
    .filter(
      (b) =>
        b.origin === "visitor" &&
        b.status === "confirmado" &&
        (b.date > now.date || (b.date === now.date && b.endMin > now.minutes)),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
}

/** Dias em que dá para retirar no balcão (abertos e, se for hoje, ainda antes de fechar). */
export function counterDays(now: BusinessNow, days = 7): string[] {
  return Array.from({ length: days }, (_, index) => addDays(now.date, index)).filter((date) => {
    const window = getOpeningWindow(date);
    return window && !(date === now.date && window.closeMin - 30 <= now.minutes);
  });
}

export function placeOrder(
  state: DemoState,
  input: { pickup: Pickup; payment: Order["payment"] },
  now: BusinessNow,
  nowMs = 0,
): Outcome<Order> {
  if (state.cart.length === 0) return fail("A sacola está vazia.");
  for (const item of state.cart) {
    if (item.qty > stockLeft(state, item.productId)) return fail(`${getProduct(item.productId)?.name ?? "Produto"} sem estoque suficiente.`);
  }
  if (input.pickup.mode === "horario") {
    const bookingId = input.pickup.bookingId;
    if (!pickupBookings(state, now).some((b) => b.id === bookingId)) return fail("Escolha um dos seus horários marcados.");
  } else if (!counterDays(now).includes(input.pickup.date)) {
    return fail("Escolha um dia em que a barbearia esteja aberta.");
  }

  const totals = cartTotals(state.cart, input.payment);
  const order: Order = {
    id: `PED-${state.nextNumber}`,
    customerName: demoCustomerName,
    items: state.cart.map((item) => ({ ...item, unitCents: getProduct(item.productId)!.priceCents })),
    pickup: input.pickup,
    payment: input.payment,
    subtotalCents: totals.subtotalCents,
    discountCents: totals.discountCents,
    totalCents: totals.totalCents,
    pixStatus: input.payment === "pix" ? "pendente" : null,
    ...(input.payment === "pix" ? { pixExpiresAt: nowMs + business.pixExpiresMin * 60_000 } : {}),
    status: "separar",
    origin: "visitor",
  };
  return {
    ok: true,
    value: order,
    state: { ...state, cart: [], nextNumber: state.nextNumber + 1, orders: [...state.orders, order] },
  };
}

function updateOrder(state: DemoState, id: string, change: (order: Order) => Order | string): Outcome<Order> {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return fail("Pedido não encontrado.");
  const updated = change(order);
  if (typeof updated === "string") return fail(updated);
  return { ok: true, value: updated, state: { ...state, orders: state.orders.map((o) => (o.id === id ? updated : o)) } };
}

export function payOrderPix(state: DemoState, id: string): Outcome<Order> {
  return updateOrder(state, id, (order) =>
    order.pixStatus === "pendente" && order.status !== "cancelado" ? { ...order, pixStatus: "pago" } : "Não há Pix pendente.",
  );
}

export function sweepExpiredOrders(state: DemoState, nowMs: number): DemoState {
  const expired = state.orders.some(
    (o) => o.pixStatus === "pendente" && o.status !== "cancelado" && (o.pixExpiresAt ?? 0) <= nowMs,
  );
  if (!expired) return state;
  return {
    ...state,
    orders: state.orders.map((o) =>
      o.pixStatus === "pendente" && o.status !== "cancelado" && (o.pixExpiresAt ?? 0) <= nowMs ? { ...o, status: "cancelado" } : o,
    ),
  };
}

/** Próxima etapa do pedido no painel: separar → pronto → retirado. */
export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  if (status === "separar") return "pronto";
  if (status === "pronto") return "retirado";
  return null;
}

export function advanceOrder(state: DemoState, id: string): Outcome<Order> {
  return updateOrder(state, id, (order) => {
    const next = nextOrderStatus(order.status);
    if (!next) return "Este pedido já foi encerrado.";
    if (order.pixStatus === "pendente") return "O Pix deste pedido ainda não foi pago.";
    return { ...order, status: next };
  });
}

export function cancelOrder(state: DemoState, id: string): Outcome<Order> {
  return updateOrder(state, id, (order) =>
    order.status === "retirado" || order.status === "cancelado"
      ? "Este pedido não pode mais ser cancelado."
      : { ...order, status: "cancelado", refunded: order.pixStatus === "pago" },
  );
}

/** Se o horário de retirada for cancelado, o pedido passa para o balcão no mesmo dia. */
export function movePickupsToCounter(state: DemoState, booking: Booking): DemoState {
  if (!state.orders.some((o) => o.pickup.mode === "horario" && o.pickup.bookingId === booking.id)) return state;
  return {
    ...state,
    orders: state.orders.map((o) =>
      o.pickup.mode === "horario" && o.pickup.bookingId === booking.id && o.status !== "cancelado"
        ? { ...o, pickup: { mode: "balcao", date: booking.date } }
        : o,
    ),
  };
}

/** Data em que o pedido será retirado. */
export function pickupDate(state: DemoState, order: Order): string | null {
  if (order.pickup.mode === "balcao") return order.pickup.date;
  const bookingId = order.pickup.bookingId;
  return state.bookings.find((b) => b.id === bookingId)?.date ?? null;
}

export function ordersForBooking(state: DemoState, bookingId: string): Order[] {
  return state.orders.filter((o) => o.pickup.mode === "horario" && o.pickup.bookingId === bookingId && o.status !== "cancelado");
}

/** Pedidos de exemplo: alguns clientes da agenda levam produtos no horário, outro retira no balcão. */
export function generateSeedOrders(bookings: readonly Booking[], now: BusinessNow): Order[] {
  const random = createRandom(`pedidos:${now.date}`);
  const candidates = bookings.filter(
    (b) => b.status !== "cancelado" && (b.date === now.date || b.date === addDays(now.date, 1)),
  );
  const orders: Order[] = [];
  let counter = 0;
  for (const booking of candidates) {
    if (random() > 0.3 || orders.length >= 6) continue;
    const pool = products.filter((p) => p.pairsWith.includes(booking.serviceId) && p.category !== "kits");
    const first = pool[Math.floor(random() * pool.length)];
    if (!first) continue;
    const items = [{ productId: first.id, qty: 1, unitCents: first.priceCents }];
    const subtotal = first.priceCents;
    const pix = random() < 0.5;
    const discount = pix ? Math.round((subtotal * PIX_DISCOUNT_PCT) / 100) : 0;
    const past = booking.date === now.date && booking.endMin <= now.minutes;
    counter += 1;
    orders.push({
      id: `PED-${String(counter).padStart(3, "0")}`,
      customerName: booking.customerName,
      items,
      pickup: { mode: "horario", bookingId: booking.id },
      payment: pix ? "pix" : "retirada",
      subtotalCents: subtotal,
      discountCents: discount,
      totalCents: subtotal - discount,
      pixStatus: pix ? "pago" : null,
      status: past ? "retirado" : booking.date === now.date ? "pronto" : "separar",
      origin: "seed",
    });
  }
  // Uma compra para retirar no balcão no próximo dia aberto.
  const day = counterDays(now).find((date) => date > now.date);
  const kit = products.find((p) => p.id === "kit-barba");
  if (day && kit) {
    counter += 1;
    orders.push({
      id: `PED-${String(counter).padStart(3, "0")}`,
      customerName: "Vitor E.",
      items: [{ productId: kit.id, qty: 1, unitCents: kit.priceCents }],
      pickup: { mode: "balcao", date: day },
      payment: "pix",
      subtotalCents: kit.priceCents,
      discountCents: Math.round((kit.priceCents * PIX_DISCOUNT_PCT) / 100),
      totalCents: kit.priceCents - Math.round((kit.priceCents * PIX_DISCOUNT_PCT) / 100),
      pixStatus: "pago",
      status: "separar",
      origin: "seed",
    });
  }
  return orders;
}

/** Produtos sugeridos para o serviço (para "leve junto" depois de agendar). */
export function suggestionsFor(serviceId: string, limit = 3) {
  return products
    .filter((p) => p.pairsWith.includes(serviceId) && p.category !== "kits")
    .sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)))
    .slice(0, limit);
}

export function orderStatusLabel(order: Order): string {
  if (order.status === "cancelado") return order.refunded ? "Cancelado · Pix devolvido" : "Cancelado";
  if (order.pixStatus === "pendente") return "Aguardando o Pix";
  if (order.status === "separar") return "Recebido · a barbearia vai separar";
  if (order.status === "pronto") return "Separado, pronto para retirar";
  return "Retirado";
}

/** Quantas unidades da loja o cliente retira no horário. */
export function productCount(state: DemoState, bookingId: string): number {
  return ordersForBooking(state, bookingId)
    .flatMap((order) => order.items)
    .reduce((sum, item) => sum + item.qty, 0);
}
