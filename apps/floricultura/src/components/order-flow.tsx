"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Copy, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addons, CARD_MAX_CHARS, getProduct, periods, regions, type Period } from "@/data/shop";
import { flowerActions, flowerStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import {
  addonAllowed,
  availableDates,
  availablePeriods,
  priceFor,
  totalsFor,
  validateDraft,
  type DraftErrors,
  type OrderDraft,
} from "@/lib/order";
import { formatDateLong, formatDateParts, getBusinessNow, relativeDayLabel } from "@/lib/time";

const STEPS = ["Tamanho", "Cartão", "Entrega", "Quem recebe", "Resumo"] as const;
const TITLES = ["Tamanho e adicionais", "Mensagem do cartão", "Entrega ou retirada", "Quem recebe", "Revise o pedido"];
const STEP_FIELDS: Array<Array<keyof OrderDraft>> = [
  ["sizeId", "addonIds"],
  ["card"],
  ["fulfillment", "regionId", "date", "period"],
  ["personName"],
  [],
];

export function OrderFlow({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const state = flowerStore.useStore();
  const [now] = useState(getBusinessNow);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OrderDraft>({
    productId,
    sizeId: "m",
    addonIds: [],
    card: "",
    fulfillment: "",
    regionId: "",
    date: "",
    period: "",
    personName: "",
  });
  const [errors, setErrors] = useState<DraftErrors>({});
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Leva o foco ao título a cada troca de etapa (não no carregamento da página).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, added]);

  const update = (patch: Partial<OrderDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const next = () => {
    const all = validateDraft(draft, now);
    const stepErrors = Object.fromEntries(Object.entries(all).filter(([key]) => STEP_FIELDS[step]!.includes(key as keyof OrderDraft)));
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep((s) => s + 1);
  };

  const confirm = () => {
    const all = validateDraft(draft, now);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const first = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in all));
      setStep(first === -1 ? 0 : first);
      return;
    }
    const result = flowerActions.add(draft);
    if (!result.ok) {
      setCartError(result.error);
      return;
    }
    setAdded(true);
  };

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-line bg-paper p-6 text-muted">
        Carregando a personalização…
      </p>
    );
  }

  if (added) {
    const count = state.cart.length;
    return (
      <section aria-labelledby="done-title" className="rounded-card border border-line bg-paper p-6">
        <CheckCircle2 aria-hidden className="size-9 text-sage" />
        <h2 id="done-title" ref={headingRef} tabIndex={-1} className="mt-3 text-3xl">
          {product.name} no carrinho
        </h2>
        <p className="mt-2 text-muted">
          {count === 1 ? "Seu carrinho tem 1 item." : `Seu carrinho tem ${count} itens.`} Você revisa tudo antes de finalizar; nada é
          enviado nem cobrado.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/carrinho" className="btn btn-primary">
            Ver carrinho
          </Link>
          <Link href="/catalogo" className="btn btn-secondary">
            Escolher mais flores
          </Link>
        </div>
      </section>
    );
  }

  // Atalho: repetir a entrega do último item do carrinho (mesmo destino e horário pagam uma taxa só).
  const last = state.cart.at(-1);
  const canReuse = last !== undefined && availablePeriods(last.date, now).includes(last.period as Period);

  const dates = availableDates(now);
  const periodsForDate = draft.date ? availablePeriods(draft.date, now) : [];
  const price = draft.sizeId ? priceFor(product, draft.sizeId, draft.addonIds) : null;
  const errorId = (field: keyof OrderDraft) => (errors[field] ? `erro-${field}` : undefined);
  const errorText = (field: keyof OrderDraft) =>
    errors[field] ? (
      <p id={`erro-${field}`} className="mt-1 text-sm text-alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="rounded-card border border-line bg-paper p-5 sm:p-6">
      <ol className="grid grid-cols-5 gap-1.5" aria-label="Etapas do pedido">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${index <= step ? "bg-rose" : "bg-line"}`} />
            <span className={`mt-1.5 block text-[0.7rem] leading-tight sm:text-xs ${index === step ? "font-medium text-ink" : "text-muted"}`}>
              <span className="sr-only">Etapa {index + 1}: </span>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl">
        {TITLES[step]}
      </h2>

      <form
        noValidate
        className="mt-5 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 4) next();
          else confirm();
        }}
      >
        {step === 0 && (
          <>
            <fieldset className="min-w-0" aria-describedby={errorId("sizeId")}>
              <legend className="font-medium">Tamanho</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {product.sizes.map((size) => (
                  <label key={size.id} className="choice">
                    <input type="radio" name="size" value={size.id} checked={draft.sizeId === size.id} onChange={() => update({ sizeId: size.id })} className="sr-only" />
                    <span className="block font-medium">{size.label}</span>
                    <span className="block text-sm text-muted">{size.detail}</span>
                    <span className="mt-1 block">{formatBRL(size.priceCents)}</span>
                  </label>
                ))}
              </div>
              {errorText("sizeId")}
            </fieldset>
            <fieldset className="min-w-0" aria-describedby={errorId("addonIds")}>
              <legend className="font-medium">Adicionais (opcional)</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {addons.map((addon) => {
                  const allowed = addonAllowed(product, addon);
                  return (
                    <label key={addon.id} className="choice flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={draft.addonIds.includes(addon.id)}
                        disabled={!allowed}
                        onChange={(event) =>
                          update({ addonIds: event.target.checked ? [...draft.addonIds, addon.id] : draft.addonIds.filter((id) => id !== addon.id) })
                        }
                        className="size-5 accent-rose"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block">{addon.name}</span>
                        <span className="text-sm text-muted">{allowed ? `+ ${formatBRL(addon.priceCents)}` : "Não disponível para este produto"}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errorText("addonIds")}
            </fieldset>
          </>
        )}

        {step === 1 && (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block font-medium">
              Mensagem (opcional)
              <textarea
                value={draft.card}
                onChange={(event) => update({ card: event.target.value })}
                rows={6}
                aria-invalid={errors.card ? true : undefined}
                aria-describedby={errors.card ? "erro-card" : "card-count"}
                className="field font-normal"
              />
              <span id="card-count" className="mt-1 block text-sm font-normal text-muted" aria-live="polite">
                {draft.card.length} de {CARD_MAX_CHARS} caracteres
              </span>
              {errorText("card")}
            </label>
            <figure aria-label="Prévia do cartão" className="self-start rounded-2xl border border-line bg-blush p-6 shadow-sm">
              <p className="kicker">Cartão</p>
              <p className="mt-3 min-h-24 font-display text-2xl leading-snug whitespace-pre-line break-words">
                {draft.card.trim() || <span className="text-muted">O cartão segue sem mensagem.</span>}
              </p>
            </figure>
          </div>
        )}

        {step === 2 && (
          <>
            {canReuse && (
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => {
                  update({ fulfillment: last.fulfillment, regionId: last.regionId, date: last.date, period: last.period, personName: last.personName });
                  setErrors({});
                }}
              >
                <Copy aria-hidden className="size-4" />
                Usar a mesma entrega do item anterior
              </button>
            )}
            <fieldset className="min-w-0" aria-describedby={errorId("fulfillment")}>
              <legend className="font-medium">Como vai ser?</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["entrega", "Entrega", "Taxa por bairro"],
                    ["retirada", "Retirada na loja", "Sem taxa"],
                  ] as const
                ).map(([value, label, hint]) => (
                  <label key={value} className="choice">
                    <input type="radio" name="fulfillment" value={value} checked={draft.fulfillment === value} onChange={() => update({ fulfillment: value })} className="sr-only" />
                    <span className="font-medium">{label}</span> <span className="text-sm text-muted">· {hint}</span>
                  </label>
                ))}
              </div>
              {errorText("fulfillment")}
            </fieldset>
            {draft.fulfillment === "entrega" && (
              <label className="block font-medium">
                Bairro
                <select
                  value={draft.regionId}
                  onChange={(event) => update({ regionId: event.target.value })}
                  aria-invalid={errors.regionId ? true : undefined}
                  aria-describedby={errors.regionId ? "erro-regionId" : "bairro-hint"}
                  className="field font-normal"
                >
                  <option value="">Escolha o bairro</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name} (entrega {formatBRL(region.feeCents)})
                    </option>
                  ))}
                </select>
                <span id="bairro-hint" className="mt-1 block text-sm font-normal text-muted">
                  Bairros fictícios. Não pedimos endereço nesta demonstração.
                </span>
                {errorText("regionId")}
              </label>
            )}
            <div>
              <p id="data-label" className="font-medium">
                Data
              </p>
              <p className="text-sm text-muted">Sem entregas aos domingos. Para hoje, só à tarde e até as 11h.</p>
              <div role="group" aria-labelledby="data-label" aria-describedby={errorId("date")} className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                {dates.map((date) => {
                  const parts = formatDateParts(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      aria-pressed={draft.date === date}
                      aria-label={formatDateLong(date)}
                      onClick={() => update({ date, period: availablePeriods(date, now).includes(draft.period as Period) ? draft.period : "" })}
                      className="flex min-w-16 shrink-0 flex-col items-center rounded-2xl border border-line bg-paper px-3 py-2 aria-pressed:border-rose aria-pressed:bg-rose-soft"
                    >
                      <span className="text-xs text-muted capitalize">{relativeDayLabel(date, now.date) ?? parts.weekday}</span>
                      <span className="font-medium">{parts.dayMonth}</span>
                    </button>
                  );
                })}
              </div>
              {errorText("date")}
            </div>
            {draft.date && (
              <fieldset className="min-w-0" aria-describedby={errorId("period")}>
                <legend className="font-medium">Período em {formatDateLong(draft.date)}</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(periods) as Period[]).map((period) => (
                    <label key={period} className="choice">
                      <input
                        type="radio"
                        name="period"
                        value={period}
                        checked={draft.period === period}
                        disabled={!periodsForDate.includes(period)}
                        onChange={() => update({ period })}
                        className="sr-only"
                      />
                      {periods[period].label}
                      {!periodsForDate.includes(period) && <span className="block text-sm text-muted">Indisponível nesta data</span>}
                    </label>
                  ))}
                </div>
                {errorText("period")}
              </fieldset>
            )}
          </>
        )}

        {step === 3 && (
          <label className="block font-medium">
            {draft.fulfillment === "retirada" ? "Nome de quem vai retirar" : "Nome de quem vai receber"}
            <input
              value={draft.personName}
              onChange={(event) => update({ personName: event.target.value })}
              maxLength={60}
              autoComplete="off"
              placeholder="Ex.: Ana (nome fictício)"
              aria-invalid={errors.personName ? true : undefined}
              aria-describedby={errors.personName ? "erro-personName" : "nome-hint"}
              className="field font-normal"
            />
            <span id="nome-hint" className="mt-1 block text-sm font-normal text-muted">
              Demonstração: use um nome fictício. Não pedimos telefone, endereço nem outros dados pessoais.
            </span>
            {errorText("personName")}
          </label>
        )}

        {step === 4 && draft.sizeId && (
          <Summary draft={draft} />
        )}

        {price && step < 4 && (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm">
            Até aqui: <strong className="font-medium">{formatBRL(price.subtotal)}</strong>
            {draft.fulfillment === "entrega" && draft.regionId ? ` + entrega ${formatBRL(totalsFor(draft).delivery)}` : ""}
          </p>
        )}

        {cartError && (
          <p role="alert" className="flex items-start gap-2 text-sm text-alert">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            {cartError}{" "}
            <Link href="/carrinho" className="underline underline-offset-4">
              Ver carrinho
            </Link>
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-secondary" onClick={() => { setErrors({}); setStep((s) => s - 1); }}>
              <ArrowLeft aria-hidden className="size-4" />
              Voltar
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-primary">
            {step < 4 ? (
              <>
                Continuar
                <ArrowRight aria-hidden className="size-4" />
              </>
            ) : (
              "Adicionar ao carrinho"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Summary({ draft }: { draft: OrderDraft }) {
  const product = getProduct(draft.productId)!;
  const size = product.sizes.find((s) => s.id === draft.sizeId)!;
  const totals = totalsFor(draft);
  const region = regions.find((r) => r.id === draft.regionId);
  const rows: Array<[string, string]> = [
    ["Produto", `${product.name} · ${size.label.toLowerCase()} (${size.detail})`],
    ["Adicionais", draft.addonIds.length ? draft.addonIds.map((id) => addons.find((a) => a.id === id)!.name).join(", ") : "Nenhum"],
    ["Cartão", draft.card.trim() || "Sem mensagem"],
    [
      draft.fulfillment === "entrega" ? "Entrega" : "Retirada",
      `${formatDateLong(draft.date)}, ${periods[draft.period as Period].label.toLowerCase()}${region ? ` · ${region.name}` : ""}`,
    ],
    [draft.fulfillment === "entrega" ? "Quem recebe" : "Quem retira", draft.personName.trim()],
  ];
  return (
    <div>
      <dl className="divide-y divide-line rounded-2xl border border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">{label}</dt>
            <dd className="break-words whitespace-pre-line">{value}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-4 space-y-1">
        <div className="flex justify-between gap-4">
          <dt>Produto</dt>
          <dd>{formatBRL(totals.base)}</dd>
        </div>
        {totals.extras > 0 && (
          <div className="flex justify-between gap-4">
            <dt>Adicionais</dt>
            <dd>{formatBRL(totals.extras)}</dd>
          </div>
        )}
        {draft.fulfillment === "entrega" && (
          <div className="flex justify-between gap-4">
            <dt>Entrega</dt>
            <dd>{formatBRL(totals.delivery)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 text-xl font-medium">
          <dt>Total</dt>
          <dd>{formatBRL(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
