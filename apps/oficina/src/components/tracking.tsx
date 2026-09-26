"use client";

import { Check, ChevronsRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getCategory } from "@/data/garage";
import { garageActions, garageStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { nextStage, STAGES, stageLabels } from "@/lib/quote";

export function Tracking() {
  const state = garageStore.useStore();
  const [feedback, setFeedback] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!state) {
    return (
      <p role="status" className="text-muted">
        Carregando…
      </p>
    );
  }

  const requests = [...state.requests].reverse();

  return (
    <div>
      <div role="status" aria-live="polite" className="min-h-6 text-sm font-bold text-ok">
        {feedback}
      </div>
      {requests.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-muted">Nenhuma solicitação de demonstração neste navegador.</p>
          <Link href="/orcamento" className="btn btn-primary mt-6">
            Pedir orçamento
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-5">
          {requests.map((request) => {
            const current = STAGES.indexOf(request.stage);
            const next = nextStage(request.stage);
            return (
              <li key={request.id} className="rounded-card border border-line bg-paper p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl uppercase">
                    {request.vehicle.model} <span className="text-sm font-semibold text-muted normal-case">· {request.id}</span>
                  </h2>
                  <p className="text-sm text-muted">
                    {getCategory(request.categoryId)?.name} · {formatBRL(request.estimate.minCents)} a{" "}
                    {formatBRL(request.estimate.maxCents)} · {request.photoCount} foto(s)
                  </p>
                </div>
                <ol className="mt-5 grid gap-2 sm:grid-cols-6" aria-label={`Etapas de ${request.id}`}>
                  {STAGES.map((stage, index) => {
                    const done = index <= current;
                    return (
                      <li
                        key={stage}
                        aria-current={index === current ? "step" : undefined}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm sm:flex-col sm:items-start ${
                          done ? "bg-orange-soft font-semibold text-ink" : "bg-steel text-muted"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${done ? "bg-orange-dark text-white" : "bg-line"}`}
                        >
                          {done ? <Check className="size-3.5" /> : index + 1}
                        </span>
                        {stageLabels[stage]}
                        <span className="sr-only">{done ? " (concluída)" : " (pendente)"}</span>
                      </li>
                    );
                  })}
                </ol>
                {next && (
                  <button
                    type="button"
                    onClick={() => {
                      garageActions.advance(request.id);
                      setFeedback(`${request.id}: ${stageLabels[next]}.`);
                    }}
                    className="btn btn-secondary mt-4 !min-h-11 !text-sm"
                  >
                    <ChevronsRight aria-hidden className="size-4" />
                    Avançar etapa (simulação)<span className="sr-only"> {request.id}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {requests.length > 0 && (
        <button type="button" onClick={() => dialogRef.current?.showModal()} className="btn btn-secondary mt-8">
          <RotateCcw aria-hidden className="size-4" />
          Restaurar dados iniciais
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="reset-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl bg-paper p-6 text-ink shadow-2xl backdrop:bg-black/50"
      >
        <h2 id="reset-title" className="text-2xl uppercase">
          Apagar as solicitações?
        </h2>
        <p className="mt-2 text-sm text-muted">Isso afeta só este navegador.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" autoFocus onClick={() => dialogRef.current?.close()} className="btn btn-secondary">
            Manter
          </button>
          <button
            type="button"
            onClick={() => {
              garageActions.reset();
              dialogRef.current?.close();
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
