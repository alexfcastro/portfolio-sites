/*
 * Raiz & Grão é uma loja fictícia. Produtos, preços, estoque e regiões de entrega
 * são dados de demonstração, centralizados aqui. Preços em centavos; pesos em
 * gramas inteiras. Textos sem alegações de saúde: só uso, conservação e origem.
 */

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "temperos", name: "Temperos" },
  { id: "chas", name: "Chás e ervas" },
  { id: "graos", name: "Grãos e cereais" },
  { id: "castanhas", name: "Castanhas" },
  { id: "frutas-secas", name: "Frutas secas" },
  { id: "farinhas", name: "Farinhas" },
  { id: "sementes", name: "Sementes" },
  { id: "granolas", name: "Granolas" },
  { id: "mel", name: "Mel e pastas" },
  { id: "kits", name: "Kits" },
];

export type Tag = "vegano" | "sem-gluten" | "sem-acucar" | "integral";
export const tagLabels: Record<Tag, string> = {
  vegano: "Vegano",
  "sem-gluten": "Sem glúten",
  "sem-acucar": "Sem açúcar adicionado",
  integral: "Integral",
};

/** Opções de peso oferecidas para produtos a granel, em gramas. */
export const WEIGHT_OPTIONS = [100, 250, 500, 1000] as const;
export type Grams = (typeof WEIGHT_OPTIONS)[number];

export type Sale =
  | { kind: "peso"; pricePerKgCents: number; options: readonly Grams[] }
  | { kind: "unidade"; priceCents: number; unitLabel: string };

export type Stock = "disponivel" | "ultimas" | "esgotado";
export const stockLabels: Record<Stock, string> = {
  disponivel: "Disponível",
  ultimas: "Últimas unidades",
  esgotado: "Esgotado",
};

export interface ProductInfo {
  uso: string;
  conservacao: string;
  origem: string;
  ingredientes: string;
  alergenicos: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  sale: Sale;
  tags: Tag[];
  stock: Stock;
  /** Desconto de promoção, em pontos percentuais inteiros. */
  promoPercent?: number;
  isNew?: boolean;
  featured?: boolean;
  art: { color: string; accent: string };
  info: ProductInfo;
}

const all: readonly Grams[] = WEIGHT_OPTIONS;
const small: readonly Grams[] = [100, 250, 500];

const kg = (pricePerKgCents: number, options: readonly Grams[] = all): Sale => ({ kind: "peso", pricePerKgCents, options });
const unit = (priceCents: number, unitLabel: string): Sale => ({ kind: "unidade", priceCents, unitLabel });

const dry = "Em pote bem fechado, em local seco, fresco e longe da luz.";

export const products: Product[] = [
  {
    id: "canela-em-po",
    name: "Canela em pó",
    categoryId: "temperos",
    sale: kg(5990, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    featured: true,
    art: { color: "#a0522d", accent: "#d9a066" },
    info: {
      uso: "Em bolos, mingaus, frutas assadas e bebidas quentes.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Canela em pó.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "curcuma",
    name: "Cúrcuma em pó",
    categoryId: "temperos",
    sale: kg(6490, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#d8a21b", accent: "#f2cf5b" },
    info: {
      uso: "Dá cor e sabor a arroz, sopas, ovos e legumes.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Cúrcuma em pó.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "paprica-defumada",
    name: "Páprica defumada",
    categoryId: "temperos",
    sale: kg(8990, small),
    tags: ["vegano", "sem-gluten"],
    stock: "ultimas",
    isNew: true,
    art: { color: "#b23a23", accent: "#e0764f" },
    info: {
      uso: "Em carnes, grão-de-bico assado, batatas e molhos.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Pimentão desidratado, defumado e moído.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "camomila",
    name: "Camomila (flores secas)",
    categoryId: "chas",
    sale: kg(12990, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    featured: true,
    art: { color: "#e9c46a", accent: "#fff3c4" },
    info: {
      uso: "Uma colher de sopa para cada xícara de água quente; abafe por 5 minutos.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Flores secas de camomila.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "hortela",
    name: "Hortelã (folhas secas)",
    categoryId: "chas",
    sale: kg(9990, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#4f7a3a", accent: "#9cc47a" },
    info: {
      uso: "Em infusões quentes ou geladas e para aromatizar sucos.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Folhas secas de hortelã.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "quinoa",
    name: "Quinoa em grãos",
    categoryId: "graos",
    sale: kg(4990),
    tags: ["vegano", "sem-gluten", "integral"],
    stock: "disponivel",
    featured: true,
    art: { color: "#e4d3a8", accent: "#bfa76a" },
    info: {
      uso: "Lave bem e cozinhe como arroz, com duas partes de água.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Quinoa em grãos.",
      alergenicos: "Pode conter traços de glúten, por ser embalada em ambiente com cereais.",
    },
  },
  {
    id: "lentilha",
    name: "Lentilha",
    categoryId: "graos",
    sale: kg(2290),
    tags: ["vegano", "sem-gluten", "integral"],
    stock: "disponivel",
    promoPercent: 15,
    art: { color: "#9c6b3c", accent: "#c99a64" },
    info: {
      uso: "Não precisa de remolho; cozinhe por cerca de 20 minutos.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Lentilha.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "aveia-flocos",
    name: "Aveia em flocos",
    categoryId: "graos",
    sale: kg(1890),
    tags: ["vegano", "integral"],
    stock: "disponivel",
    art: { color: "#d9c7a0", accent: "#f1e6cc" },
    info: {
      uso: "Em mingaus, vitaminas, massas de bolo e com frutas.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Aveia em flocos.",
      alergenicos: "Contém glúten.",
    },
  },
  {
    id: "castanha-caju",
    name: "Castanha de caju",
    categoryId: "castanhas",
    sale: kg(11990),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    featured: true,
    art: { color: "#e7c79a", accent: "#c79a5b" },
    info: {
      uso: "Como petisco, em saladas, farofas e pratos salteados.",
      conservacao: "Em pote fechado, longe do calor; depois de aberto, prefira a geladeira.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Castanha de caju torrada, sem sal.",
      alergenicos: "Contém castanha de caju. Pode conter outras castanhas e amendoim.",
    },
  },
  {
    id: "castanha-para",
    name: "Castanha-do-pará",
    categoryId: "castanhas",
    sale: kg(13990),
    tags: ["vegano", "sem-gluten"],
    stock: "esgotado",
    art: { color: "#8a5a3b", accent: "#c4956b" },
    info: {
      uso: "Como petisco ou picada sobre frutas e iogurtes.",
      conservacao: "Em pote fechado, longe do calor; depois de aberta, prefira a geladeira.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Castanha-do-pará.",
      alergenicos: "Contém castanha-do-pará. Pode conter outras castanhas e amendoim.",
    },
  },
  {
    id: "amendoas",
    name: "Amêndoas",
    categoryId: "castanhas",
    sale: kg(10990),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    promoPercent: 10,
    art: { color: "#b98555", accent: "#e2b98a" },
    info: {
      uso: "Inteiras, laminadas sobre doces ou tostadas como petisco.",
      conservacao: "Em pote fechado, longe do calor.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Amêndoas.",
      alergenicos: "Contém amêndoas. Pode conter outras castanhas e amendoim.",
    },
  },
  {
    id: "damasco",
    name: "Damasco seco",
    categoryId: "frutas-secas",
    sale: kg(9490, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#e8913a", accent: "#f6c27a" },
    info: {
      uso: "Como lanche, em saladas, recheios e molhos agridoces.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Damasco desidratado.",
      alergenicos: "Pode conter sulfitos e traços de castanhas.",
    },
  },
  {
    id: "uva-passa",
    name: "Uva-passa escura",
    categoryId: "frutas-secas",
    sale: kg(3990),
    tags: ["vegano", "sem-gluten", "sem-acucar"],
    stock: "disponivel",
    art: { color: "#4a2c3a", accent: "#8a5a72" },
    info: {
      uso: "Em arroz, farofas, bolos, granolas e saladas.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Uva-passa escura, sem adição de açúcar.",
      alergenicos: "Pode conter traços de castanhas.",
    },
  },
  {
    id: "farinha-amendoas",
    name: "Farinha de amêndoas",
    categoryId: "farinhas",
    sale: kg(12490, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    isNew: true,
    art: { color: "#efdcbc", accent: "#cfae7e" },
    info: {
      uso: "Em bolos, biscoitos e empanados, sozinha ou com outras farinhas.",
      conservacao: "Em pote fechado; depois de aberta, prefira a geladeira.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Amêndoas moídas.",
      alergenicos: "Contém amêndoas.",
    },
  },
  {
    id: "farinha-integral",
    name: "Farinha de trigo integral",
    categoryId: "farinhas",
    sale: kg(1290),
    tags: ["vegano", "integral"],
    stock: "disponivel",
    art: { color: "#c7a276", accent: "#e6cda8" },
    info: {
      uso: "Em pães, bolos e massas; costuma pedir um pouco mais de líquido.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Farinha de trigo integral.",
      alergenicos: "Contém glúten.",
    },
  },
  {
    id: "chia",
    name: "Semente de chia",
    categoryId: "sementes",
    sale: kg(3990, small),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#5b5b5b", accent: "#9a9a9a" },
    info: {
      uso: "Em iogurtes, vitaminas e pudins; hidrata em líquido por 15 minutos.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Semente de chia.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "girassol",
    name: "Semente de girassol",
    categoryId: "sementes",
    sale: kg(2990),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#8c8a6a", accent: "#d6d2a8" },
    info: {
      uso: "Tostada em saladas, pães e granolas.",
      conservacao: dry,
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Semente de girassol sem casca.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
  {
    id: "granola-tradicional",
    name: "Granola tradicional",
    categoryId: "granolas",
    sale: kg(4590),
    tags: ["vegano", "integral"],
    stock: "disponivel",
    featured: true,
    art: { color: "#b8864b", accent: "#e3bd82" },
    info: {
      uso: "Com iogurte, leite, frutas ou como lanche.",
      conservacao: dry,
      origem: "Mistura de exemplo, montada para esta demonstração.",
      ingredientes: "Aveia, flocos de milho, uva-passa, castanha de caju, açúcar mascavo e óleo de girassol.",
      alergenicos: "Contém glúten e castanha de caju.",
    },
  },
  {
    id: "granola-sem-acucar",
    name: "Granola sem açúcar",
    categoryId: "granolas",
    sale: kg(5290),
    tags: ["vegano", "sem-acucar", "integral"],
    stock: "ultimas",
    promoPercent: 20,
    art: { color: "#a57a45", accent: "#d7b27c" },
    info: {
      uso: "Com iogurte, leite, frutas ou como lanche.",
      conservacao: dry,
      origem: "Mistura de exemplo, montada para esta demonstração.",
      ingredientes: "Aveia, coco em flocos, sementes de girassol, uva-passa e canela.",
      alergenicos: "Contém glúten.",
    },
  },
  {
    id: "mel-silvestre",
    name: "Mel silvestre",
    categoryId: "mel",
    sale: unit(3490, "pote de 500 g"),
    tags: ["sem-gluten"],
    stock: "disponivel",
    art: { color: "#e0a526", accent: "#f7d27a" },
    info: {
      uso: "Para adoçar bebidas, sobre frutas, pães e iogurtes.",
      conservacao: "Em temperatura ambiente, bem fechado. Cristalizar é natural.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Mel.",
      alergenicos: "Não oferecer a crianças menores de 1 ano.",
    },
  },
  {
    id: "pasta-amendoim",
    name: "Pasta de amendoim integral",
    categoryId: "mel",
    sale: unit(2790, "pote de 450 g"),
    tags: ["vegano", "sem-gluten", "sem-acucar"],
    stock: "disponivel",
    isNew: true,
    art: { color: "#b07a3e", accent: "#dfae6e" },
    info: {
      uso: "Em pães, frutas, vitaminas e molhos.",
      conservacao: "Em temperatura ambiente; mexa antes de usar se o óleo separar.",
      origem: "Produto de exemplo, sem procedência real informada.",
      ingredientes: "Amendoim torrado.",
      alergenicos: "Contém amendoim.",
    },
  },
  {
    id: "kit-cafe-da-manha",
    name: "Kit café da manhã",
    categoryId: "kits",
    sale: unit(7990, "kit com 4 itens"),
    tags: ["vegano"],
    stock: "disponivel",
    featured: true,
    art: { color: "#5f6f2f", accent: "#c9d48f" },
    info: {
      uso: "Granola tradicional 250 g, aveia 250 g, uva-passa 100 g e pasta de amendoim 450 g.",
      conservacao: "Siga a orientação de cada item.",
      origem: "Seleção de exemplo desta demonstração.",
      ingredientes: "Veja cada item do kit.",
      alergenicos: "Contém glúten, amendoim e castanha de caju.",
    },
  },
  {
    id: "kit-chas",
    name: "Kit chás da tarde",
    categoryId: "kits",
    sale: unit(5490, "kit com 3 itens"),
    tags: ["vegano", "sem-gluten"],
    stock: "disponivel",
    art: { color: "#7a8b4f", accent: "#e9c46a" },
    info: {
      uso: "Camomila 100 g, hortelã 100 g e canela em pó 100 g.",
      conservacao: "Siga a orientação de cada item.",
      origem: "Seleção de exemplo desta demonstração.",
      ingredientes: "Veja cada item do kit.",
      alergenicos: "Pode conter traços de outros produtos embalados no mesmo ambiente.",
    },
  },
];

export interface Region {
  id: string;
  name: string;
  feeCents: number;
}

/** Bairros fictícios atendidos na demonstração. */
export const regions: Region[] = [
  { id: "centro", name: "Centro", feeCents: 800 },
  { id: "jardim-das-ervas", name: "Jardim das Ervas", feeCents: 1000 },
  { id: "vila-aroeira", name: "Vila Aroeira", feeCents: 1200 },
  { id: "parque-dos-ipes", name: "Parque dos Ipês", feeCents: 1500 },
];

/** Pedidos a partir deste valor têm entrega grátis. */
export const FREE_DELIVERY_FROM_CENTS = 15000;
export const MAX_QUANTITY = 20;

export const storeHours = [
  ["Segunda a sexta", "8h às 19h"],
  ["Sábado", "8h às 14h"],
  ["Domingo", "Fechado"],
] as const;

export const faq = [
  { q: "Como funciona a venda por peso?", a: "Você escolhe 100 g, 250 g, 500 g ou 1 kg e o preço é calculado pelo valor do quilo, arredondado para o centavo mais próximo." },
  { q: "Posso retirar na loja?", a: "Sim. Na demonstração, a retirada não tem taxa e o pedido só gera uma prévia de mensagem." },
  { q: "Os produtos têm informações de alergênicos?", a: "Cada produto traz ingredientes e alergênicos. Em caso de restrição, confirme com a loja antes de comprar." },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
