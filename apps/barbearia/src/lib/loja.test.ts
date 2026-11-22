import { describe, expect, it } from "vitest";
import { getProduct, PIX_DISCOUNT_PCT, products } from "@/data/loja";
import { addVisitorBooking, cancelByCustomer, createInitialState, STATE_VERSION, sweepExpiredPix, type DemoState } from "@/lib/demo-state";
import {
  addToCart,
  advanceOrder,
  cancelOrder,
  cartTotals,
  counterDays,
  ordersForBooking,
  payOrderPix,
  placeOrder,
  productCount,
  setCartQty,
  stockLeft,
} from "@/lib/loja";
import { addDays } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

// Quarta-feira, 10:00.
const now: BusinessNow = { date: "2026-09-30", minutes: 10 * 60 };
const tomorrow = addDays(now.date, 1);
const empty: DemoState = {
  version: STATE_VERSION,
  seedDate: now.date,
  nextNumber: 1001,
  bookings: [],
  blocks: [],
  waitlist: [],
  contacted: [],
  subscription: null,
  cart: [],
  orders: [],
};

function ok<T>(result: { ok: true; state: DemoState; value: T } | { ok: false; error: string }) {
  if (!result.ok) throw new Error(result.error);
  return result;
}

const withBooking = ok(addVisitorBooking(empty, { serviceId: "corte", professionalId: "rafa", date: tomorrow, startMin: 14 * 60 }, now));

describe("sacola", () => {
  it("soma quantidades do mesmo produto e respeita o estoque", () => {
    const first = ok(addToCart(empty, "po-texturizador"));
    const second = ok(addToCart(first.state, "po-texturizador", 2));
    expect(second.state.cart).toEqual([{ productId: "po-texturizador", qty: 3 }]);
    // O pó começa com 3 unidades: a quarta é recusada.
    expect(addToCart(second.state, "po-texturizador").ok).toBe(false);
  });

  it("quantidade zero tira o produto da sacola", () => {
    const added = ok(addToCart(empty, "gel-forte", 2));
    expect(ok(setCartQty(added.state, "gel-forte", 0)).state.cart).toEqual([]);
  });

  it("Pix tem desconto; pagar na retirada não", () => {
    const items = [{ productId: "pomada-matte", qty: 2 }];
    const price = getProduct("pomada-matte")!.priceCents * 2;
    expect(cartTotals(items, "retirada")).toMatchObject({ subtotalCents: price, discountCents: 0, totalCents: price, count: 2 });
    const pix = cartTotals(items, "pix");
    expect(pix.discountCents).toBe(Math.round((price * PIX_DISCOUNT_PCT) / 100));
    expect(pix.totalCents).toBe(price - pix.discountCents);
  });
});

describe("pedido para retirar", () => {
  it("retira no horário marcado: o painel vê os produtos no horário", () => {
    const cart = ok(addToCart(withBooking.state, "oleo-barba"));
    const order = ok(placeOrder(cart.state, { pickup: { mode: "horario", bookingId: withBooking.value.id }, payment: "retirada" }, now));
    expect(order.value).toMatchObject({ status: "separar", pixStatus: null, totalCents: getProduct("oleo-barba")!.priceCents });
    expect(order.state.cart).toEqual([]);
    expect(productCount(order.state, withBooking.value.id)).toBe(1);
    expect(stockLeft(order.state, "oleo-barba")).toBe(getProduct("oleo-barba")!.stock - 1);
  });

  it("recusa sacola vazia, horário de outra pessoa e dia fechado", () => {
    expect(placeOrder(withBooking.state, { pickup: { mode: "balcao", date: tomorrow }, payment: "pix" }, now).ok).toBe(false);
    const cart = ok(addToCart(withBooking.state, "gel-forte"));
    expect(placeOrder(cart.state, { pickup: { mode: "horario", bookingId: "EX-001" }, payment: "pix" }, now).ok).toBe(false);
    // 2026-10-04 é domingo: barbearia fechada.
    expect(placeOrder(cart.state, { pickup: { mode: "balcao", date: "2026-10-04" }, payment: "pix" }, now).ok).toBe(false);
    expect(counterDays(now)).not.toContain("2026-10-04");
  });

  it("Pix: pendente até pagar; vencido, o pedido é cancelado e o estoque volta", () => {
    const cart = ok(addToCart(empty, "kit-barba"));
    const order = ok(placeOrder(cart.state, { pickup: { mode: "balcao", date: tomorrow }, payment: "pix" }, now, 1_000));
    expect(order.value.pixStatus).toBe("pendente");
    expect(advanceOrder(order.state, order.value.id).ok).toBe(false);
    const swept = sweepExpiredPix(order.state, order.value.pixExpiresAt! + 1);
    expect(swept.orders[0]!.status).toBe("cancelado");
    expect(stockLeft(swept, "kit-barba")).toBe(getProduct("kit-barba")!.stock);
    const paid = ok(payOrderPix(order.state, order.value.id));
    expect(paid.value.pixStatus).toBe("pago");
  });

  it("o painel leva o pedido de separar a pronto a retirado", () => {
    const cart = ok(addToCart(empty, "pente-madeira"));
    const order = ok(placeOrder(cart.state, { pickup: { mode: "balcao", date: tomorrow }, payment: "retirada" }, now));
    const ready = ok(advanceOrder(order.state, order.value.id));
    expect(ready.value.status).toBe("pronto");
    const done = ok(advanceOrder(ready.state, order.value.id));
    expect(done.value.status).toBe("retirado");
    expect(advanceOrder(done.state, order.value.id).ok).toBe(false);
    expect(cancelOrder(done.state, order.value.id).ok).toBe(false);
  });

  it("se o cliente cancela o horário, a compra passa para o balcão no mesmo dia", () => {
    const cart = ok(addToCart(withBooking.state, "pomada-matte"));
    const order = ok(placeOrder(cart.state, { pickup: { mode: "horario", bookingId: withBooking.value.id }, payment: "retirada" }, now));
    const cancelled = ok(cancelByCustomer(order.state, withBooking.value.id, now));
    expect(cancelled.state.orders[0]!.pickup).toEqual({ mode: "balcao", date: tomorrow });
    expect(ordersForBooking(cancelled.state, withBooking.value.id)).toEqual([]);
  });
});

describe("dados de exemplo", () => {
  it("a agenda de exemplo já vem com pedidos e nenhum estoque negativo", () => {
    const state = createInitialState(now);
    expect(state.orders.length).toBeGreaterThan(0);
    for (const product of products) expect(stockLeft(state, product.id)).toBeGreaterThanOrEqual(0);
  });

  it("kits custam menos que os itens avulsos", () => {
    for (const kit of products.filter((p) => p.category === "kits")) {
      expect(kit.priceCents).toBeLessThan(kit.listPriceCents!);
    }
  });
});
