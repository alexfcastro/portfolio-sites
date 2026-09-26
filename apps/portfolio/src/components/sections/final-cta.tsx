import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { quoteHref } from "@/data/navigation";
import { getWhatsAppChatUrl } from "@/lib/contact/links";

interface FinalCtaProps {
  title?: string;
  description?: string;
}

export function FinalCta({
  title = "Vamos conversar sobre o seu site?",
  description = "Conte um pouco sobre o seu negócio e o que você precisa. A partir disso, preparo uma proposta de acordo com o escopo.",
}: FinalCtaProps) {
  const whatsappUrl = getWhatsAppChatUrl();

  return (
    <section aria-labelledby="cta-final-title" className="pb-20 sm:pb-24">
      <div className="container-page">
        <div className="on-dark relative overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-canvas sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_100%_0%,color-mix(in_srgb,var(--color-accent)_35%,transparent),transparent_70%)]"
          />
          <div className="relative max-w-2xl">
            <h2 id="cta-final-title" className="text-3xl leading-tight font-extrabold sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-on-dark">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={quoteHref} className="btn btn-primary">
                Solicitar orçamento
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              {whatsappUrl && (
                <ExternalLink href={whatsappUrl} className="btn btn-secondary">
                  <MessageCircle aria-hidden className="size-4" />
                  Conversar no WhatsApp
                </ExternalLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
