import Link from "next/link";
import { siteConfig } from "@/config/site";
import { clinica } from "@/data/clinica";

/** Marca: um núcleo (círculo com ponto central) e o nome em peso médio. */
export function Marca() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
        <circle cx="16" cy="16" r="10" fill="none" stroke="var(--color-agua)" strokeWidth="3" />
        <circle cx="16" cy="16" r="3.5" fill="var(--color-agua-claro)" />
      </svg>
      <span className="text-lg font-bold tracking-tight whitespace-nowrap">
        Clínica Núcleo
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md" aria-label="Clínica Núcleo — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#objetivos", "Objetivos"],
                ["/#montador", "Montar protocolo"],
                ["/#pos-operatorio", "Pós-operatório"],
                ["/#equipe", "Equipe"],
                ["/#duvidas", "Dúvidas"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-medium text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#agendar" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Agendar avaliação</span>
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
            {clinica.horario} · {clinica.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            A Clínica Núcleo e a equipe são fictícias. Este site é uma demonstração criada pelo Estúdio X, de Alex Castro: protocolos,
            preços, prazos e números de registro são exemplos ou espaços reservados, e nenhuma avaliação é marcada de verdade. As
            fotos são ilustrativas, geradas por IA. Nada aqui substitui orientação médica.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-line p-6">
            <p className="text-xl font-semibold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site como este pode ser adaptado para a sua clínica de estética. Fale com quem desenvolveu.
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
