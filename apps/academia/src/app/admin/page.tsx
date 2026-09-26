import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "Painel" };

export default function AdminPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Painel da recepção · demonstração</p>
      <h1 className="mt-2 text-5xl">Painel</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Visão simples da semana: ocupação de cada aula e reservas experimentais feitas neste navegador. Sem login, porque
        é uma demonstração; em um site real este painel seria protegido.
      </p>
      <div className="mt-8">
        <AdminPanel />
      </div>
    </div>
  );
}
