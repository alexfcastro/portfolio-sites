export type BookingStatus = "confirmado" | "concluido" | "cancelado";

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
  priceCents: number;
  customerName: string;
  status: BookingStatus;
  /** "seed" = agenda de exemplo; "visitor" = criado neste navegador. */
  origin: "seed" | "visitor";
}

/** Momento atual no fuso do negócio. */
export interface BusinessNow {
  date: string;
  minutes: number;
}
