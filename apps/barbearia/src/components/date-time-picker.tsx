"use client";

import { getBookableDates, getOpeningWindow, listAvailableStarts } from "@/lib/schedule";
import { formatDateLong, formatDateParts, formatTime, relativeDayLabel } from "@/lib/time";
import type { Block, Booking, BusinessNow, Service } from "@/types/booking";

interface DateTimePickerProps {
  service: Service;
  professionalId: string;
  bookings: readonly Booking[];
  blocks: readonly Block[];
  now: BusinessNow;
  date: string;
  startMin: number | null;
  onChange: (date: string, startMin: number | null) => void;
  /** Ignora este agendamento ao calcular vagas (remarcação). */
  ignoreId?: string;
  /** Prefixo dos nomes dos campos, para usar mais de um seletor na mesma página. */
  name?: string;
}

/** Faixa de datas + grade de horários livres. Usado no agendamento e na remarcação. */
export function DateTimePicker({
  service,
  professionalId,
  bookings,
  blocks,
  now,
  date,
  startMin,
  onChange,
  ignoreId,
  name = "",
}: DateTimePickerProps) {
  const startsFor = (day: string) =>
    listAvailableStarts({ date: day, service, professionalId, bookings, now, blocks, ignoreId });
  const dates = getBookableDates(now.date);
  const starts = date ? startsFor(date) : [];

  return (
    <>
      {/* min-w-0: fieldset tem largura mínima = conteúdo; sem isso a faixa de datas alarga a página. */}
      <fieldset className="mt-6 min-w-0">
        <legend className="font-display text-lg tracking-wider uppercase">Data</legend>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {dates.map((day) => {
            const closed = !getOpeningWindow(day);
            const free = closed ? 0 : startsFor(day).length;
            const parts = formatDateParts(day);
            const relative = relativeDayLabel(day, now.date);
            const status = closed ? "Fechado" : free === 0 ? "Lotado" : `${free} livres`;
            return (
              <label key={day} className="choice w-24 shrink-0 px-2 py-3 text-center">
                <input
                  type="radio"
                  name={`${name}date`}
                  value={day}
                  checked={date === day}
                  disabled={free === 0}
                  onChange={() => onChange(day, null)}
                  className="sr-only"
                />
                <span className="block text-xs font-semibold text-smoke uppercase">{relative ?? parts.weekday}</span>
                <span className="block font-display text-2xl font-semibold">{parts.dayMonth}</span>
                <span className={`block text-xs ${free ? "text-ok" : "text-smoke"}`}>{status}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {date && (
        <fieldset className="mt-6 min-w-0">
          <legend className="font-display text-lg tracking-wider uppercase">
            Horário — <span className="normal-case">{formatDateLong(date)}</span>
          </legend>
          {starts.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
              {starts.map((start) => (
                <label key={start} className="choice py-3 text-center">
                  <input
                    type="radio"
                    name={`${name}time`}
                    value={start}
                    checked={startMin === start}
                    onChange={() => onChange(date, start)}
                    className="sr-only"
                  />
                  <span className="font-display text-lg font-semibold">{formatTime(start)}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-smoke">Sem horários livres neste dia. Escolha outra data.</p>
          )}
        </fieldset>
      )}
    </>
  );
}

/** Primeiro dia com horário livre, ou "" se não houver. */
export function firstFreeDate(
  service: Service,
  professionalId: string,
  bookings: readonly Booking[],
  blocks: readonly Block[],
  now: BusinessNow,
  ignoreId?: string,
): string {
  return (
    getBookableDates(now.date).find(
      (day) => listAvailableStarts({ date: day, service, professionalId, bookings, now, blocks, ignoreId }).length > 0,
    ) ?? ""
  );
}
