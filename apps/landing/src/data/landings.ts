/*
 * As seis landing pages de demonstração. Todos os negócios, ofertas, preços e datas são fictícios.
 * Cada página tem um objetivo de conversão diferente, para mostrar a variedade do formato.
 */
export interface Landing {
  slug: string;
  name: string;
  /** Tipo de oferta, em linguagem do visitante. */
  kind: string;
  /** O que a página quer que o visitante faça. */
  goal: string;
  summary: string;
  /** Foto usada no índice. */
  cover: string;
}

export const landings: Landing[] = [
  {
    slug: "residencial-aurora",
    name: "Residencial Aurora",
    kind: "Lançamento imobiliário",
    goal: "Receber a tabela e as plantas",
    summary: "Apresenta o empreendimento com fotos grandes, plantas por tipo de apartamento e cadastro de interesse.",
    cover: "aurora-fachada",
  },
  {
    slug: "fluente-na-mala",
    name: "Fluente na Mala",
    kind: "Curso on-line",
    goal: "Garantir a vaga na turma",
    summary: "Vende um curso de inglês para viagem: para quem é, o que se aprende por semana, bônus e matrícula.",
    cover: "fluente-hero",
  },
  {
    slug: "festival-sabores-da-serra",
    name: "Festival Sabores da Serra",
    kind: "Evento",
    goal: "Reservar o ingresso",
    summary: "Divulga um festival gastronômico: programação por dia, atrações, ingressos e reserva.",
    cover: "festival-hero",
  },
  {
    slug: "agenda-leve",
    name: "Agenda Leve",
    kind: "Aplicativo",
    goal: "Começar o teste grátis",
    summary: "Apresenta um aplicativo de agendamento: o que ele resolve, recursos, planos mensal e anual e cadastro.",
    cover: "agenda-hero",
  },
  {
    slug: "clube-serra-alta",
    name: "Clube Serra Alta",
    kind: "Assinatura de produto",
    goal: "Assinar o clube de café",
    summary: "Vende uma assinatura de café especial: como funciona, montagem do plano com preço na hora e origem.",
    cover: "cafe-hero",
  },
  {
    slug: "solar-viva",
    name: "Solar Viva",
    kind: "Serviço com simulação",
    goal: "Pedir a simulação de economia",
    summary: "Capta pedidos de energia solar: calculadora com o valor da conta, etapas da instalação e formulário.",
    cover: "solar-hero",
  },
];
