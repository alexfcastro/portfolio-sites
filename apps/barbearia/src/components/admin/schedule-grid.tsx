"use client";

import { useState } from "react";
import { business, getService, professionals } from "@/data/business";
import type { DemoState } from "@/lib/demo-state";
import { billable, occupancy } from "@/lib/finance";
import { productCount } from "@/lib/loja";
import { formatBRL } from "@/lib/money";
import { getBookableDates, getOpeningWindow } from "@/lib/schedule";
import { formatDateLong, formatDateParts, formatTime, relativeDayLabel } from "@/lib/time";
import type { Booking, BusinessNow } from "@/types/booking";

/** Altura de cada intervalo de 20 minutos na grade, em pixels. */
const ROW = 22;

const blockStyle: Record<Booking["status"], string> = {
  confirmado: "border-serie-agenda bg-serie-agenda/25",
  concluido: "border-serie-real bg-serie-real/25",
  cancelado: "",
};

interface ScheduleGridProps {
  demo: DemoState;
  now: BusinessNow;
  /** Só um dia (hoje, ou o próximo dia aberto), sem seletor de datas. */
  single?: boolean;
  /** Mostra os totais do dia acima da grade. */
  showStats?: boolean;
  title?: string;
  /** Os blocos levam à linha do agendamento na lista (âncora `#ag-<código>`). */
  linkToRows?: boolean;
}

/** Grade visual do dia: uma coluna por barbeiro, blocos nos horários reservados. */
export function ScheduleGrid({ demo, now, single = false, showStats = true, title = "Horários reservados", linkToRows = false }: ScheduleGridProps) {
  const dates = getBookableDates(now.date)
    .filter((date) => getOpeningWindow(date))
    .slice(0, single ? 1 : 7);
  const [date, setDate] = useState(dates[0] ?? now.date);
  const opening = getOpeningWindow(date);
  const occ = occupancy(demo, date);
  const dayBookings = demo.bookings.filter((b) => b.date === date && b.status !== "cancelado");
  const total = dayBookings.filter(billable).reduce((sum, b) => sum + b.priceCents, 0);
  const done = dayBookings.filter((b) => b.status === "concluido" && billable(b)).reduce((sum, b) => sum + b.priceCents, 0);

  return (
    <section aria-labelledby="grade-title" className="rounded-card border border-edge bg-coal-2 p-4 sm:p-6">
      <h2 id="grade-title" className="text-3xl font-bold">
        {title}
      </h2>
      {single && date !== now.date && (
        <p className="mt-1 text-smoke">
          A barbearia não abre hoje. Esta é a agenda do próximo dia aberto: {formatDateLong(date)}.
        </p>
      )}
      {!single && (
      <fieldset className="mt-4 min-w-0">
        <legend className="sr-only">Dia</legend>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((day) => {
            const parts = formatDateParts(day);
            return (
              <label key={day} className="choice w-20 shrink-0 px-2 py-2 text-center">
                <input type="radio" name="grade-dia" value={day} checked={date === day} onChange={() => setDate(day)} className="sr-only" />
                <span className="block text-xs font-semibold text-smoke uppercase">{relativeDayLabel(day, now.date) ?? parts.weekday}</span>
                <span className="font-display text-xl font-semibold">{parts.dayMonth}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      )}

      {showStats && (
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-smoke">Atendimentos</dt>
          <dd className="font-display text-2xl font-semibold">{dayBookings.length}</dd>
        </div>
        <div>
          <dt className="text-smoke">Valor do dia (sem plano)</dt>
          <dd className="font-display text-2xl font-semibold">{formatBRL(total)}</dd>
        </div>
        <div>
          <dt className="text-smoke">Já atendido</dt>
          <dd className="font-display text-2xl font-semibold">{formatBRL(done)}</dd>
        </div>
        <div>
          <dt className="text-smoke">Falta atender</dt>
          <dd className="font-display text-2xl font-semibold">{formatBRL(total - done)}</dd>
        </div>
      </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-smoke" aria-hidden>
        <span className="flex items-center gap-1.5">
          <i className="size-3 rounded-sm border border-serie-agenda bg-serie-agenda/25" /> Confirmado
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-3 rounded-sm border border-serie-real bg-serie-real/25" /> Concluído
        </span>
        <span className="flex items-center gap-1.5">
          <i className="faixa-bloqueio size-3 rounded-sm border border-edge" /> Almoço ou bloqueio
        </span>
      </div>

      {opening && (
        <div className="mt-4 overflow-x-auto overflow-y-hidden pt-2 pb-3">
          <div className="grid min-w-[30rem] grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-x-2">
            <span />
            {professionals.map((professional) => {
              const o = occ.find((item) => item.professionalId === professional.id)!;
              return (
                <div key={professional.id} className="pb-2">
                  <p className="font-semibold">{professional.shortName}</p>
                  <p className="text-xs text-smoke">{o.pct}% ocupado</p>
                  <span aria-hidden className="mt-1 block h-1.5 rounded-full bg-edge">
                    <span className="block h-full rounded-full bg-serie-agenda" style={{ width: `${o.pct}%` }} />
                  </span>
                </div>
              );
            })}

            <TimeAxis openMin={opening.openMin} closeMin={opening.closeMin} />
            {professionals.map((professional) => (
              <Column
                key={professional.id}
                demo={demo}
                date={date}
                professionalId={professional.id}
                openMin={opening.openMin}
                closeMin={opening.closeMin}
                now={now}
                linkToRows={linkToRows}
              />
            ))}
          </div>
        </div>
      )}
      <p className="sr-only">A lista completa dos agendamentos de {formatDateLong(date)} está logo abaixo, na agenda.</p>
    </section>
  );
}

function TimeAxis({ openMin, closeMin }: { openMin: number; closeMin: number }) {
  const hours: number[] = [];
  for (let t = Math.ceil(openMin / 60) * 60; t <= closeMin; t += 60) hours.push(t);
  return (
    <div aria-hidden className="relative" style={{ height: ((closeMin - openMin) / 20) * ROW }}>
      {hours.map((t) => (
        <span key={t} className="absolute right-0 -translate-y-1/2 text-xs text-smoke tabular-nums" style={{ top: ((t - openMin) / 20) * ROW }}>
          {formatTime(t)}
        </span>
      ))}
    </div>
  );
}

function Column({
  demo,
  date,
  professionalId,
  openMin,
  closeMin,
  now,
  linkToRows,
}: {
  demo: DemoState;
  date: string;
  professionalId: string;
  openMin: number;
  closeMin: number;
  now: BusinessNow;
  linkToRows: boolean;
}) {
  const top = (min: number) => ((min - openMin) / 20) * ROW;
  const height = (from: number, to: number) => ((to - from) / 20) * ROW - 2;
  const bookings = demo.bookings.filter((b) => b.date === date && b.professionalId === professionalId && b.status !== "cancelado");
  const blocks = demo.blocks.filter((b) => b.date === date && b.professionalId === professionalId);
  const hours: number[] = [];
  for (let t = Math.ceil(openMin / 60) * 60; t <= closeMin; t += 60) hours.push(t);

  return (
    <ul className="relative rounded-lg bg-coal" style={{ height: ((closeMin - openMin) / 20) * ROW }}>
      {hours.map((t) => (
        <li key={`h${t}`} aria-hidden className="absolute inset-x-0 border-t border-edge/60" style={{ top: top(t) }} />
      ))}
      <li
        aria-hidden
        className="faixa-bloqueio absolute inset-x-1 rounded-md border border-edge px-1.5 text-[0.6875rem] text-smoke"
        style={{ top: top(business.lunch.startMin) + 1, height: height(business.lunch.startMin, business.lunch.endMin) }}
      >
        Almoço
      </li>
      {blocks.map((block) => (
        <li
          key={block.id}
          className="faixa-bloqueio absolute inset-x-1 overflow-hidden rounded-md border border-edge px-1.5 text-[0.6875rem] text-smoke"
          style={{ top: top(block.startMin) + 1, height: height(block.startMin, block.endMin) }}
        >
          Bloqueado: {block.reason}
        </li>
      ))}
      {date === now.date && now.minutes > openMin && now.minutes < closeMin && (
        <li aria-hidden className="absolute inset-x-0 z-10 border-t-2 border-warn" style={{ top: top(now.minutes) }}>
          <span className="absolute -top-2.5 -left-1 size-2.5 rounded-full bg-warn" />
        </li>
      )}
      {bookings.map((booking) => {
        const items = productCount(demo, booking.id);
        const label = `${formatTime(booking.startMin)} a ${formatTime(booking.endMin)}: ${booking.customerName}, ${getService(booking.serviceId)?.name}, ${formatBRL(booking.priceCents)}${booking.status === "concluido" ? ", concluído" : ""}${booking.note ? `. Recado: ${booking.note}` : ""}`;
        return (
          <li
            key={booking.id}
            title={label}
            aria-label={label}
            className={`absolute inset-x-1 overflow-hidden rounded-md border-l-4 px-1.5 py-0.5 text-[0.6875rem] leading-tight ${blockStyle[booking.status]} ${
              booking.origin === "visitor" ? "ring-1 ring-cream/60" : ""
            }`}
            style={{ top: top(booking.startMin) + 1, height: height(booking.startMin, booking.endMin) }}
          >
            {linkToRows ? (
              <a href={`#ag-${booking.id}`} className="block size-full rounded-sm hover:brightness-125">
                <BlockText booking={booking} items={items} />
              </a>
            ) : (
              <BlockText booking={booking} items={items} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function BlockText({ booking, items }: { booking: Booking; items: number }) {
  // Blocos de 20 minutos só têm altura para uma linha.
  const short = booking.endMin - booking.startMin <= 20;
  return (
    <>
      <span className="block truncate font-semibold">
        {formatTime(booking.startMin)} {booking.customerName}
      </span>
      <span className={`truncate text-smoke ${short ? "hidden" : "block"}`}>
        {getService(booking.serviceId)?.name}
        {items > 0 ? ` · +${items} produto${items > 1 ? "s" : ""}` : ""}
        {booking.note ? " · recado" : ""}
      </span>
    </>
  );
}
