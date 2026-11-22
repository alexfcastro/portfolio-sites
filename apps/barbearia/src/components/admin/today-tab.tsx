"use client";

import { BellRing, CalendarCheck2, Clock3, Info, UserPlus } from "lucide-react";
import { useState } from "react";
import { ScheduleGrid } from "@/components/admin/schedule-grid";
import { BookingRow, FeedbackLine, type Feedback } from "@/components/admin/shared";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { getProfessional, getService } from "@/data/business";
import { waitlistOpenings, type DemoState } from "@/lib/demo-state";
import { pickupDate, productCount } from "@/lib/loja";
import { demoActions } from "@/lib/demo-store";
import { summarizeDay } from "@/lib/insights";
import { buildOpeningMessage, buildReminderMessage } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime } from "@/lib/time";
import type { BusinessNow } from "@/types/booking";

export function TodayTab({ demo, now }: { demo: DemoState; now: BusinessNow }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const day = summarizeDay(demo.bookings, now);
  const openings = waitlistOpenings(demo, now);
  const todayList = demo.bookings
    .filter((b) => b.date === now.date)
    .sort((a, b) => a.startMin - b.startMin);
  const nextService = day.next ? getService(day.next.serviceId) : undefined;
  // Horários e pedidos cancelados automaticamente por Pix vencido.
  const released =
    demo.bookings.filter((b) => b.cancelledBy === "sistema").length +
    demo.orders.filter((o) => o.status === "cancelado" && o.pixStatus === "pendente").length;
  const pickupsToday = demo.orders.filter(
    (o) => (o.status === "separar" || o.status === "pronto") && pickupDate(demo, o) === now.date,
  ).length;

  return (
    <div className="grid gap-10 [&>*]:min-w-0">
      {/* Destaque: a agenda do dia, com os números do dia e o próximo cliente logo acima. */}
      <section aria-labelledby="dia-title" className="grid min-w-0 gap-5 [&>*]:min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="dia-title" className="text-3xl font-bold sm:text-4xl">
            <span className="text-gold">Hoje</span> · {formatDateLong(now.date)}
          </h2>
          <p className="text-sm text-smoke">Toque num horário da grade para ver os detalhes e as ações.</p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-edge bg-edge lg:grid-cols-5">
          <DayStat label="Atendimentos" value={`${day.done}/${day.total}`} hint="concluídos / do dia" />
          <DayStat label="Previsto no dia" value={formatBRL(day.expectedCents)} hint="sem plano e fidelidade" />
          <DayStat label="Já recebido" value={formatBRL(day.receivedCents)} hint={`${formatBRL(day.pixCents)} por Pix`} />
          <DayStat label="A receber" value={formatBRL(day.dueCents)} hint="no balcão" />
          <div className="col-span-2 bg-coal-3 p-4 lg:col-span-1">
            <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gold uppercase">
              <Clock3 aria-hidden className="size-3.5" /> Próximo cliente
            </dt>
            <dd className="mt-1">
              {day.next ? (
                <>
                  <span className="font-display text-2xl font-semibold">{formatTime(day.next.startMin)}</span>{" "}
                  <span className="font-semibold">{day.next.customerName}</span>
                  <span className="block text-xs text-smoke">
                    {nextService?.name} com {getProfessional(day.next.professionalId)?.shortName} ·{" "}
                    {day.next.presence === "confirmada" ? "confirmou" : "não confirmou"}
                  </span>
                </>
              ) : (
                <span className="text-sm text-smoke">Ninguém mais hoje.</span>
              )}
            </dd>
          </div>
        </dl>

        {(pickupsToday > 0 || released > 0 || day.pendingPix.length > 0 || day.awaitingPresence.length > 0) && (
          <ul className="flex flex-wrap gap-2 text-sm">
            {day.awaitingPresence.length > 0 && (
              <li className="rounded-full border border-gold/50 px-3 py-1 text-gold">
                {day.awaitingPresence.length} sem confirmar presença
              </li>
            )}
            {pickupsToday > 0 && (
              <li className="rounded-full border border-gold/50 px-3 py-1 text-gold">
                {pickupsToday} {pickupsToday === 1 ? "pedido da loja" : "pedidos da loja"} para entregar
              </li>
            )}
            {day.pendingPix.length > 0 && (
              <li className="rounded-full border border-warn/40 px-3 py-1 text-warn">
                {day.pendingPix.length} Pix aguardando pagamento (libera em 10 min)
              </li>
            )}
            {released > 0 && (
              <li className="rounded-full border border-edge px-3 py-1 text-smoke">
                {released} {released === 1 ? "reserva liberada" : "reservas liberadas"} por Pix não pago
              </li>
            )}
          </ul>
        )}

        <ScheduleGrid demo={demo} now={now} single showStats={false} title="Horários de cada barbeiro" linkToRows />
      </section>

      <section aria-labelledby="hoje-lista-title">
        <h2 id="hoje-lista-title" className="text-3xl font-bold">
          Lista do dia
        </h2>
        <p className="mt-1 text-smoke">Conclua, cancele ou reative cada atendimento.</p>
        <div className="mt-3">
          <FeedbackLine feedback={feedback} />
        </div>
        {todayList.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-edge p-8 text-center text-smoke">
            A barbearia não abre hoje ou não há agendamentos.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {todayList.map((booking) => (
              <BookingRow key={booking.id} booking={booking} now={now} onFeedback={setFeedback} products={productCount(demo, booking.id)} />
            ))}
          </ul>
        )}
      </section>

      <div className="rounded-card border border-edge bg-coal-2 p-5">
        <p className="kicker flex items-center gap-2">
          <BellRing aria-hidden className="size-4" /> Lembretes automáticos
        </p>
        <p className="mt-2 text-smoke">
          Cada cliente recebe um lembrete na véspera, às 18:00, e outro 1 hora antes, com o botão “Confirmo”.{" "}
          <strong className="text-cream">
            {day.awaitingPresence.length === 0
              ? "Todos os clientes de hoje já confirmaram."
              : `${day.awaitingPresence.length} ${day.awaitingPresence.length === 1 ? "cliente ainda não confirmou" : "clientes ainda não confirmaram"} hoje.`}
          </strong>
        </p>
        {day.awaitingPresence[0] && (
          <WhatsAppPreview
            message={buildReminderMessage(day.awaitingPresence[0], "hora")}
            contactName={day.awaitingPresence[0].customerName}
            triggerLabel="Ver o lembrete que o cliente recebe"
            triggerClassName="btn btn-line mt-4 !min-h-11 !text-sm"
            note="Os lembretes saem sozinhos, sem ninguém da barbearia digitar. Aqui é só a prévia."
          />
        )}
      </div>

      <section aria-labelledby="vagas-title">
        <h2 id="vagas-title" className="text-3xl font-bold">
          Lista de espera
        </h2>
        <p className="mt-1 text-smoke">
          Quando alguém cancela ou um bloqueio é retirado, o painel mostra quem da fila cabe no horário que abriu.
        </p>
        {openings.length === 0 ? (
          <p className="mt-5 flex gap-2 rounded-card border border-dashed border-edge p-5 text-smoke">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              {demo.waitlist.filter((e) => e.status !== "encaixado").length} pedido(s) na fila e nenhuma vaga compatível
              agora. Dica: cancele um horário na aba Agenda para ver o encaixe acontecer.
            </span>
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {openings.map(({ entry, professionalId, startMin }) => {
              const service = getService(entry.serviceId);
              const pro = getProfessional(professionalId);
              return (
                <li key={entry.id} className="rounded-card border border-ok/40 bg-coal-2 p-5">
                  <p className="flex items-center gap-2 font-semibold text-ok">
                    <CalendarCheck2 aria-hidden className="size-4" />
                    Vaga para {entry.customerName}: {formatDateLong(entry.date)}, às {formatTime(startMin)}
                  </p>
                  <p className="mt-1 text-sm text-smoke">
                    {service?.name} com {pro?.shortName}
                    {entry.status === "avisado" ? " · cliente já avisado" : ""}
                    {entry.origin === "visitor" ? " · pedido feito por você" : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <WhatsAppPreview
                      message={buildOpeningMessage(entry.customerName, service?.name ?? "", entry.date, startMin)}
                      contactName={entry.customerName}
                      triggerLabel={entry.status === "avisado" ? "Ver aviso enviado" : "Avisar pelo WhatsApp"}
                      triggerClassName="btn btn-line !min-h-11 !text-sm"
                      note="Num sistema real, este aviso pode sair sozinho assim que a vaga abre."
                      onOpen={() => demoActions.notifyWaiting(entry.id)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const result = demoActions.fitFromWaitlist(entry.id);
                        setFeedback(
                          result.ok
                            ? { tone: "ok", text: `${entry.customerName} encaixado às ${formatTime(result.value.startMin)}.` }
                            : { tone: "error", text: result.error },
                        );
                      }}
                      className="btn btn-gold !min-h-11 !text-sm"
                    >
                      <UserPlus aria-hidden className="size-4" />
                      Encaixar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

    </div>
  );
}

function DayStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-coal-2 p-4">
      <dt className="text-xs font-semibold tracking-wider text-smoke uppercase">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold text-gold sm:text-3xl">{value}</dd>
      <dd className="text-xs text-smoke">{hint}</dd>
    </div>
  );
}
