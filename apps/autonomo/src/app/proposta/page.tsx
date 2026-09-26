import type { Metadata } from "next";
import { ProposalForm } from "@/components/proposal-form";

export const metadata: Metadata = {
  title: "Pedir proposta",
  description: "Pedido de proposta com escopo, prazo e investimento, e pacote sugerido. Nada é enviado.",
};

export default function ProposalPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Proposta</p>
      <h1 className="mt-3 text-5xl">Vamos conversar sobre o seu projeto</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Conte o essencial. Com essas informações, uma proposta real sairia sem a sequência de perguntas de sempre.
      </p>
      <div className="mt-10">
        <ProposalForm />
      </div>
    </div>
  );
}
