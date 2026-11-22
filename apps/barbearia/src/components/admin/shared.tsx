"use client";

import { Ban, CheckCheck, Undo2 } from "lucide-react";
import { getProfessional, getService, loyalty } from "@/data/business";
import { allowedTransitions } from "@/lib/demo-state";
import { demoActions } from "@/lib/demo-store";
import { reminderText } from "@/lib/insights";
import { formatBRL } from "@/lib/money";
import { formatDateParts, formatTime, relativeDayLabel } from "@/lib/time";
import type { Booking, BookingStatus, BusinessNow } from "@/types/booking";

export type Feedback = { tone: "ok" | "error"; text: string } | null;

export const selectClass =
  "mt-1.5 block w-full rounded-lg border border-edge bg-coal px-3 py-2.5 text-cream focus:border-gold focus:outline-none";

const statusLabels: Record<BookingStatus, string> = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusStyles: Record<BookingStatus, string> = {
  confirmado: "border-gold/50 text-gold",
  concluido: "border-ok/40 text-ok",
  cancelado: "border-warn/40 text-warn line-through decoration-1",
};

const actionLabels: Record<BookingStatus, { label: string; icon: typeof Ban }> = {
  concluido: { label: "Concluir", icon: CheckCheck },
  cancelado: { label: "Cancelar", icon: Ban },
  confirmado: { label: "Reativar", icon: Undo2 },
};

export function paymentBadge(booking: Booking): { text: string; className: string } {
  if (booking.payment === "plano") return { text: "Plano", className: "border-cream/30 text-cream" };
  if (booking.payment === "recompensa") return { text: "Fidelidade", className: "border-cream/30 text-cream" };
  if (booking.payment === "local") return { text: "Paga no balcão", className: "border-edge text-smoke" };
  if (booking.pixStatus === "pendente") return { text: "Pix pendente", className: "border-warn/40 text-warn" };
  return booking.payment === "total"
    ? { text: "Pago por Pix", className: "border-ok/40 text-ok" }
    : { text: `Sinal ${formatBRL(booking.pixCents)} pago`, className: "border-ok/40 text-ok" };
}

export function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}

export function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-card border border-edge bg-coal-2 p-5">
      <p className="text-xs font-semibold tracking-wider text-smoke uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-gold">{value}</p>
      <p className="text-xs text-smoke">{hint}</p>
    </div>
  );
}

export function FeedbackLine({ feedback }: { feedback: Feedback }) {
  return (
    <div role="status" aria-live="polite" className="min-h-6 text-sm font-semibold">
      {feedback && <span className={feedback.tone === "ok" ? "text-ok" : "text-warn"}>{feedback.text}</span>}
    </div>
  );
}

const statusVerb: Record<BookingStatus, string> = {
  concluido: "concluído",
  cancelado: "cancelado",
  confirmado: "reativado",
};

/** Uma linha da agenda, com a situação, o pagamento, o lembrete e as ações do dono. */
export function BookingRow({
  booking,
  now,
  onFeedback,
  products = 0,
}: {
  booking: Booking;
  now: BusinessNow;
  onFeedback: (feedback: Feedback) => void;
  /** Quantos produtos da loja o cliente retira neste horário. */
  products?: number;
}) {
  const service = getService(booking.serviceId);
  const professional = getProfessional(booking.professionalId);
  const parts = formatDateParts(booking.date);
  const relative = relativeDayLabel(booking.date, now.date);
  const pay = paymentBadge(booking);
  const reminder = reminderText(booking, now);

  const change = (next: BookingStatus) => {
    const result = demoActions.setStatus(booking.id, next);
    if (!result.ok) return onFeedback({ tone: "error", text: result.error });
    const stamp =
      next === "concluido" &&
      booking.origin === "visitor" &&
      (loyalty.stampServiceIds as readonly string[]).includes(booking.serviceId);
    const refund = next === "cancelado" && result.value.refunded ? ` O Pix de ${formatBRL(booking.pixCents)} seria devolvido.` : "";
    onFeedback({
      tone: "ok",
      text: `Agendamento ${booking.id} ${statusVerb[next]}.${stamp ? " Um selo entrou no cartão fidelidade do cliente." : ""}${refund}`,
    });
  };

  return (
    <li
      id={`ag-${booking.id}`}
      className={`grid scroll-mt-24 gap-4 rounded-card border p-4 target:ring-2 target:ring-gold sm:grid-cols-[7rem_1fr_auto] sm:items-center ${
        booking.origin === "visitor" ? "border-gold/50 bg-coal-3" : "border-edge bg-coal-2"
      }`}
    >
      <div>
        <p className="font-display text-2xl font-semibold">{formatTime(booking.startMin)}</p>
        <p className="text-xs text-smoke uppercase">
          {relative ?? parts.weekday} · {parts.dayMonth}
        </p>
      </div>
      <div className="min-w-0">
        <p className="font-semibold">
          {booking.customerName} <span className="font-normal text-smoke">· {service?.name ?? booking.serviceId}</span>
        </p>
        <p className="text-sm text-smoke">
          com {professional?.shortName ?? booking.professionalId} · {formatTime(booking.startMin)}–{formatTime(booking.endMin)} ·{" "}
          {formatBRL(booking.priceCents)} · {booking.id}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge className={statusStyles[booking.status]}>{statusLabels[booking.status]}</Badge>
          {booking.status !== "cancelado" && <Badge className={pay.className}>{pay.text}</Badge>}
          {booking.status === "cancelado" && booking.cancelledBy && (
            <Badge className="border-edge text-smoke">
              {booking.cancelledBy === "cliente"
                ? "Pelo cliente, no site"
                : booking.cancelledBy === "sistema"
                  ? "Pix não pago"
                  : "Pela barbearia"}
              {booking.refunded ? " · Pix devolvido" : ""}
            </Badge>
          )}
          {booking.origin === "visitor" && <Badge className="border-cream/30 text-cream">Criado por você</Badge>}
          {booking.fromWaitlist && <Badge className="border-cream/30 text-cream">Da lista de espera</Badge>}
          {products > 0 && booking.status !== "cancelado" && (
            <Badge className="border-gold/50 text-gold">
              Leva {products} {products === 1 ? "produto" : "produtos"}
            </Badge>
          )}
        </div>
        {booking.note && (
          <p className="mt-2 rounded-md border-l-2 border-gold bg-coal px-2 py-1 text-sm">
            <span className="text-smoke">Recado: </span>“{booking.note}”
          </p>
        )}
        {reminder && (
          <p className={`mt-2 text-xs ${booking.presence === "confirmada" ? "text-ok" : "text-smoke"}`}>{reminder}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {allowedTransitions(booking.status).map((next) => {
          const { label, icon: Icon } = actionLabels[next];
          return (
            <button
              key={next}
              type="button"
              onClick={() => change(next)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-edge px-3 text-sm font-semibold hover:border-gold hover:text-gold-bright"
            >
              <Icon aria-hidden className="size-4" />
              {label}
              <span className="sr-only"> {booking.id}</span>
            </button>
          );
        })}
      </div>
    </li>
  );
}
