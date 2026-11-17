/*
 * Landing pages de demonstração (app independente em apps/landing). Ofertas fictícias.
 * Cada uma mostra um objetivo de conversão diferente. As capturas ficam em public/landing/<slug>.png.
 */
export interface LandingPage {
  slug: string;
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
    name: "Residencial Aurora",
    kind: "Lançamento imobiliário",
    goal: "Receber a tabela e as plantas",
    summary: "Fotos grandes do empreendimento, plantas por tipo de apartamento e cadastro de interesse.",
  },
  {
    slug: "fluente-na-mala",
    name: "Fluente na Mala",
    kind: "Curso on-line",
    goal: "Garantir a vaga",
    summary: "Para quem é, o que se aprende a cada semana, preço e matrícula.",
  },
  {
    slug: "festival-sabores-da-serra",
    name: "Festival Sabores da Serra",
    kind: "Evento",
    goal: "Reservar o ingresso",
    summary: "Programação por dia, atrações, tipos de ingresso e reserva.",
  },
  {
    slug: "agenda-leve",
    name: "Agenda Leve",
    kind: "Aplicativo",
    goal: "Começar o teste grátis",
    summary: "O que o aplicativo resolve, recursos, planos mensal e anual e cadastro.",
  },
  {
    slug: "clube-serra-alta",
    name: "Clube Serra Alta",
    kind: "Assinatura de produto",
    goal: "Assinar o clube",
    summary: "Como funciona, montagem do plano com o preço na hora e origem do café.",
  },
  {
    slug: "solar-viva",
    name: "Solar Viva",
    kind: "Serviço com simulação",
    goal: "Pedir a simulação",
    summary: "Calculadora de economia com o valor da conta, etapas da instalação e formulário.",
  },
];
