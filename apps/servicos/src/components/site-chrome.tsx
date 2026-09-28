import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Marca fictícia da Resolve: check em quadrado. Não usa a marca AX. */
export function ResolveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect width="40" height="40" rx="10" fill="#0f4c55" />
      <path d="M11 21l6 6 12-14" fill="none" stroke="#f5c542" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Resolve Serviços — início" className="inline-flex items-center gap-2.5 rounded-md">
          <ResolveMark className="size-9 shrink-0" />
          <span className="text-base font-extrabold whitespace-nowrap sm:text-lg">
            Resolve<span className="max-[379px]:hidden"> Serviços</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/#servicos", "Serviços"],
                ["/#trabalhos", "Trabalhos"],
                ["/#regioes", "Regiões"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/solicitar" className="btn btn-primary shrink-0 !px-4">
            <span className="hidden sm:inline">Pedir orçamento</span>
            <span className="sm:hidden">Orçamento</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-petrol-dark text-white">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xl font-extrabold">Resolve Serviços</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            A Resolve é um prestador de serviços fictício. Esta página é uma demonstração criada por Alex Castro: serviços,
            regiões e trabalhos são exemplos, e nenhuma solicitação é enviada. As fotos são ilustrativas, geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-lg font-extrabold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Um site com solicitação guiada pode ser adaptado para o seu serviço. Fale com quem desenvolveu.
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
