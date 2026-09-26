import {
  demoPatientName,
  getProfessional,
  getSpecialty,
  professionalsFor,
  type Period,
} from "@/data/clinic";
import { addDays, getWeekday } from "@/lib/time";

/*
 * Solicitações de horário: o paciente indica dia e período; a recepção confirma
 * depois. Nesta demo, a confirmação é simulada e tudo fica só no navegador.
 */

export const REQUEST_WINDOW_DAYS = 21;

export type RequestStatus = "enviada" | "confirmada" | "cancelada";
export type Payment = "particular" | "convenio";

export interface AppointmentRequest {
  id: string;
  specialtyId: string;
  /** `null` = primeiro profissional disponível. */
  professionalId: string | null;
  date: string;
  period: Period;
  payment: Payment;
  firstVisit: boolean;
  patientName: string;
  status: RequestStatus;
  /** Preenchidos na confirmação simulada. */
  confirmedProfessionalId: string | null;
  confirmedStartMin: number | null;
}

export interface RequestInput {
  specialtyId: string;
  professionalId: string | null;
  date: string;
  period: Period;
  payment: Payment;
  firstVisit: boolean;
}

/** Profissionais que atendem a especialidade naquele dia e período. */
export function professionalsAvailable(specialtyId: string, professionalId: string | null, date: string, period: Period) {
  const weekday = getWeekday(date);
  const pool = professionalId ? professionalsFor(specialtyId).filter((p) => p.id === professionalId) : professionalsFor(specialtyId);
  return pool.filter((p) => p.schedule[weekday]?.includes(period));
}

/** Períodos disponíveis em uma data (a partir de amanhã, dentro da janela). */
export function periodsFor(specialtyId: string, professionalId: string | null, date: string, today: string): Period[] {
  if (date <= today || date > addDays(today, REQUEST_WINDOW_DAYS)) return [];
  return (["manha", "tarde"] as const).filter(
    (period) => professionalsAvailable(specialtyId, professionalId, date, period).length > 0,
  );
}

export function datesFor(specialtyId: string, professionalId: string | null, today: string): string[] {
  return Array.from({ length: REQUEST_WINDOW_DAYS }, (_, index) => addDays(today, index + 1)).filter(
    (date) => periodsFor(specialtyId, professionalId, date, today).length > 0,
  );
}

export function validateRequest(input: RequestInput, today: string): string | null {
  const specialty = getSpecialty(input.specialtyId);
  if (!specialty) return "Escolha uma especialidade.";
  if (input.professionalId) {
    const professional = getProfessional(input.professionalId);
    if (!professional || professional.specialtyId !== specialty.id) {
      return "Este profissional não atende a especialidade escolhida.";
    }
  }
  if (input.payment !== "particular" && input.payment !== "convenio") return "Escolha a forma de atendimento.";
  if (!periodsFor(specialty.id, input.professionalId, input.date, today).includes(input.period)) {
    return "Não há atendimento nesse dia e período. Escolha outra opção.";
  }
  return null;
}

export function createRequest(input: RequestInput, number: number): AppointmentRequest {
  return {
    ...input,
    id: `VTA-${number}`,
    patientName: demoPatientName,
    status: "enviada",
    confirmedProfessionalId: null,
    confirmedStartMin: null,
  };
}

/**
 * Confirmação simulada da recepção: escolhe o profissional (o pedido ou o primeiro
 * disponível) e um horário determinístico dentro do período.
 */
export function simulateConfirmation(request: AppointmentRequest): AppointmentRequest | null {
  if (request.status !== "enviada") return null;
  const professional = professionalsAvailable(request.specialtyId, request.professionalId, request.date, request.period)[0];
  if (!professional) return null;
  const specialty = getSpecialty(request.specialtyId);
  const step = specialty && specialty.durationMin > 30 ? 60 : 30;
  const [start, end] = request.period === "manha" ? [8 * 60, 12 * 60] : [13 * 60, 18 * 60];
  const slots = Math.floor((end - start) / step);
  const seed = [...request.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return {
    ...request,
    status: "confirmada",
    confirmedProfessionalId: professional.id,
    confirmedStartMin: start + (seed % slots) * step,
  };
}

export function canCancel(request: AppointmentRequest, today: string): boolean {
  return request.status !== "cancelada" && request.date > today;
}
