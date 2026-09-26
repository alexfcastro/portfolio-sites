/*
 * Sabor & Brasa é um restaurante fictício. Cardápio, preços, bairros, taxas e
 * horários são dados de demonstração. Preços sempre em centavos.
 */

export interface AddonOption {
  id: string;
  name: string;
  priceCents: number;
}

export interface AddonGroup {
  id: string;
  name: string;
  /** Mínimo e máximo de opções escolhidas. `min > 0` torna o grupo obrigatório. */
  min: number;
  max: number;
  options: AddonOption[];
}

export type PlateArt = "picanha" | "costela" | "frango" | "linguica" | "arroz" | "farofa" | "mandioca" | "salada" | "refri" | "suco" | "agua" | "pudim" | "brownie";

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceCents: number;
  addonGroupIds: string[];
  art: PlateArt;
  highlight?: boolean;
}

export const categories = [
  { id: "carnes", name: "Carnes na brasa" },
  { id: "acompanhamentos", name: "Acompanhamentos" },
  { id: "bebidas", name: "Bebidas" },
  { id: "sobremesas", name: "Sobremesas" },
] as const;

export const addonGroups: AddonGroup[] = [
  {
    id: "ponto",
    name: "Ponto da carne",
    min: 1,
    max: 1,
    options: [
      { id: "mal", name: "Mal passada", priceCents: 0 },
      { id: "ponto", name: "Ao ponto", priceCents: 0 },
      { id: "bem", name: "Bem passada", priceCents: 0 },
    ],
  },
  {
    id: "extras",
    name: "Acompanhamentos extras",
    min: 0,
    max: 3,
    options: [
      { id: "farofa", name: "Farofa da casa", priceCents: 600 },
      { id: "vinagrete", name: "Vinagrete", priceCents: 400 },
      { id: "mandioca", name: "Mandioca frita", priceCents: 900 },
      { id: "arroz", name: "Arroz branco", priceCents: 700 },
    ],
  },
  {
    id: "tamanho-suco",
    name: "Tamanho",
    min: 1,
    max: 1,
    options: [
      { id: "300", name: "300 ml", priceCents: 0 },
      { id: "500", name: "500 ml", priceCents: 400 },
    ],
  },
  {
    id: "sabor-suco",
    name: "Sabor",
    min: 1,
    max: 1,
    options: [
      { id: "laranja", name: "Laranja", priceCents: 0 },
      { id: "maracuja", name: "Maracujá", priceCents: 0 },
      { id: "limao", name: "Limão", priceCents: 0 },
    ],
  },
  {
    id: "calda",
    name: "Cobertura extra",
    min: 0,
    max: 1,
    options: [{ id: "sorvete", name: "Bola de sorvete", priceCents: 800 }],
  },
];

export const menu: MenuItem[] = [
  {
    id: "picanha",
    categoryId: "carnes",
    name: "Picanha na brasa",
    description: "400 g, servida fatiada com sal grosso.",
    priceCents: 8990,
    addonGroupIds: ["ponto", "extras"],
    art: "picanha",
    highlight: true,
  },
  {
    id: "costela",
    categoryId: "carnes",
    name: "Costela assada",
    description: "Assada lentamente por 8 horas.",
    priceCents: 7490,
    addonGroupIds: ["extras"],
    art: "costela",
  },
  {
    id: "frango",
    categoryId: "carnes",
    name: "Frango na brasa",
    description: "Meio frango temperado com ervas.",
    priceCents: 5290,
    addonGroupIds: ["extras"],
    art: "frango",
  },
  {
    id: "linguica",
    categoryId: "carnes",
    name: "Linguiça artesanal",
    description: "Três gomos com cebola na chapa.",
    priceCents: 3890,
    addonGroupIds: ["ponto", "extras"],
    art: "linguica",
  },
  { id: "arroz", categoryId: "acompanhamentos", name: "Arroz biro-biro", description: "Com ovo, bacon e batata palha.", priceCents: 2290, addonGroupIds: [], art: "arroz" },
  { id: "farofa", categoryId: "acompanhamentos", name: "Farofa da casa", description: "Com banana e cebola dourada.", priceCents: 1490, addonGroupIds: [], art: "farofa" },
  { id: "mandioca", categoryId: "acompanhamentos", name: "Mandioca frita", description: "Porção para duas pessoas.", priceCents: 2190, addonGroupIds: [], art: "mandioca" },
  { id: "salada", categoryId: "acompanhamentos", name: "Salada da estação", description: "Folhas, tomate e cebola roxa.", priceCents: 1890, addonGroupIds: [], art: "salada" },
  { id: "refri", categoryId: "bebidas", name: "Refrigerante lata", description: "350 ml.", priceCents: 700, addonGroupIds: [], art: "refri" },
  {
    id: "suco",
    categoryId: "bebidas",
    name: "Suco natural",
    description: "Feito na hora.",
    priceCents: 1100,
    addonGroupIds: ["sabor-suco", "tamanho-suco"],
    art: "suco",
  },
  { id: "agua", categoryId: "bebidas", name: "Água mineral", description: "500 ml, com ou sem gás.", priceCents: 500, addonGroupIds: [], art: "agua" },
  { id: "pudim", categoryId: "sobremesas", name: "Pudim de leite", description: "Receita da casa.", priceCents: 1600, addonGroupIds: [], art: "pudim" },
  {
    id: "brownie",
    categoryId: "sobremesas",
    name: "Brownie",
    description: "Com calda de chocolate.",
    priceCents: 1800,
    addonGroupIds: ["calda"],
    art: "brownie",
    highlight: true,
  },
];

/** Bairros ilustrativos atendidos, com taxa de entrega. */
export const deliveryAreas = [
  { id: "centro", name: "Centro", feeCents: 590 },
  { id: "jardim", name: "Jardim das Palmeiras", feeCents: 790 },
  { id: "vila", name: "Vila Nova", feeCents: 890 },
  { id: "parque", name: "Parque do Lago", feeCents: 1090 },
];

export const MIN_DELIVERY_CENTS = 4000;

/** Funcionamento por dia (0 = domingo); segunda fechado. Minutos desde a meia-noite. */
export const openingHours: Record<number, Array<[number, number]>> = {
  0: [[11 * 60 + 30, 16 * 60]],
  1: [],
  2: [[11 * 60 + 30, 15 * 60], [18 * 60 + 30, 23 * 60]],
  3: [[11 * 60 + 30, 15 * 60], [18 * 60 + 30, 23 * 60]],
  4: [[11 * 60 + 30, 15 * 60], [18 * 60 + 30, 23 * 60]],
  5: [[11 * 60 + 30, 15 * 60], [18 * 60 + 30, 23 * 60 + 30]],
  6: [[11 * 60 + 30, 16 * 60], [18 * 60 + 30, 23 * 60 + 30]],
};

/** Identidade e endereço fictícios usados nos pedidos da demo. */
export const demoCustomer = { name: "Cliente de demonstração", address: "Rua Ilustrativa, 100 (endereço de exemplo)" };

export function getItem(id: string): MenuItem | undefined {
  return menu.find((item) => item.id === id);
}

export function getGroup(id: string): AddonGroup | undefined {
  return addonGroups.find((group) => group.id === id);
}
