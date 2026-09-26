import Link from "next/link";
import { BrandSignature } from "@/components/ui/brand-signature";
import { ExternalLink } from "@/components/ui/external-link";
import { siteConfig } from "@/config/site";
import { mainNavigation, quoteHref } from "@/data/navigation";
import { formatWhatsAppDisplay, getEmailUrl, getWhatsAppChatUrl } from "@/lib/contact/links";

export function SiteFooter() {
  const whatsappUrl = getWhatsAppChatUrl();
  const emailUrl = getEmailUrl();
  const { whatsapp, email } = siteConfig.contact;
  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "GitHub", href: siteConfig.social.github },
  ].filter((item): item is { label: string; href: string } => item.href !== null);
  const hasContact = Boolean(whatsappUrl || emailUrl || socials.length);
  const year = new Date().getFullYear();

  return (
    // Com o botão flutuante ativo, o fim do rodapé ganha espaço para não ficar coberto.
    <footer className={`on-dark bg-ink text-canvas ${siteConfig.features.floatingWhatsApp ? "pb-24" : ""}`}>
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <BrandSignature tone="dark" />
          <p className="mt-4 text-sm leading-relaxed text-muted-on-dark">
            {siteConfig.tagline}. Sites e ferramentas simples de usar para pequenos e médios negócios.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="text-sm font-semibold text-canvas">Navegação</h2>
          <ul className="mt-3 text-sm">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-muted-on-dark hover:text-canvas">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={quoteHref} className="inline-flex min-h-11 items-center text-muted-on-dark hover:text-canvas">
                Contato e orçamento
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="inline-flex min-h-11 items-center text-muted-on-dark hover:text-canvas">
                Privacidade
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-canvas">Contato</h2>
          {hasContact ? (
            <ul className="mt-3 text-sm">
              {whatsappUrl && whatsapp && (
                <li>
                  <ExternalLink href={whatsappUrl} className="inline-flex min-h-11 items-center text-muted-on-dark hover:text-canvas">
                    WhatsApp: {formatWhatsAppDisplay(whatsapp)}
                  </ExternalLink>
                </li>
              )}
              {emailUrl && email && (
                <li>
                  <a href={emailUrl} className="inline-flex min-h-11 items-center break-all text-muted-on-dark hover:text-canvas">
                    {email}
                  </a>
                </li>
              )}
              {socials.map((social) => (
                <li key={social.label}>
                  <ExternalLink href={social.href} className="inline-flex min-h-11 items-center text-muted-on-dark hover:text-canvas">
                    {social.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-on-dark">Canais de contato em configuração.</p>
          )}
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-on-dark sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p>Os projetos apresentados são conceituais e usam negócios fictícios.</p>
        </div>
      </div>
    </footer>
  );
}
