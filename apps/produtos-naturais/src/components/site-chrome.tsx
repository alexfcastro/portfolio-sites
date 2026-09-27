import Link from "next/link";
import { CartLink, FavoritesLink } from "@/components/shop-links";
import { siteConfig } from "@/config/site";
import { storeHours } from "@/data/catalog";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden focusable="false">
        <circle cx="20" cy="20" r="20" fill="#56682a" />
        <path d="M20 31 V17" stroke="#f7f2e7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 19 q-9 -1 -10 -9 q9 0 10 9 Z" fill="#e8ecd6" />
        <path d="M20 23 q8 -1 9 -8 q-8 0 -9 8 Z" fill="#f6e1d6" />
      </svg>
      <span className="font-display text-xl font-semibold whitespace-nowrap">
        Raiz <span className="text-terra">&amp;</span> Grão
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-linen/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-2">
        <Link href="/" aria-label="Raiz & Grão — início" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/produtos", "Produtos"],
                ["/produtos?categoria=kits", "Kits"],
                ["/produtos?promocao=1", "Promoções"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/produtos" className="inline-flex min-h-11 items-center px-2 font-semibold text-muted hover:text-ink max-[419px]:hidden md:hidden">
            Produtos
          </Link>
          <FavoritesLink />
          <CartLink />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-olive-dark text-white">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Raiz &amp; Grão</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
            A Raiz &amp; Grão é uma loja fictícia. Este site é uma demonstração criada por Alex Castro: produtos, preços,
            estoque e bairros são exemplos, e nenhum pedido é enviado.
          </p>
        </div>
        <div>
          <p className="font-semibold">Horário (exemplo)</p>
          <dl className="mt-2 space-y-1 text-sm text-white/80">
            {storeHours.map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4">
                <dt>{day}</dt>
                <dd>{hours}</dd>
              </div>
            ))}
          </dl>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/20 p-6">
            <p className="text-lg font-semibold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Um catálogo com venda por peso e carrinho pode ser adaptado para a sua loja. Fale com quem desenvolveu.
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
