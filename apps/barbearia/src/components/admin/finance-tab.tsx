"use client";

import { Info } from "lucide-react";
import type { DemoState } from "@/lib/demo-state";
import { monthForecast, type DayRevenue, type MonthForecast } from "@/lib/finance";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatDateParts } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

const monthName = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long" });

/** R$ sem centavos, para eixos e rótulos curtos. */
function short(cents: number): string {
  const reais = Math.round(cents / 100);
  return reais >= 1000 ? `R$ ${(reais / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : `R$ ${reais}`;
}

export function FinanceTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const f = monthForecast(demo, now);
  const month = monthName.format(new Date(`${now.date}T12:00:00Z`));
  const servicesTotal = f.realizedCents + f.bookedCents + f.projectedCents;

  return (
    <div className="grid gap-10">
      <section aria-labelledby="estimativa-title">
        <h2 id="estimativa-title" className="text-3xl font-bold">
          Faturamento de {month}
        </h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="rounded-card border border-gold/50 bg-coal-3 p-5">
            <p className="text-xs font-semibold tracking-wider text-smoke uppercase">Estimativa do mês</p>
            <p className="mt-1 font-display text-5xl font-semibold text-gold">{formatBRL(f.estimateCents)}</p>
            <p className="mt-1 text-xs text-smoke">
              Garantido até agora: {formatBRL(f.conservativeCents)} (sem a projeção)
            </p>
          </div>
          <Stat label="Já faturado" value={f.realizedCents + f.storeCents + f.plansCents} hint="serviços atendidos, loja e assinaturas" swatch="bg-serie-real" />
          <Stat label="Agendado" value={f.bookedCents} hint="horários confirmados ainda não atendidos" swatch="bg-serie-agenda" />
          <Stat label="Projeção" value={f.projectedCents} hint="o que costuma entrar nos dias que faltam" swatch="barra-projecao" />
        </div>
      </section>

      <MonthChart days={f.days} today={now.date} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="composicao-title" className="rounded-card border border-edge bg-coal-2 p-5 sm:p-6">
          <h2 id="composicao-title" className="text-2xl font-bold">
            Como a estimativa se forma
          </h2>
          <dl className="mt-4 space-y-2">
            <Row label="Serviços já atendidos" value={f.realizedCents} />
            <Row label="Serviços agendados" value={f.bookedCents} />
            <Row label="Projeção dos dias sem agenda cheia" value={f.projectedCents} muted />
            <Row label="Subtotal de serviços" value={servicesTotal} strong />
            <Row label="Loja (pedidos do mês)" value={f.storeCents} />
            <Row label="Assinaturas (planos mensais)" value={f.plansCents} />
            <Row label="Estimativa do mês" value={f.estimateCents} strong gold />
          </dl>
        </section>

        <ProfessionalSplit forecast={f} />
      </div>

      <p className="flex gap-3 rounded-card border border-edge p-4 text-sm leading-relaxed text-smoke">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
        <span>
          <strong className="text-cream">Como a projeção é calculada:</strong> para cada dia que falta, o painel olha quanto
          cada barbeiro faturou nas últimas 4 semanas no mesmo dia da semana e soma só a diferença para o que já está
          agendado. A conta não depende do relógio: os números só mudam quando a agenda muda ou quando o dia vira. Serviços pagos pelo plano ou pela fidelidade não
          entram duas vezes: o plano já está nas assinaturas. Histórico fictício, gerado para a demonstração.
        </span>
      </p>
    </div>
  );
}

function Stat({ label, value, hint, swatch }: { label: string; value: number; hint: string; swatch: string }) {
  return (
    <div className="rounded-card border border-edge bg-coal-2 p-5">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-smoke uppercase">
        <i aria-hidden className={`size-3 rounded-sm ${swatch}`} />
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold">{formatBRL(value)}</p>
      <p className="text-xs text-smoke">{hint}</p>
    </div>
  );
}

function Row({ label, value, strong, gold, muted }: { label: string; value: number; strong?: boolean; gold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-edge pt-2 font-semibold" : ""} ${muted ? "text-smoke" : ""}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums ${gold ? "font-display text-2xl text-gold" : ""}`}>{formatBRL(value)}</dd>
    </div>
  );
}

/** Barras empilhadas por dia: realizado (dourado), agendado (azul) e projeção (listras azuis). */
function MonthChart({ days, today }: { days: DayRevenue[]; today: string }) {
  const totals = days.map((d) => d.realizedCents + d.bookedCents + d.projectedCents);
  const rawMax = Math.max(1, ...totals);
  // Topo do eixo arredondado para um número "redondo".
  const step = rawMax > 200000 ? 50000 : rawMax > 80000 ? 25000 : 10000;
  const max = Math.ceil(rawMax / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step).filter((_, i, all) => all.length <= 6 || i % 2 === 0);
  const HEIGHT = 220;
  const px = (cents: number) => (cents / max) * HEIGHT;

  return (
    <section aria-labelledby="grafico-title" className="rounded-card border border-edge bg-coal-2 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="grafico-title" className="text-2xl font-bold">
          Serviços por dia
        </h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-smoke">
          <li className="flex items-center gap-1.5">
            <i aria-hidden className="size-3 rounded-sm bg-serie-real" /> Atendido
          </li>
          <li className="flex items-center gap-1.5">
            <i aria-hidden className="size-3 rounded-sm bg-serie-agenda" /> Agendado
          </li>
          <li className="flex items-center gap-1.5">
            <i aria-hidden className="barra-projecao size-3 rounded-sm" /> Projeção
          </li>
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-[3.25rem_1fr] gap-2" aria-hidden>
        <div className="relative" style={{ height: HEIGHT }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 translate-y-1/2 text-[0.6875rem] text-smoke tabular-nums" style={{ bottom: px(t) }}>
              {short(t)}
            </span>
          ))}
        </div>
        <div className="relative" style={{ height: HEIGHT }}>
          {ticks.map((t) => (
            <span key={t} className="absolute inset-x-0 border-t border-edge/50" style={{ bottom: px(t) }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {days.map((day, index) => (
              <Bar key={day.date} day={day} today={today} px={px} alignRight={index > days.length / 2} />
            ))}
          </div>
        </div>
        <span />
        <div className="flex gap-[2px] text-[0.625rem] text-smoke">
          {days.map((day) => {
            const d = Number(day.date.slice(8));
            // Números de 5 em 5, sem encostar no rótulo "hoje".
            const show = day.date === today || ((d === 1 || d % 5 === 0) && Math.abs(d - Number(today.slice(8))) > 1);
            return (
              <span key={day.date} className={`flex-1 text-center tabular-nums ${day.date === today ? "font-bold text-cream" : ""}`}>
                {show ? (day.date === today ? "hoje" : d) : ""}
              </span>
            );
          })}
        </div>
      </div>

      <details className="mt-5 text-sm">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-gold">Ver como tabela</summary>
        <div className="mt-2 max-h-80 overflow-auto rounded-lg border border-edge">
          <table className="w-full min-w-[28rem] text-left">
            <caption className="sr-only">Faturamento de serviços por dia do mês</caption>
            <thead className="sticky top-0 bg-coal-2 text-xs text-smoke uppercase">
              <tr>
                <th scope="col" className="p-2">
                  Dia
                </th>
                <th scope="col" className="p-2 text-right">
                  Atendido
                </th>
                <th scope="col" className="p-2 text-right">
                  Agendado
                </th>
                <th scope="col" className="p-2 text-right">
                  Projeção
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {days.map((day) => (
                <tr key={day.date} className={day.date === today ? "bg-coal-3" : ""}>
                  <th scope="row" className="p-2 font-normal">
                    {formatDateParts(day.date).dayMonth} {formatDateParts(day.date).weekday}
                    {day.closed ? " · fechado" : ""}
                  </th>
                  <td className="p-2 text-right tabular-nums">{formatBRL(day.realizedCents)}</td>
                  <td className="p-2 text-right tabular-nums">{formatBRL(day.bookedCents)}</td>
                  <td className="p-2 text-right tabular-nums">{formatBRL(day.projectedCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Bar({
  day,
  today,
  px,
  alignRight,
}: {
  day: DayRevenue;
  today: string;
  px: (cents: number) => number;
  alignRight: boolean;
}) {
  const segments = [
    { cents: day.realizedCents, className: "bg-serie-real" },
    { cents: day.bookedCents, className: "bg-serie-agenda" },
    { cents: day.projectedCents, className: "barra-projecao" },
  ].filter((s) => s.cents > 0);
  const total = day.realizedCents + day.bookedCents + day.projectedCents;

  return (
    <div className="group relative flex h-full flex-1 flex-col justify-end">
      {/* Área de toque maior que a barra */}
      <span className="absolute inset-0 rounded-sm group-hover:bg-cream/5" />
      {day.closed ? (
        <span className="mx-auto mb-0.5 block size-1 rounded-full bg-edge" />
      ) : (
        <span className="flex flex-col-reverse gap-[2px]">
          {segments.map((segment, i) => (
            <span
              key={i}
              className={`block w-full ${segment.className} ${i === segments.length - 1 ? "rounded-t-[4px]" : ""}`}
              style={{ height: Math.max(2, px(segment.cents) - 2) }}
            />
          ))}
        </span>
      )}
      {day.date === today && <span className="absolute -top-1 left-1/2 h-[calc(100%+4px)] w-px -translate-x-1/2 bg-cream/40" />}
      <span
        className={`pointer-events-none absolute top-0 z-20 hidden w-52 rounded-lg border border-edge bg-coal p-3 text-xs shadow-xl group-hover:block ${
          alignRight ? "right-0" : "left-0"
        }`}
      >
        <span className="block font-semibold text-cream first-letter:uppercase">{formatDateLong(day.date)}</span>
        {day.closed ? (
          <span className="text-smoke">Fechado</span>
        ) : (
          <>
            <TipLine swatch="bg-serie-real" label="Atendido" value={day.realizedCents} />
            <TipLine swatch="bg-serie-agenda" label={`Agendado (${day.bookedCount})`} value={day.bookedCents} />
            <TipLine swatch="barra-projecao" label="Projeção" value={day.projectedCents} />
            <span className="mt-1 flex justify-between border-t border-edge pt-1 font-semibold text-cream">
              <span>Total</span>
              <span className="tabular-nums">{formatBRL(total)}</span>
            </span>
          </>
        )}
      </span>
    </div>
  );
}

function TipLine({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <span className="mt-1 flex items-center justify-between gap-2 text-smoke">
      <span className="flex items-center gap-1.5">
        <i className={`size-2.5 rounded-sm ${swatch}`} />
        {label}
      </span>
      <span className="text-cream tabular-nums">{formatBRL(value)}</span>
    </span>
  );
}

function ProfessionalSplit({ forecast }: { forecast: MonthForecast }) {
  const rows = forecast.byProfessional;
  const max = Math.max(1, ...rows.map((r) => r.realizedCents + r.bookedCents + r.projectedCents));
  return (
    <section aria-labelledby="por-barbeiro-title" className="rounded-card border border-edge bg-coal-2 p-5 sm:p-6">
      <h2 id="por-barbeiro-title" className="text-2xl font-bold">
        Por barbeiro
      </h2>
      <ul className="mt-4 space-y-5">
        {rows.map((row) => {
          const total = row.realizedCents + row.bookedCents + row.projectedCents;
          return (
            <li key={row.professionalId}>
              <p className="flex justify-between gap-3">
                <span className="font-semibold">{row.name}</span>
                <span className="font-display text-xl font-semibold tabular-nums">{formatBRL(total)}</span>
              </p>
              <span aria-hidden className="mt-2 flex h-3 gap-[2px]">
                <span className="rounded-l-[4px] bg-serie-real" style={{ width: `${(row.realizedCents / max) * 100}%` }} />
                <span className="bg-serie-agenda" style={{ width: `${(row.bookedCents / max) * 100}%` }} />
                <span className="barra-projecao rounded-r-[4px]" style={{ width: `${(row.projectedCents / max) * 100}%` }} />
              </span>
              <p className="mt-1.5 text-xs text-smoke">
                Atendido {formatBRL(row.realizedCents)} · agendado {formatBRL(row.bookedCents)} · projeção {formatBRL(row.projectedCents)}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
