"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { studioActions, studioStore } from "@/lib/demo-store";
import { activeTrials, describeOccurrence, findOccurrence, listOccurrences, seedEnrolled, type Trial } from "@/lib/schedule";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";

const statusLabels: Record<Trial["status"], string> = { reservada: "Reservada", presente: "Presente", cancelada: "Cancelada" };

export function AdminPanel() {
  const state = studioStore.useStore();
  const [now] = useState(getBusinessNow);
  const [date, setDate] = useState(now.date);

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-edge bg-panel p-6 text-muted">
        Carregando o painel de demonstração…
      </p>
    );
  }

  const week = listOccurrences(now.date);
  const dates = [...new Set(week.map((o) => o.date))];
  const occupancy = (key: string) => {
    const o = week.find((item) => item.key === key)!;
    return seedEnrolled(o) + activeTrials(state.trials, key);
  };
  const totalSpots = week.reduce((total, o) => total + o.template.capacity, 0);
  const totalTaken = week.reduce((total, o) => total + Math.min(o.template.capacity, occupancy(o.key)), 0);
  const fullCount = week.filter((o) => occupancy(o.key) >= o.template.capacity).length;
  const trialsActive = state.trials.filter((t) => t.status !== "cancelada").length;
  const dayClasses = week.filter((o) => o.date === date);

  const stats = [
    ["Aulas na semana", String(week.length)],
    ["Ocupação média", `${Math.round((totalTaken / totalSpots) * 100)}%`],
    ["Aulas lotadas", String(fullCount)],
    ["Experimentais ativas", String(trialsActive)],
  ];

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-card border border-edge bg-panel p-5">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="mt-1 text-3xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="grade-title">
        <h2 id="grade-title" className="text-2xl">
          Ocupação por aula
        </h2>
        <div role="group" aria-label="Dia" className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {dates.map((d) => {
            const parts = formatDateParts(d);
            return (
              <button key={d} type="button" className="chip capitalize" aria-pressed={date === d} aria-label={formatDateLong(d)} onClick={() => setDate(d)}>
                {relativeDayLabel(d, now.date) ?? parts.weekday} {parts.dayMonth}
              </button>
            );
          })}
        </div>
        {dayClasses.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-edge p-6 text-muted">Sem aulas neste dia (estúdio fechado).</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-card border border-edge">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">Aulas de {formatDateLong(date)} com ocupação</caption>
              <thead className="bg-panel text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Horário
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Aula
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Ocupação
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Experimentais
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayClasses.map((o) => {
                  const { modality, teacher } = describeOccurrence(o);
                  const taken = Math.min(o.template.capacity, occupancy(o.key));
                  const ratio = taken / o.template.capacity;
                  return (
                    <tr key={o.key} className="border-t border-edge">
                      <td className="px-4 py-3 font-bold whitespace-nowrap">{formatTime(o.template.startMin)}</td>
                      <td className="px-4 py-3">
                        {modality.name} <span className="text-muted">· {teacher.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-3">
                          <span aria-hidden className="h-2 w-28 overflow-hidden rounded-full bg-edge">
                            <span
                              className={`block h-full rounded-full ${ratio >= 1 ? "bg-full" : "bg-lime"}`}
                              style={{ width: `${Math.round(ratio * 100)}%` }}
                            />
                          </span>
                          <span className="whitespace-nowrap">
                            {taken}/{o.template.capacity}
                            {ratio >= 1 && <strong className="ml-2 text-full">Lotada</strong>}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{activeTrials(state.trials, o.key)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="experimentais-title">
        <h2 id="experimentais-title" className="text-2xl">
          Aulas experimentais
        </h2>
        {state.trials.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-edge p-6 text-muted">
            Nenhuma reserva ainda. Reserve uma aula experimental na grade para vê-la aqui.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {[...state.trials].reverse().map((trial) => {
              const occurrence = findOccurrence(trial.occurrenceKey);
              const info = occurrence ? describeOccurrence(occurrence) : null;
              return (
                <li key={trial.id} className="rounded-card border border-edge bg-panel p-5">
                  <p className="text-xs font-semibold text-muted">
                    {trial.id} · <span className={trial.status === "cancelada" ? "text-full" : "text-lime"}>{statusLabels[trial.status]}</span>
                  </p>
                  <p className="mt-1 text-lg font-bold">{trial.nickname}</p>
                  <p className="text-sm text-muted">
                    {info ? `${info.modality.name} com ${info.teacher.name} · ${info.when}` : "Aula fora da grade atual"}
                  </p>
                  <p className="text-sm text-muted">{trial.level}</p>
                  {trial.status === "reservada" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="btn btn-secondary !min-h-11 text-sm" onClick={() => studioActions.setStatus(trial.id, "presente")}>
                        <Check aria-hidden className="size-4" />
                        Marcar presença
                      </button>
                      <button type="button" className="btn btn-secondary !min-h-11 text-sm" onClick={() => studioActions.setStatus(trial.id, "cancelada")}>
                        <X aria-hidden className="size-4" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button type="button" className="btn btn-secondary" onClick={() => studioStore.reset()}>
        <RotateCcw aria-hidden className="size-4" />
        Limpar dados da demonstração
      </button>
    </div>
  );
}
