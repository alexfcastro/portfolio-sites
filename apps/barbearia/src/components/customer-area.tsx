"use client";

import { BellRing, CalendarClock, CalendarPlus, Check, Crown, ListChecks, Repeat, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { AddToCalendar } from "@/components/add-to-calendar";
import { DateTimePicker } from "@/components/date-time-picker";
import { MyOrders } from "@/components/loja/my-orders";
import { LoyaltyCard } from "@/components/loyalty-card";
import { PixCheckout } from "@/components/pix-checkout";
import { business, demoCustomerName, getPlan, getProfessional, getService, periods } from "@/data/business";
import { canChangeOnline, dueAtShop, findOpening, loyaltyStatus, planUsesLeft } from "@/lib/demo-state";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { generateHistory } from "@/lib/history";
import { ordersForBooking } from "@/lib/loja";
import { getProduct } from "@/data/loja";
import { buildReminderMessage, paymentLabel } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, formatTime, getBusinessNow } from "@/lib/time";
import type { Booking } from "@/types/booking";

type Feedback = { tone: "ok" | "error"; text: string } | null;

export function CustomerArea() {
  const demo = useDemoState();
  const [now] = useState(getBusinessNow);
  const [feedback, setFeedback] = useState<Feedback>(null);

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando seus horários de demonstração…
      </p>
    );
  }

  const mine = demo.bookings.filter((b) => b.origin === "visitor");
  const upcoming = mine
    .filter((b) => b.status === "confirmado" && b.date >= now.date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
  const past = mine.filter((b) => b.status !== "confirmado").sort((a, b) => b.date.localeCompare(a.date));
  const history = generateHistory(now.date).filter((visit) => visit.customerName === demoCustomerName);
  const waiting = demo.waitlist.filter((entry) => entry.origin === "visitor" && entry.status !== "encaixado");
  const loyaltyNow = loyaltyStatus(demo);
  const plan = demo.subscription ? getPlan(demo.subscription.planId) : undefined;

  return (
    <div className="grid gap-12">
      <div role="status" aria-live="polite" className="min-h-6 text-sm font-semibold">
        {feedback && <span className={feedback.tone === "ok" ? "text-ok" : "text-warn"}>{feedback.text}</span>}
      </div>

      <section aria-labelledby="proximos-title" className="-mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="proximos-title" className="text-3xl font-bold sm:text-4xl">
            Próximos horários
          </h2>
          <Link href="/agendar" className="btn btn-gold">
            <CalendarPlus aria-hidden className="size-4" />
            Novo agendamento
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="mt-6 rounded-card border border-dashed border-edge p-8 text-center text-smoke">
            Nenhum horário marcado.{" "}
            <Link href="/agendar" className="font-semibold text-gold underline underline-offset-4">
              Agende em menos de um minuto
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-6 space-y-5">
            {upcoming.map((booking) => (
              <UpcomingCard key={booking.id} booking={booking} now={now} onFeedback={setFeedback} />
            ))}
          </ul>
        )}
      </section>

      <MyOrders demo={demo} onFeedback={setFeedback} />

      {waiting.length > 0 && (
        <section aria-labelledby="espera-title">
          <h2 id="espera-title" className="text-3xl font-bold">
            Lista de espera
          </h2>
          <ul className="mt-5 space-y-3">
            {waiting.map((entry) => {
              const service = getService(entry.serviceId);
              const opening = findOpening(demo, entry, now);
              const pro = getProfessional(opening?.professionalId ?? entry.professionalId);
              return (
                <li key={entry.id} className="rounded-card border border-edge bg-coal-2 p-5">
                  <p className="font-semibold">
                    {service?.name} · {formatDateLong(entry.date)} · {periods[entry.period].label.toLowerCase()}
                  </p>
                  <p className="text-sm text-smoke">
                    {entry.professionalId === "qualquer" ? "Qualquer profissional" : `Com ${pro?.shortName}`}
                  </p>
                  {opening ? (
                    <div className="mt-4 rounded-lg border border-ok/40 bg-coal p-4">
                      <p className="flex items-center gap-2 font-semibold text-ok">
                        <BellRing aria-hidden className="size-4" />
                        Abriu vaga às {formatTime(opening.startMin)} com {pro?.shortName}!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const result = demoActions.fitFromWaitlist(entry.id);
                          setFeedback(
                            result.ok
                              ? { tone: "ok", text: `Horário das ${formatTime(result.value.startMin)} reservado para você.` }
                              : { tone: "error", text: result.error },
                          );
                        }}
                        className="btn btn-gold mt-3"
                      >
                        <Check aria-hidden className="size-4" />
                        Quero este horário
                      </button>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-smoke">Aguardando alguém cancelar. Você é avisado assim que abrir vaga.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      demoActions.leaveWaitlist(entry.id);
                      setFeedback({ tone: "ok", text: "Você saiu da lista de espera." });
                    }}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-smoke hover:text-cream"
                  >
                    <X aria-hidden className="size-4" />
                    Sair da lista
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="vantagens-title" className="grid gap-5 lg:grid-cols-2">
        <h2 id="vantagens-title" className="sr-only">
          Fidelidade e plano
        </h2>
        <LoyaltyCard stamps={loyaltyNow.stamps} rewardsAvailable={loyaltyNow.rewardsAvailable} />
        <div className="rounded-card border border-edge bg-coal-2 p-5 sm:p-6">
          <p className="kicker flex items-center gap-2">
            <Crown aria-hidden className="size-4" /> Meu plano
          </p>
          {plan && demo.subscription?.pixStatus === "pago" ? (
            <>
              <p className="mt-1 font-display text-2xl font-semibold uppercase">{plan.name} ativo</p>
              <p className="mt-2 text-smoke">
                Restam <strong className="text-cream">{planUsesLeft(demo)} de {plan.usesPerMonth}</strong> atendimentos neste
                mês. Ao agendar, escolha “Usar meu plano”.
              </p>
              <Link href="/planos" className="btn btn-line mt-5">
                Ver detalhes do plano
              </Link>
            </>
          ) : plan ? (
            <>
              <p className="mt-1 font-display text-2xl font-semibold uppercase">{plan.name}: falta pagar</p>
              <p className="mt-2 text-smoke">A assinatura começa quando a primeira mensalidade é paga.</p>
              <Link href="/planos" className="btn btn-gold mt-5">
                Pagar a primeira mensalidade
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 font-display text-2xl font-semibold uppercase">Corte todo mês com preço fechado</p>
              <p className="mt-2 text-smoke">Assinantes economizam e agendam sem pagar a cada visita.</p>
              <Link href="/planos" className="btn btn-gold mt-5">
                Conhecer os planos
              </Link>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="historico-title">
        <h2 id="historico-title" className="text-3xl font-bold">
          Histórico
        </h2>
        <ul className="mt-5 divide-y divide-edge rounded-card border border-edge bg-coal-2">
          {past.map((booking) => (
            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p>
                <span className="font-semibold">{getService(booking.serviceId)?.name}</span>{" "}
                <span className="text-smoke">
                  com {getProfessional(booking.professionalId)?.shortName} · {formatDateLong(booking.date)}
                </span>
              </p>
              <span className={`text-sm font-semibold ${booking.status === "cancelado" ? "text-warn" : "text-ok"}`}>
                {booking.status === "cancelado"
                  ? booking.cancelledBy === "sistema"
                    ? "Cancelado: Pix não pago"
                    : `Cancelado${booking.refunded ? " · Pix devolvido" : ""}`
                  : "Concluído"}
              </span>
            </li>
          ))}
          {history.map((visit) => (
            <li key={visit.date} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p>
                <span className="font-semibold">{getService(visit.serviceId)?.name}</span>{" "}
                <span className="text-smoke">
                  com {getProfessional(visit.professionalId)?.shortName} · {formatDateLong(visit.date)}
                </span>
              </p>
              <Link
                href={`/agendar?servico=${visit.serviceId}&profissional=${visit.professionalId}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright"
              >
                <Repeat aria-hidden className="size-4" />
                Repetir
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function UpcomingCard({
  booking,
  now,
  onFeedback,
}: {
  booking: Booking;
  now: ReturnType<typeof getBusinessNow>;
  onFeedback: (feedback: Feedback) => void;
}) {
  const demo = useDemoState();
  const [mode, setMode] = useState<"view" | "remarcar" | "pix">("view");
  const [pick, setPick] = useState<{ date: string; startMin: number | null }>({ date: booking.date, startMin: null });
  const cancelDialog = useRef<HTMLDialogElement>(null);
  const expire = useCallback(() => demoActions.sweepPix(), []);
  const service = getService(booking.serviceId);
  const pro = getProfessional(booking.professionalId);
  if (!demo || !service || !pro) return null;

  const changeable = canChangeOnline(booking, now);
  const isTomorrowOrToday = booking.date <= addDays(now.date, 1);
  const due = dueAtShop(booking);

  const saveReschedule = () => {
    if (pick.startMin === null) return onFeedback({ tone: "error", text: "Escolha o novo horário." });
    const result = demoActions.reschedule(booking.id, pick.date, pick.startMin);
    if (!result.ok) return onFeedback({ tone: "error", text: result.error });
    setMode("view");
    onFeedback({
      tone: "ok",
      text: `Remarcado para ${formatDateLong(result.value.date)}, às ${formatTime(result.value.startMin)}. A barbearia já vê o novo horário.`,
    });
  };

  const cancel = () => {
    cancelDialog.current?.close();
    const result = demoActions.cancelByCustomer(booking.id);
    onFeedback(
      result.ok
        ? {
            tone: "ok",
            text: result.value.refunded
              ? `Cancelado. O Pix de ${formatBRL(result.value.pixCents)} seria devolvido automaticamente.`
              : "Cancelado. O horário voltou para a agenda.",
          }
        : { tone: "error", text: result.error },
    );
  };

  return (
    <li className="rounded-card border border-gold/50 bg-coal-2 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-semibold">
            {formatTime(booking.startMin)} <span className="text-lg text-smoke normal-case">{formatDateLong(booking.date)}</span>
          </p>
          <p className="mt-1 font-semibold">
            {service.name} com {pro.name}
          </p>
          <p className="text-sm text-smoke">
            {booking.id} · {formatBRL(booking.priceCents)} · {paymentLabel(booking)}
            {due > 0 && booking.payment !== "local" ? ` · falta ${formatBRL(due)} no balcão` : ""}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            booking.presence === "confirmada" ? "border-ok/40 text-ok" : "border-gold/50 text-gold"
          }`}
        >
          {booking.presence === "confirmada" ? "Presença confirmada" : "Aguardando sua confirmação"}
        </span>
      </div>

      {ordersForBooking(demo, booking.id).length > 0 && (
        <p className="mt-4 rounded-lg border border-edge bg-coal p-3 text-sm">
          <strong>Para retirar neste horário:</strong>{" "}
          {ordersForBooking(demo, booking.id)
            .flatMap((order) => order.items)
            .map((item) => `${item.qty}× ${getProduct(item.productId)?.name}`)
            .join(", ")}
        </p>
      )}

      {booking.pixStatus === "pendente" && mode !== "pix" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warn/40 p-4">
          <p className="text-sm">
            <strong>Pix pendente.</strong> Sem o pagamento, o horário é liberado.
          </p>
          <button type="button" onClick={() => setMode("pix")} className="btn btn-gold !min-h-11">
            Pagar {formatBRL(booking.pixCents)} agora
          </button>
        </div>
      )}
      {mode === "pix" && booking.pixStatus === "pendente" && (
        <div className="mt-5">
          <PixCheckout
            reference={booking.id}
            cents={booking.pixCents}
            description={`${service.name} com ${pro.shortName}, ${formatDateLong(booking.date)}.`}
            expiresAt={booking.pixExpiresAt}
            onPaid={() => {
              demoActions.payPix(booking.id);
              setMode("view");
              onFeedback({ tone: "ok", text: "Pagamento aprovado. Horário garantido." });
            }}
            onExpired={expire}
          />
        </div>
      )}

      {booking.presence === "pendente" && (
        <div className="mt-5 rounded-xl bg-wa-chat p-4">
          <p className="text-xs font-semibold text-wa-subtle">
            {isTomorrowOrToday ? "Lembrete automático recebido" : "Lembrete automático que chega na véspera, às 18:00"} · prévia,
            nada foi enviado
          </p>
          <p className="mt-2 max-w-md rounded-xl rounded-tl-sm bg-coal-3 px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
            {buildReminderMessage(booking, booking.date === now.date ? "hora" : "vespera")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                demoActions.confirmPresence(booking.id);
                onFeedback({ tone: "ok", text: "Presença confirmada. A barbearia já vê no painel." });
              }}
              className="btn btn-gold !min-h-11"
            >
              <Check aria-hidden className="size-4" />
              Confirmo
            </button>
            {changeable && (
              <button type="button" onClick={() => setMode("remarcar")} className="btn btn-line !min-h-11">
                Preciso remarcar
              </button>
            )}
          </div>
        </div>
      )}

      {mode === "remarcar" && (
        <div className="mt-5 rounded-card border border-edge bg-coal p-4 sm:p-5">
          <h3 className="text-2xl font-semibold">Escolha o novo horário</h3>
          <DateTimePicker
            name={`${booking.id}-`}
            service={service}
            professionalId={booking.professionalId}
            bookings={demo.bookings}
            blocks={demo.blocks}
            now={now}
            date={pick.date}
            startMin={pick.startMin}
            ignoreId={booking.id}
            onChange={(date, startMin) => setPick({ date, startMin })}
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={saveReschedule} className="btn btn-gold">
              <CalendarClock aria-hidden className="size-4" />
              Salvar novo horário
            </button>
            <button type="button" onClick={() => setMode("view")} className="btn btn-line">
              Desistir
            </button>
          </div>
        </div>
      )}

      {mode === "view" && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-edge pt-5">
          {changeable ? (
            <>
              <button type="button" onClick={() => setMode("remarcar")} className="btn btn-line">
                <CalendarClock aria-hidden className="size-4" />
                Remarcar
              </button>
              <button type="button" onClick={() => cancelDialog.current?.showModal()} className="btn btn-line">
                <X aria-hidden className="size-4" />
                Cancelar
              </button>
              <AddToCalendar booking={booking} />
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-smoke">
              <ListChecks aria-hidden className="size-4" />
              Faltam menos de {business.changeDeadlineMin / 60} horas: para mudar, fale com a barbearia.
            </p>
          )}
        </div>
      )}

      <dialog
        ref={cancelDialog}
        aria-labelledby={`${booking.id}-cancel`}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-edge bg-coal-2 p-6 text-cream backdrop:bg-black/70"
      >
        <h3 id={`${booking.id}-cancel`} className="text-2xl font-semibold">
          Cancelar este horário?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-smoke">
          {service.name} com {pro.shortName}, {formatDateLong(booking.date)}, às {formatTime(booking.startMin)}.{" "}
          {booking.pixStatus === "pago"
            ? `Como está no prazo, o Pix de ${formatBRL(booking.pixCents)} é devolvido.`
            : "O horário volta para a agenda."}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" autoFocus onClick={() => cancelDialog.current?.close()} className="btn btn-line">
            Manter o horário
          </button>
          <button type="button" onClick={cancel} className="btn btn-gold">
            Cancelar horário
          </button>
        </div>
      </dialog>
    </li>
  );
}
