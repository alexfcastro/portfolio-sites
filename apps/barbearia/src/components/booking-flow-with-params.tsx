"use client";

import { useSearchParams } from "next/navigation";
import { BookingFlow } from "@/components/booking-flow";

/** Lê `?servico=<id>` (vindo da lista de serviços) e abre o fluxo já com ele. */
export function BookingFlowWithParams() {
  const serviceId = useSearchParams().get("servico") ?? "";
  // A chave reinicia o fluxo se o serviço da URL mudar.
  return <BookingFlow key={serviceId} initialServiceId={serviceId} />;
}
