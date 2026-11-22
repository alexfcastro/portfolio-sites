"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Info,
  ListPlus,
  Repeat,
  RotateCcw,
  TimerOff,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddToCalendar } from "@/components/add-to-calendar";
import { DateTimePicker, firstFreeDate } from "@/components/date-time-picker";
import { TakeAlong } from "@/components/loja/take-along";
import { PixCheckout } from "@/components/pix-checkout";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { business, demoCustomerName, getPlan, getProfessional, getService, periods, professionals, services } from "@/data/business";
import { NOTE_MAX, paymentOptions, planUsesLeft, pixAmount, type DemoState } from "@/lib/demo-state";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { lastVisitOfDemoCustomer } from "@/lib/insights";
import { buildBookingMessage, paymentLabel } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime, getBusinessNow } from "@/lib/time";
import type { Booking, PaymentMode, Period, Service } from "@/types/booking";

const STEPS = ["Serviço", "Profissional", "Data e horário", "Pagamento"] as const;

interface Selection {
  serviceId: string;
  professionalId: string;
  date: string;
  startMin: number | null;
}

interface BookingFlowProps {
  initialServiceId?: string;
  initialProfessionalId?: string;
}

export function BookingFlow({ initialServiceId = "", initialProfessionalId = "" }: BookingFlowProps) {
  const demo = useDemoState();
  const initialService = getService(initialServiceId);
  const initialPro = initialService?.professionalIds.includes(initialProfessionalId) ? initialProfessionalId : "";
  const [step, setStep] = useState(initialService ? (initialPro ? 2 : 1) : 0);
  const [now, setNow] = useState(getBusinessNow);
  const [selection, setSelection] = useState<Selection>({
    serviceId: initialService ? initialServiceId : "",
    professionalId: initialPro,
    date: "",
    startMin: null,
  });
  const [payment, setPayment] = useState<PaymentMode | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Leva o foco ao título a cada troca de etapa (não no carregamento da página).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, createdId]);

  const expire = useCallback(() => demoActions.sweepPix(), []);

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
  const options = service ? paymentOptions(demo, service.id) : [];
  const chosenPayment = payment && options.includes(payment) ? payment : options[0];
  const lastVisit = lastVisitOfDemoCustomer(demo.bookings, now);
  const created = createdId ? demo.bookings.find((b) => b.id === createdId) : undefined;

  const goTo = (next: number) => {
    setError("");
    setNow(getBusinessNow());
    setStep(next);
  };

  const preselectDate = (target: Service, professionalId: string) => {
    if (selection.date) return;
    const date = firstFreeDate(target, professionalId, demo.bookings, demo.blocks, now);
    setSelection((current) => ({ ...current, date, startMin: null }));
  };

  const next = () => {
    if (step === 0 && !service) return setError("Escolha um serviço para continuar.");
    if (step === 1 && !professional) return setError("Escolha um profissional para continuar.");
    if (step === 2 && !selection.date) return setError("Escolha uma data.");
    if (step === 2 && selection.startMin === null) return setError("Escolha uma data e um horário livres.");
    if (step === 1 && service && professional) preselectDate(service, professional.id);
    goTo(step + 1);
  };

  const repeatLast = () => {
    if (!lastVisit) return;
    const target = getService(lastVisit.serviceId);
    if (!target) return;
    const date = firstFreeDate(target, lastVisit.professionalId, demo.bookings, demo.blocks, now);
    setSelection({ serviceId: target.id, professionalId: lastVisit.professionalId, date, startMin: null });
    goTo(2);
  };

  const confirm = () => {
    if (!service || !professional || !selection.date || selection.startMin === null || !chosenPayment) return;
    const result = demoActions.book(
      { serviceId: service.id, professionalId: professional.id, date: selection.date, startMin: selection.startMin, note },
      chosenPayment,
    );
    if (!result.ok) {
      setError(result.error);
      setSelection((current) => ({ ...current, startMin: null }));
      setNow(getBusinessNow());
      setStep(2);
      return;
    }
    setError("");
    setCreatedId(result.value.id);
  };

  const restart = () => {
    setCreatedId(null);
    setPayment(null);
    setNote("");
    setSelection({ serviceId: "", professionalId: "", date: "", startMin: null });
    goTo(0);
  };

  if (created) {
    if (created.pixStatus === "pendente" && created.status === "confirmado") {
      return (
        <PixCheckout
          reference={created.id}
          cents={created.pixCents}
          description={`${getService(created.serviceId)?.name} com ${getProfessional(created.professionalId)?.shortName}, ${formatDateLong(created.date)}, às ${formatTime(created.startMin)}.`}
          expiresAt={created.pixExpiresAt}
          onPaid={() => demoActions.payPix(created.id)}
          onExpired={expire}
        />
      );
    }
    if (created.status === "cancelado") {
      return (
        <section className="rounded-card border border-warn/40 bg-coal-2 p-6 sm:p-10">
          <TimerOff aria-hidden className="size-10 text-warn" />
          <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-4xl font-bold outline-none">
            O Pix venceu e o horário foi liberado
          </h2>
          <p className="mt-2 text-smoke">
            Sem o pagamento em {business.pixExpiresMin} minutos, o horário volta para a agenda. Você pode agendar de novo.
          </p>
          <button type="button" onClick={restart} className="btn btn-gold mt-6">
            <RotateCcw aria-hidden className="size-4" />
            Agendar de novo
          </button>
        </section>
      );
    }
    return <Confirmation booking={created} headingRef={headingRef} onRestart={restart} />;
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
          <>
            {lastVisit && (
              <div className="mb-8 flex flex-col gap-4 rounded-card border border-gold/50 bg-coal-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <Repeat aria-hidden className="mt-1 size-5 shrink-0 text-gold" />
                  <p>
                    <span className="block font-semibold">Repetir o último atendimento</span>
                    <span className="text-sm text-smoke">
                      {getService(lastVisit.serviceId)?.name} com {getProfessional(lastVisit.professionalId)?.shortName} ·
                      último em {formatDateLong(lastVisit.date)}
                    </span>
                  </p>
                </div>
                <button type="button" onClick={repeatLast} className="btn btn-gold shrink-0">
                  Repetir em 2 toques
                  <ArrowRight aria-hidden className="size-4" />
                </button>
              </div>
            )}
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
          </>
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
            <DateTimePicker
              service={service}
              professionalId={professional.id}
              bookings={demo.bookings}
              blocks={demo.blocks}
              now={now}
              date={selection.date}
              startMin={selection.startMin}
              onChange={(date, startMin) => {
                setError("");
                setSelection((current) => ({ ...current, date, startMin }));
              }}
            />
            <WaitlistJoin service={service} professionalId={professional.id} date={selection.date} />
          </div>
        )}

        {step === 3 && service && professional && selection.startMin !== null && chosenPayment && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
              Revise e escolha como pagar
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

            <label className="mt-6 block">
              <span className="font-display text-lg tracking-wider uppercase">Recado para o barbeiro</span>{" "}
              <span className="text-sm text-smoke">(opcional)</span>
              <textarea
                value={note}
                maxLength={NOTE_MAX}
                rows={2}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: quero baixar só as laterais; tenho a pele sensível na barba"
                className="mt-2 block w-full rounded-lg border border-edge bg-coal px-3 py-2.5 text-cream placeholder:text-smoke/70 focus:border-gold focus:outline-none"
              />
              <span className="mt-1 block text-right text-xs text-smoke" aria-live="polite">
                {note.length}/{NOTE_MAX}
              </span>
            </label>

            <PaymentChoice
              state={demo}
              service={service}
              options={options}
              value={chosenPayment}
              onChange={(mode) => setPayment(mode)}
            />

            <p className="mt-5 flex gap-3 rounded-card border border-edge p-4 text-sm leading-relaxed text-smoke">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                Você pode remarcar ou cancelar sozinho até {business.changeDeadlineMin / 60} horas antes, em{" "}
                <strong className="text-cream">Meus horários</strong>. Se pagou por Pix e cancelar no prazo, o valor volta.
                Este é um <strong className="text-cream">agendamento de demonstração</strong>: fica só neste navegador e
                nenhum valor é cobrado.
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
            {chosenPayment && service && pixAmount(chosenPayment, service.priceCents) > 0
              ? `Confirmar e pagar ${formatBRL(pixAmount(chosenPayment, service.priceCents))} por Pix`
              : "Confirmar agendamento de demonstração"}
          </button>
        )}
      </div>
    </div>
  );
}

function PaymentChoice({
  state,
  service,
  options,
  value,
  onChange,
}: {
  state: DemoState;
  service: Service;
  options: PaymentMode[];
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
}) {
  const plan = state.subscription ? getPlan(state.subscription.planId) : undefined;
  const rest = service.priceCents - pixAmount("sinal", service.priceCents);
  const describe: Record<PaymentMode, { title: string; text: string; price: string; tag?: string }> = {
    plano: {
      title: "Usar meu plano",
      text: `Incluso no ${plan?.name ?? "plano"} · restam ${planUsesLeft(state)} neste mês.`,
      price: formatBRL(0),
      tag: "Assinante",
    },
    recompensa: {
      title: "Usar a barba do cartão fidelidade",
      text: "Cortesia pelos 10 cortes. Não paga nada.",
      price: formatBRL(0),
      tag: "Presente",
    },
    sinal: {
      title: `Sinal de ${formatBRL(pixAmount("sinal", service.priceCents))} por Pix agora`,
      text: `Garante o horário. O restante (${formatBRL(rest)}) você paga na barbearia.`,
      price: formatBRL(pixAmount("sinal", service.priceCents)),
      tag: "Mais escolhido",
    },
    total: {
      title: "Pagar tudo por Pix agora",
      text: "Chega e vai direto para a cadeira, sem fila no balcão.",
      price: formatBRL(service.priceCents),
    },
    local: {
      title: "Pagar na barbearia",
      text: "Dinheiro, cartão ou Pix no balcão, depois do atendimento.",
      price: formatBRL(0),
    },
  };

  return (
    <fieldset className="mt-8 min-w-0">
      <legend className="font-display text-lg tracking-wider uppercase">Como prefere pagar?</legend>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {options.map((mode) => {
          const item = describe[mode];
          return (
            <label key={mode} className="choice p-5">
              <input
                type="radio"
                name="payment"
                value={mode}
                checked={value === mode}
                onChange={() => onChange(mode)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-4">
                <span>
                  {item.tag && (
                    <span className="mb-1.5 inline-block rounded-full border border-gold/50 px-2 py-0.5 text-xs font-semibold text-gold">
                      {item.tag}
                    </span>
                  )}
                  <span className="block font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm text-smoke">{item.text}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs text-smoke">agora</span>
                  <span className="font-display text-xl font-semibold text-gold">{item.price}</span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function WaitlistJoin({ service, professionalId, date }: { service: Service; professionalId: string; date: string }) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("noite");
  const [anyPro, setAnyPro] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const join = () => {
    const result = demoActions.joinWaitlist({
      serviceId: service.id,
      professionalId: anyPro ? "qualquer" : professionalId,
      date,
      period,
    });
    setFeedback(
      result.ok
        ? { ok: true, text: "Pronto! Se abrir vaga nesse período, você é avisado. Acompanhe em Meus horários." }
        : { ok: false, text: result.error },
    );
  };

  return (
    <div className="mt-8 rounded-card border border-dashed border-edge p-5">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} disabled={!date} className="btn btn-line">
          <ListPlus aria-hidden className="size-4" />
          Não achou o horário? Entrar na lista de espera
        </button>
      ) : (
        <fieldset className="min-w-0">
          <legend className="font-display text-lg tracking-wider uppercase">
            Lista de espera — <span className="normal-case">{formatDateLong(date)}</span>
          </legend>
          <p className="mt-1 text-sm text-smoke">
            Se alguém cancelar no período que você escolher, a barbearia avisa você na hora.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(periods) as Period[]).map((key) => (
              <label key={key} className="choice px-4 py-2.5">
                <input
                  type="radio"
                  name="wait-period"
                  value={key}
                  checked={period === key}
                  onChange={() => setPeriod(key)}
                  className="sr-only"
                />
                <span className="font-semibold">{periods[key].label}</span>{" "}
                <span className="text-sm text-smoke">
                  {formatTime(periods[key].startMin)}–{formatTime(periods[key].endMin)}
                </span>
              </label>
            ))}
          </div>
          <label className="mt-4 flex min-h-11 items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={anyPro} onChange={(e) => setAnyPro(e.target.checked)} className="size-5 accent-gold" />
            <UserRound aria-hidden className="size-4 text-smoke" />
            Aceito qualquer profissional que faça o serviço
          </label>
          <button type="button" onClick={join} className="btn btn-gold mt-4">
            <ListPlus aria-hidden className="size-4" />
            Entrar na lista de espera
          </button>
          <p role="status" className={`mt-3 min-h-5 text-sm font-semibold ${feedback?.ok ? "text-ok" : "text-warn"}`}>
            {feedback?.text}
          </p>
        </fieldset>
      )}
    </div>
  );
}

function Confirmation({
  booking,
  headingRef,
  onRestart,
}: {
  booking: Booking;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const service = getService(booking.serviceId);
  const pro = getProfessional(booking.professionalId);
  return (
    <section aria-labelledby="confirmado-title" className="rounded-card border border-gold/50 bg-coal-2 p-6 sm:p-10">
      <CheckCircle2 aria-hidden className="size-10 text-ok" />
      <h2 id="confirmado-title" ref={headingRef} tabIndex={-1} className="mt-4 text-4xl font-bold outline-none">
        {booking.pixStatus === "pago" ? "Pagamento aprovado, horário garantido" : "Agendamento de demonstração confirmado"}
      </h2>
      <p className="mt-2 text-smoke">
        Código <strong className="font-display text-lg tracking-wider text-gold">{booking.id}</strong> — salvo apenas neste
        navegador. Nenhum horário real foi reservado e nenhum valor foi cobrado.
      </p>
      <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <Detail term="Serviço" value={service?.name ?? booking.serviceId} />
        <Detail term="Profissional" value={pro?.name ?? booking.professionalId} />
        <Detail term="Data" value={formatDateLong(booking.date)} />
        <Detail term="Horário" value={`${formatTime(booking.startMin)} às ${formatTime(booking.endMin)}`} />
        <Detail term="Valor" value={formatBRL(booking.priceCents)} />
        <Detail term="Pagamento" value={paymentLabel(booking)} />
        {booking.note && <Detail term="Recado para o barbeiro" value={booking.note} />}
      </dl>
      <p className="mt-6 text-sm text-smoke">
        Na véspera, às 18:00, chega um lembrete automático para confirmar a presença.
      </p>
      <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row">
        <Link href="/meus-horarios" className="btn btn-gold">
          <CalendarCheck aria-hidden className="size-4" />
          Ver em Meus horários
        </Link>
        <AddToCalendar booking={booking} />
        <WhatsAppPreview message={buildBookingMessage(booking)} />
        <button type="button" onClick={onRestart} className="btn btn-line">
          <RotateCcw aria-hidden className="size-4" />
          Novo agendamento
        </button>
      </div>
      <TakeAlong booking={booking} />
    </section>
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
