import type { Metadata } from "next";
import { OwnerForm } from "@/components/owner-form";

export const metadata: Metadata = {
  title: "Anunciar imóvel",
  description: "Formulário demonstrativo para proprietários que querem vender ou alugar.",
};

export default function OwnerPage() {
  return (
    <div className="wrap max-w-3xl py-10 sm:py-14">
      <p className="kicker">Proprietários</p>
      <h1 className="mt-2 text-4xl">Quero anunciar meu imóvel</h1>
      <p className="mt-3 text-muted">Conte o básico sobre o imóvel. Em um site real, um corretor retornaria para agendar a avaliação.</p>
      <div className="mt-8">
        <OwnerForm />
      </div>
    </div>
  );
}
