"use client";

import "./globals.css";

/** Último recurso: falha no próprio layout raiz. Sem detalhes técnicos para o visitante. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh items-center justify-center bg-canvas p-6 text-center text-ink">
        <main>
          <h1 className="text-3xl font-extrabold">Algo não saiu como esperado</h1>
          <p className="mt-3 text-muted">O site não pôde ser carregado agora.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => retry()} className="btn btn-primary">
              Tentar novamente
            </button>
            {/* Link simples: o roteador do app pode não estar disponível aqui. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btn-secondary">
              Voltar ao início
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
