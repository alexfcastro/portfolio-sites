import { ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Faixa persistente: deixa claro que tudo aqui é demonstração. */
export function DemoBar() {
  const { home } = siteConfig.portfolio;

  return (
    <div className="bg-demo-bg text-demo-ink">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-[0.8125rem]">
        <p className="font-semibold">
          Landing page demonstrativa — oferta fictícia
          <span className="hidden font-normal text-demo-muted sm:inline"> · nenhum cadastro ou pagamento real é feito</span>
        </p>
        <nav aria-label="Demonstrações" className="flex items-center gap-4">
          <Link href="/" className="inline-flex min-h-9 items-center gap-1 font-medium underline-offset-4 hover:underline">
            <LayoutGrid aria-hidden className="size-3.5" />
            Todas as landing pages
          </Link>
          {home && (
            <a href={home} className="inline-flex min-h-9 items-center gap-1 font-medium underline-offset-4 hover:underline">
              <ArrowLeft aria-hidden className="size-3.5" />
              Voltar ao portfólio
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
