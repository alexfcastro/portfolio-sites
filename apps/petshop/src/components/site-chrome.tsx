import { CalendarHeart } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden focusable="false">
        <rect width="40" height="40" rx="12" fill="#c8452f" />
        <g fill="#fff6ec">
          <ellipse cx="20" cy="25" rx="7" ry="6" />
          <circle cx="11.5" cy="17" r="3" />
          <circle cx="17" cy="11.5" r="3" />
          <circle cx="23" cy="11.5" r="3" />
          <circle cx="28.5" cy="17" r="3" />
        </g>
      </svg>
      <span className="text-xl font-extrabold whitespace-nowrap">PetVille</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="PetVille — início" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/#servicos", "Serviços"],
                ["/#pacotes", "Pacotes"],
                ["/#galeria", "Galeria"],
                ["/agendamentos", "Meus agendamentos"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-bold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/agendamentos"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-coral-soft md:hidden"
          >
            <CalendarHeart aria-hidden className="size-5" />
            <span className="sr-only">Meus agendamentos</span>
          </Link>
          <Link href="/agendar" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Agendar banho</span>
            <span className="min-[380px]:hidden">Agendar</span>
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
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xl font-extrabold">PetVille</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            O PetVille é um pet shop fictício. Este site é uma demonstração criada por Alex Castro: serviços, preços,
            profissionais e horários são exemplos, e nenhum agendamento é enviado.
          </p>
          <p className="mt-3 text-sm text-white/75">Terça a sexta, 9h às 18h · Sábado, 9h às 17h (horários de exemplo)</p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-lg font-bold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Um site com agendamento por porte e serviço pode ser adaptado para o seu pet shop. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border-2 border-white/30 hover:border-white">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
