"use client";

import { Check, Crown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoyaltyCard } from "@/components/loyalty-card";
import { PixCheckout } from "@/components/pix-checkout";
import { getPlan, getService, plans, type Plan } from "@/data/business";
import { loyaltyStatus, planUsesLeft } from "@/lib/demo-state";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";

/** Quanto custariam os mesmos atendimentos avulsos (usando o serviço principal do plano). */
function avulso(plan: Plan): number {
  return (getService(plan.serviceIds[0])?.priceCents ?? 0) * plan.usesPerMonth;
}

export function PlansArea() {
  const demo = useDemoState();
  const [message, setMessage] = useState("");

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando os planos…
      </p>
    );
  }

  const sub = demo.subscription;
  const current = sub ? getPlan(sub.planId) : undefined;
  const loyaltyNow = loyaltyStatus(demo);

  return (
    <div className="grid gap-12">
      <p role="status" className="-mt-8 min-h-6 text-sm font-semibold text-ok">
        {message}
      </p>

      {sub?.pixStatus === "pendente" && current && (
        <div className="-mt-6">
          <PixCheckout
            reference={`ASSINATURA-${current.id.toUpperCase()}`}
            cents={current.priceCents}
            description={`Primeira mensalidade do ${current.name}. As próximas seriam cobradas todo mês, por Pix automático.`}
            onPaid={() => {
              demoActions.paySubscription();
              setMessage(`${current.name} ativo! Ao agendar, escolha “Usar meu plano”.`);
            }}
          />
          <button
            type="button"
            onClick={() => {
              demoActions.cancelSubscription();
              setMessage("");
            }}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-smoke hover:text-cream"
          >
            <X aria-hidden className="size-4" />
            Desistir da assinatura
          </button>
        </div>
      )}

      {sub?.pixStatus === "pago" && current && (
        <div className="-mt-6 flex flex-col gap-4 rounded-card border border-ok/40 bg-coal-2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Crown aria-hidden className="mt-1 size-6 shrink-0 text-gold" />
            <p>
              <span className="block font-display text-2xl font-semibold uppercase">{current.name} ativo</span>
              <span className="text-smoke">
                Restam {planUsesLeft(demo)} de {current.usesPerMonth} atendimentos neste mês.
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-gold">
              Agendar pelo plano
            </Link>
            <button
              type="button"
              onClick={() => {
                demoActions.cancelSubscription();
                setMessage("Assinatura cancelada. Sem multa: o plano vale até o fim do mês pago.");
              }}
              className="btn btn-line"
            >
              Cancelar assinatura
            </button>
          </div>
        </div>
      )}

      <section aria-label="Planos disponíveis" className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => {
          const savings = avulso(plan) - plan.priceCents;
          const active = sub?.planId === plan.id;
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-card border p-6 sm:p-8 ${active ? "border-gold bg-coal-3" : "border-edge bg-coal-2"}`}
            >
              <h2 className="text-3xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-smoke">{plan.summary}</p>
              <p className="mt-5">
                <span className="font-display text-5xl font-semibold text-gold">{formatBRL(plan.priceCents)}</span>
                <span className="text-smoke"> /mês</span>
              </p>
              {savings > 0 && (
                <p className="mt-1 text-sm font-semibold text-ok">
                  Avulso sairia {formatBRL(avulso(plan))}: economia de {formatBRL(savings)} por mês.
                </p>
              )}
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {plan.serviceIds.map((id) => (
                  <li key={id} className="flex gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                    {getService(id)?.name}
                  </li>
                ))}
                <li className="flex gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                  Agenda online com prioridade na lista de espera
                </li>
                <li className="flex gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                  Cancele quando quiser, sem multa
                </li>
              </ul>
              <button
                type="button"
                disabled={active || sub?.pixStatus === "pago"}
                onClick={() => {
                  const result = demoActions.subscribe(plan.id);
                  setMessage(result.ok ? "" : result.error);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-gold mt-8"
              >
                <Crown aria-hidden className="size-4" />
                {active ? "Plano escolhido" : `Assinar o ${plan.name}`}
              </button>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="fidelidade-title" className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h2 id="fidelidade-title" className="text-4xl font-bold">
            Não quer assinar? Junte selos
          </h2>
          <p className="mt-3 text-smoke">
            Todo corte concluído vale um selo no cartão fidelidade digital. No décimo, a barba completa sai de presente. Sem
            cartão de papel para perder.
          </p>
        </div>
        <LoyaltyCard stamps={loyaltyNow.stamps} rewardsAvailable={loyaltyNow.rewardsAvailable} />
      </section>
    </div>
  );
}
