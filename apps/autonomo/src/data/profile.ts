/*
 * "Linha Direta Profissional" é o modelo; a profissional apresentada, Lia Torres,
 * é fictícia. Serviços, pacotes, valores e trabalhos são exemplos de demonstração.
 */

export const professional = {
  name: "Lia Torres",
  role: "Fotografia de produto",
  pitch: "Imagens que ajudam pequenas marcas a vender.",
  about:
    "Fotografo produtos para lojas on-line, cardápios e redes sociais. Trabalho sozinha, do planejamento à entrega, com luz controlada e edição cuidadosa. Atendo marcas pequenas que precisam de imagens consistentes sem montar uma grande produção.",
  area: "Atendimento em estúdio próprio e entregas on-line para todo o país (ilustrativo).",
  /** Redes só aparecem se informadas. Nesta demo, nenhuma é real, por isso a lista fica vazia. */
  social: [] as Array<{ label: string; href: string }>,
};

export interface ServiceOffer {
  id: string;
  name: string;
  description: string;
  includes: string[];
  fromCents: number;
}

export const offers: ServiceOffer[] = [
  {
    id: "ecommerce",
    name: "Fotos para loja on-line",
    description: "Fundo branco ou neutro, padrão consistente para catálogo.",
    includes: ["Até 3 ângulos por produto", "Tratamento de cor e recorte", "Arquivos para web"],
    fromCents: 3500,
  },
  {
    id: "ambientada",
    name: "Fotos ambientadas",
    description: "Produto em cena, com objetos e luz que contam uma história.",
    includes: ["Direção de cena", "Props do acervo", "Versões para redes sociais"],
    fromCents: 9000,
  },
  {
    id: "cardapio",
    name: "Cardápio e gastronomia",
    description: "Pratos e bebidas para cardápio digital e delivery.",
    includes: ["Produção no local", "Até 20 pratos por diária", "Recortes para aplicativo"],
    fromCents: 6500,
  },
];

export const workCategories = [
  { id: "alimentos", name: "Alimentos" },
  { id: "moda", name: "Moda" },
  { id: "cosmeticos", name: "Cosméticos" },
] as const;

export type WorkCategory = (typeof workCategories)[number]["id"];

export const works: Array<{ id: string; title: string; category: WorkCategory; context: string; art: number }> = [
  { id: "cafe", title: "Café especial", category: "alimentos", context: "Linha de cafés para loja on-line, 12 produtos.", art: 0 },
  { id: "sabonetes", title: "Sabonetes artesanais", category: "cosmeticos", context: "Fotos ambientadas para lançamento.", art: 1 },
  { id: "tenis", title: "Tênis de corrida", category: "moda", context: "Catálogo com 3 ângulos por modelo.", art: 2 },
  { id: "doces", title: "Doceria de bairro", category: "alimentos", context: "Cardápio digital com 18 itens.", art: 3 },
  { id: "bolsas", title: "Bolsas de couro", category: "moda", context: "Fotos em fundo neutro e detalhes.", art: 4 },
  { id: "serum", title: "Linha de sérum", category: "cosmeticos", context: "Composição com água e luz lateral.", art: 5 },
];

export const faq = [
  { q: "Quanto tempo leva a entrega?", a: "Depende do volume. Na proposta, você recebe um prazo estimado para aprovar antes de começar." },
  { q: "Preciso enviar os produtos?", a: "Para fotos em estúdio, sim. Para gastronomia, a produção é feita no seu local." },
  { q: "Posso usar as fotos em anúncios?", a: "As condições de uso são descritas na proposta, de acordo com o que foi combinado." },
  { q: "Como funciona o pagamento?", a: "Em um site real, esta resposta traria as condições da profissional. Aqui é um exemplo." },
];
