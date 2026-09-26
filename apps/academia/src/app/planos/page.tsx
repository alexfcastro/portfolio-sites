import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { plans } from "@/data/studio";
import { formatBRL } from "@/lib/money";

export const metadata: Metadata = { title: "Planos" };

export default function PlansPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Planos</p>
      <h1 className="mt-2 text-5xl">Escolha seu plano</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Valores de exemplo. Nesta demonstração não há contratação nem pagamento: comece por uma aula experimental.
      </p>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className={`flex flex-col rounded-card border p-7 ${plan.highlight ? "border-lime bg-panel-2" : "border-edge bg-panel"}`}
          >
            {plan.highlight && (
              <p className="mb-3 w-fit rounded-full bg-lime px-3 py-1 text-xs font-bold text-night uppercase">Mais escolhido</p>
            )}
            <h2 className="text-2xl">{plan.name}</h2>
            <p className="mt-4">
              <span className="text-4xl font-bold">{formatBRL(plan.monthlyCents)}</span>
              <span className="text-muted">/mês</span>
            </p>
            <p className="mt-1 text-sm text-muted">{plan.commitment}</p>
            <ul className="mt-6 flex-1 space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-lime" />
                  {perk}
                </li>
              ))}
            </ul>
            <Link href="/aulas" className={`btn mt-8 ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
              Começar com aula experimental
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
