import type { Metadata } from "next";
import { AppointmentList } from "@/components/appointment-list";

export const metadata: Metadata = { title: "Meus agendamentos" };

export default function AppointmentsPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Neste navegador</p>
      <h1 className="mt-2 text-4xl">Meus agendamentos</h1>
      <p className="mt-3 max-w-2xl text-muted">Agendamentos de demonstração feitos aqui. Nenhum deles foi enviado ao pet shop.</p>
      <div className="mt-8">
        <AppointmentList />
      </div>
    </div>
  );
}
