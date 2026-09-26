import { contactPeriods, contactSubjects, getArea } from "@/data/firm";

/*
 * Pedido de conversa inicial (simulado). Não pede nome, documentos nem detalhes do
 * processo: só o necessário para direcionar o contato.
 */

export interface ContactInput {
  areaSlug: string;
  subject: string;
  period: string;
  summary: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (!getArea(input.areaSlug)) errors.areaSlug = "Escolha a área relacionada.";
  if (!(contactSubjects as readonly string[]).includes(input.subject)) errors.subject = "Escolha o assunto.";
  if (!(contactPeriods as readonly string[]).includes(input.period)) errors.period = "Escolha o melhor período.";
  const summary = input.summary.trim();
  if (summary.length > 400) errors.summary = "Use no máximo 400 caracteres.";
  return errors;
}

export function buildContactMessage(input: ContactInput): string {
  return [
    "Olá! Gostaria de agendar uma conversa inicial.",
    "",
    `Área: ${getArea(input.areaSlug)?.name}`,
    `Assunto: ${input.subject}`,
    `Melhor período: ${input.period}`,
    ...(input.summary.trim() ? ["", input.summary.trim()] : []),
  ].join("\n");
}

/**
 * Expressões que não devem aparecer em conteúdo de advocacia (promessa de
 * resultado, captação agressiva ou comparação). Usado nos testes do conteúdo.
 */
export const forbiddenExpressions = [
  /garant(imos|ia de|ido)/i,
  /\b100\s?%/,
  /vit[óo]ria/i,
  /causa ganha/i,
  /ganhe (sua|seu|a)/i,
  /melhor(es)? (escrit[óo]rio|advogad)/i,
  /taxa de (sucesso|êxito)/i,
  /resultado (certo|garantido)/i,
  /\bdepoimento/i,
];
