import type { Metadata } from "next";
import { QuoteFlow } from "@/components/quote-flow";

export const metadata: Metadata = {
  title: "Pedir orçamento",
  description: "Triagem de orçamento com dados do veículo, sintomas e fotos em prévia local. Nada é enviado.",
};

export default function QuotePage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Orçamento on-line</p>
      <h1 className="mt-3 text-4xl uppercase sm:text-5xl">Pedir orçamento</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Quatro etapas rápidas. Nesta demonstração, tudo fica no seu navegador e a estimativa é ilustrativa.
      </p>
      <div className="mt-10">
        <QuoteFlow />
      </div>
    </div>
  );
}
