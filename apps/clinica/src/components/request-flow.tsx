"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Info, ListChecks, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { demoPatientName, getProfessional, getSpecialty, periodLabels, professionalsFor, specialties, type Period } from "@/data/clinic";
import { clinicActions, useClinicState } from "@/lib/demo-store";
import { datesFor, periodsFor, type AppointmentRequest, type Payment } from "@/lib/requests";
import { formatDateLong, formatDateParts, getBusinessNow } from "@/lib/time";

const STEPS = ["Especialidade", "Profissional", "Preferência", "Revisão"] as const;
const ANY = "qualquer";

interface Selection {
  specialtyId: string;
  professional: string; // id ou ANY
  date: string;
  period: Period | "";
  payment: Payment | "";
  firstVisit: "sim" | "nao" | "";
}

function requestMessage(request: AppointmentRequest): string {
  return [
    "Olá, Vita Clínica! Fiz uma solicitação pelo site:",
    "",
    `Especialidade: ${getSpecialty(request.specialtyId)?.name}`,
    `Profissional: ${request.professionalId ? getProfessional(request.professionalId)?.name : "primeiro disponível"}`,
    `Preferência: ${formatDateLong(request.date)}, ${periodLabels[request.period].toLowerCase()}`,
    `Protocolo: ${request.id}`,
  ].join("\n");
}

export function RequestFlow({ initialSpecialtyId = "" }: { initialSpecialtyId?: string }) {
  const state = useClinicState();
  const [today] = useState(() => getBusinessNow().date);
  const validInitial = getSpecialty(initialSpecialtyId) ? initialSpecialtyId : "";
  const [step, setStep] = useState(validInitial ? 1 : 0);
  const [selection, setSelection] = useState<Selection>({
    specialtyId: validInitial,
    professional: "",
    date: "",
    period: "",
    payment: "",
    firstVisit: "",
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState<AppointmentRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, sent]);

  if (!state) {
    return (
      <p role="status" className="rounded-card border border-line bg-paper p-6 text-muted">
        Carregando…
      </p>
    );
  }

  const specialty = getSpecialty(selection.specialtyId);
  const professionalId = selection.professional && selection.professional !== ANY ? selection.professional : null;
  const dates = specialty && selection.professional ? datesFor(specialty.id, professionalId, today) : [];
  const periods = specialty && selection.date ? periodsFor(specialty.id, professionalId, selection.date, today) : [];

  const update = (patch: Partial<Selection>) => {
    setError("");
    setSelection((current) => ({ ...current, ...patch }));
  };

  const go = (next: number) => {
    setError("");
    setStep(next);
  };

  const next = () => {
    if (step === 0 && !specialty) return setError("Escolha uma especialidade.");
    if (step === 1 && !selection.professional) return setError("Escolha um profissional ou “Primeiro disponível”.");
    if (step === 2 && (!selection.date || !selection.period)) return setError("Escolha o dia e o período.");
    go(step + 1);
  };

  const submit = () => {
    if (!specialty || !selection.date || !selection.period) return;
    if (!selection.payment) return setError("Indique se o atendimento é particular ou por convênio.");
    if (!selection.firstVisit) return setError("Indique se é a primeira consulta.");
    const result = clinicActions.submit({
      specialtyId: specialty.id,
      professionalId,
      date: selection.date,
      period: selection.period,
      payment: selection.payment,
      firstVisit: selection.firstVisit === "sim",
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(result.request);
  };

  if (sent) {
    return (
      <section aria-labelledby="enviado" className="rounded-card border border-teal/40 bg-paper p-6 sm:p-10">
        <CheckCircle2 aria-hidden className="size-10 text-teal" />
        <h2 id="enviado" ref={headingRef} tabIndex={-1} className="mt-4 text-3xl outline-none">
          Solicitação de demonstração registrada
        </h2>
        <p className="mt-3 text-muted">
          Protocolo <strong className="text-ink">{sent.id}</strong>. Situação: <strong className="text-ink">aguardando
          confirmação da recepção</strong>. Nada foi enviado a ninguém: a solicitação fica só neste navegador.
        </p>
        <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
          <Link href="/minhas-solicitacoes" className="btn btn-primary">
            <ListChecks aria-hidden className="size-4" />
            Acompanhar solicitação
          </Link>
          <MessagePreview businessName="Vita Clínica" message={requestMessage(sent)} triggerLabel="Prévia da mensagem no WhatsApp" />
        </div>
      </section>
    );
  }

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2" aria-label="Etapas da solicitação">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${index <= step ? "bg-teal" : "bg-line"}`} />
            <span className={`mt-2 hidden text-xs font-semibold sm:block ${index === step ? "text-ink" : "text-muted"}`}>
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
                Qual especialidade?
              </h2>
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {specialties.map((item) => (
                <label key={item.id} className="choice p-5">
                  <input
                    type="radio"
                    name="specialty"
                    className="sr-only"
                    checked={selection.specialtyId === item.id}
                    onChange={() => update({ specialtyId: item.id, professional: "", date: "", period: "" })}
                  />
                  <span className="block font-serif text-lg">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">{item.summary}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && specialty && (
          <fieldset className="min-w-0">
            <legend className="contents">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
                Com quem?
              </h2>
            </legend>
            <p className="mt-2 text-muted">Profissionais de {specialty.name.toLowerCase()}.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="choice p-5">
                <input
                  type="radio"
                  name="professional"
                  className="sr-only"
                  checked={selection.professional === ANY}
                  onChange={() => update({ professional: ANY, date: "", period: "" })}
                />
                <span className="block font-serif text-lg">Primeiro disponível</span>
                <span className="mt-1 block text-sm text-muted">Mais opções de dia e período.</span>
              </label>
              {professionalsFor(specialty.id).map((item) => (
                <label key={item.id} className="choice p-5">
                  <input
                    type="radio"
                    name="professional"
                    className="sr-only"
                    checked={selection.professional === item.id}
                    onChange={() => update({ professional: item.id, date: "", period: "" })}
                  />
                  <span className="block font-serif text-lg">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">{item.approach}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && specialty && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
              Qual a sua preferência?
            </h2>
            <p className="mt-2 text-muted">A recepção confirma o horário exato dentro do período escolhido.</p>
            <fieldset className="mt-6 min-w-0">
              <legend className="font-semibold">Dia</legend>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const parts = formatDateParts(date);
                  return (
                    <label key={date} className="choice w-24 shrink-0 px-2 py-3 text-center">
                      <input
                        type="radio"
                        name="date"
                        className="sr-only"
                        checked={selection.date === date}
                        onChange={() => update({ date, period: "" })}
                      />
                      <span className="block text-xs font-semibold text-muted uppercase">{parts.weekday}</span>
                      <span className="block font-serif text-xl">{parts.dayMonth}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {selection.date && (
              <fieldset className="mt-6 min-w-0">
                <legend className="font-semibold">Período — {formatDateLong(selection.date)}</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {periods.map((period) => (
                    <label key={period} className="choice p-4">
                      <input
                        type="radio"
                        name="period"
                        className="sr-only"
                        checked={selection.period === period}
                        onChange={() => update({ period })}
                      />
                      <span className="font-semibold">{periodLabels[period]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {step === 3 && specialty && selection.period && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
              Revise e envie
            </h2>
            <dl className="mt-6 grid gap-x-8 gap-y-4 rounded-card border border-line bg-paper p-6 sm:grid-cols-2">
              <Detail term="Especialidade" value={specialty.name} />
              <Detail term="Profissional" value={professionalId ? (getProfessional(professionalId)?.name ?? "") : "Primeiro disponível"} />
              <Detail term="Dia" value={formatDateLong(selection.date)} />
              <Detail term="Período" value={periodLabels[selection.period]} />
              <Detail term="Paciente" value={`${demoPatientName} (identidade de exemplo)`} />
            </dl>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <fieldset className="min-w-0">
                <legend className="font-semibold">Forma de atendimento</legend>
                <div className="mt-3 flex gap-3">
                  {(["particular", "convenio"] as const).map((payment) => (
                    <label key={payment} className="choice flex-1 p-4 text-center">
                      <input
                        type="radio"
                        name="payment"
                        className="sr-only"
                        checked={selection.payment === payment}
                        onChange={() => update({ payment })}
                      />
                      {payment === "particular" ? "Particular" : "Convênio"}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="min-w-0">
                <legend className="font-semibold">Primeira consulta nesta especialidade?</legend>
                <div className="mt-3 flex gap-3">
                  {(["sim", "nao"] as const).map((value) => (
                    <label key={value} className="choice flex-1 p-4 text-center">
                      <input
                        type="radio"
                        name="firstVisit"
                        className="sr-only"
                        checked={selection.firstVisit === value}
                        onChange={() => update({ firstVisit: value })}
                      />
                      {value === "sim" ? "Sim" : "Não"}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <p className="mt-6 flex gap-3 rounded-card bg-teal-soft p-4 text-sm leading-relaxed">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-teal" />
              <span>
                <strong>Solicitação de demonstração.</strong> Não pedimos sintomas, exames nem documentos, e nada é enviado:
                a solicitação fica só neste navegador. Em um site real, a recepção confirmaria o horário.
              </span>
            </p>
          </div>
        )}
      </div>

      <div role="alert" className="mt-6 min-h-6 text-sm font-semibold text-alert">
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
            Enviar solicitação de demonstração
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{term}</dt>
      <dd className="mt-0.5 text-lg first-letter:uppercase">{value}</dd>
    </div>
  );
}
