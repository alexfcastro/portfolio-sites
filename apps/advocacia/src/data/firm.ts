/*
 * Almeida & Prado Advocacia é um escritório fictício. Áreas, textos, equipe e
 * artigos são exemplos de demonstração, de caráter apenas informativo.
 * Não há promessa de resultado, relatos de clientes, comparações ou registros
 * profissionais inventados. Antes de qualquer uso real, o conteúdo precisa ser revisado conforme
 * as normas de publicidade da advocacia aplicáveis.
 */

export interface PracticeArea {
  slug: string;
  name: string;
  summary: string;
  body: string[];
  topics: string[];
}

export const areas: PracticeArea[] = [
  {
    slug: "familia",
    name: "Direito de Família",
    summary: "Divórcio, guarda, pensão alimentícia e planejamento familiar.",
    body: [
      "Questões de família costumam envolver decisões delicadas e prazos que afetam a rotina de todos os envolvidos.",
      "A atuação inclui orientação sobre os caminhos possíveis, tanto consensuais quanto judiciais, e acompanhamento de cada etapa.",
    ],
    topics: ["Divórcio consensual e litigioso", "Guarda e convivência", "Pensão alimentícia", "União estável"],
  },
  {
    slug: "trabalho",
    name: "Direito do Trabalho",
    summary: "Orientação a empregados e empresas em relações de trabalho.",
    body: [
      "Relações de trabalho envolvem direitos e deveres de ambas as partes, com regras específicas para cada situação.",
      "A atuação inclui análise de documentos, orientação preventiva e acompanhamento de processos.",
    ],
    topics: ["Rescisão contratual", "Horas extras e jornada", "Orientação preventiva para empresas"],
  },
  {
    slug: "consumidor",
    name: "Direito do Consumidor",
    summary: "Problemas com produtos, serviços, cobranças e contratos.",
    body: [
      "Muitos conflitos de consumo podem ser resolvidos com orientação adequada e registro organizado dos fatos.",
      "A atuação inclui análise do caso, tentativa de solução extrajudicial e, quando necessário, medidas judiciais.",
    ],
    topics: ["Cobranças indevidas", "Produtos com defeito", "Cancelamento de contratos"],
  },
  {
    slug: "imobiliario",
    name: "Direito Imobiliário",
    summary: "Compra, venda, locação e regularização de imóveis.",
    body: [
      "Negócios imobiliários envolvem documentos, prazos e valores relevantes, em que a análise prévia faz diferença.",
      "A atuação inclui revisão de contratos, orientação em locações e acompanhamento de regularizações.",
    ],
    topics: ["Contratos de compra e venda", "Locação residencial e comercial", "Regularização de imóveis"],
  },
  {
    slug: "sucessoes",
    name: "Sucessões e Inventário",
    summary: "Inventário, partilha, testamento e planejamento sucessório.",
    body: [
      "O inventário pode ser feito em cartório ou na Justiça, conforme a situação da família e dos bens.",
      "A atuação inclui orientação sobre o procedimento adequado, levantamento de documentos e acompanhamento da partilha.",
    ],
    topics: ["Inventário extrajudicial e judicial", "Testamento", "Planejamento sucessório"],
  },
  {
    slug: "empresarial",
    name: "Direito Empresarial",
    summary: "Contratos, sociedades e rotina jurídica de pequenas empresas.",
    body: [
      "Pequenas empresas se beneficiam de contratos bem redigidos e de orientação antes das decisões importantes.",
      "A atuação inclui elaboração e revisão de contratos, organização societária e consultoria contínua.",
    ],
    topics: ["Contratos comerciais", "Constituição e alteração de sociedades", "Consultoria para pequenas empresas"],
  },
];

export const team = [
  {
    name: "Helena Almeida",
    role: "Sócia",
    areas: ["familia", "sucessoes"],
    bio: "Atua em questões de família e sucessões, com foco em soluções consensuais quando possíveis.",
  },
  {
    name: "Ricardo Prado",
    role: "Sócio",
    areas: ["empresarial", "imobiliario"],
    bio: "Atua na rotina jurídica de pequenas empresas e em negócios imobiliários.",
  },
  {
    name: "Camila Souza",
    role: "Advogada associada",
    areas: ["trabalho", "consumidor"],
    bio: "Atua em relações de trabalho e de consumo, com orientação preventiva.",
  },
];

export interface Article {
  slug: string;
  title: string;
  areaSlug: string;
  summary: string;
  body: string[];
  readingMinutes: number;
}

export const articles: Article[] = [
  {
    slug: "inventario-em-cartorio",
    title: "Quando o inventário pode ser feito em cartório",
    areaSlug: "sucessoes",
    summary: "Entenda, de forma geral, as condições para o inventário extrajudicial.",
    body: [
      "O inventário extrajudicial é feito por escritura pública em cartório e costuma ser mais rápido do que o judicial.",
      "De forma geral, ele depende de consenso entre os herdeiros e da presença de advogado. Há situações em que a via judicial é obrigatória.",
      "Cada caso tem particularidades, e a escolha do procedimento deve considerar a situação da família e dos bens.",
    ],
    readingMinutes: 3,
  },
  {
    slug: "cobranca-indevida",
    title: "Cobrança indevida: como organizar as informações",
    areaSlug: "consumidor",
    summary: "Um roteiro geral para registrar fatos e documentos antes de buscar orientação.",
    body: [
      "Guardar faturas, protocolos de atendimento e conversas ajuda a entender o que aconteceu e em que ordem.",
      "Registrar datas e valores em uma lista simples facilita a análise por quem vai orientar o caso.",
      "Este texto é informativo e não substitui a análise individual de cada situação.",
    ],
    readingMinutes: 2,
  },
  {
    slug: "contrato-de-locacao",
    title: "Pontos de atenção em um contrato de locação",
    areaSlug: "imobiliario",
    summary: "Itens que costumam gerar dúvidas entre locadores e locatários.",
    body: [
      "Prazo, reajuste, garantias locatícias e responsabilidade por reparos são temas que merecem leitura atenta.",
      "Vistorias de entrada e saída bem documentadas ajudam a evitar divergências no fim da locação.",
      "As regras variam conforme o tipo de imóvel e o que foi combinado entre as partes.",
    ],
    readingMinutes: 3,
  },
];

export const contactSubjects = [
  "Quero entender meus direitos",
  "Preciso revisar um contrato",
  "Já tenho um processo em andamento",
  "Outro assunto",
] as const;

export const contactPeriods = ["Manhã", "Tarde", "Tanto faz"] as const;

export function getArea(slug: string) {
  return areas.find((area) => area.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
