import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm, ContactFormWithParams } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Conversa inicial",
  description: "Pedido de conversa inicial com área e assunto, sem dados pessoais. Nada é enviado.",
};

export default function ContactPage() {
  return (
    <div className="wrap max-w-3xl py-12 sm:py-16">
      <p className="kicker">Contato</p>
      <h1 className="mt-3 text-5xl">Agendar conversa inicial</h1>
      <p className="mt-3 text-lg text-muted">
        Indique a área e o assunto para direcionarmos o retorno. A conversa inicial serve para entender a situação e
        explicar os caminhos possíveis.
      </p>
      <div className="mt-10">
        <Suspense fallback={<ContactForm />}>
          <ContactFormWithParams />
        </Suspense>
      </div>
    </div>
  );
}
