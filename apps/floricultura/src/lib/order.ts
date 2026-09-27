import {
  addons,
  CARD_MAX_CHARS,
  CARD_MAX_LINES,
  DATE_WINDOW_DAYS,
  getProduct,
  periods,
  products,
  regions,
  SAME_DAY_CUTOFF_MIN,
  type Addon,
  type CategoryId,
  type Period,
  type Product,
  type SizeId,
} from "@/data/shop";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, getWeekday, type BusinessNow } from "@/lib/time";

/* Regras do pedido de flores: preço em centavos, adicionais compatíveis, cartão, data e período. */

export function addonAllowed(product: Product, addon: Addon): boolean {
  // Só bloqueia quando todas as ocasiões do produto estão na lista (ex.: arranjo só de condolências).
  const occasionClash = addon.notFor !== undefined && product.occasionIds.every((o) => addon.notFor!.includes(o));
  const categoryClash = addon.notInCategories?.includes(product.categoryId);
  return !occasionClash && !categoryClash;
}

export function allowedAddons(product: Product): Addon[] {
  return addons.filter((addon) => addonAllowed(product, addon));
}

export function validateAddons(product: Product, addonIds: readonly string[]): string | null {
  if (new Set(addonIds).size !== addonIds.length) return "Adicional repetido.";
  for (const id of addonIds) {
    const addon = addons.find((a) => a.id === id);
    if (!addon) return "Adicional não encontrado.";
    if (!addonAllowed(product, addon)) return `${addon.name} não está disponível para este produto.`;
  }
  return null;
}

export function priceFor(product: Product, sizeId: SizeId, addonIds: readonly string[]) {
  const size = product.sizes.find((s) => s.id === sizeId);
  if (!size) throw new Error("Tamanho inválido.");
  const extras = addonIds.reduce((sum, id) => sum + (addons.find((a) => a.id === id)?.priceCents ?? 0), 0);
  return { base: size.priceCents, extras, subtotal: size.priceCents + extras };
}

export function validateCard(text: string): string | null {
  if (text.length > CARD_MAX_CHARS) return `Use no máximo ${CARD_MAX_CHARS} caracteres.`;
  if (text.split("\n").length > CARD_MAX_LINES) return `Use no máximo ${CARD_MAX_LINES} linhas.`;
  return null;
}

/** Datas com entrega ou retirada: sem domingo, dentro da janela. */
export function availableDates(now: BusinessNow): string[] {
  return Array.from({ length: DATE_WINDOW_DAYS }, (_, i) => addDays(now.date, i)).filter(
    (date) => getWeekday(date) !== 0 && availablePeriods(date, now).length > 0,
  );
}

export function availablePeriods(date: string, now: BusinessNow): Period[] {
  if (getWeekday(date) === 0 || date < now.date || date > addDays(now.date, DATE_WINDOW_DAYS - 1)) return [];
  if (date === now.date) return now.minutes <= SAME_DAY_CUTOFF_MIN ? ["tarde"] : [];
  return ["manha", "tarde"];
}

export type Fulfillment = "entrega" | "retirada";

export interface OrderDraft {
  productId: string;
  sizeId: SizeId | "";
  addonIds: string[];
  card: string;
  fulfillment: Fulfillment | "";
  regionId: string;
  date: string;
  period: Period | "";
  /** Nome de quem recebe (entrega) ou retira (retirada). Demonstração: nome fictício. */
  personName: string;
}

export type DraftErrors = Partial<Record<keyof OrderDraft, string>>;

export function validateDraft(draft: OrderDraft, now: BusinessNow): DraftErrors {
  const errors: DraftErrors = {};
  const product = getProduct(draft.productId);
  if (!product) return { productId: "Produto não encontrado." };
  if (!product.sizes.some((s) => s.id === draft.sizeId)) errors.sizeId = "Escolha um tamanho.";
  const addonError = validateAddons(product, draft.addonIds);
  if (addonError) errors.addonIds = addonError;
  const cardError = validateCard(draft.card);
  if (cardError) errors.card = cardError;
  if (draft.fulfillment !== "entrega" && draft.fulfillment !== "retirada") errors.fulfillment = "Escolha entrega ou retirada.";
  if (draft.fulfillment === "entrega" && !regions.some((r) => r.id === draft.regionId)) errors.regionId = "Escolha o bairro.";
  if (!availableDates(now).includes(draft.date)) errors.date = "Escolha uma data disponível.";
  else if (!draft.period || !availablePeriods(draft.date, now).includes(draft.period)) errors.period = "Escolha um período disponível.";
  const name = draft.personName.trim();
  if (!name) errors.personName = draft.fulfillment === "retirada" ? "Informe quem vai retirar." : "Informe quem vai receber.";
  else if (name.length > 40) errors.personName = "Use no máximo 40 caracteres.";
  return errors;
}

export function totalsFor(draft: OrderDraft) {
  const product = getProduct(draft.productId)!;
  const { base, extras, subtotal } = priceFor(product, draft.sizeId as SizeId, draft.addonIds);
  const delivery = draft.fulfillment === "entrega" ? (regions.find((r) => r.id === draft.regionId)?.feeCents ?? 0) : 0;
  return { base, extras, delivery, total: subtotal + delivery };
}

export function buildOrderMessage(draft: OrderDraft, code: string): string {
  const product = getProduct(draft.productId)!;
  const size = product.sizes.find((s) => s.id === draft.sizeId)!;
  const extras = draft.addonIds.map((id) => addons.find((a) => a.id === id)!.name);
  const totals = totalsFor(draft);
  const when = `${formatDateLong(draft.date)}, ${periods[draft.period as Period].label.toLowerCase()}`;
  const region = regions.find((r) => r.id === draft.regionId);
  return [
    `Olá, Flor & Afeto! Pedido de demonstração ${code}:`,
    `${product.name} — ${size.label.toLowerCase()} (${size.detail})`,
    extras.length ? `Adicionais: ${extras.join(", ")}` : "Sem adicionais",
    draft.card.trim() ? `Cartão: "${draft.card.trim()}"` : "Cartão sem mensagem",
    draft.fulfillment === "entrega"
      ? `Entrega para ${draft.personName.trim()} em ${region?.name}: ${when}`
      : `Retirada por ${draft.personName.trim()}: ${when}`,
    `Total: ${formatBRL(totals.total)}`,
  ].join("\n");
}

/* ---------- Catálogo ---------- */

export interface CatalogFilters {
  query: string;
  occasionId: string | "todas";
  categoryId: CategoryId | "todas";
  /** Faixa pelo menor preço do produto, em centavos. */
  maxPriceCents: number | null;
}

export function minPrice(product: Product): number {
  return Math.min(...product.sizes.map((s) => s.priceCents));
}

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filterProducts(filters: CatalogFilters): Product[] {
  const words = normalize(filters.query).split(/\s+/).filter(Boolean);
  return products.filter(
    (p) =>
      (filters.occasionId === "todas" || p.occasionIds.includes(filters.occasionId)) &&
      (filters.categoryId === "todas" || p.categoryId === filters.categoryId) &&
      (filters.maxPriceCents === null || minPrice(p) <= filters.maxPriceCents) &&
      words.every((w) => normalize(`${p.name} ${p.description}`).includes(w)),
  );
}
