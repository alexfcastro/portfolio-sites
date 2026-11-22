import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { BravusLogo } from "@/components/brand";
import { CartLink } from "@/components/loja/cart-link";
import { MobileMenu } from "@/components/mobile-menu";

const sections = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/planos", label: "Planos" },
  { href: "/loja", label: "Loja" },
  { href: "/#visite", label: "Visite" },
];

const areas = [
  { href: "/meus-horarios", label: "Meus horários" },
  { href: "/admin", label: "Painel" },
];

const linkClass =
  "inline-flex min-h-11 items-center px-3 font-display text-[0.9375rem] tracking-[0.12em] text-smoke uppercase hover:text-cream";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-coal/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-2">
        <Link href="/" aria-label="Bravus Barbearia — início" className="shrink-0 rounded-md">
          <BravusLogo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          {/* A partir de 1024px, todos os links ficam no topo; abaixo disso, dentro do botão Menu. */}
          <ul className="hidden items-center gap-1 lg:flex">
            {[...sections, ...areas].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <CartLink />
          <MobileMenu links={[...sections, ...areas]} />
          {/* Abaixo de 420px, só o ícone (o texto continua para leitores de tela), para caber com a sacola e o menu. */}
          <Link href="/agendar" className="btn btn-gold ml-1 shrink-0 !px-4 max-[419px]:!px-3">
            <CalendarPlus aria-hidden className="size-4" />
            <span className="max-[419px]:sr-only">Agendar</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
