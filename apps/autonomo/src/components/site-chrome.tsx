import Link from "next/link";
import { siteConfig } from "@/config/site";
import { professional } from "@/data/profile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sandbg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-sm font-serif text-xl whitespace-nowrap">
          {professional.name}
          <span className="text-terra max-[379px]:hidden"> · foto</span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {(
              [
                ["/#servicos", "Serviços"],
                ["/#portfolio", "Portfólio"],
                ["/#duvidas", "Dúvidas"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 font-semibold text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/proposta" className="btn btn-primary shrink-0 !px-4">
            <span className="max-[379px]:hidden">Pedir proposta</span>
            <span className="min-[380px]:hidden">Proposta</span>
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
          <p className="font-serif text-2xl">{professional.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Lia Torres é uma profissional fictícia. Este site é uma demonstração do modelo “Linha Direta Profissional”,
            criada por Alex Castro: serviços, valores e trabalhos são exemplos, e nenhum pedido é enviado. As fotos são ilustrativas, geradas por IA.
          </p>
          {professional.social.length === 0 && (
            <p className="mt-3 text-sm text-muted">
              Redes sociais: aparecem aqui só quando informadas. Nesta demonstração, nenhuma é real.
            </p>
          )}
        </div>
        {quoteUrl && (
          <div className="rounded-lg border border-line p-6">
            <p className="font-serif text-xl">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site próprio como este pode ser adaptado para o seu trabalho autônomo. Fale com quem desenvolveu.
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
