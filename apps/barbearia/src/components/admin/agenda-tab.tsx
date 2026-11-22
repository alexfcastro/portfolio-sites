"use client";

import { Lock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScheduleGrid } from "@/components/admin/schedule-grid";
import { BookingRow, FeedbackLine, selectClass, Tile, type Feedback } from "@/components/admin/shared";
import { business, getProfessional, getService, periods, professionals } from "@/data/business";
import type { DemoState } from "@/lib/demo-state";
import { productCount } from "@/lib/loja";
import { demoActions } from "@/lib/demo-store";
import { formatBRL, sumCents } from "@/lib/money";
import { getBookableDates, getOpeningWindow } from "@/lib/schedule";
import { addDays, formatDateLong, formatDateParts, formatTime, relativeDayLabel } from "@/lib/time";
import type { Booking, BookingStatus, BusinessNow } from "@/types/booking";

type PeriodFilter = "hoje" | "amanha" | "semana" | "todos";
type StatusFilter = "todos" | BookingStatus;

export function AgendaTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const [period, setPeriod] = useState<PeriodFilter>("semana");
  const [professionalId, setProfessionalId] = useState("todos");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [onlyMine, setOnlyMine] = useState(false);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

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
    .filter((b) => matches(b, query))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
  const active = visible.filter((b) => b.status !== "cancelado");
  const mine = demo.bookings.filter((b) => b.origin === "visitor").length;

  return (
    <div className="grid gap-10">
      <ScheduleGrid demo={demo} now={now} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Agendamentos no filtro" value={String(active.length)} hint="sem contar cancelados" />
        <Tile
          label="Valor previsto (demonstrativo)"
          value={formatBRL(sumCents(visible.filter((b) => b.status === "confirmado").map((b) => b.priceCents)))}
          hint="soma dos confirmados"
        />
        <Tile label="Criados por você" value={String(mine)} hint="neste navegador" />
      </div>

      <section aria-labelledby="agenda-title">
        <h2 id="agenda-title" className="text-3xl font-bold">
          Agenda
        </h2>
        <form
          className="mt-5 grid gap-4 rounded-card border border-edge bg-coal-2 p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
          onSubmit={(event) => event.preventDefault()}
          aria-label="Filtros da agenda"
        >
          <label className="text-sm font-semibold sm:col-span-2 lg:col-span-1">
            Buscar cliente ou código
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Caio ou BRV-1001"
              className={`${selectClass} placeholder:text-smoke/70`}
            />
          </label>
          <label className="text-sm font-semibold">
            Período
            <select className={selectClass} value={period} onChange={(e) => setPeriod(e.target.value as PeriodFilter)}>
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

        <div className="mt-4">
          <FeedbackLine feedback={feedback} />
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
            {visible.map((booking) => (
              <BookingRow key={booking.id} booking={booking} now={now} onFeedback={setFeedback} products={productCount(demo, booking.id)} />
            ))}
          </ul>
        )}
      </section>

      <BlockForm demo={demo} now={now} />
      <WaitlistTable demo={demo} />
    </div>
  );
}

function BlockForm({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  // Só dias abertos; hoje sai da lista quando o expediente já terminou.
  const dates = getBookableDates(now.date).filter((date) => {
    const open = getOpeningWindow(date);
    return open && !(date === now.date && open.closeMin <= now.minutes);
  });
  const [form, setForm] = useState({
    professionalId: professionals[0]!.id,
    date: dates[0] ?? now.date,
    startMin: 14 * 60,
    endMin: 15 * 60,
    reason: "",
  });
  const [feedback, setFeedback] = useState<Feedback>(null);
  const hours = getOpeningWindow(form.date);
  const times: number[] = [];
  if (hours) for (let t = hours.openMin; t <= hours.closeMin; t += business.slotStepMin) times.push(t);

  const submit = (startMin = form.startMin, endMin = form.endMin) => {
    const result = demoActions.addBlock({ ...form, startMin, endMin });
    setFeedback(
      result.ok
        ? {
            tone: "ok",
            text: `Bloqueado: ${getProfessional(result.value.professionalId)?.shortName}, ${formatDateLong(result.value.date)}, das ${formatTime(result.value.startMin)} às ${formatTime(result.value.endMin)}. O site já não oferece esse horário.`,
          }
        : { tone: "error", text: result.error },
    );
  };

  const blocks = [...demo.blocks].sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);

  return (
    <section aria-labelledby="bloqueio-title" className="rounded-card border border-edge bg-coal-2 p-5 sm:p-6">
      <h2 id="bloqueio-title" className="flex items-center gap-2 text-3xl font-bold">
        <Lock aria-hidden className="size-6 text-gold" /> Bloquear horário
      </h2>
      <p className="mt-1 text-smoke">Folga, médico, imprevisto: bloqueie e o site para de oferecer o horário na hora.</p>
      <form
        className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label className="text-sm font-semibold">
          Profissional
          <select
            className={selectClass}
            value={form.professionalId}
            onChange={(e) => setForm({ ...form, professionalId: e.target.value })}
          >
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Dia
          <select className={selectClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}>
            {dates.map((date) => (
              <option key={date} value={date}>
                {relativeDayLabel(date, now.date) ?? formatDateParts(date).weekday} {formatDateParts(date).dayMonth}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Das
          <select
            className={selectClass}
            value={form.startMin}
            onChange={(e) => setForm({ ...form, startMin: Number(e.target.value) })}
          >
            {times.slice(0, -1).map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Até
          <select className={selectClass} value={form.endMin} onChange={(e) => setForm({ ...form, endMin: Number(e.target.value) })}>
            {times.slice(1).map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Motivo (opcional)
          <input
            className={selectClass}
            value={form.reason}
            maxLength={40}
            placeholder="Ex.: folga"
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-5">
          <button type="submit" className="btn btn-gold">
            <Lock aria-hidden className="size-4" />
            Bloquear
          </button>
          {form.date === now.date && hours && (
            <button
              type="button"
              className="btn btn-line"
              onClick={() => {
                const start = Math.ceil((now.minutes + 1) / business.slotStepMin) * business.slotStepMin;
                submit(Math.max(start, hours.openMin), hours.closeMin);
              }}
            >
              Bloquear o resto do dia
            </button>
          )}
        </div>
      </form>
      <div className="mt-4">
        <FeedbackLine feedback={feedback} />
      </div>

      {blocks.length > 0 && (
        <ul className="mt-4 divide-y divide-edge rounded-lg border border-edge">
          {blocks.map((block) => (
            <li key={block.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <p className="text-sm">
                <strong>{getProfessional(block.professionalId)?.shortName}</strong> · {formatDateLong(block.date)} ·{" "}
                {formatTime(block.startMin)}–{formatTime(block.endMin)} · <span className="text-smoke">{block.reason}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  demoActions.removeBlock(block.id);
                  setFeedback({ tone: "ok", text: "Bloqueio retirado. O horário voltou a aparecer no site." });
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-edge px-3 text-sm font-semibold hover:border-gold"
              >
                <Trash2 aria-hidden className="size-4" />
                Retirar<span className="sr-only"> bloqueio {block.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WaitlistTable({ demo }: { demo: DemoState }) {
  const entries = demo.waitlist;
  return (
    <section aria-labelledby="fila-title">
      <h2 id="fila-title" className="text-3xl font-bold">
        Lista de espera completa
      </h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-smoke">Ninguém na fila.</p>
      ) : (
        <ul className="mt-4 divide-y divide-edge rounded-card border border-edge bg-coal-2">
          {entries.map((entry, index) => (
            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p>
                <span className="font-semibold">
                  {index + 1}º {entry.customerName}
                </span>{" "}
                <span className="text-smoke">
                  · {getService(entry.serviceId)?.name} ·{" "}
                  {entry.professionalId === "qualquer" ? "qualquer profissional" : getProfessional(entry.professionalId)?.shortName} ·{" "}
                  {formatDateLong(entry.date)} · {periods[entry.period].label.toLowerCase()}
                </span>
              </p>
              <span className="text-sm font-semibold text-smoke">
                {entry.status === "encaixado" ? "Encaixado" : entry.status === "avisado" ? "Avisado" : "Aguardando"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Busca sem diferenciar maiúsculas nem acentos, no nome do cliente e no código. */
function matches(booking: Booking, query: string): boolean {
  const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const q = normalize(query.trim());
  if (!q) return true;
  return normalize(booking.customerName).includes(q) || normalize(booking.id).includes(q);
}
