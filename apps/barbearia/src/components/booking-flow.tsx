"use client";

import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Clock, Info, LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { demoCustomerName, getProfessional, getService, professionals, services } from "@/data/business";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { buildBookingMessage } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { getBookableDates, getOpeningWindow, listAvailableStarts } from "@/lib/schedule";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";
import type { Booking } from "@/types/booking";

const STEPS = ["Serviço", "Profissional", "Data e horário", "Revisão"] as const;

interface Selection {
  serviceId: string;
  professionalId: string;
  date: string;
  startMin: number | null;
}

export function BookingFlow({ initialServiceId = "" }: { initialServiceId?: string }) {
  const demo = useDemoState();
  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [now, setNow] = useState(getBusinessNow);
  const [selection, setSelection] = useState<Selection>({
    serviceId: getService(initialServiceId) ? initialServiceId : "",
    professionalId: "",
    date: "",
    startMin: null,
  });
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Booking | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Leva o foco ao título a cada troca de etapa (não no carregamento da página).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, created]);

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando a agenda de demonstração…
      </p>
    );
  }

  const service = getService(selection.serviceId);
  const professional = getProfessional(selection.professionalId);
  const compatiblePros = service ? professionals.filter((p) => service.professionalIds.includes(p.id)) : [];
  const dates = getBookableDates(now.date);

  const startsFor = (date: string) =>
    service && professional
      ? listAvailableStarts({ date, service, professionalId: professional.id, bookings: demo.bookings, now })
      : [];

  const goTo = (next: number) => {
    setError("");
    setNow(getBusinessNow());
    setStep(next);
  };

  const next = () => {
    if (step === 0 && !service) return setError("Escolha um serviço para continuar.");
    if (step === 1 && !professional) return setError("Escolha um profissional para continuar.");
    if (step === 2 && selection.startMin === null) return setError("Escolha uma data e um horário livres.");
    if (step === 2 && !selection.date) return setError("Escolha uma data.");
    if (step === 1) {
      // Pré-seleciona o primeiro dia com horário livre.
      const firstDate = dates.find((date) => startsFor(date).length > 0) ?? "";
      if (!selection.date || startsFor(selection.date).length === 0) {
        setSelection((current) => ({ ...current, date: firstDate, startMin: null }));
      }
    }
    goTo(step + 1);
  };

  const confirm = () => {
    if (!service || !professional || !selection.date || selection.startMin === null) return;
    const result = demoActions.book({
      serviceId: service.id,
      professionalId: professional.id,
      date: selection.date,
      startMin: selection.startMin,
    });
    if (!result.ok) {
      setError(result.error);
      setSelection((current) => ({ ...current, startMin: null }));
      setNow(getBusinessNow());
      setStep(2);
      return;
    }
    setError("");
    setCreated(result.value);
  };

  const restart = () => {
    setCreated(null);
    setSelection({ serviceId: "", professionalId: "", date: "", startMin: null });
    goTo(0);
  };

  if (created) {
    const createdService = getService(created.serviceId);
    const createdPro = getProfessional(created.professionalId);
    return (
      <section aria-labelledby="confirmado-title" className="rounded-card border border-gold/50 bg-coal-2 p-6 sm:p-10">
        <CheckCircle2 aria-hidden className="size-10 text-ok" />
        <h2 id="confirmado-title" ref={headingRef} tabIndex={-1} className="mt-4 text-4xl font-bold outline-none">
          Agendamento de demonstração confirmado
        </h2>
        <p className="mt-2 text-smoke">
          Código <strong className="font-display text-lg tracking-wider text-gold">{created.id}</strong> — salvo apenas
          neste navegador. Nenhum horário real foi reservado.
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail term="Serviço" value={createdService?.name ?? created.serviceId} />
          <Detail term="Profissional" value={createdPro?.name ?? created.professionalId} />
          <Detail term="Data" value={formatDateLong(created.date)} />
          <Detail term="Horário" value={`${formatTime(created.startMin)} às ${formatTime(created.endMin)}`} />
          <Detail term="Valor" value={formatBRL(created.priceCents)} />
          <Detail term="Cliente" value={created.customerName} />
        </dl>
        <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
          <Link href="/admin" className="btn btn-gold">
            <LayoutDashboard aria-hidden className="size-4" />
            Ver no painel
          </Link>
          <WhatsAppPreview message={buildBookingMessage(created)} />
          <button type="button" onClick={restart} className="btn btn-line">
            <RotateCcw aria-hidden className="size-4" />
            Novo agendamento
          </button>
        </div>
      </section>
    );
  }

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2" aria-label="Etapas do agendamento">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1 rounded-full ${index <= step ? "bg-gold" : "bg-edge"}`} />
            <span className={`mt-2 hidden text-xs font-semibold sm:block ${index === step ? "text-cream" : "text-smoke"}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-smoke sm:hidden">
        Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      <div className="mt-8">
        {step === 0 && (
          <fieldset className="min-w-0">
            <legend className="contents">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
                Escolha o serviço
              </h2>
            </legend>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {services.map((item) => (
                <label key={item.id} className="choice p-5">
                  <input
                    type="radio"
                    name="service"
                    value={item.id}
                    checked={selection.serviceId === item.id}
                    onChange={() => {
                      setError("");
                      setSelection((current) => ({
                        serviceId: item.id,
                        // Mantém o profissional só se ele fizer o novo serviço.
                        professionalId: item.professionalIds.includes(current.professionalId) ? current.professionalId : "",
                        date: current.date,
                        startMin: null,
                      }));
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block font-display text-xl font-semibold tracking-wide uppercase">{item.name}</span>
                      <span className="mt-1 block text-sm text-smoke">{item.description}</span>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-smoke">
                        <Clock aria-hidden className="size-4" /> {item.durationMin} min
                      </span>
                    </span>
                    <span className="font-display text-xl font-semibold text-gold">{formatBRL(item.priceCents)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && service && (
          <fieldset className="min-w-0">
            <legend className="contents">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
                Escolha o profissional
              </h2>
            </legend>
            <p className="mt-2 text-smoke">Aparecem só os profissionais que fazem “{service.name}”.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {compatiblePros.map((item) => (
                <label key={item.id} className="choice p-5">
                  <input
                    type="radio"
                    name="professional"
                    value={item.id}
                    checked={selection.professionalId === item.id}
                    onChange={() => {
                      setError("");
                      setSelection((current) => ({ ...current, professionalId: item.id, startMin: null }));
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className="grid size-12 place-items-center rounded-full border border-gold/40 bg-coal font-display text-xl text-gold"
                  >
                    {item.shortName.slice(0, 1)}
                  </span>
                  <span className="mt-3 block font-display text-xl font-semibold tracking-wide uppercase">{item.name}</span>
                  <span className="block text-sm text-smoke">{item.role}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && service && professional && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
              Escolha data e horário
            </h2>
            <p className="mt-2 text-smoke">
              {service.name} com {professional.shortName} · {service.durationMin} min. Horários de Brasília.
            </p>

            {/* min-w-0: fieldset tem largura mínima = conteúdo; sem isso a faixa de datas alarga a página. */}
            <fieldset className="mt-6 min-w-0">
              <legend className="font-display text-lg tracking-wider uppercase">Data</legend>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const closed = !getOpeningWindow(date);
                  const free = closed ? 0 : startsFor(date).length;
                  const parts = formatDateParts(date);
                  const relative = relativeDayLabel(date, now.date);
                  const status = closed ? "Fechado" : free === 0 ? "Lotado" : `${free} livres`;
                  return (
                    <label key={date} className="choice w-24 shrink-0 px-2 py-3 text-center">
                      <input
                        type="radio"
                        name="date"
                        value={date}
                        checked={selection.date === date}
                        disabled={free === 0}
                        onChange={() => {
                          setError("");
                          setSelection((current) => ({ ...current, date, startMin: null }));
                        }}
                        className="sr-only"
                      />
                      <span className="block text-xs font-semibold text-smoke uppercase">{relative ?? parts.weekday}</span>
                      <span className="block font-display text-2xl font-semibold">{parts.dayMonth}</span>
                      <span className={`block text-xs ${free ? "text-ok" : "text-smoke"}`}>{status}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {selection.date && (
              <fieldset className="mt-6 min-w-0">
                <legend className="font-display text-lg tracking-wider uppercase">
                  Horário — <span className="normal-case">{formatDateLong(selection.date)}</span>
                </legend>
                {startsFor(selection.date).length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
                    {startsFor(selection.date).map((start) => (
                      <label key={start} className="choice py-3 text-center">
                        <input
                          type="radio"
                          name="time"
                          value={start}
                          checked={selection.startMin === start}
                          onChange={() => {
                            setError("");
                            setSelection((current) => ({ ...current, startMin: start }));
                          }}
                          className="sr-only"
                        />
                        <span className="font-display text-lg font-semibold">{formatTime(start)}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-smoke">Sem horários livres neste dia. Escolha outra data.</p>
                )}
              </fieldset>
            )}
          </div>
        )}

        {step === 3 && service && professional && selection.startMin !== null && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
              Revise o agendamento
            </h2>
            <dl className="mt-6 grid gap-x-8 gap-y-4 rounded-card border border-edge bg-coal-2 p-6 sm:grid-cols-2">
              <Detail term="Serviço" value={`${service.name} (${service.durationMin} min)`} />
              <Detail term="Profissional" value={professional.name} />
              <Detail term="Data" value={formatDateLong(selection.date)} />
              <Detail
                term="Horário"
                value={`${formatTime(selection.startMin)} às ${formatTime(selection.startMin + service.durationMin)}`}
              />
              <Detail term="Valor" value={formatBRL(service.priceCents)} />
              <Detail term="Cliente" value={`${demoCustomerName} (identidade de exemplo)`} />
            </dl>
            <p className="mt-5 flex gap-3 rounded-card border border-edge p-4 text-sm leading-relaxed text-smoke">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                Este é um <strong className="text-cream">agendamento de demonstração</strong>. Ele fica salvo só neste
                navegador: não há reserva real, pagamento, mensagem ou sincronização com outros visitantes. Não pedimos
                seus dados pessoais.
              </span>
            </p>
          </div>
        )}
      </div>

      <div role="alert" className="mt-6 min-h-6 text-sm font-semibold text-warn">
        {error}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 border-t border-edge pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => goTo(step - 1)} className="btn btn-line">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn btn-gold">
            Continuar
            <ArrowRight aria-hidden className="size-4" />
          </button>
        ) : (
          <button type="button" onClick={confirm} className="btn btn-gold">
            <CalendarCheck aria-hidden className="size-4" />
            Confirmar agendamento de demonstração
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wider text-smoke uppercase">{term}</dt>
      <dd className="mt-0.5 text-lg first-letter:uppercase">{value}</dd>
    </div>
  );
}
