import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = { title: "Agendar" };

export default function BookingPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Agendamento de demonstração</p>
      <h1 className="mt-2 text-4xl">Agende banho ou tosa</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Pet, serviço, data e resumo. Nada é enviado: o agendamento fica salvo só neste navegador.
      </p>
      <div className="mt-8">
        <BookingFlow />
      </div>
    </div>
  );
}
