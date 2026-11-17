/*
 * Contas das landing pages. Valores em centavos (inteiros). São regras de demonstração:
 * ilustram o funcionamento da página, não são tabela nem estudo técnico real.
 */

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Clube Serra Alta (assinatura de café) ---------- */

export const coffeeSizes = [
  { id: "250", label: "250 g", cents: 3900 },
  { id: "500", label: "500 g", cents: 6900 },
  { id: "1000", label: "1 kg", cents: 12400 },
] as const;

export const coffeeFrequencies = [
  { id: "mensal", label: "Todo mês", deliveries: 1 },
  { id: "quinzenal", label: "A cada 15 dias", deliveries: 2 },
] as const;

export const coffeeGrinds = ["Em grãos", "Moído para coador", "Moído para prensa", "Moído para espresso"] as const;

/** Entregas quinzenais ganham 10% de desconto em cada pacote (arredondado para o centavo). */
export function coffeePlan(sizeId: string, frequencyId: string) {
  const size = coffeeSizes.find((item) => item.id === sizeId) ?? coffeeSizes[0];
  const frequency = coffeeFrequencies.find((item) => item.id === frequencyId) ?? coffeeFrequencies[0];
  const perDelivery = frequency.deliveries > 1 ? Math.round(size.cents * 0.9) : size.cents;
  return { size, frequency, perDeliveryCents: perDelivery, monthlyCents: perDelivery * frequency.deliveries };
}

/* ---------- Solar Viva (simulação de economia) ---------- */

export const SOLAR_MIN_BILL = 15000;
export const SOLAR_MAX_BILL = 200000;

/**
 * Estimativa ilustrativa: considera que o sistema cobre 85% da conta e que cada painel
 * corresponde a R$ 70,00 de conta mensal. Em um site real, viria de um estudo com dados do cliente.
 */
export function solarEstimate(billCents: number) {
  const bill = Math.min(SOLAR_MAX_BILL, Math.max(SOLAR_MIN_BILL, Math.round(billCents)));
  const monthlySavingCents = Math.round(bill * 0.85);
  return {
    billCents: bill,
    monthlySavingCents,
    yearlySavingCents: monthlySavingCents * 12,
    panels: Math.max(4, Math.ceil(bill / 7000)),
  };
}

/* ---------- Agenda Leve (planos) ---------- */

export const agendaPlans = [
  { id: "solo", name: "Solo", monthlyCents: 3900, seats: "1 profissional", features: ["Agenda on-line", "Lembrete por WhatsApp", "Página de agendamento"] },
  { id: "equipe", name: "Equipe", monthlyCents: 8900, seats: "Até 5 profissionais", features: ["Tudo do Solo", "Agenda por profissional", "Relatório mensal"] },
  { id: "casa", name: "Casa cheia", monthlyCents: 15900, seats: "Profissionais ilimitados", features: ["Tudo do Equipe", "Várias unidades", "Suporte prioritário"] },
] as const;

/** No plano anual, paga-se o equivalente a 10 meses: o valor mensal mostrado é o total dividido por 12. */
export function agendaPrice(monthlyCents: number, annual: boolean): number {
  return annual ? Math.round((monthlyCents * 10) / 12) : monthlyCents;
}
