import type { Metadata } from "next";
import { PlansArea } from "@/components/plans-area";

export const metadata: Metadata = {
  title: "Planos mensais",
  description: "Assinatura mensal de demonstração: cortes com preço fechado, pagos por Pix. Valores fictícios.",
};

export default function PlansPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Clube Bravus</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Corte todo mês, preço fechado</h1>
      <p className="mt-3 max-w-2xl text-smoke">
        Assine, pague a mensalidade por Pix e agende sem pagar a cada visita. Planos e valores são exemplos de uma
        barbearia fictícia.
      </p>
      <div className="mt-12">
        <PlansArea />
      </div>
    </div>
  );
}
