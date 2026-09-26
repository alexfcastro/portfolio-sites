import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking-flow";
import { BookingFlowWithParams } from "@/components/booking-flow-with-params";

export const metadata: Metadata = {
  title: "Agendar horário",
  description: "Simulação de agendamento on-line: serviço, profissional, data e horário. Nenhuma reserva real.",
};

export default function BookPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Agendamento on-line</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Agendar horário</h1>
      <p className="mt-3 max-w-2xl text-smoke">
        Simulação completa do fluxo, com agenda de exemplo. Os horários ocupados são fictícios e os seus agendamentos
        ficam só neste navegador.
      </p>
      <div className="mt-10">
        <Suspense fallback={<BookingFlow />}>
          <BookingFlowWithParams />
        </Suspense>
      </div>
    </div>
  );
}
