"use client";

import { CalendarPlus } from "lucide-react";
import { buildIcs } from "@/lib/calendar";
import type { Booking } from "@/types/booking";

/** Baixa o horário como arquivo de calendário (.ics), com lembrete 1 hora antes. */
export function AddToCalendar({ booking, className = "btn btn-line" }: { booking: Booking; className?: string }) {
  const download = () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const blob = new Blob([buildIcs(booking, stamp)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bravus-${booking.id}.ics`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button type="button" onClick={download} className={className}>
      <CalendarPlus aria-hidden className="size-4" />
      Salvar na agenda do celular
    </button>
  );
}
