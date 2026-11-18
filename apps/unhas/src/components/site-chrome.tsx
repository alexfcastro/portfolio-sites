import Link from "next/link";
import { siteConfig } from "@/config/site";
import { esmalteria } from "@/data/esmalteria";

export function Marca() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" aria-hidden className="size-7 shrink-0">
        <mask id="meia-lua-mascara">
          <rect width="32" height="32" fill="white" />
          <circle cx="21" cy="12" r="10" fill="black" />
        </mask>
        <circle cx="15" cy="17" r="12" className="fill-rosa-escuro" mask="url(#meia-lua-mascara)" />
      </svg>
      <span className="text-lg font-bold tracking-tight whitespace-nowrap">
        Meia-Lua <span className="font-medium text-muted max-[379px]:hidden">esmalteria</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md" aria-label="Esmalteria Meia-Lua — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#catalogo", "Catálogo"],
                ["/#montador", "Montar"],
                ["/#planos", "Planos"],
                ["/#cuidados", "Cuidados"],
                ["/#biosseguranca", "Biossegurança"],
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
            Agendar
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
            {esmalteria.horario} · {esmalteria.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            A Esmalteria Meia-Lua e a equipe são fictícias. Este site é uma demonstração criada pelo Estúdio X, de Alex Castro:
            serviços, preços, prazos e planos são exemplos, e nenhum horário é marcado de verdade. As fotos são ilustrativas,
            geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-line p-6">
            <p className="text-xl font-bold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site como este pode ser adaptado para a sua esmalteria ou estúdio de unhas. Fale com quem desenvolveu.
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
