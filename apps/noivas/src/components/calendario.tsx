"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { demoStore } from "@/lib/demo-store";
import { dataDisponivel, diasDoMes, ocupada, proximoMes } from "@/lib/orcamento";
import { formatDateLong, getBusinessNow, getWeekday } from "@/lib/time";

const SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Disponibilidade por mês: datas ocupadas riscadas, livres para escolher (a partir de 30 dias). */
export function Calendario() {
  const estado = demoStore.useStore();
  if (!estado) return <div aria-hidden className="mt-10 h-96 rounded-card bg-paper" />;
  return <Mes />;
}

function Mes() {
  const estado = demoStore.useStore()!;
  const [hoje] = useState(() => getBusinessNow().date);
  const primeiro = hoje.slice(0, 7);
  const [mes, setMes] = useState(() => (estado.data ? estado.data.slice(0, 7) : proximoMes(primeiro, 2)));
  const ultimo = proximoMes(primeiro, 18);
  const dias = diasDoMes(mes);
  const vazios = getWeekday(dias[0]!);
  const [ano, m] = mes.split("-").map(Number) as [number, number];
  const ocupadasNoMes = dias.filter((d) => d >= hoje && ocupada(d)).length;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
      <div className="min-w-0 rounded-card border border-line bg-paper p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMes(proximoMes(mes, -1))}
            disabled={mes <= primeiro}
            className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
          >
            <ChevronLeft aria-hidden className="size-5" />
            <span className="sr-only">Mês anterior</span>
          </button>
          <h3 className="text-2xl first-letter:uppercase" aria-live="polite">
            {MESES[m - 1]} de {ano}
          </h3>
          <button
            type="button"
            onClick={() => setMes(proximoMes(mes, 1))}
            disabled={mes >= ultimo}
            className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
          >
            <ChevronRight aria-hidden className="size-5" />
            <span className="sr-only">Próximo mês</span>
          </button>
        </div>
        <div className="mt-4">
          <div aria-hidden className="grid grid-cols-7 text-center text-xs tracking-wide text-muted uppercase">
            {SEMANA.map((dia) => (
              <span key={dia} className="py-2">
                {dia}
              </span>
            ))}
          </div>
          <div role="group" aria-label={`Datas de ${MESES[m - 1]} de ${ano}`} className="grid grid-cols-7 gap-1">
            {Array.from({ length: vazios }, (_, i) => (
              <span key={`v${i}`} aria-hidden />
            ))}
            {dias.map((dia) => {
              const livre = dataDisponivel(dia, hoje);
              const tomada = dia >= hoje && ocupada(dia);
              const escolhida = estado.data === dia;
              return (
                <span key={dia}>
                  <button
                    type="button"
                    disabled={!livre}
                    aria-pressed={escolhida}
                    aria-label={`${formatDateLong(dia)}${tomada ? ", ocupada" : !livre ? ", indisponível" : ", livre"}`}
                    onClick={() => demoStore.set({ ...demoStore.get(), data: dia })}
                    className={`mx-auto grid size-11 place-items-center rounded-full text-sm font-medium transition-colors sm:size-12 aria-pressed:bg-dourado-escuro aria-pressed:text-white ${
                      tomada ? "text-muted line-through decoration-2" : !livre ? "text-muted/60" : "hover:bg-champanhe-suave"
                    }`}
                  >
                    {Number(dia.slice(8))}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Neste mês, <strong className="text-ink">{ocupadasNoMes} datas</strong> já estão reservadas. Sábados costumam fechar primeiro.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-dourado-escuro text-xs text-white">12</span> Data escolhida
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden className="grid size-8 place-items-center rounded-full border border-line text-xs">12</span> Livre
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden className="grid size-8 place-items-center text-xs text-muted line-through decoration-2">12</span> Ocupada
          </li>
        </ul>
        <p className="rounded-card bg-champanhe-suave p-4 text-sm" aria-live="polite">
          {estado.data ? (
            <>
              Data escolhida: <strong className="first-letter:uppercase">{formatDateLong(estado.data)}</strong>
            </>
          ) : (
            "Nenhuma data escolhida ainda."
          )}
        </p>
      </div>
    </div>
  );
}
