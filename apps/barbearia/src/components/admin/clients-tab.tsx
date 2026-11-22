"use client";

import { Check, UserX } from "lucide-react";
import { Badge, Tile } from "@/components/admin/shared";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { getProfessional, getService } from "@/data/business";
import type { DemoState } from "@/lib/demo-state";
import { demoActions } from "@/lib/demo-store";
import { missingCustomers, subscribersSummary } from "@/lib/insights";
import { buildComebackMessage } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { formatDateLong } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

export function ClientsTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const missing = missingCustomers(demo, now);
  const subs = subscribersSummary(demo);
  const lostCents = missing.reduce((sum, item) => sum + (getService(item.serviceId)?.priceCents ?? 0), 0);

  return (
    <div className="grid gap-10">
      <section aria-labelledby="assinantes-title">
        <h2 id="assinantes-title" className="text-3xl font-bold">
          Assinantes
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Tile label="Assinantes ativos" value={String(subs.count)} hint="pagam todo mês por Pix" />
          <Tile label="Receita fixa por mês" value={formatBRL(subs.monthlyCents)} hint="entra antes de qualquer corte" />
          <Tile
            label="Por plano"
            value={subs.byPlan.map((plan) => plan.count).join(" · ")}
            hint={subs.byPlan.map((plan) => plan.name).join(" · ")}
          />
        </div>
      </section>

      <section aria-labelledby="sumidos-title">
        <h2 id="sumidos-title" className="flex items-center gap-2 text-3xl font-bold">
          <UserX aria-hidden className="size-6 text-gold" /> Clientes sumidos
        </h2>
        <p className="mt-1 text-smoke">
          Quem não volta há mais de 30 dias e não tem horário marcado. Uma mensagem na hora certa traz boa parte de volta:
          são cerca de {formatBRL(lostCents)} em atendimentos parados.
        </p>
        {missing.length === 0 ? (
          <p className="mt-5 text-smoke">Nenhum cliente sumido. Ótimo sinal.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {missing.map((item) => {
              const service = getService(item.serviceId);
              const pro = getProfessional(item.professionalId);
              return (
                <li
                  key={item.name}
                  className="flex flex-col gap-4 rounded-card border border-edge bg-coal-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name} <span className="font-normal text-smoke">· há {item.daysAway} dias</span>
                    </p>
                    <p className="text-sm text-smoke">
                      Último: {service?.name} com {pro?.shortName}, {formatDateLong(item.lastDate)}
                    </p>
                    {item.contacted && (
                      <p className="mt-2">
                        <Badge className="border-ok/40 text-ok">
                          <Check aria-hidden className="mr-1 inline size-3" />
                          Mensagem enviada
                        </Badge>
                      </p>
                    )}
                  </div>
                  <WhatsAppPreview
                    message={buildComebackMessage(item.name, service?.name ?? "corte", pro?.shortName ?? "barbeiro", item.daysAway)}
                    contactName={item.name}
                    triggerLabel={item.contacted ? "Ver mensagem" : "Chamar de volta"}
                    triggerClassName={`btn ${item.contacted ? "btn-line" : "btn-gold"} !min-h-11 shrink-0 !text-sm`}
                    note="A mensagem já vem pronta, com o nome, o último serviço e o link de agendamento. Num sistema real, sai com um toque."
                    onOpen={() => demoActions.markContacted(item.name)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
