import { FREE_DELIVERY_FROM_CENTS, getProduct, MAX_QUANTITY, products, regions, type Product, type Tag } from "@/data/catalog";
import { formatBRL } from "@/lib/money";

/*
 * Regras de preço e carrinho. Tudo em inteiros: centavos e gramas.
 * Arredondamento explícito: para o centavo mais próximo, com meio centavo para cima.
 */

/** Divide com arredondamento "meio para cima" (valores não negativos). */
export function divRound(numerator: number, denominator: number): number {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("Use inteiros não negativos.");
  }
  return Math.floor((numerator * 2 + denominator) / (denominator * 2));
}

export function formatWeight(grams: number): string {
  return grams >= 1000 ? `${(grams / 1000).toLocaleString("pt-BR")} kg` : `${grams} g`;
}

/** Preço de tabela de uma opção (peso em gramas ou unidade), antes de promoção. */
export function listPrice(product: Product, grams: number | null): number {
  if (product.sale.kind === "unidade") return product.sale.priceCents;
  if (grams === null) throw new Error("Produto vendido por peso precisa de gramas.");
  return divRound(product.sale.pricePerKgCents * grams, 1000);
}

/** Preço com promoção aplicada, arredondado ao centavo. */
export function unitPrice(product: Product, grams: number | null): number {
  const base = listPrice(product, grams);
  const off = product.promoPercent ?? 0;
  return base - divRound(base * off, 100);
}

/** Menor preço exibido no card ("a partir de"). */
export function fromPrice(product: Product): { cents: number; label: string } {
  if (product.sale.kind === "unidade") return { cents: unitPrice(product, null), label: product.sale.unitLabel };
  const grams = product.sale.options[0]!;
  return { cents: unitPrice(product, grams), label: formatWeight(grams) };
}

export interface CartLine {
  productId: string;
  /** Gramas por embalagem; `null` para produtos vendidos por unidade. */
  grams: number | null;
  quantity: number;
}

export function validateLine(line: CartLine): string | null {
  const product = getProduct(line.productId);
  if (!product) return "Produto não encontrado.";
  if (product.stock === "esgotado") return "Produto esgotado no momento.";
  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY) {
    return `Escolha de 1 a ${MAX_QUANTITY} unidades.`;
  }
  if (product.sale.kind === "unidade") return line.grams === null ? null : "Este produto é vendido por unidade.";
  if (line.grams === null || !product.sale.options.includes(line.grams as never)) return "Escolha um dos pesos disponíveis.";
  return null;
}

/** Adiciona ao carrinho; mesmo produto e peso somam quantidade (limitada ao máximo). */
export function addLine(cart: readonly CartLine[], line: CartLine): { ok: true; cart: CartLine[] } | { ok: false; error: string } {
  const error = validateLine(line);
  if (error) return { ok: false, error };
  const index = cart.findIndex((l) => l.productId === line.productId && l.grams === line.grams);
  if (index === -1) return { ok: true, cart: [...cart, line] };
  const quantity = cart[index]!.quantity + line.quantity;
  if (quantity > MAX_QUANTITY) return { ok: false, error: `O limite é de ${MAX_QUANTITY} unidades por item.` };
  return { ok: true, cart: cart.map((l, i) => (i === index ? { ...l, quantity } : l)) };
}

export function setQuantity(cart: readonly CartLine[], index: number, quantity: number): CartLine[] {
  if (quantity < 1) return cart.filter((_, i) => i !== index);
  const clamped = Math.min(MAX_QUANTITY, Math.floor(quantity));
  return cart.map((l, i) => (i === index ? { ...l, quantity: clamped } : l));
}

export function lineTotal(line: CartLine): number {
  return unitPrice(getProduct(line.productId)!, line.grams) * line.quantity;
}

export type Fulfillment = { kind: "retirada" } | { kind: "entrega"; regionId: string };

export interface Totals {
  subtotal: number;
  savings: number;
  delivery: number;
  total: number;
  /** Peso total dos itens a granel, em gramas. */
  grams: number;
}

export function computeTotals(cart: readonly CartLine[], fulfillment: Fulfillment | null): Totals {
  const valid = cart.filter((l) => validateLine(l) === null);
  const subtotal = valid.reduce((sum, l) => sum + lineTotal(l), 0);
  const savings = valid.reduce((sum, l) => sum + (listPrice(getProduct(l.productId)!, l.grams) - unitPrice(getProduct(l.productId)!, l.grams)) * l.quantity, 0);
  const grams = valid.reduce((sum, l) => sum + (l.grams ?? 0) * l.quantity, 0);
  let delivery = 0;
  if (fulfillment?.kind === "entrega" && subtotal < FREE_DELIVERY_FROM_CENTS) {
    delivery = regions.find((r) => r.id === fulfillment.regionId)?.feeCents ?? 0;
  }
  return { subtotal, savings, delivery, total: subtotal + delivery, grams };
}

export function validateOrder(cart: readonly CartLine[], fulfillment: Fulfillment | null): string | null {
  if (cart.length === 0) return "Seu carrinho está vazio.";
  const invalid = cart.find((l) => validateLine(l) !== null);
  if (invalid) return `Revise o item "${getProduct(invalid.productId)?.name ?? invalid.productId}": ${validateLine(invalid)}`;
  if (!fulfillment) return "Escolha retirada ou entrega.";
  if (fulfillment.kind === "entrega" && !regions.some((r) => r.id === fulfillment.regionId)) return "Escolha o bairro de entrega.";
  return null;
}

export function describeLine(line: CartLine): string {
  const product = getProduct(line.productId)!;
  const size = product.sale.kind === "unidade" ? product.sale.unitLabel : formatWeight(line.grams!);
  return `${line.quantity}× ${product.name} (${size}) — ${formatBRL(lineTotal(line))}`;
}

export function buildOrderMessage(cart: readonly CartLine[], fulfillment: Fulfillment, code: string): string {
  const totals = computeTotals(cart, fulfillment);
  const region = fulfillment.kind === "entrega" ? regions.find((r) => r.id === fulfillment.regionId) : null;
  return [
    `Olá, Raiz & Grão! Pedido de demonstração ${code}:`,
    ...cart.map((l) => `• ${describeLine(l)}`),
    `Subtotal: ${formatBRL(totals.subtotal)}`,
    fulfillment.kind === "retirada"
      ? "Retirada na loja"
      : `Entrega em ${region?.name}: ${totals.delivery === 0 ? "grátis" : formatBRL(totals.delivery)}`,
    `Total: ${formatBRL(totals.total)}`,
  ].join("\n");
}

/* ---------- Catálogo ---------- */

export type Sort = "relevancia" | "menor-preco" | "maior-preco" | "nome";

export interface CatalogFilters {
  query: string;
  categoryId: string | "todas";
  tags: Tag[];
  onlyPromo: boolean;
  sort: Sort;
}

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function searchProducts(filters: CatalogFilters): Product[] {
  const words = normalize(filters.query).split(/\s+/).filter(Boolean);
  const result = products.filter(
    (p) =>
      (filters.categoryId === "todas" || p.categoryId === filters.categoryId) &&
      filters.tags.every((tag) => p.tags.includes(tag)) &&
      (!filters.onlyPromo || (p.promoPercent ?? 0) > 0) &&
      words.every((word) => normalize(`${p.name} ${p.info.ingredientes}`).includes(word)),
  );
  // Por padrão, esgotados vão para o fim.
  const rank = (p: Product) => (p.stock === "esgotado" ? 1 : 0);
  const byPrice = (p: Product) => fromPrice(p).cents;
  return [...result].sort((a, b) => {
    if (filters.sort === "menor-preco") return byPrice(a) - byPrice(b);
    if (filters.sort === "maior-preco") return byPrice(b) - byPrice(a);
    if (filters.sort === "nome") return a.name.localeCompare(b.name, "pt-BR");
    return rank(a) - rank(b);
  });
}
