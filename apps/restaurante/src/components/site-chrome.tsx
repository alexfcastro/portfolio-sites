import Link from "next/link";
import { Logo } from "@/components/brand";
import { CartLink } from "@/components/cart-link";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Sabor & Brasa — cardápio" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link href="/#horarios" className="hidden min-h-11 items-center px-3 font-medium text-muted hover:text-ink sm:inline-flex">
            Horários
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-coal text-cream">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-serif text-2xl">Sabor &amp; Brasa</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/75">
            O Sabor &amp; Brasa é um restaurante fictício. Esta página é uma demonstração criada por Alex Castro: cardápio,
            preços, bairros e taxas são exemplos, e nenhum pedido é enviado. As fotos dos pratos são ilustrativas, geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="font-serif text-xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-cream/75">
              Um cardápio digital como este pode ser adaptado para o seu restaurante. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-white/30 text-cream hover:border-white">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
