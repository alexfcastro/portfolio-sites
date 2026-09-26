import { listings, neighborhoods, type Listing, type Purpose, type PropertyType } from "@/data/listings";
import { formatBRL } from "@/lib/money";

/*
 * Busca e filtros combinados. Todos os filtros são opcionais e se somam.
 */

export interface Filters {
  purpose: Purpose | "";
  type: PropertyType | "";
  neighborhood: string;
  /** Limites em reais inteiros (o usuário digita reais), convertidos para centavos. */
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number;
  query: string;
}

export type Sort = "relevancia" | "menor-preco" | "maior-preco" | "maior-area";

export const emptyFilters: Filters = { purpose: "", type: "", neighborhood: "", minPrice: null, maxPrice: null, minBedrooms: 0, query: "" };

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function matches(listing: Listing, filters: Filters): boolean {
  if (filters.purpose && listing.purpose !== filters.purpose) return false;
  if (filters.type && listing.type !== filters.type) return false;
  if (filters.neighborhood && listing.neighborhood !== filters.neighborhood) return false;
  if (filters.minPrice !== null && listing.priceCents < filters.minPrice * 100) return false;
  if (filters.maxPrice !== null && listing.priceCents > filters.maxPrice * 100) return false;
  if (filters.minBedrooms > 0 && listing.bedrooms < filters.minBedrooms) return false;
  const query = normalize(filters.query.trim());
  if (query) {
    const haystack = normalize(`${listing.code} ${listing.title} ${listing.neighborhood} ${listing.features.join(" ")}`);
    if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}

export function search(filters: Filters, sort: Sort, source: Listing[] = listings): Listing[] {
  const result = source.filter((listing) => matches(listing, filters));
  const sorted = [...result];
  if (sort === "menor-preco") sorted.sort((a, b) => a.priceCents - b.priceCents);
  else if (sort === "maior-preco") sorted.sort((a, b) => b.priceCents - a.priceCents);
  else if (sort === "maior-area") sorted.sort((a, b) => b.areaM2 - a.areaM2);
  else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  return sorted;
}

/** Faixa de preço invertida (mínimo maior que máximo) é um erro de preenchimento. */
export function priceRangeError(filters: Filters): string | null {
  if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
    return "O preço mínimo está maior que o máximo.";
  }
  return null;
}

export function formatPrice(listing: Listing): string {
  return listing.purpose === "aluguel" ? `${formatBRL(listing.priceCents)}/mês` : formatBRL(listing.priceCents);
}

export function toggleFavorite(list: string[], code: string): string[] {
  return list.includes(code) ? list.filter((item) => item !== code) : [...list, code];
}

/* ---------- formulários (sem dados pessoais) ---------- */

export const interestReasons = ["Quero visitar", "Quero mais informações", "Quero fazer uma proposta"] as const;
export const visitPeriods = ["Manhã", "Tarde", "Fim de semana"] as const;

export function buildInterestMessage(listing: Listing, reason: string, period: string): string {
  return [
    `Olá, Horizonte! Tenho interesse no imóvel ${listing.code}.`,
    "",
    `${listing.title} — ${listing.neighborhood}`,
    `Valor: ${formatPrice(listing)}`,
    `Motivo: ${reason}`,
    `Melhor período: ${period}`,
  ].join("\n");
}

export interface OwnerInput {
  purpose: string;
  type: string;
  neighborhood: string;
  bedrooms: number;
  expectation: string;
}

export function validateOwner(input: OwnerInput): Partial<Record<keyof OwnerInput, string>> {
  const errors: Partial<Record<keyof OwnerInput, string>> = {};
  if (input.purpose !== "venda" && input.purpose !== "aluguel") errors.purpose = "Escolha vender ou alugar.";
  if (!["casa", "apartamento", "sala"].includes(input.type)) errors.type = "Escolha o tipo de imóvel.";
  if (!(neighborhoods as readonly string[]).includes(input.neighborhood)) errors.neighborhood = "Escolha o bairro.";
  if (!Number.isInteger(input.bedrooms) || input.bedrooms < 0 || input.bedrooms > 10) errors.bedrooms = "Informe de 0 a 10 quartos.";
  if (input.expectation.trim().length > 300) errors.expectation = "Use no máximo 300 caracteres.";
  return errors;
}
