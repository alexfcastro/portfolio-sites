import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestFlow } from "@/components/request-flow";
import { RequestFlowWithParams } from "@/components/request-flow-with-params";

export const metadata: Metadata = {
  title: "Solicitar horário",
  description: "Simulação de solicitação de horário por especialidade e profissional. Sem dados de saúde.",
};

export default function RequestPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Solicitação on-line</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Solicitar horário</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Você indica a preferência e a recepção confirma. Nesta demonstração, tudo fica só no seu navegador.
      </p>
      <div className="mt-10">
        <Suspense fallback={<RequestFlow />}>
          <RequestFlowWithParams />
        </Suspense>
      </div>
    </div>
  );
}
