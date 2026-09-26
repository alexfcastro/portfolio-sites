"use client";

import { Ban, CalendarCheck2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getProfessional, getSpecialty, periodLabels } from "@/data/clinic";
import { clinicActions, useClinicState } from "@/lib/demo-store";
import { canCancel, type RequestStatus } from "@/lib/requests";
import { formatDateLong, formatTime, getBusinessNow } from "@/lib/time";

const statusLabels: Record<RequestStatus, string> = {
  enviada: "Aguardando confirmação",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
};

const statusStyles: Record<RequestStatus, string> = {
  enviada: "bg-sand text-ink",
  confirmada: "bg-teal-soft text-teal-dark",
  cancelada: "bg-mist text-muted line-through",
};

export function MyRequests() {
  const state = useClinicState();
  const [today] = useState(() => getBusinessNow().date);
  const [feedback, setFeedback] = useState("");
  const resetDialog = useRef<HTMLDialogElement>(null);

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-line bg-paper p-6 text-muted">
        Carregando…
      </p>
    );
  }

  const requests = [...state.requests].reverse();

  const act = (result: { ok: boolean; error?: string }, success: string) => setFeedback(result.ok ? success : (result.error ?? ""));

  return (
    <div>
      <div role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-teal-dark">
        {feedback}
      </div>

      {requests.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-muted">Você ainda não fez nenhuma solicitação de demonstração neste navegador.</p>
          <Link href="/solicitar" className="btn btn-primary mt-6">
            Solicitar horário
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {requests.map((request) => {
            const specialty = getSpecialty(request.specialtyId);
            const confirmedPro = request.confirmedProfessionalId ? getProfessional(request.confirmedProfessionalId) : null;
            const wantedPro = request.professionalId ? getProfessional(request.professionalId)?.name : "Primeiro disponível";
            return (
              <li key={request.id} className="rounded-card border border-line bg-paper p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl">
                    {specialty?.name} <span className="font-sans text-sm font-normal text-muted">· {request.id}</span>
                  </h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
                    {statusLabels[request.status]}
                  </span>
                </div>
                <p className="mt-2 text-muted">
                  Preferência: <span className="first-letter:uppercase">{formatDateLong(request.date)}</span>,{" "}
                  {periodLabels[request.period].toLowerCase()} · {wantedPro} ·{" "}
                  {request.payment === "particular" ? "particular" : "convênio"}
                </p>
                {request.status === "confirmada" && confirmedPro && request.confirmedStartMin !== null && (
                  <p className="mt-3 rounded-xl bg-teal-soft px-4 py-3 text-sm">
                    <strong>Confirmação simulada:</strong> {formatDateLong(request.date)}, às{" "}
                    {formatTime(request.confirmedStartMin)}, com {confirmedPro.name}.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {request.status === "enviada" && (
                    <button
                      type="button"
                      className="btn btn-secondary !min-h-11 !text-sm"
                      onClick={() => act(clinicActions.confirm(request.id), `Solicitação ${request.id} confirmada (simulação).`)}
                    >
                      <CalendarCheck2 aria-hidden className="size-4" />
                      Simular confirmação da recepção
                      <span className="sr-only"> {request.id}</span>
                    </button>
                  )}
                  {canCancel(request, today) && (
                    <button
                      type="button"
                      className="btn btn-secondary !min-h-11 !text-sm"
                      onClick={() => act(clinicActions.cancel(request.id), `Solicitação ${request.id} cancelada.`)}
                    >
                      <Ban aria-hidden className="size-4" />
                      Cancelar
                      <span className="sr-only"> {request.id}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {requests.length > 0 && (
        <div className="mt-10 rounded-card border border-line bg-paper p-5">
          <h2 className="text-lg">Restaurar dados iniciais</h2>
          <p className="mt-1 text-sm text-muted">Apaga as solicitações de demonstração deste navegador.</p>
          <button type="button" onClick={() => resetDialog.current?.showModal()} className="btn btn-secondary mt-4">
            <RotateCcw aria-hidden className="size-4" />
            Restaurar dados iniciais
          </button>
        </div>
      )}

      <dialog
        ref={resetDialog}
        aria-labelledby="reset-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl bg-paper p-6 text-ink shadow-2xl backdrop:bg-black/50"
      >
        <h2 id="reset-title" className="text-2xl">
          Apagar as solicitações?
        </h2>
        <p className="mt-2 text-sm text-muted">Isso afeta só este navegador.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" autoFocus onClick={() => resetDialog.current?.close()} className="btn btn-secondary">
            Manter
          </button>
          <button
            type="button"
            onClick={() => {
              clinicActions.reset();
              resetDialog.current?.close();
              setFeedback("Solicitações de demonstração apagadas.");
            }}
            className="btn btn-primary"
          >
            Apagar
          </button>
        </div>
      </dialog>
    </div>
  );
}
