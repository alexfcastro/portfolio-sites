/*
 * Torque Auto Center é uma oficina fictícia. Serviços, faixas de preço e prazos
 * são dados de demonstração: a estimativa é ilustrativa e não substitui avaliação.
 */

export interface Symptom {
  id: string;
  label: string;
  /** Serviços prováveis para esse sintoma. */
  serviceIds: string[];
}

export interface ProblemCategory {
  id: string;
  name: string;
  description: string;
  symptoms: Symptom[];
}

export interface GarageService {
  id: string;
  name: string;
  description: string;
  /** Faixa demonstrativa em centavos (peças + mão de obra). */
  minCents: number;
  maxCents: number;
}

export const services: GarageService[] = [
  { id: "pastilhas", name: "Troca de pastilhas de freio", description: "Eixo dianteiro, com revisão dos discos.", minCents: 18000, maxCents: 32000 },
  { id: "discos", name: "Retífica ou troca de discos", description: "Quando há vibração ou desgaste irregular.", minCents: 26000, maxCents: 58000 },
  { id: "fluido-freio", name: "Troca do fluido de freio", description: "Sangria completa do sistema.", minCents: 12000, maxCents: 18000 },
  { id: "amortecedores", name: "Amortecedores", description: "Par dianteiro ou traseiro.", minCents: 52000, maxCents: 110000 },
  { id: "alinhamento", name: "Alinhamento e balanceamento", description: "Quatro rodas.", minCents: 12000, maxCents: 18000 },
  { id: "bieletas", name: "Bieletas e buchas", description: "Ruídos em lombadas e buracos.", minCents: 16000, maxCents: 34000 },
  { id: "diagnostico", name: "Diagnóstico eletrônico", description: "Leitura de códigos de falha com scanner.", minCents: 9000, maxCents: 15000 },
  { id: "velas", name: "Velas e cabos de ignição", description: "Falhas e perda de potência.", minCents: 16000, maxCents: 38000 },
  { id: "arrefecimento", name: "Sistema de arrefecimento", description: "Mangueiras, válvula termostática e aditivo.", minCents: 22000, maxCents: 60000 },
  { id: "bateria", name: "Teste e troca de bateria", description: "Com teste do alternador.", minCents: 38000, maxCents: 72000 },
  { id: "carga-ar", name: "Recarga do ar-condicionado", description: "Com teste de vazamento.", minCents: 22000, maxCents: 34000 },
  { id: "filtro-cabine", name: "Filtro de cabine e higienização", description: "Mau cheiro e pouco fluxo de ar.", minCents: 12000, maxCents: 20000 },
  { id: "revisao", name: "Revisão com troca de óleo", description: "Óleo, filtros e checklist de 30 itens.", minCents: 28000, maxCents: 52000 },
];

export const problemCategories: ProblemCategory[] = [
  {
    id: "freios",
    name: "Freios",
    description: "Ruídos, pedal diferente ou carro puxando ao frear.",
    symptoms: [
      { id: "ruido-freio", label: "Chiado ou ruído metálico ao frear", serviceIds: ["pastilhas"] },
      { id: "vibra-freio", label: "Volante ou pedal vibra ao frear", serviceIds: ["discos"] },
      { id: "pedal-baixo", label: "Pedal baixo ou “esponjoso”", serviceIds: ["fluido-freio", "diagnostico"] },
    ],
  },
  {
    id: "suspensao",
    name: "Suspensão e direção",
    description: "Batidas, carro puxando ou pneus gastando de forma irregular.",
    symptoms: [
      { id: "batida", label: "Barulho em lombadas e buracos", serviceIds: ["bieletas", "amortecedores"] },
      { id: "puxa", label: "Carro puxa para um lado", serviceIds: ["alinhamento"] },
      { id: "balanca", label: "Carro balança demais em curvas", serviceIds: ["amortecedores"] },
    ],
  },
  {
    id: "motor",
    name: "Motor",
    description: "Falhas, perda de força, superaquecimento ou luz de injeção.",
    symptoms: [
      { id: "luz-injecao", label: "Luz da injeção acesa", serviceIds: ["diagnostico"] },
      { id: "falhando", label: "Motor falhando ou sem força", serviceIds: ["diagnostico", "velas"] },
      { id: "esquentando", label: "Temperatura subindo demais", serviceIds: ["arrefecimento"] },
    ],
  },
  {
    id: "eletrica",
    name: "Elétrica",
    description: "Partida difícil, bateria descarregando ou luzes do painel.",
    symptoms: [
      { id: "partida", label: "Dificuldade para dar partida", serviceIds: ["bateria"] },
      { id: "painel", label: "Luzes de alerta no painel", serviceIds: ["diagnostico"] },
    ],
  },
  {
    id: "ar",
    name: "Ar-condicionado",
    description: "Não gela, faz barulho ou tem mau cheiro.",
    symptoms: [
      { id: "nao-gela", label: "Não gela ou gela pouco", serviceIds: ["carga-ar"] },
      { id: "cheiro", label: "Mau cheiro ao ligar", serviceIds: ["filtro-cabine"] },
    ],
  },
  {
    id: "revisao",
    name: "Revisão",
    description: "Manutenção preventiva por quilometragem ou tempo.",
    symptoms: [{ id: "preventiva", label: "Revisão preventiva / troca de óleo", serviceIds: ["revisao"] }],
  },
];

export const vehicleTypes = [
  { id: "hatch", name: "Hatch" },
  { id: "sedan", name: "Sedã" },
  { id: "suv", name: "SUV" },
  { id: "picape", name: "Picape" },
] as const;

export function getService(id: string): GarageService | undefined {
  return services.find((service) => service.id === id);
}

export function getCategory(id: string): ProblemCategory | undefined {
  return problemCategories.find((category) => category.id === id);
}
