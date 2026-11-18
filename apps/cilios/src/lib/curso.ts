import { addDays, getWeekday } from "@/lib/time";

/*
 * Turma do curso de extensão de cílios do Lash Lab (fictício). Turmas pequenas, de três alunas, em um fim de
 * semana. Valores em centavos. Tudo puro, para poder ser testado.
 */

export const TURMA = {
  vagasTotal: 3,
  /** Vagas já ocupadas antes de a visitante chegar (simulação). */
  ocupadasIniciais: 1,
  /** Investimento à vista no Pix. */
  aVista: 189000,
  /** No cartão o valor cheio, parcelado sem juros. */
  cartao: 199000,
  parcelasMax: 10,
  /** Sinal para garantir a vaga no Pix (abatido do total). */
  sinal: 50000,
} as const;

/**
 * Próxima turma: o primeiro sábado que esteja a pelo menos 14 dias de hoje (tempo de a aluna se organizar e
 * receber o material). A turma ocupa sábado e domingo.
 */
export function proximaTurma(hoje: string): { sabado: string; domingo: string } {
  let data = addDays(hoje, 14);
  while (getWeekday(data) !== 6) data = addDays(data, 1);
  return { sabado: data, domingo: addDays(data, 1) };
}

export function vagasRestantes(reservas: number): number {
  return Math.max(0, TURMA.vagasTotal - TURMA.ocupadasIniciais - reservas);
}

export type Pagamento = "pix" | "cartao";

export function parcela(parcelas: number): number {
  const n = Math.min(Math.max(1, Math.round(parcelas)), TURMA.parcelasMax);
  return Math.round(TURMA.cartao / n);
}

export type Experiencia = "nunca" | "cilios" | "beleza";

export const experienciaLabels: Record<Experiencia, string> = {
  nunca: "Nunca trabalhei com beleza",
  cilios: "Já faço cílios e quero melhorar",
  beleza: "Trabalho com outra área da beleza",
};

export interface Reserva {
  nome: string;
  whatsapp: string;
  experiencia: Experiencia | "";
  pagamento: Pagamento | "";
  parcelas: number;
}

export type ErrosReserva = Partial<Record<"nome" | "whatsapp" | "experiencia" | "pagamento", string>>;

export function validarReserva(r: Reserva): ErrosReserva {
  const erros: ErrosReserva = {};
  if (r.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (r.whatsapp.replace(/\D/g, "").length < 10) erros.whatsapp = "Informe um WhatsApp com DDD.";
  if (!r.experiencia) erros.experiencia = "Conte a sua experiência, para a turma ser montada no nível certo.";
  if (!r.pagamento) erros.pagamento = "Escolha a forma de pagamento.";
  return erros;
}
