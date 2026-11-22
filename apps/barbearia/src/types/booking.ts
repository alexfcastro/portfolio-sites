export type BookingStatus = "confirmado" | "concluido" | "cancelado";

/**
 * Como o cliente escolheu pagar.
 * - `sinal`: parte do valor por Pix no agendamento, o resto na barbearia;
 * - `total`: tudo por Pix no agendamento;
 * - `local`: tudo na barbearia;
 * - `plano`: coberto pela assinatura mensal;
 * - `recompensa`: coberto pelo cartão fidelidade.
 */
export type PaymentMode = "sinal" | "total" | "local" | "plano" | "recompensa";

/** Situação do Pix antecipado. `null` quando não há Pix (local, plano, recompensa). */
export type PixStatus = "pendente" | "pago" | null;

/** Resposta ao lembrete automático. */
export type Presence = "pendente" | "confirmada";

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  /** Preço demonstrativo em centavos. */
  priceCents: number;
  professionalIds: string[];
}

export interface Professional {
  id: string;
  name: string;
  shortName: string;
  role: string;
  bio: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  professionalId: string;
  /** Data no fuso do negócio, AAAA-MM-DD. */
  date: string;
  /** Minutos desde a meia-noite, no fuso do negócio. */
  startMin: number;
  endMin: number;
  /** Preço de tabela do serviço. */
  priceCents: number;
  customerName: string;
  status: BookingStatus;
  /** "seed" = agenda de exemplo; "visitor" = criado neste navegador. */
  origin: "seed" | "visitor";
  payment: PaymentMode;
  /** Quanto deve ser pago por Pix no agendamento (0 quando não há Pix). */
  pixCents: number;
  pixStatus: PixStatus;
  presence: Presence;
  /** Encaixado a partir da lista de espera. */
  fromWaitlist?: boolean;
  /** Observação do cliente para o barbeiro (até 140 caracteres). */
  note?: string;
  /** Quem cancelou: o cliente pelo site, a barbearia pelo painel ou o sistema (Pix não pago). */
  cancelledBy?: "cliente" | "barbearia" | "sistema";
  /** O Pix pago foi devolvido no cancelamento. */
  refunded?: boolean;
  /** Até quando o Pix pendente segura o horário (milissegundos desde 1970). */
  pixExpiresAt?: number;
}

/** Horário bloqueado pelo dono (almoço, folga, imprevisto). */
export interface Block {
  id: string;
  professionalId: string;
  date: string;
  startMin: number;
  endMin: number;
  reason: string;
}

export type Period = "manha" | "tarde" | "noite";

export interface WaitEntry {
  id: string;
  customerName: string;
  serviceId: string;
  /** "qualquer" = aceita qualquer profissional que faça o serviço. */
  professionalId: string;
  date: string;
  period: Period;
  status: "aguardando" | "avisado" | "encaixado";
  origin: "seed" | "visitor";
}

export interface Subscription {
  planId: string;
  /** Usos no mês atual. */
  used: number;
  /** Pix da primeira mensalidade. */
  pixStatus: "pendente" | "pago";
}

/** Momento atual no fuso do negócio. */
export interface BusinessNow {
  date: string;
  minutes: number;
}

/* ---------- Loja ---------- */

export interface CartItem {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  qty: number;
  /** Preço unitário no momento da compra. */
  unitCents: number;
}

/** Retirada junto com um horário marcado, ou no balcão num dia escolhido. */
export type Pickup = { mode: "horario"; bookingId: string } | { mode: "balcao"; date: string };

export type OrderStatus = "separar" | "pronto" | "retirado" | "cancelado";

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  pickup: Pickup;
  /** Pix na hora (com desconto) ou pagamento na retirada. */
  payment: "pix" | "retirada";
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  pixStatus: PixStatus;
  pixExpiresAt?: number;
  status: OrderStatus;
  origin: "seed" | "visitor";
  refunded?: boolean;
}
