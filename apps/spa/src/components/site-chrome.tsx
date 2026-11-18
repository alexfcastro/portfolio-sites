import Link from "next/link";
import { siteConfig } from "@/config/site";
import { serena } from "@/data/serena";

export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden className="size-7 shrink-0">
        <path d="M16 27 C8 23 7 14 16 6 C25 14 24 23 16 27 Z" fill="none" stroke={claro ? "var(--color-areia)" : "var(--color-verde)"} strokeWidth="1.8" />
        <path d="M16 27 L16 14" stroke="var(--color-verde-claro)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-xl tracking-wide whitespace-nowrap">Casa Serena</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md" aria-label="Casa Serena — início">
          <Marca />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {(
              [
                ["/#experiencias", "Experiências"],
                ["/#vale-presente", "Vale-presente"],
                ["/#day-spa", "Day spa para dois"],
                ["/#visita", "Sua visita"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#vale-presente" className="inline-flex min-h-11 items-center px-3 font-semibold text-verde max-[429px]:hidden lg:hidden">
            Presentear
          </Link>
          <Link href="/#reserva" className="btn btn-primary shrink-0 !px-4">
            Reservar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-verde text-areia">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Marca claro />
          <p className="mt-4 text-sm text-areia/75">
            {serena.horario} · {serena.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-areia/75">
            A Casa Serena é um spa fictício. Este site é uma demonstração criada pelo Estúdio X, de Alex Castro: experiências, preços,
            vale-presente e políticas são exemplos, e nenhuma reserva ou compra é feita de verdade. As fotos são ilustrativas, geradas
            por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-areia/20 p-6">
            <p className="font-serif text-xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-areia/75">
              Um site como este pode ser adaptado para o seu spa ou espaço de bem-estar, com vale-presente para as datas comemorativas.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-areia/40 text-areia hover:border-areia">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
