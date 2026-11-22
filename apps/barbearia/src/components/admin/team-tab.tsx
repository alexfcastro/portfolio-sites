"use client";

import { Tile } from "@/components/admin/shared";
import { business } from "@/data/business";
import type { DemoState } from "@/lib/demo-state";
import { monthByProfessional } from "@/lib/insights";
import { formatBRL } from "@/lib/money";
import type { BusinessNow } from "@/types/booking";

const monthName = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long" });

export function TeamTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const rows = monthByProfessional(demo.bookings, now);
  const total = rows.reduce((sum, row) => sum + row.servedCents, 0);
  const count = rows.reduce((sum, row) => sum + row.count, 0);
  const commission = rows.reduce((sum, row) => sum + row.commissionCents, 0);
  const max = Math.max(1, ...rows.map((row) => row.servedCents));
  const month = monthName.format(new Date(`${now.date}T12:00:00Z`));

  return (
    <div className="grid gap-10">
      <div>
        <h2 className="text-3xl font-bold">Equipe em {month}, até hoje</h2>
        <p className="mt-1 text-smoke">
          Atendimentos concluídos do dia 1 até agora, com a comissão de {business.commissionPct}% já calculada. Valores pelo
          preço de tabela (inclui os atendimentos de plano).
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Tile label="Atendimentos no mês" value={String(count)} hint="todos os profissionais" />
          <Tile label="Valor atendido" value={formatBRL(total)} hint="preço de tabela" />
          <Tile label="Comissões a pagar" value={formatBRL(commission)} hint={`${business.commissionPct}% do atendido`} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-edge">
        <table className="w-full min-w-[36rem] text-left">
          <caption className="sr-only">Resultado do mês por profissional</caption>
          <thead className="bg-coal-2 text-xs tracking-wider text-smoke uppercase">
            <tr>
              <th scope="col" className="p-4">
                Profissional
              </th>
              <th scope="col" className="p-4 text-right">
                Atendimentos
              </th>
              <th scope="col" className="p-4 text-right">
                Valor atendido
              </th>
              <th scope="col" className="p-4 text-right">
                Ticket médio
              </th>
              <th scope="col" className="p-4 text-right">
                Comissão
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {rows.map((row) => (
              <tr key={row.professionalId}>
                <th scope="row" className="p-4 font-semibold">
                  {row.name}
                  <span aria-hidden className="mt-2 block h-1.5 rounded-full bg-edge">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${(row.servedCents / max) * 100}%` }} />
                  </span>
                </th>
                <td className="p-4 text-right tabular-nums">{row.count}</td>
                <td className="p-4 text-right tabular-nums">{formatBRL(row.servedCents)}</td>
                <td className="p-4 text-right tabular-nums">{formatBRL(row.averageCents)}</td>
                <td className="p-4 text-right font-semibold text-gold tabular-nums">{formatBRL(row.commissionCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-smoke">
        Histórico fictício gerado para a demonstração. Num sistema real, estes números saem dos atendimentos concluídos no
        painel, sem planilha.
      </p>
    </div>
  );
}
