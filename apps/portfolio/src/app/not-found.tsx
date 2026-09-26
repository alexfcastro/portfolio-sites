import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AxSymbol } from "@/components/ui/ax-symbol";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center sm:py-32">
      <AxSymbol className="size-14 opacity-90" />
      <p className="eyebrow mt-8">Erro 404</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
        O endereço pode ter mudado ou não existir. Você pode voltar ao início ou ver os projetos.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          <ArrowLeft aria-hidden className="size-4" />
          Voltar ao início
        </Link>
        <Link href="/projetos" className="btn btn-secondary">
          Ver projetos
        </Link>
      </div>
    </section>
  );
}
