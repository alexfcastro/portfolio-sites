"use client";

import { useSearchParams } from "next/navigation";
import { RequestFlow } from "@/components/request-flow";

/** Lê `?especialidade=<id>` (vindo da página da especialidade). */
export function RequestFlowWithParams() {
  const specialtyId = useSearchParams().get("especialidade") ?? "";
  return <RequestFlow key={specialtyId} initialSpecialtyId={specialtyId} />;
}
