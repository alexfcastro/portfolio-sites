"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Info, MapPinOff, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MessagePreview } from "@/components/message-preview";
import { getRegion, getServiceType, regions, serviceTypes } from "@/data/services";
import { createLocalStore } from "@/lib/local-store";
import {
  buildRequestMessage,
  checkRegion,
  MAX_PREFERENCES,
  periodNames,
  periodsOn,
  togglePreference,
  travelFeeLabel,
  validateAnswers,
  validatePreferences,
  visitDates,
  type Preference,
} from "@/lib/request";
import { formatDateLong, formatDateParts, getBusinessNow } from "@/lib/time";

const STEPS = ["Serviço", "Região", "Detalhes", "Disponibilidade"] as const;

/** Só o contador de protocolos fica salvo; as solicitações não guardam dados pessoais. */
const counterStore = createLocalStore<{ version: 1; nextNumber: number }>({
  key: "ax-resolve-demo",
  initial: () => ({ version: 1, nextNumber: 1001 }),
  parse: (value) => {
    const v = value as { version?: number; nextNumber?: number };
    return v?.version === 1 && Number.isInteger(v.nextNumber) ? { version: 1, nextNumber: v.nextNumber! } : null;
  },
});

const noop = () => () => {};

export function RequestFlow({ initialServiceId = "" }: { initialServiceId?: string }) {
  const today = useSyncExternalStore(noop, () => getBusinessNow().date, () => "");
  const valid = getServiceType(initialServiceId) ? initialServiceId : "";
  const [step, setStep] = useState(valid ? 1 : 0);
  const [serviceId, setServiceId] = useState(valid);
  const [regionId, setRegionId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [details, setDetails] = useState("");
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ code: string; message: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, sent]);

  if (!today) {
    return (
      <p role="status" className="text-muted">
        Carregando…
      </p>
    );
  }

  const service = getServiceType(serviceId);
  const region = checkRegion(regionId);
  const go = (next: number) => {
    setError("");
    setStep(next);
  };

  const next = () => {
    if (step === 0 && !service) return setError("Escolha um serviço.");
    if (step === 1 && !region.ok) return setError(regionId ? "Essa região não é atendida. Escolha outra." : "Escolha a sua região.");
    if (step === 2) {
      const problem = validateAnswers(serviceId, answers, details);
      if (problem) return setError(problem);
    }
    go(step + 1);
  };

  const submit = () => {
    const problem = validatePreferences(preferences, today);
    if (problem) return setError(problem);
    const counter = counterStore.get();
    const code = `RS-${counter.nextNumber}`;
    counterStore.set({ ...counter, nextNumber: counter.nextNumber + 1 });
    setSent({ code, message: buildRequestMessage({ code, serviceId, regionId, answers, details, preferences }) });
  };

  if (sent) {
    return (
      <section aria-labelledby="ok" className="rounded-card border border-ok/30 bg-paper p-6 sm:p-10">
        <CheckCircle2 aria-hidden className="size-10 text-ok" />
        <h2 id="ok" ref={headingRef} tabIndex={-1} className="mt-4 text-3xl outline-none">
          Solicitação de demonstração pronta
        </h2>
        <p className="mt-2 text-muted">
          Protocolo <strong className="text-ink">{sent.code}</strong>. Nada foi enviado: em um site real, a equipe
          receberia a mensagem abaixo e confirmaria uma das datas.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName="Resolve Serviços" message={sent.message} triggerLabel="Prévia da mensagem" triggerClassName="btn btn-primary" />
          <Link href="/" className="btn btn-secondary">
            Voltar ao início
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2" aria-label="Etapas da solicitação">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${index <= step ? "bg-petrol" : "bg-line"}`} />
            <span className={`mt-2 hidden text-xs font-bold sm:block ${index === step ? "text-ink" : "text-muted"}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted sm:hidden">
        Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      <div className="mt-8">
        {step === 0 && (
          <fieldset className="min-w-0">
            <legend className="contents">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
                Que serviço você precisa?
              </h2>
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceTypes.map((item) => (
                <label key={item.id} className="choice !items-start">
                  <input
                    type="radio"
                    name="service"
                    className="sr-only"
                    checked={serviceId === item.id}
                    onChange={() => {
                      setError("");
                      setServiceId(item.id);
                      setAnswers({});
                    }}
                  />
                  <span>
                    <span className="block text-lg font-bold">{item.name}</span>
                    <span className="block text-sm text-muted">{item.summary}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="min-w-0">
            <legend className="contents">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
                Onde vai ser o serviço?
              </h2>
            </legend>
            <p className="mt-2 text-muted">Verificamos a região antes de seguir. Regiões ilustrativas.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {regions.map((item) => (
                <label key={item.id} className="choice justify-between">
                  <input
                    type="radio"
                    name="region"
                    className="sr-only"
                    checked={regionId === item.id}
                    onChange={() => {
                      setError("");
                      setRegionId(item.id);
                    }}
                  />
                  <span className="font-bold">{item.name}</span>
                  <span className="text-sm text-muted">{item.served ? travelFeeLabel(item.travelFeeCents) : "Não atendida"}</span>
                </label>
              ))}
            </div>
            <div aria-live="polite" className="mt-4">
              {regionId && region.ok && (
                <p className="rounded-xl bg-petrol-soft px-4 py-3 font-semibold text-petrol-dark">
                  ✓ Atendemos {getRegion(regionId)?.name}. {travelFeeLabel(region.feeCents)}.
                </p>
              )}
              {regionId && !region.ok && (
                <p className="flex gap-2 rounded-xl bg-sun-soft px-4 py-3">
                  <MapPinOff aria-hidden className="mt-0.5 size-5 shrink-0" />
                  {region.message}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {step === 2 && service && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
              Conte um pouco mais
            </h2>
            <div className="mt-6 space-y-6">
              {service.questions.map((question) => (
                <fieldset key={question.id} className="min-w-0">
                  <legend className="font-bold">{question.label}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <label key={option} className="choice">
                        <input
                          type="radio"
                          name={question.id}
                          className="size-5 accent-petrol"
                          checked={answers[question.id] === option}
                          onChange={() => {
                            setError("");
                            setAnswers((current) => ({ ...current, [question.id]: option }));
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <label className="block">
                <span className="font-bold">Detalhes</span> <span className="text-sm text-muted">(opcional)</span>
                <textarea
                  rows={3}
                  maxLength={400}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Ex.: o disjuntor desarma quando ligo o chuveiro. Não inclua endereço ou documentos."
                  className="mt-2 block w-full resize-y rounded-xl border border-line bg-paper px-3.5 py-3 focus:border-petrol focus:outline-none"
                />
                <span className="mt-1 block text-right text-xs text-muted">{details.length} de 400</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && service && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
              Quando podemos ir?
            </h2>
            <p className="mt-2 text-muted">
              Marque até {MAX_PREFERENCES} opções de dia e período. A equipe confirma uma delas.
            </p>
            <p role="status" className="mt-3 font-semibold">
              {preferences.length} de {MAX_PREFERENCES} escolhidas
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visitDates(today).map((date) => {
                const parts = formatDateParts(date);
                return (
                  <li key={date} className="rounded-card border border-line bg-paper p-3">
                    <p className="font-bold">
                      <span className="uppercase">{parts.weekday}</span> {parts.dayMonth}
                    </p>
                    <div className="mt-2 grid gap-2">
                      {periodsOn(date).map((period) => {
                        const checked = preferences.some((p) => p.date === date && p.period === period);
                        return (
                          <label key={period} className="choice !min-h-11 !py-2 text-sm">
                            <input
                              type="checkbox"
                              className="size-5 accent-petrol"
                              checked={checked}
                              disabled={!checked && preferences.length >= MAX_PREFERENCES}
                              onChange={() => {
                                setError("");
                                setPreferences((list) => togglePreference(list, { date, period }));
                              }}
                            />
                            {periodNames[period]}
                          </label>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
            {preferences.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                Escolhidas: {preferences.map((p) => `${formatDateLong(p.date)} (${periodNames[p.period].split(" ")[0]!.toLowerCase()})`).join("; ")}.
              </p>
            )}
            <p className="mt-6 flex gap-2 rounded-xl bg-petrol-soft p-4 text-sm">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol" />
              Solicitação de demonstração: nada é enviado, e não pedimos nome, telefone nem endereço.
            </p>
          </div>
        )}
      </div>

      <div role="alert" className="mt-6 min-h-6 text-sm font-bold text-alert">
        {error}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} className="btn btn-secondary">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn btn-primary">
            Continuar
            <ArrowRight aria-hidden className="size-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn btn-primary">
            <Send aria-hidden className="size-4" />
            Gerar solicitação de demonstração
          </button>
        )}
      </div>
    </div>
  );
}
