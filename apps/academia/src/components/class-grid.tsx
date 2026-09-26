"use client";

import { CalendarCheck, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { experienceLevels, modalities, teachers } from "@/data/studio";
import { studioActions, studioStore } from "@/lib/demo-store";
import {
  BOOKING_CUTOFF_MIN,
  buildTrialMessage,
  describeOccurrence,
  filterOccurrences,
  findOccurrence,
  hasStarted,
  listOccurrences,
  periodLabels,
  spotsLeft,
  validateNickname,
  type Filters,
  type Occurrence,
  type Period,
} from "@/lib/schedule";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";

const PERIODS: Period[] = ["manha", "tarde", "noite"];

export function ClassGrid({ initialModality }: { initialModality: string }) {
  const state = studioStore.useStore();
  const [now] = useState(getBusinessNow);
  const [filters, setFilters] = useState<Filters>({ date: "todos", modalityId: initialModality, teacherId: "todos", period: "todos" });
  const [selected, setSelected] = useState<Occurrence | null>(null);
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState<string>(experienceLevels[0]);
  const [nicknameError, setNicknameError] = useState("");
  const [error, setError] = useState("");
  const [justBooked, setJustBooked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bannerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (justBooked) bannerRef.current?.focus();
  }, [justBooked]);

  // Abre o diálogo quando uma aula é escolhida; ao fechar, a escolha é limpa.
  useEffect(() => {
    if (selected && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [selected]);

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-edge bg-panel p-6 text-muted">
        Carregando a grade de demonstração…
      </p>
    );
  }

  const week = listOccurrences(now.date);
  const dates = [...new Set(week.map((o) => o.date))];
  const visible = filterOccurrences(week, filters);
  const reserved = state.trials.find((t) => t.status === "reservada");
  const reservedOccurrence = reserved ? findOccurrence(reserved.occurrenceKey) : null;
  const set = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const filtered = filters.date !== "todos" || filters.modalityId !== "todos" || filters.teacherId !== "todos" || filters.period !== "todos";

  const open = (occurrence: Occurrence) => {
    setSelected(occurrence);
    setError("");
    setNicknameError("");
  };

  const confirm = () => {
    if (!selected) return;
    const nickError = validateNickname(nickname);
    setNicknameError(nickError ?? "");
    if (nickError) return;
    const result = studioActions.book({ occurrenceKey: selected.key, nickname, level }, getBusinessNow());
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dialogRef.current?.close();
    setJustBooked(true);
  };

  const selectedInfo = selected ? describeOccurrence(selected) : null;

  return (
    <div>
      {reserved && reservedOccurrence && (
        <section aria-labelledby="trial-title" className="mb-8 rounded-card border border-lime bg-panel-2 p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-lime">
            <CalendarCheck aria-hidden className="size-4" />
            Aula experimental reservada · {reserved.id}
          </p>
          <h2 id="trial-title" ref={bannerRef} tabIndex={-1} className="mt-2 text-2xl">
            {describeOccurrence(reservedOccurrence).modality.name} com {describeOccurrence(reservedOccurrence).teacher.name}
          </h2>
          <p className="mt-1 text-muted">{describeOccurrence(reservedOccurrence).when}</p>
          <p className="mt-1 text-sm text-muted">Reserva de demonstração, salva só neste navegador. Uma aula experimental por pessoa.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <MessagePreview businessName="Pulse Studio" message={buildTrialMessage(reserved)} />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                studioActions.setStatus(reserved.id, "cancelada");
                setJustBooked(false);
              }}
            >
              <X aria-hidden className="size-4" />
              Cancelar reserva
            </button>
          </div>
        </section>
      )}

      <div className="space-y-4 rounded-card border border-edge bg-panel p-5">
        <div role="group" aria-label="Dia" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button type="button" className="chip" aria-pressed={filters.date === "todos"} onClick={() => set({ date: "todos" })}>
            Semana toda
          </button>
          {dates.map((date) => {
            const parts = formatDateParts(date);
            return (
              <button
                key={date}
                type="button"
                className="chip capitalize"
                aria-pressed={filters.date === date}
                aria-label={formatDateLong(date)}
                onClick={() => set({ date })}
              >
                {relativeDayLabel(date, now.date) ?? parts.weekday} {parts.dayMonth}
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="block text-sm font-semibold">
            Modalidade
            <select value={filters.modalityId} onChange={(event) => set({ modalityId: event.target.value })} className="field">
              <option value="todos">Todas</option>
              {modalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Professor
            <select value={filters.teacherId} onChange={(event) => set({ teacherId: event.target.value })} className="field">
              <option value="todos">Todos</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Período" className="flex flex-wrap gap-2">
            {PERIODS.map((period) => (
              <button
                key={period}
                type="button"
                className="chip"
                aria-pressed={filters.period === period}
                onClick={() => set({ period: filters.period === period ? "todos" : period })}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="font-semibold">
          {visible.length === 1 ? "1 aula encontrada" : `${visible.length} aulas encontradas`}
        </p>
        {filtered && (
          <button
            type="button"
            className="min-h-11 text-sm font-semibold text-lime underline underline-offset-4"
            onClick={() => setFilters({ date: "todos", modalityId: "todos", teacherId: "todos", period: "todos" })}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-edge p-8 text-center text-muted">
          Nenhuma aula com esses filtros. Tente outro dia ou limpe os filtros.
        </p>
      ) : (
        dates
          .filter((date) => visible.some((o) => o.date === date))
          .map((date) => (
            <section key={date} aria-labelledby={`dia-${date}`} className="mt-6">
              <h2 id={`dia-${date}`} className="text-xl first-letter:uppercase">
                {relativeDayLabel(date, now.date) ? `${relativeDayLabel(date, now.date)} · ` : ""}
                {formatDateLong(date)}
              </h2>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {visible
                  .filter((o) => o.date === date)
                  .map((occurrence) => {
                    const { modality, teacher } = describeOccurrence(occurrence);
                    const left = spotsLeft(occurrence, state.trials);
                    const closed = hasStarted(occurrence, now, BOOKING_CUTOFF_MIN);
                    const mine = reserved?.occurrenceKey === occurrence.key;
                    const { startMin, durationMin, capacity } = occurrence.template;
                    const reason = mine ? "Sua reserva" : closed ? "Encerrada" : left === 0 ? "Lotada" : reserved ? "Você já tem reserva" : null;
                    return (
                      <li
                        key={occurrence.key}
                        className={`flex items-center gap-4 rounded-card border bg-panel p-4 ${mine ? "border-lime" : "border-edge"}`}
                      >
                        <div className="w-16 shrink-0 text-center">
                          <p className="text-xl font-bold">{formatTime(startMin)}</p>
                          <p className="text-xs text-muted">{durationMin} min</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">{modality.name}</p>
                          <p className="text-sm text-muted">com {teacher.name}</p>
                          <p className={`mt-1 text-sm font-semibold ${left === 0 ? "text-full" : "text-lime"}`}>
                            {left === 0 ? "Lotada" : `${left} de ${capacity} vagas`}
                          </p>
                        </div>
                        {reason ? (
                          <span className="shrink-0 text-right text-xs font-semibold text-muted">{reason}</span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary shrink-0 !px-3 text-sm"
                            onClick={() => open(occurrence)}
                            aria-label={`Reservar ${modality.name} de ${formatDateLong(date)} às ${formatTime(startMin)}`}
                          >
                            Reservar
                          </button>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="reserva-title"
        onClose={() => setSelected(null)}
        className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-card border border-edge bg-panel p-0 text-chalk shadow-2xl backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {selected && selectedInfo && (
          <form
            noValidate
            className="p-6"
            onSubmit={(event) => {
              event.preventDefault();
              confirm();
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker">Aula experimental</p>
                <h2 id="reserva-title" className="mt-1 text-2xl">
                  {selectedInfo.modality.name} com {selectedInfo.teacher.name}
                </h2>
                <p className="mt-1 text-sm text-muted">{selectedInfo.when}</p>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-panel-2"
              >
                <X aria-hidden className="size-5" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-full/40 p-3 text-sm text-full">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            )}

            <label className="mt-5 block text-sm font-semibold">
              Como podemos te chamar?
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                maxLength={30}
                autoComplete="off"
                aria-invalid={nicknameError ? true : undefined}
                aria-describedby="nickname-note"
                className="field font-normal"
              />
              <span id="nickname-note" className={`mt-1 block text-xs font-normal ${nicknameError ? "text-full" : "text-muted"}`}>
                {nicknameError || "Um apelido basta. Não pedimos dados pessoais nesta demonstração."}
              </span>
            </label>

            <fieldset className="mt-5 min-w-0">
              <legend className="text-sm font-semibold">Sua experiência</legend>
              <div className="mt-2 grid gap-2">
                {experienceLevels.map((item) => (
                  <label
                    key={item}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-edge px-3 has-[:checked]:border-lime"
                  >
                    <input
                      type="radio"
                      name="level"
                      value={item}
                      checked={level === item}
                      onChange={() => setLevel(item)}
                      className="size-4 accent-lime"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-5 text-sm text-muted">
              {spotsLeft(selected, state.trials)} vagas restantes. Uma aula experimental por pessoa.
            </p>
            <button type="submit" className="btn btn-primary mt-4 w-full">
              Confirmar reserva
            </button>
          </form>
        )}
      </dialog>
    </div>
  );
}
