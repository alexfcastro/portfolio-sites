/*
 * Landing pages de demonstração (app independente em apps/landing). Ofertas fictícias.
 * Cada uma mostra um objetivo de conversão diferente. As capturas ficam em public/landing/<slug>.png.
 */
import type { CategoryId } from "@/types/project";

export interface LandingPage {
  slug: string;
  /** Segmento do catálogo: com esse filtro ativo, a landing page aparece junto dos projetos. */
  categoryId: CategoryId;
  name: string;
  /** Tipo de oferta, em linguagem do visitante. */
  kind: string;
  /** O que a página pede ao visitante. */
  goal: string;
  summary: string;
}

export const landingPages: LandingPage[] = [
  {
    slug: "residencial-aurora",
    categoryId: "imoveis",
    name: "Residencial Aurora",
    kind: "Lançamento imobiliário",
    goal: "Receber a tabela e as plantas",
    summary: "Fotos grandes do empreendimento, plantas por tipo de apartamento e cadastro de interesse.",
  },
  {
    slug: "fluente-na-mala",
    categoryId: "profissionais",
    name: "Fluente na Mala",
    kind: "Curso on-line",
    goal: "Garantir a vaga",
    summary: "Para quem é, o que se aprende a cada semana, preço e matrícula.",
  },
  {
    slug: "festival-sabores-da-serra",
    categoryId: "alimentacao",
    name: "Festival Sabores da Serra",
    kind: "Evento",
    goal: "Reservar o ingresso",
    summary: "Programação por dia, atrações, tipos de ingresso e reserva.",
  },
  {
    slug: "agenda-leve",
    categoryId: "servicos",
    name: "Agenda Leve",
    kind: "Aplicativo",
    goal: "Começar o teste grátis",
    summary: "O que o aplicativo resolve, recursos, planos mensal e anual e cadastro.",
  },
  {
    slug: "clube-serra-alta",
    categoryId: "alimentacao",
    name: "Clube Serra Alta",
    kind: "Assinatura de produto",
    goal: "Assinar o clube",
    summary: "Como funciona, montagem do plano com o preço na hora e origem do café.",
  },
  {
    slug: "solar-viva",
    categoryId: "servicos",
    name: "Solar Viva",
    kind: "Serviço com simulação",
    goal: "Pedir a simulação",
    summary: "Calculadora de economia com o valor da conta, etapas da instalação e formulário.",
  },
  {
    slug: "volume-perfeito",
    categoryId: "beleza",
    name: "Curso Volume Perfeito",
    kind: "Curso presencial",
    goal: "Reservar a vaga",
    summary: "Uma descida só, sem menu: vagas que diminuem, cronograma dos dois dias, parcelamento e reserva fixa no celular.",
  },
];
