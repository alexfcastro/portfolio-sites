import Link from "next/link";
import { siteConfig } from "@/config/site";
import { studio } from "@/data/studio";

/** Marca: o nome em serifada fina e um traço curvo, como uma sobrancelha desenhada. */
export function Marca() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 40 20" aria-hidden className="h-4 w-8 shrink-0 text-cacau">
        <path d="M2 16 C12 4 26 1 38 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-2xl leading-none whitespace-nowrap">
        Linha Fina<span className="sr-only"> — Studio Linha Fina</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-sm" aria-label="Studio Linha Fina — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#procedimentos", "Procedimentos"],
                ["/#antes-e-depois", "Antes e depois"],
                ["/#avaliacao", "A avaliação"],
                ["/#cuidados", "Cuidados"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#agendar" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Marcar avaliação</span>
            <span className="min-[380px]:hidden">Avaliação</span>
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
          <p className="mt-3 text-sm text-muted">
            {studio.atendimento} · {studio.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            O Studio Linha Fina e a profissional {studio.profissional} são fictícios. Este site é uma demonstração criada pelo
            Estúdio X, de Alex Castro: procedimentos, preços, prazos e depoimentos são exemplos, e nenhuma avaliação é
            marcada de verdade. As fotos de antes e depois são ilustrativas, geradas por IA, e não mostram resultados reais.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-line p-6">
            <p className="font-serif text-2xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site como este pode ser adaptado para o seu estúdio de sobrancelhas ou de estética. Fale com quem desenvolveu.
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
