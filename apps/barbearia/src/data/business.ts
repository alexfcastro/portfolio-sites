import type { Professional, Service } from "@/types/booking";

/*
 * Bravus Barbearia é um negócio fictício. Serviços, preços, equipe, horários e
 * avaliações são dados de demonstração e não correspondem a nenhuma empresa real.
 */

export const business = {
  name: "Bravus Barbearia",
  timeZone: "America/Sao_Paulo",
  /** Intervalo entre inícios de horário, em minutos. */
  slotStepMin: 20,
  /** Antecedência mínima para agendar no mesmo dia, em minutos. */
  minLeadMin: 30,
  /** Quantos dias à frente a agenda mostra (incluindo hoje). */
  bookingWindowDays: 14,
  /** Sinal cobrado por Pix para garantir o horário, descontado no dia. */
  depositCents: 1000,
  /** Até quantos minutos antes o próprio cliente pode remarcar ou cancelar. */
  changeDeadlineMin: 120,
  /** Prazo para pagar o Pix antes de o horário ser liberado, em minutos. */
  pixExpiresMin: 10,
  /** Comissão dos barbeiros sobre o que atenderam, em porcentagem. */
  commissionPct: 40,
  /** Dias sem voltar para o cliente entrar na lista de "sumidos". */
  missingAfterDays: 30,
  /** Pausa de almoço (minutos desde a meia-noite). */
  lunch: { startMin: 12 * 60, endMin: 13 * 60 },
  /** Horário por dia da semana (0 = domingo). `null` = fechado. */
  hours: {
    0: null,
    1: { openMin: 9 * 60, closeMin: 19 * 60 },
    2: { openMin: 9 * 60, closeMin: 19 * 60 },
    3: { openMin: 9 * 60, closeMin: 19 * 60 },
    4: { openMin: 9 * 60, closeMin: 19 * 60 },
    5: { openMin: 9 * 60, closeMin: 19 * 60 },
    6: { openMin: 9 * 60, closeMin: 16 * 60 },
  } as Record<number, { openMin: number; closeMin: number } | null>,
} as const;

export const professionals: Professional[] = [
  {
    id: "rafa",
    name: "Rafael Moura",
    shortName: "Rafa",
    role: "Cortes clássicos e barba",
    bio: "Tesoura, navalha e acabamento sem pressa.",
  },
  {
    id: "leo",
    name: "Leonardo Brandão",
    shortName: "Leo",
    role: "Degradê e barba desenhada",
    bio: "Especialista em transições suaves e contornos precisos.",
  },
  {
    id: "davi",
    name: "Davi Correia",
    shortName: "Davi",
    role: "Cortes modernos e sobrancelha",
    bio: "Cortes com textura e acabamento na navalha.",
  },
];

export const services: Service[] = [
  {
    id: "corte",
    name: "Corte clássico",
    description: "Tesoura e máquina, lavagem e finalização.",
    durationMin: 40,
    priceCents: 4500,
    professionalIds: ["rafa", "leo", "davi"],
  },
  {
    id: "barba",
    name: "Barba completa",
    description: "Toalha quente, navalha e hidratação.",
    durationMin: 30,
    priceCents: 3500,
    professionalIds: ["rafa", "leo"],
  },
  {
    id: "combo",
    name: "Corte + barba",
    description: "O serviço completo, com um só horário.",
    durationMin: 70,
    priceCents: 7000,
    professionalIds: ["rafa", "leo"],
  },
  {
    id: "degrade",
    name: "Degradê",
    description: "Transição na máquina com acabamento na navalha.",
    durationMin: 50,
    priceCents: 5500,
    professionalIds: ["leo", "davi"],
  },
  {
    id: "acabamento",
    name: "Acabamento",
    description: "Pezinho, contorno e laterais entre um corte e outro.",
    durationMin: 20,
    priceCents: 2500,
    professionalIds: ["rafa", "leo", "davi"],
  },
  {
    id: "sobrancelha",
    name: "Sobrancelha na navalha",
    description: "Alinhamento discreto e natural.",
    durationMin: 20,
    priceCents: 2000,
    professionalIds: ["davi"],
  },
];

/** Planos de assinatura mensal (valores fictícios). */
export const plans = [
  {
    id: "clube-corte",
    name: "Clube Corte",
    priceCents: 12990,
    usesPerMonth: 4,
    serviceIds: ["corte", "degrade", "acabamento"],
    summary: "Até 4 cortes por mês (clássico ou degradê) e acabamentos.",
  },
  {
    id: "clube-completo",
    name: "Clube Completo",
    priceCents: 21990,
    usesPerMonth: 4,
    serviceIds: ["combo", "corte", "degrade", "barba", "acabamento"],
    summary: "Até 4 atendimentos por mês, incluindo corte + barba.",
  },
] as const;

export type Plan = (typeof plans)[number];

export function getPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

/** Cartão fidelidade: a cada 10 cortes, uma barba completa de presente. */
export const loyalty = {
  stampsForReward: 10,
  /** Serviços que contam selo. */
  stampServiceIds: ["corte", "degrade", "combo"],
  /** Serviço que a recompensa cobre. */
  rewardServiceId: "barba",
  /** Selos que o cliente de demonstração já tem de visitas anteriores. */
  demoStartingStamps: 8,
} as const;

/** Faixas de horário usadas na lista de espera (minutos desde a meia-noite). */
export const periods = {
  manha: { label: "Manhã", startMin: 9 * 60, endMin: 12 * 60 },
  tarde: { label: "Tarde", startMin: 13 * 60, endMin: 17 * 60 },
  noite: { label: "Fim de tarde", startMin: 17 * 60, endMin: 19 * 60 },
} as const;

/** Identidade fictícia usada nos agendamentos de quem visita a demo. */
export const demoCustomerName = "Cliente de demonstração";

/** Nomes fictícios para a agenda de exemplo. */
export const seedCustomerNames = [
  "Bruno T.",
  "Caio M.",
  "Diego R.",
  "Eduardo P.",
  "Felipe A.",
  "Gustavo L.",
  "Henrique S.",
  "Igor N.",
  "João V.",
  "Marcos F.",
  "Otávio C.",
  "Pedro H.",
  "Rodrigo B.",
  "Samuel D.",
  "Tiago G.",
  "Vitor E.",
  "Wesley O.",
  "André Q.",
  "Breno J.",
  "Danilo U.",
  "Fábio Z.",
  "Hugo W.",
  "Leandro I.",
  "Murilo K.",
];

/** Avaliações de exemplo: todas fictícias e identificadas individualmente. */
export const sampleReviews = [
  { author: "Lucas A.", rating: 5, text: "Marquei pelo site em menos de um minuto e fui atendido no horário." },
  { author: "Thiago R.", rating: 5, text: "Degradê muito bem feito e ambiente tranquilo." },
  { author: "Vinícius K.", rating: 4, text: "Gostei de ver o valor e a duração antes de escolher o serviço." },
];

export function getService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getProfessional(id: string): Professional | undefined {
  return professionals.find((professional) => professional.id === id);
}
