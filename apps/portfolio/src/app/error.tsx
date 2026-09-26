"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center sm:py-32">
      <p className="eyebrow">Erro inesperado</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Algo não saiu como esperado</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
        Não foi possível exibir esta página agora. Tente novamente ou volte ao início.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          <RotateCcw aria-hidden className="size-4" />
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-secondary">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
