import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { BravusLogo } from "@/components/brand";

const sections = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#equipe", label: "Equipe" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#visite", label: "Visite" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-coal/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Bravus Barbearia — início" className="rounded-md">
          <BravusLogo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 lg:flex">
            {sections.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-3 font-display text-[0.9375rem] tracking-[0.12em] text-smoke uppercase hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Em telas pequenas, o painel fica no rodapé e na confirmação do agendamento. */}
          <Link
            href="/admin"
            className="hidden min-h-11 items-center px-3 font-display text-[0.9375rem] tracking-[0.12em] text-smoke uppercase hover:text-cream sm:inline-flex"
          >
            Painel
          </Link>
          <Link href="/agendar" className="btn btn-gold ml-1 shrink-0 !px-4">
            <CalendarPlus aria-hidden className="size-4" />
            Agendar
          </Link>
        </nav>
      </div>
    </header>
  );
}
