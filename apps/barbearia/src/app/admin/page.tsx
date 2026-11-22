import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = {
  title: "Painel da barbearia",
  description: "Painel público de demonstração com os agendamentos fictícios deste navegador.",
  // Só esta página aponta para o manifesto: instalado, o atalho abre direto no painel.
  manifest: "/painel.webmanifest",
};

export default function AdminPage() {
  return (
    <div className="wrap py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="kicker">Área da barbearia</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Painel da barbearia</h1>
        </div>
        <p className="flex max-w-xl gap-2 rounded-lg border border-warn/40 bg-coal-2 px-3 py-2 text-xs leading-relaxed text-smoke">
          <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warn" />
          <span>
            <strong className="text-cream">Área pública, sem login.</strong> Agenda fictícia, guardada só neste navegador. Num
            sistema real, esta área exige login e fica protegida no servidor.
          </span>
        </p>
      </div>
      <div className="mt-6">
        <AdminPanel />
      </div>
    </div>
  );
}
