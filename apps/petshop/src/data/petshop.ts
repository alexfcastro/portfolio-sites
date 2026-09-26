/*
 * PetVille é um pet shop fictício. Serviços, preços, profissionais e horários
 * são dados de demonstração. Preços em centavos.
 */

export type Species = "cao" | "gato";
export type Size = "pequeno" | "medio" | "grande";

export const speciesLabels: Record<Species, string> = { cao: "Cachorro", gato: "Gato" };
export const sizeLabels: Record<Size, string> = { pequeno: "Pequeno", medio: "Médio", grande: "Grande" };
export const sizeHints: Record<Size, string> = { pequeno: "até 10 kg", medio: "10 a 25 kg", grande: "acima de 25 kg" };

export interface PetService {
  id: string;
  name: string;
  description: string;
  species: Species[];
  /** Duração-base (porte pequeno), em minutos. */
  baseMinutes: number;
  /** Preço por porte, em centavos. */
  priceCents: Record<Size, number>;
}

export const services: PetService[] = [
  {
    id: "banho",
    name: "Banho",
    description: "Banho com produtos neutros, secagem e escovação.",
    species: ["cao", "gato"],
    baseMinutes: 45,
    priceCents: { pequeno: 5000, medio: 6500, grande: 8500 },
  },
  {
    id: "banho-higienica",
    name: "Banho e tosa higiênica",
    description: "Banho completo com aparo das patas, barriga e região íntima.",
    species: ["cao"],
    baseMinutes: 60,
    priceCents: { pequeno: 6500, medio: 8000, grande: 10500 },
  },
  {
    id: "banho-tosa",
    name: "Banho e tosa completa",
    description: "Banho e tosa na máquina ou tesoura, conforme a raça.",
    species: ["cao"],
    baseMinutes: 90,
    priceCents: { pequeno: 8500, medio: 11000, grande: 14500 },
  },
  {
    id: "hidratacao",
    name: "Banho com hidratação",
    description: "Banho com máscara hidratante para pelos ressecados.",
    species: ["cao", "gato"],
    baseMinutes: 60,
    priceCents: { pequeno: 7000, medio: 8500, grande: 11000 },
  },
];

/** Multiplicador de tempo por porte. */
export const sizeFactor: Record<Size, number> = { pequeno: 1, medio: 1.25, grande: 1.5 };

export const groomers = [
  { id: "bia", name: "Bia", specialty: "Cães de pelo longo" },
  { id: "tom", name: "Tom", specialty: "Gatos e cães pequenos" },
];

/** Terça a sábado, 9h às 18h (0 = domingo). */
export const openingHours: Record<number, { openMin: number; closeMin: number } | null> = {
  0: null,
  1: null,
  2: { openMin: 540, closeMin: 1080 },
  3: { openMin: 540, closeMin: 1080 },
  4: { openMin: 540, closeMin: 1080 },
  5: { openMin: 540, closeMin: 1080 },
  6: { openMin: 540, closeMin: 1020 },
};

export const packages = [
  { name: "Mensal", detail: "4 banhos no mês", discount: "10% de desconto sobre o avulso" },
  { name: "Quinzenal", detail: "2 banhos no mês", discount: "5% de desconto sobre o avulso" },
];

export const faq = [
  { q: "Preciso levar coleira e guia?", a: "Sim, para a segurança do seu pet na chegada e na saída." },
  { q: "Posso acompanhar o banho?", a: "Em um site real, esta resposta traria a regra da casa. Aqui é um exemplo." },
  { q: "E se meu pet for bravo?", a: "Informe no agendamento; a equipe organiza o atendimento com mais calma." },
];

export function getService(id: string): PetService | undefined {
  return services.find((service) => service.id === id);
}
