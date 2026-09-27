/*
 * Flor & Afeto é uma floricultura fictícia. Produtos, preços, bairros e horários
 * são dados de demonstração, centralizados aqui. Preços em centavos.
 */

export interface Occasion {
  id: string;
  name: string;
}

export const occasions: Occasion[] = [
  { id: "aniversario", name: "Aniversário" },
  { id: "amor", name: "Amor" },
  { id: "maternidade", name: "Maternidade" },
  { id: "agradecimento", name: "Agradecimento" },
  { id: "condolencias", name: "Condolências" },
];

export const categories = [
  { id: "buques", name: "Buquês" },
  { id: "arranjos", name: "Arranjos" },
  { id: "cestas", name: "Cestas" },
  { id: "plantas", name: "Plantas" },
] as const;
export type CategoryId = (typeof categories)[number]["id"];

export type SizeId = "p" | "m" | "g";

export interface Size {
  id: SizeId;
  label: string;
  detail: string;
  priceCents: number;
}

export interface FlowerArt {
  petals: string;
  center: string;
  leaves: string;
  wrap: string;
  kind: "buque" | "arranjo" | "cesta" | "vaso";
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  occasionIds: string[];
  description: string;
  sizes: Size[];
  featured?: boolean;
  art: FlowerArt;
}

const sizes = (p: number, m: number, g: number, unit = "hastes"): Size[] => [
  { id: "p", label: "Pequeno", detail: `6 ${unit}`, priceCents: p },
  { id: "m", label: "Médio", detail: `12 ${unit}`, priceCents: m },
  { id: "g", label: "Grande", detail: `24 ${unit}`, priceCents: g },
];

export const products: Product[] = [
  {
    id: "buque-rosas-vermelhas",
    name: "Buquê de rosas vermelhas",
    categoryId: "buques",
    occasionIds: ["amor", "aniversario"],
    description: "Rosas vermelhas com folhagens verdes, envoltas em papel kraft e laço de cetim.",
    sizes: sizes(12990, 19990, 34990),
    featured: true,
    art: { petals: "#b3263a", center: "#7d1627", leaves: "#5f7f5a", wrap: "#e8d3b9", kind: "buque" },
  },
  {
    id: "buque-campo",
    name: "Buquê do campo",
    categoryId: "buques",
    occasionIds: ["aniversario", "agradecimento", "maternidade"],
    description: "Margaridas, lisianthus e flores miúdas da estação, em tons claros.",
    sizes: sizes(9990, 15990, 24990),
    featured: true,
    art: { petals: "#f4eadf", center: "#e8b53a", leaves: "#7e9a6d", wrap: "#d9c5e8", kind: "buque" },
  },
  {
    id: "buque-girassois",
    name: "Buquê de girassóis",
    categoryId: "buques",
    occasionIds: ["aniversario", "agradecimento"],
    description: "Girassóis com folhagens, para um presente alegre e luminoso.",
    sizes: sizes(10990, 16990, 27990),
    art: { petals: "#f2b92c", center: "#6b4424", leaves: "#6f8f4f", wrap: "#f1e3cf", kind: "buque" },
  },
  {
    id: "arranjo-rosa-antigo",
    name: "Arranjo rosa-antigo",
    categoryId: "arranjos",
    occasionIds: ["amor", "maternidade", "aniversario"],
    description: "Rosas e cravos em tons de rosa-antigo, montados em caixa de papelão rígido.",
    sizes: sizes(14990, 21990, 32990, "flores"),
    featured: true,
    art: { petals: "#d49aa0", center: "#a5616b", leaves: "#8aa38a", wrap: "#f3e6e3", kind: "arranjo" },
  },
  {
    id: "arranjo-branco-sereno",
    name: "Arranjo branco sereno",
    categoryId: "arranjos",
    occasionIds: ["condolencias"],
    description: "Lírios e rosas brancas com folhagens, em composição discreta.",
    sizes: sizes(16990, 23990, 35990, "flores"),
    art: { petals: "#f7f4ee", center: "#d9d2a4", leaves: "#6f8a74", wrap: "#e6e9e3", kind: "arranjo" },
  },
  {
    id: "cesta-cafe",
    name: "Cesta café com flores",
    categoryId: "cestas",
    occasionIds: ["aniversario", "maternidade", "agradecimento"],
    description: "Mini buquê, geleia, biscoitos e chá, em cesta de vime. Itens de exemplo.",
    sizes: [
      { id: "p", label: "Pequena", detail: "5 itens", priceCents: 15990 },
      { id: "m", label: "Média", detail: "8 itens", priceCents: 22990 },
      { id: "g", label: "Grande", detail: "12 itens", priceCents: 31990 },
    ],
    featured: true,
    art: { petals: "#e9a3b4", center: "#c9677f", leaves: "#7e9a6d", wrap: "#c89a63", kind: "cesta" },
  },
  {
    id: "orquidea",
    name: "Orquídea em vaso",
    categoryId: "plantas",
    occasionIds: ["agradecimento", "maternidade", "condolencias"],
    description: "Orquídea com hastes floridas em cachepô de cerâmica.",
    sizes: [
      { id: "p", label: "Uma haste", detail: "cachepô 12 cm", priceCents: 11990 },
      { id: "m", label: "Duas hastes", detail: "cachepô 15 cm", priceCents: 17990 },
      { id: "g", label: "Três hastes", detail: "cachepô 18 cm", priceCents: 25990 },
    ],
    art: { petals: "#c48bc0", center: "#8c4f88", leaves: "#4f7a54", wrap: "#efe8e1", kind: "vaso" },
  },
];

export interface Addon {
  id: string;
  name: string;
  priceCents: number;
  /** Ocasiões em que o adicional não combina (ex.: balão em condolências). */
  notFor?: string[];
  /** Categorias em que o adicional não se aplica. */
  notInCategories?: CategoryId[];
}

export const addons: Addon[] = [
  { id: "chocolates", name: "Caixa de chocolates", priceCents: 3490 },
  { id: "balao", name: "Balão metalizado", priceCents: 1990, notFor: ["condolencias"] },
  { id: "pelucia", name: "Ursinho de pelúcia", priceCents: 4490, notFor: ["condolencias"] },
  { id: "vaso-vidro", name: "Vaso de vidro", priceCents: 3990, notInCategories: ["arranjos", "cestas", "plantas"] },
];

export interface Region {
  id: string;
  name: string;
  feeCents: number;
}

/** Bairros fictícios atendidos. */
export const regions: Region[] = [
  { id: "jardim-primavera", name: "Jardim Primavera", feeCents: 1500 },
  { id: "vila-das-rosas", name: "Vila das Rosas", feeCents: 1800 },
  { id: "alto-da-colina", name: "Alto da Colina", feeCents: 2500 },
];

export type Period = "manha" | "tarde";
export const periods: Record<Period, { label: string; startMin: number; endMin: number }> = {
  manha: { label: "Manhã (8h às 12h)", startMin: 8 * 60, endMin: 12 * 60 },
  tarde: { label: "Tarde (13h às 18h)", startMin: 13 * 60, endMin: 18 * 60 },
};

/** Pedido para o mesmo dia só até este horário, e apenas para a tarde. */
export const SAME_DAY_CUTOFF_MIN = 11 * 60;
export const DATE_WINDOW_DAYS = 14;
export const CARD_MAX_CHARS = 200;
export const CARD_MAX_LINES = 6;

export const storeHours = [
  ["Segunda a sábado", "8h às 18h"],
  ["Domingo", "Fechado, sem entregas"],
] as const;

export const faq = [
  { q: "Posso escolher o horário exato?", a: "Trabalhamos com períodos: manhã ou tarde. Pedidos para hoje só para a tarde e até as 11h." },
  { q: "A mensagem do cartão vai assinada?", a: "Vai exatamente como você escrever. Se preferir, deixe em branco e o cartão segue sem texto." },
  { q: "Vocês entregam no domingo?", a: "Não. Nesta demonstração, domingo não aparece como data disponível." },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
