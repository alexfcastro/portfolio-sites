import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = {
  title: "Painel demonstrativo",
  description: "Painel público de demonstração com os agendamentos fictícios deste navegador.",
};

export default function AdminPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Área da barbearia</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Painel demonstrativo</h1>
      <div className="mt-6 flex max-w-3xl gap-3 rounded-card border border-warn/40 bg-coal-2 p-4 text-sm leading-relaxed text-smoke">
        <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-warn" />
        <p>
          <strong className="text-cream">Área pública, sem login.</strong> Mostra a agenda fictícia e os agendamentos que
          você criou <em>neste navegador</em>. Em um sistema real, esta área exigiria autenticação e ficaria protegida
          no servidor; aqui não há nenhum dado real nem segurança de produção.
        </p>
      </div>
      <div className="mt-10">
        <AdminPanel />
      </div>
    </div>
  );
}
