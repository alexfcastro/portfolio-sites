import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestFlow } from "@/components/request-flow";
import { RequestFlowWithParams } from "@/components/request-flow-with-params";

export const metadata: Metadata = {
  title: "Pedir orçamento",
  description: "Solicitação guiada: serviço, região atendida, detalhes e disponibilidade. Nada é enviado.",
};

export default function RequestPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Orçamento</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Pedir orçamento</h1>
      <p className="mt-3 max-w-2xl text-muted">Quatro etapas rápidas. Nesta demonstração, nada sai do seu navegador.</p>
      <div className="mt-10">
        <Suspense fallback={<RequestFlow />}>
          <RequestFlowWithParams />
        </Suspense>
      </div>
    </div>
  );
}
