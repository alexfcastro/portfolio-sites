import { getService, groomers, openingHours, services, sizeFactor, sizeLabels, speciesLabels, type PetService, type Size, type Species } from "@/data/petshop";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, formatTime, getWeekday, type BusinessNow } from "@/lib/time";

/*
 * Regras do agendamento: o serviço depende da espécie; duração e preço, do porte.
 * Horários de 30 em 30 minutos, sem sobreposição para o mesmo profissional.
 */

export const SLOT_STEP = 30;
export const WINDOW_DAYS = 14;

export interface Pet {
  name: string;
  species: Species;
  size: Size;
}

export function validatePet(pet: { name: string; species: string; size: string }): Partial<Record<keyof Pet, string>> {
  const errors: Partial<Record<keyof Pet, string>> = {};
  const name = pet.name.trim();
  if (!name) errors.name = "Informe o nome do pet.";
  else if (name.length > 30) errors.name = "Use no máximo 30 caracteres.";
  if (pet.species !== "cao" && pet.species !== "gato") errors.species = "Escolha a espécie.";
  if (!["pequeno", "medio", "grande"].includes(pet.size)) errors.size = "Escolha o porte.";
  return errors;
}

export function servicesFor(species: Species): PetService[] {
  return services.filter((service) => service.species.includes(species));
}

/** Duração ajustada ao porte, arredondada para cima em blocos de 15 minutos. */
export function durationFor(service: PetService, size: Size): number {
  return Math.ceil((service.baseMinutes * sizeFactor[size]) / 15) * 15;
}

export function priceFor(service: PetService, size: Size): number {
  return service.priceCents[size];
}

export interface Appointment {
  id: string;
  petName: string;
  species: Species;
  size: Size;
  serviceId: string;
  groomerId: string;
  date: string;
  startMin: number;
  endMin: number;
  priceCents: number;
  reminder: boolean;
  status: "agendado" | "cancelado";
  origin: "seed" | "visitor";
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/** Agenda de exemplo (ocupação) para os próximos dias, determinística por data. */
export function seedAppointments(today: string): Appointment[] {
  const result: Appointment[] = [];
  let n = 0;
  for (let offset = 0; offset < WINDOW_DAYS; offset += 1) {
    const date = addDays(today, offset);
    const hours = openingHours[getWeekday(date)];
    if (!hours) continue;
    groomers.forEach((groomer, gi) => {
      // Janela de 3 horas sempre livre, para caber até o serviço mais longo.
      const freeStart = hours.openMin + ((offset + gi) % 3) * 120;
      let seed = [...`${date}${groomer.id}`].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 9973, 7);
      for (let start = hours.openMin; start + 60 <= hours.closeMin; start += 60) {
        seed = (seed * 7 + 13) % 9973;
        const inFreeWindow = start < freeStart + 180 && freeStart < start + 60;
        // Cerca de 1/3 da agenda ocupada, fora da janela livre.
        if (!inFreeWindow && seed % 3 === 0) {
          n += 1;
          result.push({
            id: `EX-${n}`,
            petName: "Pet de exemplo",
            species: "cao",
            size: "pequeno",
            serviceId: "banho",
            groomerId: groomers[gi]!.id,
            date,
            startMin: start,
            endMin: start + 60,
            priceCents: 0,
            reminder: false,
            status: "agendado",
            origin: "seed",
          });
        }
      }
    });
  }
  return result;
}

export function availableStarts(
  date: string,
  groomerId: string,
  duration: number,
  appointments: readonly Appointment[],
  now: BusinessNow,
): number[] {
  const hours = openingHours[getWeekday(date)];
  if (!hours || date < now.date || date > addDays(now.date, WINDOW_DAYS - 1)) return [];
  const busy = appointments.filter((a) => a.status === "agendado" && a.groomerId === groomerId && a.date === date);
  const starts: number[] = [];
  for (let start = hours.openMin; start + duration <= hours.closeMin; start += SLOT_STEP) {
    if (date === now.date && start < now.minutes + 60) continue;
    if (busy.some((a) => overlaps(start, start + duration, a.startMin, a.endMin))) continue;
    starts.push(start);
  }
  return starts;
}

export interface BookingInput {
  pet: Pet;
  serviceId: string;
  groomerId: string;
  date: string;
  startMin: number;
  reminder: boolean;
}

export function validateBooking(input: BookingInput, appointments: readonly Appointment[], now: BusinessNow): string | null {
  if (Object.keys(validatePet(input.pet)).length > 0) return "Revise os dados do pet.";
  const service = getService(input.serviceId);
  if (!service || !service.species.includes(input.pet.species)) return "Este serviço não está disponível para a espécie escolhida.";
  if (!groomers.some((g) => g.id === input.groomerId)) return "Escolha um profissional.";
  const duration = durationFor(service, input.pet.size);
  if (!availableStarts(input.date, input.groomerId, duration, appointments, now).includes(input.startMin)) {
    return "Este horário não está mais disponível. Escolha outro.";
  }
  return null;
}

export function createAppointment(input: BookingInput, number: number): Appointment {
  const service = getService(input.serviceId)!;
  const duration = durationFor(service, input.pet.size);
  return {
    id: `PV-${number}`,
    petName: input.pet.name.trim(),
    species: input.pet.species,
    size: input.pet.size,
    serviceId: service.id,
    groomerId: input.groomerId,
    date: input.date,
    startMin: input.startMin,
    endMin: input.startMin + duration,
    priceCents: priceFor(service, input.pet.size),
    reminder: input.reminder,
    status: "agendado",
    origin: "visitor",
  };
}

/* ---------- Mensagens (prévia local; nada é enviado) ---------- */

function describe(appointment: Appointment) {
  const service = getService(appointment.serviceId)!;
  const groomer = groomers.find((g) => g.id === appointment.groomerId)!;
  const pet = `${appointment.petName} (${speciesLabels[appointment.species].toLowerCase()}, porte ${sizeLabels[appointment.size].toLowerCase()})`;
  return { service, groomer, pet, when: `${formatDateLong(appointment.date)}, às ${formatTime(appointment.startMin)}` };
}

export function buildBookingMessage(appointment: Appointment): string {
  const { service, groomer, pet, when } = describe(appointment);
  return [
    `Olá, PetVille! Quero confirmar o agendamento ${appointment.id}.`,
    `Pet: ${pet}`,
    `Serviço: ${service.name} (cerca de ${appointment.endMin - appointment.startMin} min)`,
    `Quando: ${when}, com ${groomer.name}`,
    `Valor: ${formatBRL(appointment.priceCents)}`,
  ].join("\n");
}

/** Lembrete preparado para a véspera. Na demonstração ele só é exibido, nunca agendado nem enviado. */
export function buildReminderMessage(appointment: Appointment): string {
  const { service, when } = describe(appointment);
  return [
    `Lembrete PetVille: amanhã, ${when}, ${appointment.petName} tem ${service.name.toLowerCase()} marcado.`,
    "Traga coleira e guia. Se precisar remarcar, responda esta mensagem.",
  ].join("\n");
}

export function reminderDate(appointment: Appointment): string {
  return addDays(appointment.date, -1);
}
