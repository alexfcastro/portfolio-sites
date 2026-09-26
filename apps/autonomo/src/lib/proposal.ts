import { offers } from "@/data/profile";
import { formatBRL } from "@/lib/money";

/*
 * Pedido de proposta: coleta o escopo e sugere um pacote com faixa de valor
 * demonstrativa. Não substitui a proposta real, que a profissional enviaria.
 */

export const deadlines = ["Até 1 semana", "Até 2 semanas", "Até 1 mês", "Sem prazo definido"] as const;
export const budgets = ["Até R$ 1.000", "R$ 1.000 a R$ 3.000", "Acima de R$ 3.000", "Ainda não sei"] as const;

export interface ProposalInput {
  offerId: string;
  quantity: number;
  deadline: string;
  budget: string;
  description: string;
}

export type ProposalErrors = Partial<Record<keyof ProposalInput, string>>;

export function validateProposal(input: ProposalInput): ProposalErrors {
  const errors: ProposalErrors = {};
  if (!offers.some((offer) => offer.id === input.offerId)) errors.offerId = "Escolha o tipo de trabalho.";
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 500) {
    errors.quantity = "Informe uma quantidade entre 1 e 500.";
  }
  if (!(deadlines as readonly string[]).includes(input.deadline)) errors.deadline = "Escolha o prazo desejado.";
  if (!(budgets as readonly string[]).includes(input.budget)) errors.budget = "Escolha uma faixa de investimento.";
  const description = input.description.trim();
  if (description.length < 10) errors.description = "Conte em poucas palavras o que você precisa (mínimo de 10 caracteres).";
  else if (description.length > 600) errors.description = "Use no máximo 600 caracteres.";
  return errors;
}

/** Pacote sugerido pelo volume, com faixa demonstrativa (em centavos). */
export function suggestPackage(offerId: string, quantity: number) {
  const offer = offers.find((item) => item.id === offerId);
  if (!offer || quantity < 1) return null;
  const name = quantity <= 10 ? "Essencial" : quantity <= 40 ? "Completo" : "Sob medida";
  // Desconto progressivo por volume: 0%, 10% e 20% sobre o valor unitário de referência.
  const discount = quantity <= 10 ? 0 : quantity <= 40 ? 10 : 20;
  const unit = Math.round((offer.fromCents * (100 - discount)) / 100);
  const minCents = unit * quantity;
  const maxCents = Math.round(minCents * 1.3);
  return { name, discount, minCents, maxCents };
}

export function buildProposalMessage(input: ProposalInput): string {
  const offer = offers.find((item) => item.id === input.offerId);
  const pack = suggestPackage(input.offerId, input.quantity);
  return [
    "Olá, Lia! Gostaria de uma proposta:",
    "",
    `Trabalho: ${offer?.name}`,
    `Quantidade: ${input.quantity}`,
    `Prazo desejado: ${input.deadline}`,
    `Investimento: ${input.budget}`,
    ...(pack ? [`Pacote sugerido no site: ${pack.name} (${formatBRL(pack.minCents)} a ${formatBRL(pack.maxCents)})`] : []),
    "",
    input.description.trim(),
  ].join("\n");
}
