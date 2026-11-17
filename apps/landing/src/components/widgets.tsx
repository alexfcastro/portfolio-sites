"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import {
  agendaPlans,
  agendaPrice,
  coffeeFrequencies,
  coffeeGrinds,
  coffeePlan,
  coffeeSizes,
  formatBRL,
  SOLAR_MAX_BILL,
  SOLAR_MIN_BILL,
  solarEstimate,
} from "@/lib/calc";

/** Abas simples (botões com aria-pressed): o conteúdo da aba escolhida aparece logo abaixo. */
export function Abas({ label, abas }: { label: string; abas: Array<{ id: string; titulo: string; conteudo: ReactNode }> }) {
  const [ativa, setAtiva] = useState(abas[0]?.id ?? "");
  const atual = abas.find((aba) => aba.id === ativa) ?? abas[0];
  return (
    <div>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {abas.map((aba) => (
          <button key={aba.id} type="button" aria-pressed={aba.id === ativa} onClick={() => setAtiva(aba.id)} className="lp-chip">
            {aba.titulo}
          </button>
        ))}
      </div>
      <div key={atual?.id} className="troca mt-6" aria-live="polite">
        {atual?.conteudo}
      </div>
    </div>
  );
}

/** Clube Serra Alta: a pessoa monta o plano e o preço aparece na hora. */
export function MontarPlano() {
  const [sizeId, setSizeId] = useState<string>("500");
  const [frequencyId, setFrequencyId] = useState<string>("mensal");
  const [grind, setGrind] = useState<string>(coffeeGrinds[0]);
  const plan = coffeePlan(sizeId, frequencyId);
  const grindId = useId();

  return (
    <div className="lp-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div className="space-y-6">
        <fieldset>
          <legend className="font-bold">Quanto café por entrega?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {coffeeSizes.map((size) => (
              <button key={size.id} type="button" aria-pressed={size.id === sizeId} onClick={() => setSizeId(size.id)} className="lp-chip">
                {size.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-bold">Com que frequência?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {coffeeFrequencies.map((frequency) => (
              <button
                key={frequency.id}
                type="button"
                aria-pressed={frequency.id === frequencyId}
                onClick={() => setFrequencyId(frequency.id)}
                className="lp-chip"
              >
                {frequency.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={grindId} className="font-bold">
            Como você prepara?
          </label>
          <select id={grindId} value={grind} onChange={(event) => setGrind(event.target.value)} className="lp-input mt-3 max-w-sm">
            {coffeeGrinds.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-2xl p-6 text-center" style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}>
        <p className="text-sm font-semibold tracking-wide uppercase">O seu plano</p>
        <p role="status" aria-live="polite" className="lp-display mt-2 text-5xl font-bold">
          {formatBRL(plan.monthlyCents)}
          <span className="block text-base font-semibold">por mês</span>
        </p>
        <p className="mt-3 text-sm">
          {plan.size.label} · {plan.frequency.label.toLowerCase()} · {grind.toLowerCase()}
          {plan.frequency.deliveries > 1 && <> · {formatBRL(plan.perDeliveryCents)} por entrega, com 10% de desconto</>}
        </p>
        <a href="#assinar" className="btn mt-5 w-full" style={{ background: "var(--lp-on-accent)", color: "var(--lp-accent)" }}>
          Assinar este plano
        </a>
      </div>
    </div>
  );
}

/** Solar Viva: a pessoa informa a conta de luz e vê uma estimativa ilustrativa. */
export function CalculadoraSolar() {
  const [bill, setBill] = useState(45000);
  const estimate = solarEstimate(bill);
  const id = useId();
  return (
    <div className="lp-card grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
      <div>
        <label htmlFor={id} className="text-lg font-bold">
          Quanto vem a sua conta de luz por mês?
        </label>
        <p className="lp-display lp-accent mt-3 text-5xl font-bold">{formatBRL(estimate.billCents)}</p>
        <input
          id={id}
          type="range"
          min={SOLAR_MIN_BILL}
          max={SOLAR_MAX_BILL}
          step={1000}
          value={bill}
          onChange={(event) => setBill(Number(event.target.value))}
          aria-valuetext={formatBRL(estimate.billCents)}
          className="mt-5 w-full"
          style={{ accentColor: "var(--lp-accent)" }}
        />
        <p className="lp-muted mt-2 flex justify-between text-sm">
          <span>{formatBRL(SOLAR_MIN_BILL)}</span>
          <span>{formatBRL(SOLAR_MAX_BILL)}</span>
        </p>
      </div>
      <dl role="status" aria-live="polite" className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {[
          ["Economia por mês", formatBRL(estimate.monthlySavingCents)],
          ["Economia por ano", formatBRL(estimate.yearlySavingCents)],
          ["Painéis estimados", String(estimate.panels)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border p-4" style={{ borderColor: "var(--lp-line)" }}>
            <dt className="lp-muted text-sm">{label}</dt>
            <dd className="lp-display mt-1 text-3xl font-bold">{value}</dd>
          </div>
        ))}
        <p className="lp-muted text-sm sm:col-span-3 lg:col-span-1">
          Estimativa ilustrativa desta demonstração. Em um site real, o número viria de um estudo com o seu consumo e o
          seu telhado.
        </p>
      </dl>
    </div>
  );
}

/** Agenda Leve: planos com alternância entre cobrança mensal e anual. */
export function PlanosAgenda() {
  const [annual, setAnnual] = useState(true);
  return (
    <div>
      <div role="group" aria-label="Forma de cobrança" className="flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)} className="lp-chip">
          Mensal
        </button>
        <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)} className="lp-chip">
          Anual (2 meses grátis)
        </button>
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {agendaPlans.map((plan, index) => (
          <li
            key={plan.id}
            className="lp-card flex flex-col p-6"
            style={index === 1 ? { borderColor: "var(--lp-accent)", boxShadow: "0 24px 50px -28px var(--lp-accent)" } : undefined}
          >
            {index === 1 && (
              <span
                className="mb-3 self-start rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase"
                style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}
              >
                Mais escolhido
              </span>
            )}
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="lp-muted mt-1 text-sm">{plan.seats}</p>
            <p className="lp-display mt-5 text-5xl font-bold">
              {formatBRL(agendaPrice(plan.monthlyCents, annual))}
              <span className="lp-muted text-base font-semibold"> /mês</span>
            </p>
            <p className="lp-muted mt-1 text-sm">{annual ? "cobrado uma vez por ano" : "cobrado todo mês"}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check aria-hidden className="lp-accent mt-0.5 size-5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <a href="#testar" className={`btn mt-6 ${index === 1 ? "lp-btn" : "lp-btn-ghost"}`}>
              Testar 14 dias grátis
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
