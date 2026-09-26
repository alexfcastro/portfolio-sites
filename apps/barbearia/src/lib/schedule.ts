import { business, getService, professionals, seedCustomerNames, services } from "@/data/business";
import { addDays, getWeekday } from "@/lib/time";
import type { Booking, BusinessNow, Service } from "@/types/booking";

export interface OpeningWindow {
  openMin: number;
  closeMin: number;
}

export function getOpeningWindow(date: string): OpeningWindow | null {
  return business.hours[getWeekday(date)] ?? null;
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Datas exibidas no agendamento: de hoje até o fim da janela. */
export function getBookableDates(today: string): string[] {
  return Array.from({ length: business.bookingWindowDays }, (_, index) => addDays(today, index));
}

function fitsOpeningHours(date: string, startMin: number, endMin: number): boolean {
  const window = getOpeningWindow(date);
  if (!window) return false;
  if (startMin < window.openMin || endMin > window.closeMin) return false;
  if (overlaps(startMin, endMin, business.lunch.startMin, business.lunch.endMin)) return false;
  return (startMin - window.openMin) % business.slotStepMin === 0;
}

function isInPast(date: string, startMin: number, now: BusinessNow): boolean {
  if (date < now.date) return true;
  return date === now.date && startMin < now.minutes + business.minLeadMin;
}

function conflicts(
  bookings: readonly Booking[],
  professionalId: string,
  date: string,
  startMin: number,
  endMin: number,
  ignoreId?: string,
): boolean {
  return bookings.some(
    (booking) =>
      booking.id !== ignoreId &&
      booking.status !== "cancelado" &&
      booking.professionalId === professionalId &&
      booking.date === date &&
      overlaps(startMin, endMin, booking.startMin, booking.endMin),
  );
}

export interface SlotQuery {
  date: string;
  service: Service;
  professionalId: string;
  bookings: readonly Booking[];
  now: BusinessNow;
}

/** Inícios livres (minutos) para o serviço e profissional na data. */
export function listAvailableStarts({ date, service, professionalId, bookings, now }: SlotQuery): number[] {
  const window = getOpeningWindow(date);
  if (!window || !service.professionalIds.includes(professionalId)) return [];

  const starts: number[] = [];
  for (let start = window.openMin; start + service.durationMin <= window.closeMin; start += business.slotStepMin) {
    const end = start + service.durationMin;
    if (!fitsOpeningHours(date, start, end)) continue;
    if (isInPast(date, start, now)) continue;
    if (conflicts(bookings, professionalId, date, start, end)) continue;
    starts.push(start);
  }
  return starts;
}

export interface NewBookingInput {
  serviceId: string;
  professionalId: string;
  date: string;
  startMin: number;
}

/** Revalida tudo no momento de confirmar. Retorna a mensagem de erro ou `null`. */
export function validateNewBooking(
  input: NewBookingInput,
  bookings: readonly Booking[],
  now: BusinessNow,
  ignoreId?: string,
): string | null {
  const service = getService(input.serviceId);
  if (!service) return "Serviço inválido.";
  if (!service.professionalIds.includes(input.professionalId)) {
    return "Este profissional não realiza o serviço escolhido.";
  }
  const lastDate = addDays(now.date, business.bookingWindowDays - 1);
  if (input.date > lastDate) return "Data fora da agenda disponível.";

  const endMin = input.startMin + service.durationMin;
  if (!fitsOpeningHours(input.date, input.startMin, endMin)) return "Horário fora do funcionamento.";
  if (isInPast(input.date, input.startMin, now)) return "Este horário já passou. Escolha outro.";
  if (conflicts(bookings, input.professionalId, input.date, input.startMin, endMin, ignoreId)) {
    return "Este horário acabou de ser ocupado. Escolha outro.";
  }
  return null;
}

/** Gerador pseudoaleatório determinístico (mulberry32) para a agenda de exemplo. */
function createRandom(seedText: string): () => number {
  let seed = 0;
  for (const char of seedText) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) | 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Existe algum início livre (ignorando o relógio) para a duração, no dia do profissional? */
export function hasFreeWindow(
  date: string,
  professionalId: string,
  durationMin: number,
  bookings: readonly Booking[],
): boolean {
  const window = getOpeningWindow(date);
  if (!window) return false;
  for (let start = window.openMin; start + durationMin <= window.closeMin; start += business.slotStepMin) {
    const end = start + durationMin;
    if (fitsOpeningHours(date, start, end) && !conflicts(bookings, professionalId, date, start, end)) return true;
  }
  return false;
}

/**
 * Agenda de exemplo para os próximos 7 dias, sempre relativa à data atual,
 * para que a demo nunca apresente horários vencidos. Sem sobreposição, mais
 * cheia nos primeiros dias e com garantia de vaga: em todo dia futuro, cada
 * profissional mantém ao menos uma janela para o seu serviço mais longo.
 */
export function generateSeedBookings(now: BusinessNow): Booking[] {
  const bookings: Booking[] = [];
  let counter = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    const date = addDays(now.date, offset);
    const window = getOpeningWindow(date);
    if (!window) continue;
    const busyChance = Math.max(0.12, 0.34 - offset * 0.035);

    for (const professional of professionals) {
      const random = createRandom(`${date}:${professional.id}`);
      const options = services.filter((service) => service.professionalIds.includes(professional.id));
      const longest = Math.max(...options.map((service) => service.durationMin));
      const dayStartIndex = bookings.length;
      let start = window.openMin;

      while (start < window.closeMin) {
        const service = options[Math.floor(random() * options.length)];
        if (!service) break;
        const end = start + service.durationMin;
        const busy = random() < busyChance;

        if (busy && fitsOpeningHours(date, start, end) && !conflicts(bookings, professional.id, date, start, end)) {
          const finished = date === now.date && end <= now.minutes;
          counter += 1;
          bookings.push({
            id: `EX-${String(counter).padStart(3, "0")}`,
            serviceId: service.id,
            professionalId: professional.id,
            date,
            startMin: start,
            endMin: end,
            priceCents: service.priceCents,
            customerName: seedCustomerNames[Math.floor(random() * seedCustomerNames.length)] ?? "Cliente",
            status: finished ? "concluido" : random() < 0.06 ? "cancelado" : "confirmado",
            origin: "seed",
          });
          start = end;
          // Mantém o encaixe na grade de horários.
          const offsetFromOpen = (start - window.openMin) % business.slotStepMin;
          if (offsetFromOpen) start += business.slotStepMin - offsetFromOpen;
        } else {
          start += business.slotStepMin;
        }
      }

      // Garantia de vaga nos dias futuros: remove os últimos exemplos até sobrar uma janela.
      if (offset > 0) {
        while (bookings.length > dayStartIndex && !hasFreeWindow(date, professional.id, longest, bookings)) {
          bookings.pop();
        }
      }
    }
  }

  return bookings.sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
}
