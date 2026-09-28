import Link from "next/link";
import { CartLink } from "@/components/cart-link";
import { siteConfig } from "@/config/site";
import { storeHours } from "@/data/shop";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden focusable="false">
        <circle cx="20" cy="20" r="20" fill="#f6e4e4" />
        <path d="M20 34 V20" stroke="#4f6650" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 28 q-8 -1 -9 -7 q8 0 9 7 Z" fill="#7d9277" />
        <circle cx="20" cy="15" r="5" fill="#a4525f" />
        <circle cx="15" cy="12" r="4" fill="#c98590" />
        <circle cx="25" cy="12" r="4" fill="#c98590" />
        <circle cx="20" cy="8.5" r="4" fill="#c98590" />
        <circle cx="20" cy="13" r="3" fill="#86404c" />
      </svg>
      <span className="font-display text-2xl font-semibold whitespace-nowrap max-[379px]:sr-only">
        Flor <span className="text-rose">&amp;</span> Afeto
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-blush/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-2">
        <Link href="/" aria-label="Flor & Afeto — início" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/catalogo", "Catálogo"],
                ["/#ocasioes", "Ocasiões"],
                ["/#como-funciona", "Como funciona"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <CartLink />
          <Link href="/catalogo" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Escolher flores</span>
            <span className="min-[380px]:hidden">Catálogo</span>
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
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">Flor &amp; Afeto</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            A Flor &amp; Afeto é uma floricultura fictícia. Este site é uma demonstração criada por Alex Castro: produtos,
            preços, bairros e horários são exemplos, e nenhum pedido é enviado. As fotos são ilustrativas, geradas por IA.
          </p>
        </div>
        <div>
          <p className="font-medium">Horário (exemplo)</p>
          <dl className="mt-2 space-y-1 text-sm text-white/75">
            {storeHours.map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4">
                <dt>{day}</dt>
                <dd className="text-right">{hours}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-white/75">Endereço e mapa não são exibidos: a loja é fictícia.</p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/20 p-6">
            <p className="text-lg font-medium">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Um site com personalização de pedido e data de entrega pode ser adaptado para a sua floricultura. Fale com
              quem desenvolveu.
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
