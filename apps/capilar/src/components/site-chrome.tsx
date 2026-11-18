import Link from "next/link";
import { siteConfig } from "@/config/site";
import { instituto } from "@/data/instituto";

export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
        <rect width="32" height="32" rx="5" className={claro ? "fill-creme" : "fill-ink"} />
        <path d="M11 25 C11 16 14 10 17 6 M16 25 C16 17 18 12 21 8 M21 25 C21 19 22 15 24 12" fill="none" stroke="var(--color-ambar)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-lg font-semibold whitespace-nowrap">Fio Nobre</span>
        <span className={`block text-[0.6875rem] tracking-[0.2em] uppercase ${claro ? "text-creme/70" : "text-muted"}`}>Instituto capilar</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md" aria-label="Instituto Fio Nobre — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#questionario", "Questionário"],
                ["/#avaliacao", "A avaliação"],
                ["/#tratamentos", "Tratamentos"],
                ["/#mega-hair", "Mega hair"],
                ["/#equipe", "Equipe"],
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
    <footer className="bg-ink text-creme">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Marca claro />
          <p className="mt-4 text-sm text-creme/75">
            {instituto.horario} · {instituto.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-creme/75">
            O Instituto Fio Nobre e a equipe são fictícios. Este site é uma demonstração criada pelo Estúdio X, de Alex Castro:
            tratamentos, preços e prazos são exemplos, e nenhuma avaliação é marcada de verdade. O questionário é uma orientação
            inicial e não substitui avaliação profissional nem consulta médica. As fotos são ilustrativas, geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-creme/20 p-6">
            <p className="font-serif text-xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-creme/75">
              Um site como este pode ser adaptado para o seu instituto, clínica capilar ou salão. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-creme/40 text-creme hover:border-creme">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
