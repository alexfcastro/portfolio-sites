import Link from "next/link";
import { siteConfig } from "@/config/site";
import { fotos } from "@/data/fotos";

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="leading-none whitespace-nowrap">
      <span className={`block font-serif text-base font-semibold tracking-[0.1em] sm:text-lg sm:tracking-[0.18em] ${tone === "light" ? "text-white" : "text-navy"}`}>
        ALMEIDA &amp; PRADO
      </span>
      <span className={`block text-[0.625rem] font-semibold tracking-[0.3em] sm:tracking-[0.42em] ${tone === "light" ? "text-brass" : "text-brass-text"}`}>
        ADVOCACIA
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Almeida & Prado Advocacia — início">
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/#areas", "Áreas"],
                ["/#equipe", "Equipe"],
                ["/#artigos", "Artigos"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contato" className="btn btn-primary shrink-0 !px-4">
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-navy text-white">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Wordmark tone="light" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
            Almeida &amp; Prado é um escritório fictício. Este site é uma demonstração criada por Alex Castro, com
            conteúdo apenas informativo. Nenhum contato é enviado e não há atendimento jurídico.
            {Object.keys(fotos).length > 0 && " As fotos são ilustrativas, geradas por IA."}
          </p>
          <Link href="/avisos" className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            Avisos legais e privacidade
          </Link>
        </div>
        {quoteUrl && (
          <div className="border border-white/15 p-6">
            <p className="font-serif text-xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Um site institucional como este pode ser adaptado para o seu escritório. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-white/40 hover:border-white">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
