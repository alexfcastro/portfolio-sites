import { Heart } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden focusable="false">
        <rect width="40" height="40" rx="10" fill="#1f5fbf" />
        <path d="M8 26h24M12 26l8-10 8 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="13" r="3" fill="#ffd166" />
      </svg>
      <span className="text-lg font-bold whitespace-nowrap">
        Horizonte<span className="max-[379px]:hidden"> Imóveis</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="Horizonte Imóveis — início" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/imoveis?finalidade=venda", "Comprar"],
                ["/imoveis?finalidade=aluguel", "Alugar"],
                ["/anunciar", "Anunciar"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/favoritos" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-blue-soft">
            <Heart aria-hidden className="size-5" />
            <span className="sr-only">Favoritos</span>
          </Link>
          <Link href="/imoveis" className="btn btn-primary shrink-0 !px-4">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-ink text-white">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xl font-bold">Horizonte Imóveis</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            A Horizonte é uma imobiliária fictícia. Este site é uma demonstração criada por Alex Castro: imóveis, bairros,
            valores e corretores são exemplos, e nenhum contato é enviado.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 text-sm">
            <li>
              <Link href="/imoveis" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Buscar imóveis
              </Link>
            </li>
            <li>
              <Link href="/anunciar" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Anunciar imóvel
              </Link>
            </li>
          </ul>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-lg font-bold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Um site com busca de imóveis pode ser adaptado para a sua imobiliária. Fale com quem desenvolveu.
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
