"use client";

import { Ban, CheckCheck, RotateCcw, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getProfessional, getService, professionals } from "@/data/business";
import { allowedTransitions } from "@/lib/demo-state";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { formatBRL, sumCents } from "@/lib/money";
import { addDays, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";
import type { Booking, BookingStatus } from "@/types/booking";

type Period = "hoje" | "amanha" | "semana" | "todos";
type StatusFilter = "todos" | BookingStatus;

const statusLabels: Record<BookingStatus, string> = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusStyles: Record<BookingStatus, string> = {
  confirmado: "border-gold/50 text-gold",
  concluido: "border-ok/40 text-ok",
  cancelado: "border-warn/40 text-warn line-through decoration-1",
};

const actionLabels: Record<BookingStatus, { label: string; icon: typeof Ban }> = {
  concluido: { label: "Concluir", icon: CheckCheck },
  cancelado: { label: "Cancelar", icon: Ban },
  confirmado: { label: "Reativar", icon: Undo2 },
};

const selectClass =
  "mt-1.5 block w-full rounded-lg border border-edge bg-coal px-3 py-2.5 text-cream focus:border-gold focus:outline-none";

export function AdminPanel() {
  const demo = useDemoState();
  const [now] = useState(getBusinessNow);
  const [period, setPeriod] = useState<Period>("semana");
  const [professionalId, setProfessionalId] = useState("todos");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [onlyMine, setOnlyMine] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const resetDialog = useRef<HTMLDialogElement>(null);

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando a agenda de demonstração…
      </p>
    );
  }

  const inPeriod = (booking: Booking) => {
    if (period === "hoje") return booking.date === now.date;
    if (period === "amanha") return booking.date === addDays(now.date, 1);
    if (period === "semana") return booking.date >= now.date && booking.date <= addDays(now.date, 6);
    return true;
  };

  const visible = demo.bookings
    .filter(inPeriod)
    .filter((b) => professionalId === "todos" || b.professionalId === professionalId)
    .filter((b) => status === "todos" || b.status === status)
    .filter((b) => !onlyMine || b.origin === "visitor")
    .sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);

  const active = visible.filter((b) => b.status !== "cancelado");
  const mine = demo.bookings.filter((b) => b.origin === "visitor").length;

  const change = (booking: Booking, next: BookingStatus) => {
    const result = demoActions.setStatus(booking.id, next);
    setFeedback(
      result.ok
        ? { tone: "ok", text: `Agendamento ${booking.id} marcado como ${statusLabels[next].toLowerCase()}.` }
        : { tone: "error", text: result.error },
    );
  };

  const reset = () => {
    demoActions.reset();
    resetDialog.current?.close();
    setOnlyMine(false);
    setFeedback({ tone: "ok", text: "Dados iniciais restaurados. Seus agendamentos de teste foram apagados." });
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Agendamentos no filtro" value={String(active.length)} hint="sem contar cancelados" />
        <Tile
          label="Receita prevista (demonstrativa)"
          value={formatBRL(sumCents(visible.filter((b) => b.status === "confirmado").map((b) => b.priceCents)))}
          hint="soma dos confirmados"
        />
        <Tile label="Criados por você" value={String(mine)} hint="neste navegador" />
      </div>

      <form
        className="mt-8 grid gap-4 rounded-card border border-edge bg-coal-2 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filtros do painel"
      >
        <label className="text-sm font-semibold">
          Período
          <select className={selectClass} value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
            <option value="hoje">Hoje</option>
            <option value="amanha">Amanhã</option>
            <option value="semana">Próximos 7 dias</option>
            <option value="todos">Todos</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Profissional
          <select className={selectClass} value={professionalId} onChange={(e) => setProfessionalId(e.target.value)}>
            <option value="todos">Todos</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Situação
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="todos">Todas</option>
            <option value="confirmado">Confirmados</option>
            <option value="concluido">Concluídos</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold">
          <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="size-5 accent-gold" />
          Só os meus
        </label>
      </form>

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold">
        {feedback && <span className={feedback.tone === "ok" ? "text-ok" : "text-warn"}>{feedback.text}</span>}
      </div>

      <p className="mt-2 text-sm text-smoke">
        {visible.length} {visible.length === 1 ? "registro" : "registros"} no filtro.
      </p>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-edge p-10 text-center text-smoke">
          Nenhum agendamento com estes filtros.{" "}
          {onlyMine && mine === 0 && (
            <>
              Você ainda não criou nenhum.{" "}
              <Link href="/agendar" className="font-semibold text-gold underline underline-offset-4">
                Fazer um agendamento de demonstração
              </Link>
              .
            </>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((booking) => {
            const service = getService(booking.serviceId);
            const professional = getProfessional(booking.professionalId);
            const parts = formatDateParts(booking.date);
            const relative = relativeDayLabel(booking.date, now.date);
            return (
              <li
                key={booking.id}
                className={`grid gap-4 rounded-card border p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center ${
                  booking.origin === "visitor" ? "border-gold/50 bg-coal-3" : "border-edge bg-coal-2"
                }`}
              >
                <div>
                  <p className="font-display text-2xl font-semibold">{formatTime(booking.startMin)}</p>
                  <p className="text-xs text-smoke uppercase">
                    {relative ?? parts.weekday} · {parts.dayMonth}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    {service?.name ?? booking.serviceId}{" "}
                    <span className="font-normal text-smoke">com {professional?.shortName ?? booking.professionalId}</span>
                  </p>
                  <p className="text-sm text-smoke">
                    {booking.customerName} · {formatTime(booking.startMin)}–{formatTime(booking.endMin)} ·{" "}
                    {formatBRL(booking.priceCents)} · {booking.id}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[booking.status]}`}>
                      {statusLabels[booking.status]}
                    </span>
                    {booking.origin === "visitor" && (
                      <span className="rounded-full border border-cream/30 px-2.5 py-0.5 text-xs font-semibold">Criado por você</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {allowedTransitions(booking.status).map((next) => {
                    const { label, icon: Icon } = actionLabels[next];
                    return (
                      <button
                        key={next}
                        type="button"
                        onClick={() => change(booking, next)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-edge px-3 text-sm font-semibold hover:border-gold hover:text-gold-bright"
                      >
                        <Icon aria-hidden className="size-4" />
                        {label}
                        <span className="sr-only"> {booking.id}</span>
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-10 rounded-card border border-edge p-5">
        <h2 className="text-xl font-semibold">Restaurar dados iniciais</h2>
        <p className="mt-1 text-sm text-smoke">
          Apaga os agendamentos criados neste navegador e recria a agenda de exemplo para hoje.
        </p>
        <button type="button" onClick={() => resetDialog.current?.showModal()} className="btn btn-line mt-4">
          <RotateCcw aria-hidden className="size-4" />
          Restaurar dados iniciais
        </button>
      </div>

      <dialog
        ref={resetDialog}
        aria-labelledby="reset-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-edge bg-coal-2 p-6 text-cream backdrop:bg-black/70"
      >
        <h2 id="reset-title" className="text-2xl font-semibold">
          Restaurar a agenda de exemplo?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-smoke">
          Os {mine} agendamento(s) criados por você neste navegador serão apagados. Isso não afeta outros visitantes.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" autoFocus onClick={() => resetDialog.current?.close()} className="btn btn-line">
            Manter como está
          </button>
          <button type="button" onClick={reset} className="btn btn-gold">
            Restaurar
          </button>
        </div>
      </dialog>
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-card border border-edge bg-coal-2 p-5">
      <p className="text-xs font-semibold tracking-wider text-smoke uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-gold">{value}</p>
      <p className="text-xs text-smoke">{hint}</p>
    </div>
  );
}
