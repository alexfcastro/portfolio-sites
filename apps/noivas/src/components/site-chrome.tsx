import Link from "next/link";
import { siteConfig } from "@/config/site";
import { atelie } from "@/data/atelie";

export function Marca() {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className="font-serif text-2xl tracking-wide whitespace-nowrap">Ateliê Véu</span>
      <span className="mt-1 text-[0.6875rem] font-medium tracking-[0.28em] text-dourado-escuro uppercase">dia da noiva</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-sm" aria-label="Ateliê Véu — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#portfolio", "Portfólio"],
                ["/#pacote", "O pacote"],
                ["/#montador", "Montar o grupo"],
                ["/#teste", "O teste"],
                ["/#disponibilidade", "Datas"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#orcamento" className="btn btn-primary shrink-0 !px-4">
            Orçamento
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Marca />
          <p className="mt-4 text-sm text-muted">
            {atelie.horario} · {atelie.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            O Ateliê Véu é um salão fictício. Este site é uma demonstração criada pelo Estúdio X, de Alex Castro: preços, pacote,
            datas ocupadas e depoimentos são exemplos, e nenhum orçamento ou reserva é feito de verdade. As fotos são ilustrativas,
            geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-line p-6">
            <p className="font-serif text-2xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site como este pode ser adaptado para o seu salão ou para a sua agenda de noivas. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn btn-secondary mt-4">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
