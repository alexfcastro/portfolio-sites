/*
 * Vita Clínica é um negócio fictício. Especialidades, profissionais, horários e
 * respostas são dados de demonstração. Registros profissionais (CRM, CRN, CREFITO,
 * CRP) não são exibidos porque os profissionais não existem.
 */

export type Period = "manha" | "tarde";

export const periodLabels: Record<Period, string> = {
  manha: "Manhã (8h às 12h)",
  tarde: "Tarde (13h às 18h)",
};

export interface Specialty {
  id: string;
  name: string;
  summary: string;
  description: string;
  forWhom: string[];
  preparation: string[];
  durationMin: number;
}

export interface Professional {
  id: string;
  name: string;
  specialtyId: string;
  approach: string;
  /** Dia da semana (1 = segunda … 6 = sábado) → períodos de atendimento. */
  schedule: Partial<Record<number, Period[]>>;
}

export const specialties: Specialty[] = [
  {
    id: "clinica-geral",
    name: "Clínica geral",
    summary: "Check-up, acompanhamento e orientação sobre o próximo passo.",
    description:
      "Consulta de rotina para acompanhamento de saúde, avaliação geral e orientação sobre exames e especialistas, quando necessário.",
    forWhom: ["Check-up anual", "Acompanhamento de rotina", "Dúvidas sobre qual especialista procurar"],
    preparation: ["Leve seus exames mais recentes, se tiver", "Chegue 10 minutos antes para o cadastro"],
    durationMin: 30,
  },
  {
    id: "dermatologia",
    name: "Dermatologia",
    summary: "Cuidados com pele, cabelos e unhas.",
    description:
      "Consultas para avaliação da pele, cabelos e unhas, com orientação sobre cuidados diários e acompanhamento.",
    forWhom: ["Avaliação de pintas e manchas", "Cuidados com a pele", "Queda de cabelo"],
    preparation: ["Evite maquiagem na região a ser avaliada", "Traga a lista de produtos que usa"],
    durationMin: 30,
  },
  {
    id: "nutricao",
    name: "Nutrição",
    summary: "Plano alimentar adequado à sua rotina.",
    description:
      "Avaliação dos hábitos alimentares e construção de um plano realista, com acompanhamento periódico.",
    forWhom: ["Reeducação alimentar", "Alimentação para atividade física", "Organização da rotina de refeições"],
    preparation: ["Anote o que comeu nos últimos 3 dias", "Use roupas leves para a avaliação"],
    durationMin: 50,
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    summary: "Reabilitação, postura e movimento.",
    description: "Avaliação funcional e sessões de reabilitação, com exercícios orientados para a sua necessidade.",
    forWhom: ["Reabilitação após lesões", "Postura no trabalho", "Retorno à atividade física"],
    preparation: ["Use roupas confortáveis", "Traga exames de imagem, se tiver"],
    durationMin: 50,
  },
  {
    id: "psicologia",
    name: "Psicologia",
    summary: "Escuta e acompanhamento em um ambiente acolhedor.",
    description: "Atendimento psicológico individual, com sessões semanais ou quinzenais combinadas no primeiro encontro.",
    forWhom: ["Ansiedade e estresse", "Momentos de mudança", "Autoconhecimento"],
    preparation: ["Nenhuma preparação necessária", "O primeiro encontro é uma conversa de acolhimento"],
    durationMin: 50,
  },
  {
    id: "pediatria",
    name: "Pediatria",
    summary: "Acompanhamento do crescimento e desenvolvimento infantil.",
    description: "Consultas de rotina para bebês, crianças e adolescentes, com orientação para as famílias.",
    forWhom: ["Puericultura", "Consultas de rotina", "Orientação sobre alimentação infantil"],
    preparation: ["Traga a caderneta de vacinação", "Leve um brinquedo ou livro para a espera"],
    durationMin: 30,
  },
];

export const professionals: Professional[] = [
  {
    id: "helena",
    name: "Dra. Helena Martins",
    specialtyId: "clinica-geral",
    approach: "Consultas sem pressa, com foco em prevenção.",
    schedule: { 1: ["manha", "tarde"], 3: ["manha"], 5: ["tarde"] },
  },
  {
    id: "rui",
    name: "Dr. Rui Albuquerque",
    specialtyId: "clinica-geral",
    approach: "Acompanhamento de rotina e orientação clara.",
    schedule: { 2: ["manha", "tarde"], 4: ["tarde"], 6: ["manha"] },
  },
  {
    id: "paula",
    name: "Dra. Paula Rezende",
    specialtyId: "dermatologia",
    approach: "Cuidados com a pele explicados passo a passo.",
    schedule: { 2: ["tarde"], 4: ["manha", "tarde"] },
  },
  {
    id: "marina",
    name: "Marina Costa",
    specialtyId: "nutricao",
    approach: "Planos alimentares possíveis para a vida real.",
    schedule: { 1: ["tarde"], 3: ["manha", "tarde"], 6: ["manha"] },
  },
  {
    id: "tiago",
    name: "Tiago Lemos",
    specialtyId: "fisioterapia",
    approach: "Reabilitação ativa, com exercícios para casa.",
    schedule: { 1: ["manha"], 2: ["manha"], 4: ["manha"], 5: ["manha", "tarde"] },
  },
  {
    id: "carla",
    name: "Carla Nunes",
    specialtyId: "psicologia",
    approach: "Escuta atenta e acolhedora.",
    schedule: { 2: ["tarde"], 3: ["tarde"], 5: ["manha"] },
  },
  {
    id: "beatriz",
    name: "Dra. Beatriz Farias",
    specialtyId: "pediatria",
    approach: "Consultas tranquilas para crianças e famílias.",
    schedule: { 1: ["manha"], 3: ["manha", "tarde"], 5: ["manha"] },
  },
];

export const faq = [
  {
    question: "A solicitação já garante o horário?",
    answer:
      "Não. Você indica o dia e o período de preferência e a recepção confirma o horário exato. Nesta demonstração, a confirmação é simulada.",
  },
  {
    question: "Preciso informar sintomas ao solicitar?",
    answer:
      "Não. O formulário pede apenas especialidade, profissional e preferência de horário. Informações de saúde são tratadas na consulta.",
  },
  {
    question: "Vocês atendem convênios?",
    answer:
      "Em um site real, esta resposta listaria os convênios aceitos. A Vita Clínica é fictícia, por isso não há lista.",
  },
  {
    question: "Como cancelo ou remarco?",
    answer:
      "Na página “Minhas solicitações” você pode cancelar uma solicitação de demonstração. Em um site real, a remarcação seria feita pela recepção.",
  },
];

/** Identidade fictícia usada em todas as solicitações da demo. */
export const demoPatientName = "Paciente de demonstração";

export function getSpecialty(id: string): Specialty | undefined {
  return specialties.find((item) => item.id === id);
}

export function getProfessional(id: string): Professional | undefined {
  return professionals.find((item) => item.id === id);
}

export function professionalsFor(specialtyId: string): Professional[] {
  return professionals.filter((item) => item.specialtyId === specialtyId);
}
