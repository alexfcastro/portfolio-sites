import type { Metadata } from "next";
import { Tracking } from "@/components/tracking";

export const metadata: Metadata = {
  title: "Acompanhamento",
  description: "Acompanhamento demonstrativo das solicitações de orçamento feitas neste navegador.",
};

export default function TrackingPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Acompanhamento</p>
      <h1 className="mt-3 text-4xl uppercase sm:text-5xl">Suas solicitações</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Etapas simuladas, do recebimento até o carro pronto. Em uma oficina real, quem atualiza é a equipe; aqui você
        avança as etapas para ver como funciona.
      </p>
      <div className="mt-8">
        <Tracking />
      </div>
    </div>
  );
}
