/*
 * Loja da Bravus: linha própria FICTÍCIA. Produtos, preços, estoque e modos de uso são exemplos de
 * demonstração e não correspondem a nenhuma marca ou produto real.
 */

export type ProductCategory = "cabelo" | "barba" | "kits" | "acessorios";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  /** Frase curta do cartão. */
  tagline: string;
  description: string;
  howTo: string;
  size: string;
  priceCents: number;
  /** Preço "de" (kits): soma dos itens avulsos. */
  listPriceCents?: number;
  /** Estoque inicial da demo. */
  stock: number;
  /** Atributos rápidos (fixação, efeito, tipo de cabelo). */
  traits: string[];
  /** Serviços que combinam com o produto (sugestão na hora de agendar). */
  pairsWith: string[];
  bestseller?: boolean;
}

export const categories: Record<ProductCategory, string> = {
  cabelo: "Cabelo",
  barba: "Barba",
  kits: "Kits",
  acessorios: "Acessórios",
};

export const products: Product[] = [
  {
    id: "pomada-matte",
    name: "Pomada Modeladora Matte",
    category: "cabelo",
    tagline: "Fixação forte, sem brilho",
    description: "Segura o penteado o dia todo com acabamento seco, de cabelo natural. A mais pedida depois do corte.",
    howTo: "Aqueça uma porção pequena nas palmas e aplique com o cabelo seco, de trás para frente.",
    size: "80 g",
    priceCents: 4990,
    stock: 14,
    traits: ["Fixação forte", "Efeito matte", "Sai na água"],
    pairsWith: ["corte", "degrade", "combo"],
    bestseller: true,
  },
  {
    id: "pomada-brilho",
    name: "Pomada Brilho Clássico",
    category: "cabelo",
    tagline: "Penteado alinhado, brilho médio",
    description: "À base de água, para topetes e penteados para trás com aquele brilho de barbearia antiga.",
    howTo: "Aplique no cabelo levemente úmido e penteie com pente fino para definir.",
    size: "80 g",
    priceCents: 4490,
    stock: 9,
    traits: ["Fixação média", "Brilho médio", "Sai na água"],
    pairsWith: ["corte"],
  },
  {
    id: "gel-forte",
    name: "Gel Fixador Extra Forte",
    category: "cabelo",
    tagline: "Para quem quer o penteado travado",
    description: "Gel transparente que não deixa resíduo branco. Bom para cortes curtos e espetados.",
    howTo: "Use no cabelo úmido e modele com os dedos antes de secar.",
    size: "250 g",
    priceCents: 2990,
    stock: 20,
    traits: ["Fixação extra forte", "Brilho molhado"],
    pairsWith: ["degrade"],
  },
  {
    id: "po-texturizador",
    name: "Pó Texturizador",
    category: "cabelo",
    tagline: "Volume na raiz em segundos",
    description: "Pó leve que dá volume e textura a cabelos finos, sem pesar e sem brilho.",
    howTo: "Polvilhe na raiz com o cabelo seco e bagunce com as pontas dos dedos.",
    size: "20 g",
    priceCents: 3990,
    stock: 3,
    traits: ["Volume", "Efeito seco", "Cabelos finos"],
    pairsWith: ["corte", "degrade"],
  },
  {
    id: "shampoo-hidratante",
    name: "Shampoo Hidratante",
    category: "cabelo",
    tagline: "Limpa sem ressecar",
    description: "Para lavar todo dia: limpa a pomada da véspera e deixa o fio macio, sem arrastar.",
    howTo: "Massageie no couro cabeludo molhado por um minuto e enxágue bem.",
    size: "250 ml",
    priceCents: 4290,
    stock: 12,
    traits: ["Uso diário", "Todos os tipos de cabelo"],
    pairsWith: ["corte", "degrade", "combo"],
    bestseller: true,
  },
  {
    id: "condicionador",
    name: "Condicionador Leve",
    category: "cabelo",
    tagline: "Desembaraça sem pesar",
    description: "Textura leve, pensada para cabelo curto: deixa macio sem tirar o volume do corte.",
    howTo: "Depois do shampoo, aplique no comprimento, espere dois minutos e enxágue.",
    size: "250 ml",
    priceCents: 3990,
    stock: 10,
    traits: ["Uso diário", "Não pesa"],
    pairsWith: ["corte"],
  },
  {
    id: "shampoo-barba",
    name: "Shampoo para Barba",
    category: "barba",
    tagline: "Barba limpa e macia",
    description: "Lava a barba e a pele de baixo sem ressecar. Ajuda a diminuir a coceira de barba crescendo.",
    howTo: "Use no banho, massageando a barba molhada por 30 segundos. Enxágue.",
    size: "120 ml",
    priceCents: 3490,
    stock: 11,
    traits: ["Uso diário", "Barba e pele"],
    pairsWith: ["barba", "combo"],
  },
  {
    id: "oleo-barba",
    name: "Óleo para Barba",
    category: "barba",
    tagline: "Hidrata e dá brilho natural",
    description: "Algumas gotas deixam a barba macia, alinhada e com perfume amadeirado suave.",
    howTo: "Pingue de 3 a 5 gotas na palma, espalhe na barba seca e penteie.",
    size: "30 ml",
    priceCents: 5490,
    stock: 8,
    traits: ["Amadeirado", "Hidratação"],
    pairsWith: ["barba", "combo"],
    bestseller: true,
  },
  {
    id: "balm-barba",
    name: "Balm Modelador para Barba",
    category: "barba",
    tagline: "Alinha os fios rebeldes",
    description: "Mistura de manteigas e cera leve que modela a barba e segura os fios no lugar.",
    howTo: "Raspe um pouco com a unha, aqueça nas mãos e aplique no sentido dos fios.",
    size: "60 g",
    priceCents: 4690,
    stock: 6,
    traits: ["Fixação leve", "Hidratação"],
    pairsWith: ["barba", "combo"],
  },
  {
    id: "pos-barba",
    name: "Loção Pós-Barba",
    category: "barba",
    tagline: "Refresca depois de raspar",
    description: "Loção sem álcool que acalma a pele depois do barbear e não arde.",
    howTo: "Aplique algumas gotas no rosto logo depois de barbear, com batidinhas leves.",
    size: "100 ml",
    priceCents: 3890,
    stock: 7,
    traits: ["Sem álcool", "Pele sensível"],
    pairsWith: ["barba"],
  },
  {
    id: "pente-madeira",
    name: "Pente de Madeira",
    category: "acessorios",
    tagline: "Dentes largos e finos",
    description: "Pente de madeira com dois lados: largo para a barba, fino para o cabelo. Não gera estática.",
    howTo: "Use com o óleo ou o balm para espalhar e alinhar os fios.",
    size: "15 cm",
    priceCents: 2490,
    stock: 15,
    traits: ["Cabelo e barba", "Antiestático"],
    pairsWith: ["barba", "corte"],
  },
  {
    id: "kit-barba",
    name: "Kit Barba Completa",
    category: "kits",
    tagline: "Shampoo, óleo e balm",
    description: "Os três passos do cuidado com a barba em uma caixa: lavar, hidratar e modelar. Bom para presentear.",
    howTo: "Shampoo no banho, óleo com a barba seca e balm para finalizar.",
    size: "3 itens",
    priceCents: 11990,
    listPriceCents: 3490 + 5490 + 4690,
    stock: 5,
    traits: ["Presente", "Economia"],
    pairsWith: ["barba", "combo"],
  },
  {
    id: "kit-cabelo",
    name: "Kit Cabelo em Dia",
    category: "kits",
    tagline: "Shampoo, condicionador e pomada",
    description: "Tudo para manter o corte bonito entre uma visita e outra, com a pomada matte da casa.",
    howTo: "Shampoo e condicionador no banho; pomada com o cabelo seco.",
    size: "3 itens",
    priceCents: 11490,
    listPriceCents: 4290 + 3990 + 4990,
    stock: 4,
    traits: ["Presente", "Economia"],
    pairsWith: ["corte", "degrade"],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** Estoque considerado baixo no painel. */
export const LOW_STOCK = 3;

/** Desconto para quem paga a compra por Pix na hora (em porcentagem). */
export const PIX_DISCOUNT_PCT = 5;
