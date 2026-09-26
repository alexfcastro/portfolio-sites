import { ArrowLeft, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Faixa persistente: deixa claro que tudo aqui é demonstração. */
export function DemoBar() {
  const { home, caseUrl } = siteConfig.portfolio;

  return (
    <div className="bg-demo-bg text-demo-ink">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-[0.8125rem]">
        <p className="font-semibold">
          Projeto demonstrativo — dados fictícios
          <span className="hidden font-normal text-demo-muted sm:inline"> · nenhuma reserva ou mensagem real é criada</span>
        </p>
        {(home || caseUrl) && (
          <nav aria-label="Portfólio de Alex Castro" className="flex items-center gap-4">
            {home && (
              <a href={home} className="inline-flex min-h-9 items-center gap-1 font-medium underline-offset-4 hover:underline">
                <ArrowLeft aria-hidden className="size-3.5" />
                Voltar ao portfólio
              </a>
            )}
            {caseUrl && (
              <a href={caseUrl} className="inline-flex min-h-9 items-center gap-1 font-medium underline-offset-4 hover:underline">
                <FileText aria-hidden className="size-3.5" />
                Ver case
              </a>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
