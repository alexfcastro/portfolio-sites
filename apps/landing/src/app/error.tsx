"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="kicker">Erro inesperado</p>
      <h1 className="mt-3 text-4xl font-bold">Algo não saiu como esperado</h1>
      <p className="mt-3 max-w-md text-muted">Não foi possível exibir esta página agora.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-secondary">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
