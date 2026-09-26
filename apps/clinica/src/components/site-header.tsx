import Link from "next/link";
import { VitaLogo } from "@/components/brand";

const sections = [
  { href: "/#especialidades", label: "Especialidades" },
  { href: "/#equipe", label: "Equipe" },
  { href: "/#atendimento", label: "Atendimento" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-mist/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Vita Clínica — início" className="rounded-md">
          <VitaLogo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {sections.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/minhas-solicitacoes"
            className="hidden min-h-11 items-center px-3 text-[0.9375rem] font-medium text-muted hover:text-ink sm:inline-flex"
          >
            Minhas solicitações
          </Link>
          <Link href="/solicitar" className="btn btn-primary ml-1 shrink-0 !px-4">
            Solicitar horário
          </Link>
        </nav>
      </div>
    </header>
  );
}
