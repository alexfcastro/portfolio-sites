import Link from "next/link";
import { siteConfig } from "@/config/site";
import { fotos } from "@/data/fotos";

/** Marca fictícia da Torque: engrenagem simplificada com "T". Não usa a marca AX. */
export function TorqueMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect width="40" height="40" rx="8" fill="#f28c28" />
      <path d="M11 12h18v5h-6.5v13h-5V17H11z" fill="#1b1e23" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-graphite text-white">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Torque Auto Center — início" className="inline-flex items-center gap-2.5 rounded-md">
          <TorqueMark className="size-9 shrink-0" />
          <span className="leading-none whitespace-nowrap">
            <span className="block text-lg font-extrabold tracking-wide">TORQUE</span>
            <span className="block text-[0.6875rem] font-bold tracking-[0.25em] text-orange">AUTO CENTER</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link href="/#servicos" className="hidden min-h-11 items-center px-3 font-semibold text-white/75 hover:text-white md:inline-flex">
            Serviços
          </Link>
          <Link
            href="/acompanhamento"
            className="hidden min-h-11 items-center px-3 font-semibold text-white/75 hover:text-white sm:inline-flex"
          >
            Acompanhamento
          </Link>
          <Link href="/orcamento" className="btn shrink-0 bg-orange !px-4 text-graphite hover:bg-white">
            <span className="max-[379px]:hidden">Pedir orçamento</span>
            <span className="min-[380px]:hidden">Orçamento</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-graphite text-white">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xl font-extrabold">TORQUE AUTO CENTER</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            A Torque é uma oficina fictícia. Esta página é uma demonstração criada por Alex Castro: serviços, faixas de
            preço e acompanhamento são exemplos. Nenhum orçamento é enviado e nenhuma foto sai do seu navegador.
            {Object.keys(fotos).length > 0 && " As fotos são ilustrativas, geradas por IA."}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 text-sm">
            <li>
              <Link href="/orcamento" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Pedir orçamento
              </Link>
            </li>
            <li>
              <Link href="/acompanhamento" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Acompanhamento
              </Link>
            </li>
          </ul>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-lg font-extrabold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Um site com triagem de orçamento pode ser adaptado para a sua oficina. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-white/30 hover:border-white">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
