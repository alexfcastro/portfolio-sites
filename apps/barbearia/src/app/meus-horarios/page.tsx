import type { Metadata } from "next";
import { CustomerArea } from "@/components/customer-area";

export const metadata: Metadata = {
  title: "Meus horários",
  description: "Área do cliente de demonstração: remarcar, cancelar, confirmar presença, lista de espera e cartão fidelidade.",
};

export default function MyBookingsPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Área do cliente</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Meus horários</h1>
      <p className="mt-3 max-w-2xl text-smoke">
        Remarque, cancele, confirme presença e acompanhe o cartão fidelidade sem precisar mandar mensagem. Aqui você entra
        como o “Cliente de demonstração”: nada é real e tudo fica só neste navegador.
      </p>
      <div className="mt-12">
        <CustomerArea />
      </div>
    </div>
  );
}
