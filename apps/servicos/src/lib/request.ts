import { getRegion, getServiceType } from "@/data/services";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, getWeekday } from "@/lib/time";

/*
 * Regras da solicitação: região atendida, respostas guiadas e até três
 * preferências de visita (dia + período), de amanhã em diante, sem domingos.
 */

export type VisitPeriod = "manha" | "tarde";
export const periodNames: Record<VisitPeriod, string> = { manha: "Manhã (8h–12h)", tarde: "Tarde (13h–18h)" };

export const MAX_PREFERENCES = 3;
export const VISIT_WINDOW_DAYS = 12;

export interface Preference {
  date: string;
  period: VisitPeriod;
}

export function checkRegion(regionId: string): { ok: true; feeCents: number } | { ok: false; message: string } {
  const region = getRegion(regionId);
  if (!region) return { ok: false, message: "Escolha a sua região." };
  if (!region.served) {
    return { ok: false, message: `Ainda não atendemos ${region.name}. Em um site real, aqui entraria uma indicação ou lista de espera.` };
  }
  return { ok: true, feeCents: region.travelFeeCents };
}

export function travelFeeLabel(feeCents: number): string {
  return feeCents === 0 ? "Sem taxa de deslocamento" : `Taxa de deslocamento: ${formatBRL(feeCents)}`;
}

export function validateAnswers(serviceId: string, answers: Record<string, string>, details: string): string | null {
  const service = getServiceType(serviceId);
  if (!service) return "Escolha um serviço.";
  for (const question of service.questions) {
    const answer = answers[question.id];
    if (!answer) return `Responda: ${question.label.toLowerCase()}`;
    if (!question.options.includes(answer)) return `Resposta inválida em “${question.label}”.`;
  }
  if (details.trim().length > 400) return "Detalhes com no máximo 400 caracteres.";
  return null;
}

/** Dias disponíveis para visita: de amanhã até a janela, sem domingos. */
export function visitDates(today: string): string[] {
  return Array.from({ length: VISIT_WINDOW_DAYS }, (_, index) => addDays(today, index + 1)).filter(
    (date) => getWeekday(date) !== 0,
  );
}

export function periodsOn(date: string): VisitPeriod[] {
  // Sábado: só manhã.
  return getWeekday(date) === 6 ? ["manha"] : ["manha", "tarde"];
}

export function togglePreference(list: Preference[], item: Preference): Preference[] {
  const exists = list.some((p) => p.date === item.date && p.period === item.period);
  if (exists) return list.filter((p) => !(p.date === item.date && p.period === item.period));
  if (list.length >= MAX_PREFERENCES) return list;
  return [...list, item].sort((a, b) => a.date.localeCompare(b.date) || a.period.localeCompare(b.period));
}

export function validatePreferences(list: Preference[], today: string): string | null {
  if (list.length === 0) return "Escolha ao menos uma opção de dia e período.";
  if (list.length > MAX_PREFERENCES) return `Escolha no máximo ${MAX_PREFERENCES} opções.`;
  const dates = visitDates(today);
  for (const preference of list) {
    if (!dates.includes(preference.date) || !periodsOn(preference.date).includes(preference.period)) {
      return "Uma das opções escolhidas não está disponível.";
    }
  }
  return null;
}

export function buildRequestMessage(input: {
  code: string;
  serviceId: string;
  regionId: string;
  answers: Record<string, string>;
  details: string;
  preferences: Preference[];
}): string {
  const service = getServiceType(input.serviceId);
  const region = getRegion(input.regionId);
  return [
    `Olá, Resolve! Solicitação ${input.code}:`,
    "",
    `Serviço: ${service?.name}`,
    `Região: ${region?.name}`,
    ...(service?.questions.map((q) => `${q.label} ${input.answers[q.id]}`) ?? []),
    ...(input.details.trim() ? [`Detalhes: ${input.details.trim()}`] : []),
    "",
    "Posso receber a visita em:",
    ...input.preferences.map((p) => `• ${formatDateLong(p.date)}, ${periodNames[p.period].toLowerCase()}`),
  ].join("\n");
}
