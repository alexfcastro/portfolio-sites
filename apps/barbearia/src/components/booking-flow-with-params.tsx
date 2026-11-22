"use client";

import { useSearchParams } from "next/navigation";
import { BookingFlow } from "@/components/booking-flow";

/** Lê `?servico=<id>` e `?profissional=<id>` e abre o fluxo já com eles. */
export function BookingFlowWithParams() {
  const params = useSearchParams();
  const serviceId = params.get("servico") ?? "";
  const professionalId = params.get("profissional") ?? "";
  // A chave reinicia o fluxo se a URL mudar.
  return (
    <BookingFlow key={`${serviceId}:${professionalId}`} initialServiceId={serviceId} initialProfessionalId={professionalId} />
  );
}
