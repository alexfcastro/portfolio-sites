/*
 * Horizonte Imóveis é uma imobiliária fictícia. Imóveis, bairros, valores e
 * corretores são exemplos de demonstração; nenhum anúncio é real.
 */

export type Purpose = "venda" | "aluguel";
export type PropertyType = "casa" | "apartamento" | "sala";

export interface Listing {
  code: string;
  title: string;
  purpose: Purpose;
  type: PropertyType;
  neighborhood: string;
  /** Venda: preço total. Aluguel: valor mensal. Em centavos. */
  priceCents: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  areaM2: number;
  description: string;
  features: string[];
  featured: boolean;
  /** Paleta da ilustração (0–3). */
  art: number;
}

export const neighborhoods = ["Jardim das Flores", "Centro", "Parque do Lago", "Vila Nova", "Alto da Colina"] as const;

export const typeLabels: Record<PropertyType, string> = { casa: "Casa", apartamento: "Apartamento", sala: "Sala comercial" };
export const purposeLabels: Record<Purpose, string> = { venda: "Venda", aluguel: "Aluguel" };

export const listings: Listing[] = [
  { code: "HZ-0142", title: "Casa com quintal", purpose: "venda", type: "casa", neighborhood: "Jardim das Flores", priceCents: 64000000, bedrooms: 3, bathrooms: 2, parking: 2, areaM2: 180, description: "Casa térrea com quintal gramado, cozinha integrada e área de serviço coberta.", features: ["Quintal", "Churrasqueira", "Cozinha integrada"], featured: true, art: 0 },
  { code: "HZ-0157", title: "Apartamento perto do metrô", purpose: "aluguel", type: "apartamento", neighborhood: "Centro", priceCents: 230000, bedrooms: 2, bathrooms: 1, parking: 1, areaM2: 62, description: "Apartamento reformado, a poucos minutos de transporte e comércio.", features: ["Reformado", "Portaria 24h", "Varanda"], featured: true, art: 1 },
  { code: "HZ-0163", title: "Casa em condomínio", purpose: "venda", type: "casa", neighborhood: "Parque do Lago", priceCents: 89000000, bedrooms: 4, bathrooms: 3, parking: 2, areaM2: 240, description: "Casa em condomínio com área verde, suíte master e escritório.", features: ["Condomínio fechado", "Suíte", "Escritório"], featured: true, art: 2 },
  { code: "HZ-0171", title: "Studio mobiliado", purpose: "aluguel", type: "apartamento", neighborhood: "Centro", priceCents: 180000, bedrooms: 1, bathrooms: 1, parking: 0, areaM2: 34, description: "Studio mobiliado, ideal para quem mora sozinho.", features: ["Mobiliado", "Lavanderia coletiva"], featured: false, art: 3 },
  { code: "HZ-0178", title: "Sala comercial com recepção", purpose: "aluguel", type: "sala", neighborhood: "Centro", priceCents: 350000, bedrooms: 0, bathrooms: 1, parking: 1, areaM2: 48, description: "Sala com recepção e dois ambientes, em prédio comercial.", features: ["Recepção", "Ar-condicionado"], featured: false, art: 1 },
  { code: "HZ-0184", title: "Apartamento com vista", purpose: "venda", type: "apartamento", neighborhood: "Alto da Colina", priceCents: 52000000, bedrooms: 2, bathrooms: 2, parking: 1, areaM2: 78, description: "Andar alto com vista aberta, sala para dois ambientes e suíte.", features: ["Vista livre", "Suíte", "Academia no prédio"], featured: true, art: 3 },
  { code: "HZ-0190", title: "Casa térrea reformada", purpose: "venda", type: "casa", neighborhood: "Vila Nova", priceCents: 41000000, bedrooms: 2, bathrooms: 1, parking: 1, areaM2: 110, description: "Casa térrea reformada, perto de escolas e mercados.", features: ["Reformada", "Garagem coberta"], featured: false, art: 0 },
  { code: "HZ-0203", title: "Casa com piscina", purpose: "aluguel", type: "casa", neighborhood: "Parque do Lago", priceCents: 620000, bedrooms: 3, bathrooms: 3, parking: 3, areaM2: 260, description: "Casa ampla com piscina, área gourmet e jardim.", features: ["Piscina", "Área gourmet", "Jardim"], featured: false, art: 2 },
  { code: "HZ-0211", title: "Apartamento familiar", purpose: "venda", type: "apartamento", neighborhood: "Jardim das Flores", priceCents: 47500000, bedrooms: 3, bathrooms: 2, parking: 2, areaM2: 92, description: "Três quartos, lazer completo no condomínio e duas vagas.", features: ["Lazer completo", "Duas vagas", "Suíte"], featured: false, art: 1 },
  { code: "HZ-0219", title: "Apartamento compacto", purpose: "aluguel", type: "apartamento", neighborhood: "Vila Nova", priceCents: 150000, bedrooms: 1, bathrooms: 1, parking: 1, areaM2: 40, description: "Compacto e bem iluminado, com uma vaga.", features: ["Bem iluminado", "Uma vaga"], featured: false, art: 3 },
  { code: "HZ-0226", title: "Sala em centro empresarial", purpose: "venda", type: "sala", neighborhood: "Alto da Colina", priceCents: 38000000, bedrooms: 0, bathrooms: 1, parking: 2, areaM2: 55, description: "Sala em centro empresarial com auditório e estacionamento.", features: ["Auditório", "Duas vagas"], featured: false, art: 2 },
  { code: "HZ-0232", title: "Sobrado com três suítes", purpose: "venda", type: "casa", neighborhood: "Alto da Colina", priceCents: 118000000, bedrooms: 3, bathrooms: 4, parking: 3, areaM2: 310, description: "Sobrado com três suítes, varanda gourmet e jardim de inverno.", features: ["Três suítes", "Varanda gourmet", "Jardim de inverno"], featured: true, art: 0 },
];

export const agents = [
  { name: "Marcos Vieira", focus: "Venda de casas e sobrados", initials: "MV" },
  { name: "Juliana Castro", focus: "Locação residencial e comercial", initials: "JC" },
];

export function getListing(code: string): Listing | undefined {
  return listings.find((listing) => listing.code === code.toUpperCase());
}
