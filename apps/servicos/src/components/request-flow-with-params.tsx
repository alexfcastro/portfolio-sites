"use client";

import { useSearchParams } from "next/navigation";
import { RequestFlow } from "@/components/request-flow";

/** Lê `?servico=<id>` (vindo do catálogo de serviços). */
export function RequestFlowWithParams() {
  const serviceId = useSearchParams().get("servico") ?? "";
  return <RequestFlow key={serviceId} initialServiceId={serviceId} />;
}
