import Link from "next/link";
import { siteConfig } from "@/config/site";
import { fotos } from "@/data/fotos";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden focusable="false">
        <rect width="40" height="40" rx="10" fill="#1f2225" />
        <path
          d="M6 21h7l3-8 5 15 4-11 2 4h7"
          stroke="#c6f432"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight whitespace-nowrap uppercase">
        Pulse<span className="text-lime max-[379px]:hidden"> Studio</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="Pulse Studio — início" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/aulas", "Grade de aulas"],
                ["/planos", "Planos"],
                ["/admin", "Painel"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-chalk">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/aulas" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Aula experimental</span>
            <span className="min-[380px]:hidden">Aulas</span>
          </Link>
        </nav>
      </div>
      <nav aria-label="Seções" className="border-t border-edge md:hidden">
        <ul className="wrap flex gap-1 overflow-x-auto">
          {(
            [
              ["/aulas", "Grade"],
              ["/planos", "Planos"],
              ["/admin", "Painel"],
            ] as const
          ).map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted hover:text-chalk">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="border-t border-edge bg-panel">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xl font-bold uppercase">
            Pulse <span className="text-lime">Studio</span>
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            O Pulse Studio é uma academia fictícia. Este site é uma demonstração criada por Alex Castro: modalidades,
            professores, grade, vagas e planos são exemplos, e nenhuma reserva é enviada.
            {Object.keys(fotos).length > 0 && " As fotos são ilustrativas, geradas por IA."}
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-edge p-6">
            <p className="text-lg font-bold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site com grade de aulas e reserva de aula experimental pode ser adaptado para o seu estúdio. Fale com
              quem desenvolveu.
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
