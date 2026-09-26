/*
 * Pulse Studio é uma academia fictícia. Modalidades, professores, grade,
 * vagas e planos são dados de demonstração. Preços em centavos.
 */

export type Intensity = "leve" | "moderada" | "alta";

export interface Modality {
  id: string;
  name: string;
  description: string;
  intensity: Intensity;
}

export const modalities: Modality[] = [
  { id: "funcional", name: "Funcional", description: "Circuitos com o peso do corpo, elásticos e kettlebell.", intensity: "alta" },
  { id: "bike", name: "Bike indoor", description: "Pedal em grupo com música e variação de ritmo.", intensity: "alta" },
  { id: "hiit", name: "HIIT", description: "Intervalos curtos e intensos, com pausas controladas.", intensity: "alta" },
  { id: "pilates", name: "Pilates solo", description: "Força do centro do corpo, postura e controle.", intensity: "moderada" },
  { id: "danca", name: "Dança", description: "Coreografias simples para suar sem perceber.", intensity: "moderada" },
  { id: "yoga", name: "Yoga", description: "Respiração, alongamento e equilíbrio.", intensity: "leve" },
];

export const intensityLabels: Record<Intensity, string> = { leve: "Leve", moderada: "Moderada", alta: "Alta" };

export interface Teacher {
  id: string;
  name: string;
  modalityIds: string[];
  bio: string;
}

export const teachers: Teacher[] = [
  { id: "nina", name: "Nina", modalityIds: ["funcional", "hiit"], bio: "Gosta de treinos curtos e bem explicados." },
  { id: "caio", name: "Caio", modalityIds: ["bike", "hiit"], bio: "Monta playlists para cada aula." },
  { id: "duda", name: "Duda", modalityIds: ["yoga", "pilates"], bio: "Foco em respiração e postura." },
  { id: "rafa", name: "Rafa", modalityIds: ["danca", "funcional"], bio: "Aulas animadas para todos os níveis." },
];

export interface ClassTemplate {
  id: string;
  modalityId: string;
  teacherId: string;
  /** 0 = domingo … 6 = sábado */
  weekday: number;
  startMin: number;
  durationMin: number;
  capacity: number;
}

const h = (hour: number, min = 0) => hour * 60 + min;

/** Grade semanal fixa. Domingo fechado. */
export const weeklyClasses: ClassTemplate[] = [
  { id: "seg-0630-funcional", modalityId: "funcional", teacherId: "nina", weekday: 1, startMin: h(6, 30), durationMin: 50, capacity: 16 },
  { id: "seg-1200-yoga", modalityId: "yoga", teacherId: "duda", weekday: 1, startMin: h(12), durationMin: 60, capacity: 12 },
  { id: "seg-1830-bike", modalityId: "bike", teacherId: "caio", weekday: 1, startMin: h(18, 30), durationMin: 45, capacity: 20 },
  { id: "seg-1930-danca", modalityId: "danca", teacherId: "rafa", weekday: 1, startMin: h(19, 30), durationMin: 50, capacity: 18 },
  { id: "ter-0700-pilates", modalityId: "pilates", teacherId: "duda", weekday: 2, startMin: h(7), durationMin: 50, capacity: 10 },
  { id: "ter-1800-hiit", modalityId: "hiit", teacherId: "nina", weekday: 2, startMin: h(18), durationMin: 30, capacity: 14 },
  { id: "ter-1900-funcional", modalityId: "funcional", teacherId: "rafa", weekday: 2, startMin: h(19), durationMin: 50, capacity: 16 },
  { id: "qua-0630-bike", modalityId: "bike", teacherId: "caio", weekday: 3, startMin: h(6, 30), durationMin: 45, capacity: 20 },
  { id: "qua-1200-funcional", modalityId: "funcional", teacherId: "nina", weekday: 3, startMin: h(12), durationMin: 50, capacity: 16 },
  { id: "qua-1830-yoga", modalityId: "yoga", teacherId: "duda", weekday: 3, startMin: h(18, 30), durationMin: 60, capacity: 12 },
  { id: "qua-1930-hiit", modalityId: "hiit", teacherId: "caio", weekday: 3, startMin: h(19, 30), durationMin: 30, capacity: 14 },
  { id: "qui-0700-funcional", modalityId: "funcional", teacherId: "rafa", weekday: 4, startMin: h(7), durationMin: 50, capacity: 16 },
  { id: "qui-1800-pilates", modalityId: "pilates", teacherId: "duda", weekday: 4, startMin: h(18), durationMin: 50, capacity: 10 },
  { id: "qui-1900-danca", modalityId: "danca", teacherId: "rafa", weekday: 4, startMin: h(19), durationMin: 50, capacity: 18 },
  { id: "sex-0630-hiit", modalityId: "hiit", teacherId: "nina", weekday: 5, startMin: h(6, 30), durationMin: 30, capacity: 14 },
  { id: "sex-1200-bike", modalityId: "bike", teacherId: "caio", weekday: 5, startMin: h(12), durationMin: 45, capacity: 20 },
  { id: "sex-1830-funcional", modalityId: "funcional", teacherId: "nina", weekday: 5, startMin: h(18, 30), durationMin: 50, capacity: 16 },
  { id: "sab-0900-yoga", modalityId: "yoga", teacherId: "duda", weekday: 6, startMin: h(9), durationMin: 60, capacity: 12 },
  { id: "sab-1000-danca", modalityId: "danca", teacherId: "rafa", weekday: 6, startMin: h(10), durationMin: 50, capacity: 18 },
  { id: "sab-1100-bike", modalityId: "bike", teacherId: "caio", weekday: 6, startMin: h(11), durationMin: 45, capacity: 20 },
];

export interface Plan {
  id: string;
  name: string;
  monthlyCents: number;
  commitment: string;
  perks: string[];
  highlight?: boolean;
}

export const plans: Plan[] = [
  {
    id: "mensal",
    name: "Mensal",
    monthlyCents: 18900,
    commitment: "Sem fidelidade",
    perks: ["Todas as modalidades", "Até 3 aulas por semana"],
  },
  {
    id: "trimestral",
    name: "Trimestral",
    monthlyCents: 16900,
    commitment: "Pagamento a cada 3 meses",
    perks: ["Todas as modalidades", "Aulas ilimitadas", "Avaliação inicial"],
    highlight: true,
  },
  {
    id: "anual",
    name: "Anual",
    monthlyCents: 14900,
    commitment: "Compromisso de 12 meses",
    perks: ["Todas as modalidades", "Aulas ilimitadas", "Avaliação a cada trimestre"],
  },
];

export const experienceLevels = ["Nunca treinei", "Treino às vezes", "Treino com frequência"] as const;

export function getModality(id: string): Modality | undefined {
  return modalities.find((m) => m.id === id);
}

export function getTeacher(id: string): Teacher | undefined {
  return teachers.find((t) => t.id === id);
}
