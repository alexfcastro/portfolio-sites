import { Mail, MessageCircle, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm, ContactFormWithParams } from "@/components/contact/contact-form";
import { ExternalLink } from "@/components/ui/external-link";
import { PageIntro } from "@/components/ui/page-intro";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { formatWhatsAppDisplay, getEmailUrl, getWhatsAppChatUrl } from "@/lib/contact/links";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contato e orçamento",
  description:
    "Conte sobre o seu negócio e o que você precisa. Prepare sua mensagem e continue a conversa com Alex Castro.",
  path: "/contato",
});

const introByMode = {
  whatsapp:
    "Preencha o formulário e revise a mensagem. Ela será aberta no WhatsApp para você concluir o envio por lá — nenhum dado fica guardado neste site.",
  email:
    "Preencha o formulário e revise a mensagem. Ela será aberta no seu aplicativo de e-mail para você concluir o envio — nenhum dado fica guardado neste site.",
  none: "Os canais de contato estão em configuração. Você já pode conhecer o formulário, mas ele ainda não encaminha mensagens.",
} as const;

export default function ContactPage() {
  const { mode, whatsapp, email } = siteConfig.contact;
  const whatsappUrl = getWhatsAppChatUrl();
  const emailUrl = getEmailUrl();
  const formProps = {
    mode,
    whatsappRecipient: whatsapp,
    emailRecipient: email,
    projects: projects.map(({ slug, name }) => ({ slug, name })),
  };

  return (
    <>
      <PageIntro eyebrow="Contato" title="Vamos conversar sobre o seu projeto">
        <p>{introByMode[mode]}</p>
      </PageIntro>

      <div className="container-page grid gap-10 pb-20 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="rounded-card border border-line bg-paper p-5 shadow-card sm:p-8">
          <Suspense fallback={<ContactForm {...formProps} />}>
            <ContactFormWithParams {...formProps} />
          </Suspense>
        </div>

        <aside aria-label="Outras informações de contato" className="space-y-5">
          {mode === "none" ? (
            <div className="rounded-card border border-line bg-paper p-6">
              <Wrench aria-hidden className="size-5 text-accent" />
              <h2 className="mt-3 font-bold">Contato em configuração</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Os canais de atendimento ainda estão sendo configurados. Enquanto isso, você pode explorar os{" "}
                <Link href="/projetos" className="text-link">
                  projetos
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="rounded-card border border-line bg-paper p-6">
              <h2 className="font-bold">Prefere falar direto?</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {whatsappUrl && whatsapp && (
                  <li>
                    <ExternalLink href={whatsappUrl} className="inline-flex min-h-11 items-center gap-2 font-medium hover:text-accent">
                      <MessageCircle aria-hidden className="size-4 text-accent" />
                      {formatWhatsAppDisplay(whatsapp)}
                    </ExternalLink>
                  </li>
                )}
                {emailUrl && email && (
                  <li>
                    <a href={emailUrl} className="inline-flex min-h-11 items-center gap-2 font-medium break-all hover:text-accent">
                      <Mail aria-hidden className="size-4 shrink-0 text-accent" />
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="rounded-card border border-line bg-paper p-6">
            <ShieldCheck aria-hidden className="size-5 text-accent" />
            <h2 className="mt-3 font-bold">Seus dados</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              O formulário apenas monta a mensagem no seu navegador. Nada é salvo ou enviado por este site. Saiba mais
              na{" "}
              <Link href="/privacidade" className="text-link">
                política de privacidade
              </Link>
              .
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-6">
            <h2 className="font-bold">O que acontece depois</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
              <li>Leio sua mensagem e, se precisar, faço algumas perguntas.</li>
              <li>Proponho um escopo para a primeira versão do site.</li>
              <li>Envio a proposta com valores e etapas para você avaliar.</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
