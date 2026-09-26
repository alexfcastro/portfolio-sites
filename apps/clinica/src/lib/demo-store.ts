"use client";

import { useSyncExternalStore } from "react";
import {
  canCancel,
  createRequest,
  simulateConfirmation,
  validateRequest,
  type AppointmentRequest,
  type RequestInput,
} from "@/lib/requests";
import { getBusinessNow } from "@/lib/time";

/*
 * Solicitações de demonstração guardadas só neste navegador (chave própria,
 * versão e reset). Nenhum dado de saúde é pedido nem armazenado.
 */

export const STORAGE_KEY = "ax-vita-demo";
const VERSION = 1;

export interface ClinicState {
  version: typeof VERSION;
  nextNumber: number;
  requests: AppointmentRequest[];
}

type Result = { ok: true; request: AppointmentRequest } | { ok: false; error: string };

const initialState = (): ClinicState => ({ version: VERSION, nextNumber: 1001, requests: [] });

export function parseStored(raw: string | null): ClinicState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ClinicState>;
    if (value.version !== VERSION || !Number.isInteger(value.nextNumber) || !Array.isArray(value.requests)) return null;
    const valid = value.requests.every(
      (r) => typeof r?.id === "string" && typeof r.date === "string" && ["enviada", "confirmada", "cancelada"].includes(r.status),
    );
    return valid ? (value as ClinicState) : null;
  } catch {
    return null;
  }
}

let state: ClinicState | null = null;
const listeners = new Set<() => void>();

function load(): ClinicState {
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY)) ?? initialState();
  } catch {
    return initialState();
  }
}

function setState(next: ClinicState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: segue em memória.
  }
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ClinicState {
  if (!state) state = load();
  return state;
}

export function useClinicState(): ClinicState | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

function replace(current: ClinicState, updated: AppointmentRequest) {
  setState({ ...current, requests: current.requests.map((r) => (r.id === updated.id ? updated : r)) });
}

export const clinicActions = {
  submit(input: RequestInput): Result {
    const current = getSnapshot();
    const error = validateRequest(input, getBusinessNow().date);
    if (error) return { ok: false, error };
    const request = createRequest(input, current.nextNumber);
    setState({ ...current, nextNumber: current.nextNumber + 1, requests: [...current.requests, request] });
    return { ok: true, request };
  },
  confirm(id: string): Result {
    const current = getSnapshot();
    const request = current.requests.find((r) => r.id === id);
    const confirmed = request ? simulateConfirmation(request) : null;
    if (!confirmed) return { ok: false, error: "Esta solicitação não pode ser confirmada." };
    replace(current, confirmed);
    return { ok: true, request: confirmed };
  },
  cancel(id: string): Result {
    const current = getSnapshot();
    const request = current.requests.find((r) => r.id === id);
    if (!request || !canCancel(request, getBusinessNow().date)) {
      return { ok: false, error: "Esta solicitação não pode ser cancelada." };
    }
    const cancelled: AppointmentRequest = { ...request, status: "cancelada" };
    replace(current, cancelled);
    return { ok: true, request: cancelled };
  },
  reset() {
    setState(initialState());
  },
};
