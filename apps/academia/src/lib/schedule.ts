import { experienceLevels, getModality, getTeacher, weeklyClasses, type ClassTemplate } from "@/data/studio";
import { addDays, formatDateLong, formatTime, getWeekday, type BusinessNow } from "@/lib/time";

/*
 * Grade de aulas dos próximos dias, com vagas de exemplo e aulas experimentais
 * do visitante. Cada ocorrência é identificada por "idDaAula@AAAA-MM-DD".
 */

export const WINDOW_DAYS = 7;
/** Reserva só até 30 minutos antes do início. */
export const BOOKING_CUTOFF_MIN = 30;

export type Period = "manha" | "tarde" | "noite";
export const periodLabels: Record<Period, string> = { manha: "Manhã", tarde: "Tarde", noite: "Noite" };

export function periodOf(startMin: number): Period {
  if (startMin < 12 * 60) return "manha";
  if (startMin < 18 * 60) return "tarde";
  return "noite";
}

export interface Occurrence {
  key: string;
  date: string;
  template: ClassTemplate;
}

export function occurrenceKey(classId: string, date: string) {
  return `${classId}@${date}`;
}

export function listOccurrences(today: string, days = WINDOW_DAYS): Occurrence[] {
  const result: Occurrence[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(today, offset);
    const weekday = getWeekday(date);
    for (const template of weeklyClasses.filter((c) => c.weekday === weekday).sort((a, b) => a.startMin - b.startMin)) {
      result.push({ key: occurrenceKey(template.id, date), date, template });
    }
  }
  return result;
}

export function findOccurrence(key: string): Occurrence | null {
  const [classId, date] = key.split("@");
  const template = weeklyClasses.find((c) => c.id === classId);
  if (!template || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || getWeekday(date) !== template.weekday) return null;
  return { key, date, template };
}

/** Alunos matriculados de exemplo: determinístico por aula e data; algumas aulas ficam lotadas. */
export function seedEnrolled(occurrence: Occurrence): number {
  const { capacity } = occurrence.template;
  const hash = [...occurrence.key].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 10007, 17);
  if (hash % 6 === 0) return capacity;
  return Math.floor(capacity * 0.35) + (hash % Math.ceil(capacity * 0.55));
}

export interface Trial {
  id: string;
  occurrenceKey: string;
  nickname: string;
  level: (typeof experienceLevels)[number];
  status: "reservada" | "presente" | "cancelada";
}

export function activeTrials(trials: readonly Trial[], key: string) {
  return trials.filter((t) => t.occurrenceKey === key && t.status !== "cancelada").length;
}

export function spotsLeft(occurrence: Occurrence, trials: readonly Trial[]): number {
  return Math.max(0, occurrence.template.capacity - seedEnrolled(occurrence) - activeTrials(trials, occurrence.key));
}

export function hasStarted(occurrence: Occurrence, now: BusinessNow, marginMin = 0): boolean {
  if (occurrence.date !== now.date) return occurrence.date < now.date;
  return now.minutes + marginMin > occurrence.template.startMin;
}

export interface Filters {
  date: string | "todos";
  modalityId: string | "todos";
  teacherId: string | "todos";
  period: Period | "todos";
}

export function filterOccurrences(occurrences: readonly Occurrence[], filters: Filters): Occurrence[] {
  return occurrences.filter(
    (o) =>
      (filters.date === "todos" || o.date === filters.date) &&
      (filters.modalityId === "todos" || o.template.modalityId === filters.modalityId) &&
      (filters.teacherId === "todos" || o.template.teacherId === filters.teacherId) &&
      (filters.period === "todos" || periodOf(o.template.startMin) === filters.period),
  );
}

export function validateNickname(value: string): string | null {
  const nickname = value.trim();
  if (!nickname) return "Informe como podemos te chamar.";
  if (nickname.length > 20) return "Use no máximo 20 caracteres.";
  return null;
}

export function validateTrial(
  input: { occurrenceKey: string; nickname: string; level: string },
  trials: readonly Trial[],
  now: BusinessNow,
): string | null {
  const occurrence = findOccurrence(input.occurrenceKey);
  if (!occurrence || occurrence.date > addDays(now.date, WINDOW_DAYS - 1)) return "Aula não encontrada na grade desta semana.";
  if (hasStarted(occurrence, now, BOOKING_CUTOFF_MIN)) return "As reservas para esta aula já fecharam.";
  const nicknameError = validateNickname(input.nickname);
  if (nicknameError) return nicknameError;
  if (!(experienceLevels as readonly string[]).includes(input.level)) return "Escolha seu nível de experiência.";
  // A aula experimental é uma por pessoa: só uma reserva ativa por vez neste navegador.
  if (trials.some((t) => t.status === "reservada")) return "Você já tem uma aula experimental reservada. Cancele-a para escolher outra.";
  if (spotsLeft(occurrence, trials) === 0) return "Esta aula está lotada. Escolha outro horário.";
  return null;
}

export function describeOccurrence(occurrence: Occurrence) {
  const modality = getModality(occurrence.template.modalityId)!;
  const teacher = getTeacher(occurrence.template.teacherId)!;
  const start = formatTime(occurrence.template.startMin);
  const end = formatTime(occurrence.template.startMin + occurrence.template.durationMin);
  return { modality, teacher, when: `${formatDateLong(occurrence.date)}, ${start} às ${end}` };
}

export function buildTrialMessage(trial: Trial): string {
  const occurrence = findOccurrence(trial.occurrenceKey)!;
  const { modality, teacher, when } = describeOccurrence(occurrence);
  return [
    `Olá, Pulse Studio! Sou ${trial.nickname.trim()} e reservei uma aula experimental (${trial.id}).`,
    `Aula: ${modality.name} com ${teacher.name}`,
    `Quando: ${when}`,
    `Experiência: ${trial.level}`,
  ].join("\n");
}
