import { deliveryAreas, getGroup, getItem, MIN_DELIVERY_CENTS, openingHours, type MenuItem } from "@/data/menu";
import { getWeekday, type BusinessNow } from "@/lib/time";

/*
 * Regras do carrinho: tudo em centavos inteiros. Um item só aceita adicionais dos
 * grupos declarados para ele, respeitando mínimo e máximo de cada grupo.
 */

export const MAX_QUANTITY = 20;

/** Adicionais escolhidos: grupo → ids das opções. */
export type AddonSelection = Record<string, string[]>;

export interface CartLine {
  key: string;
  itemId: string;
  addons: AddonSelection;
  quantity: number;
  note: string;
}

export type Fulfillment = { type: "retirada" } | { type: "entrega"; areaId: string };

export function validateAddons(item: MenuItem, addons: AddonSelection): string | null {
  for (const groupId of Object.keys(addons)) {
    if (!item.addonGroupIds.includes(groupId)) return `“${getGroup(groupId)?.name ?? groupId}” não se aplica a ${item.name}.`;
  }
  for (const groupId of item.addonGroupIds) {
    const group = getGroup(groupId);
    if (!group) return "Adicional inválido.";
    const chosen = addons[groupId] ?? [];
    if (new Set(chosen).size !== chosen.length) return `Opção repetida em ${group.name}.`;
    if (chosen.some((id) => !group.options.some((option) => option.id === id))) return `Opção inválida em ${group.name}.`;
    if (chosen.length < group.min) return `Escolha ${group.name.toLowerCase()}.`;
    if (chosen.length > group.max) return `Escolha no máximo ${group.max} em ${group.name.toLowerCase()}.`;
  }
  return null;
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
}

export function unitPriceCents(item: MenuItem, addons: AddonSelection): number {
  let total = item.priceCents;
  for (const [groupId, optionIds] of Object.entries(addons)) {
    const group = getGroup(groupId);
    for (const optionId of optionIds) total += group?.options.find((option) => option.id === optionId)?.priceCents ?? 0;
  }
  return total;
}

export function lineTotalCents(line: CartLine): number {
  const item = getItem(line.itemId);
  return item ? unitPriceCents(item, line.addons) * line.quantity : 0;
}

/** Mesma configuração (item + adicionais + observação) vira a mesma linha. */
export function lineKey(itemId: string, addons: AddonSelection, note: string): string {
  const normalized = Object.keys(addons)
    .sort()
    .map((groupId) => `${groupId}:${[...(addons[groupId] ?? [])].sort().join(",")}`)
    .join("|");
  return `${itemId}#${normalized}#${note.trim().toLowerCase()}`;
}

export type CartResult = { ok: true; lines: CartLine[] } | { ok: false; error: string };

export function addToCart(
  lines: CartLine[],
  itemId: string,
  addons: AddonSelection,
  quantity: number,
  note = "",
): CartResult {
  const item = getItem(itemId);
  if (!item) return { ok: false, error: "Item não encontrado." };
  if (!isValidQuantity(quantity)) return { ok: false, error: `Quantidade deve ser de 1 a ${MAX_QUANTITY}.` };
  if (note.length > 140) return { ok: false, error: "Observação com no máximo 140 caracteres." };
  const error = validateAddons(item, addons);
  if (error) return { ok: false, error };

  const key = lineKey(itemId, addons, note);
  const existing = lines.find((line) => line.key === key);
  if (existing) {
    const total = existing.quantity + quantity;
    if (total > MAX_QUANTITY) return { ok: false, error: `No máximo ${MAX_QUANTITY} unidades por item.` };
    return { ok: true, lines: lines.map((line) => (line.key === key ? { ...line, quantity: total } : line)) };
  }
  return { ok: true, lines: [...lines, { key, itemId, addons, quantity, note: note.trim() }] };
}

export function setQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((line) => line.key !== key);
  const safe = Math.min(MAX_QUANTITY, Math.floor(quantity));
  return lines.map((line) => (line.key === key ? { ...line, quantity: safe } : line));
}

export interface OrderSummary {
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  error: string | null;
}

export function summarize(lines: CartLine[], fulfillment: Fulfillment): OrderSummary {
  const subtotalCents = lines.reduce((total, line) => total + lineTotalCents(line), 0);
  if (lines.length === 0) return { subtotalCents, deliveryFeeCents: 0, totalCents: 0, error: "O carrinho está vazio." };
  if (fulfillment.type === "retirada") return { subtotalCents, deliveryFeeCents: 0, totalCents: subtotalCents, error: null };

  const area = deliveryAreas.find((item) => item.id === fulfillment.areaId);
  if (!area) return { subtotalCents, deliveryFeeCents: 0, totalCents: subtotalCents, error: "Escolha o bairro de entrega." };
  const error =
    subtotalCents < MIN_DELIVERY_CENTS ? "Pedido mínimo para entrega não atingido. Adicione itens ou escolha retirada." : null;
  return { subtotalCents, deliveryFeeCents: area.feeCents, totalCents: subtotalCents + area.feeCents, error };
}

export function isOpen(now: BusinessNow): boolean {
  return (openingHours[getWeekday(now.date)] ?? []).some(([start, end]) => now.minutes >= start && now.minutes < end);
}
