import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { PageIntro } from "@/components/ui/page-intro";
import { siteConfig } from "@/config/site";
import { getEmailUrl, getWhatsAppChatUrl } from "@/lib/contact/links";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Política de privacidade",
  description: "Como o portfólio de Alex Castro trata as informações de quem entra em contato.",
  path: "/privacidade",
});

/* Atualize esta data sempre que o funcionamento do site mudar. */
const LAST_UPDATED = "26 de setembro de 2026";

export default function PrivacyPage() {
  const { mode, email } = siteConfig.contact;
  const whatsappUrl = getWhatsAppChatUrl();
  const emailUrl = getEmailUrl();

  return (
    <>
      <PageIntro eyebrow="Privacidade" title="Política de privacidade">
        <p>Última atualização: {LAST_UPDATED}.</p>
      </PageIntro>

      <div className="container-page pb-20">
        <div className="prose-page max-w-3xl">
          <p>
            Esta página explica, de forma direta, como este site funciona em relação às informações de quem o visita e
            de quem entra em contato com <strong>{siteConfig.name}</strong>. Ela descreve o funcionamento atual do
            site e será atualizada se algo mudar.
          </p>

          <h2>Formulário de contato</h2>
          <p>
            O formulário da página <Link href="/contato" className="text-link">Contato</Link> pede nome, tipo de
            projeto e uma mensagem. Os demais campos — empresa, cidade, WhatsApp, e-mail, tipo de negócio, objetivo e
            projeto de interesse — são opcionais.
          </p>
          <p>
            Essas informações são usadas <strong>somente no seu navegador</strong> para montar um texto que você pode
            revisar. Este site não tem servidor de formulários, banco de dados ou serviço que receba, armazene ou
            registre o que você digita. Ao sair da página, o conteúdo preenchido é descartado.
          </p>

          <h2>Encaminhamento da mensagem</h2>
          {mode === "whatsapp" && (
            <p>
              Se você escolher <strong>Continuar no WhatsApp</strong>, o texto revisado é incluído em um link que abre
              o WhatsApp. A partir daí, a mensagem só é enviada se você confirmar o envio no próprio aplicativo, e o
              tratamento passa a seguir também as regras do WhatsApp (Meta).
            </p>
          )}
          {mode === "email" && (
            <p>
              Se você escolher <strong>Abrir no aplicativo de e-mail</strong>, o texto revisado é passado ao seu
              aplicativo de e-mail. A mensagem só é enviada se você confirmar o envio por lá, e o tratamento passa a
              seguir também as regras do seu provedor de e-mail.
            </p>
          )}
          {mode === "none" && (
            <p>
              No momento, os canais de contato estão em configuração e o formulário não encaminha mensagens para
              nenhum destino.
            </p>
          )}
          <p>
            As informações que chegarem por esses canais são usadas apenas para responder ao seu contato e, se for o
            caso, preparar uma proposta. Não são vendidas nem compartilhadas com terceiros para fins de marketing.
          </p>

          <h2>Cookies, analytics e rastreamento</h2>
          <p>
            O código deste site não cria cookies, não usa ferramentas de analytics, pixels de publicidade ou
            monitoramento de terceiros e não guarda dados do formulário no armazenamento do navegador. As fontes do
            site são servidas pelo próprio site, sem chamadas a serviços externos durante a navegação.
          </p>
          <p>
            Se algum desses recursos for adicionado no futuro, esta política será atualizada antes, com a finalidade
            e a forma de recusar, quando necessário.
          </p>

          <h2>Hospedagem</h2>
          <p>
            Como qualquer site na internet, o serviço de hospedagem pode registrar dados técnicos de acesso — como
            endereço IP, data e página solicitada — para funcionamento e segurança, de acordo com a política do
            próprio provedor.
          </p>

          <h2>Projetos demonstrativos</h2>
          <p>
            Os projetos apresentados no portfólio são conceituais e usam negócios fictícios. Quando demonstrações
            navegáveis forem publicadas, elas usarão apenas dados de exemplo e não criarão pedidos, reservas ou
            mensagens reais.
          </p>

          <h2>Seus direitos e contato</h2>
          <p>
            Você pode pedir informações sobre dados que tenha enviado por algum canal de contato, além de solicitar
            correção ou exclusão, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
          {whatsappUrl || emailUrl ? (
            <p>
              Para isso, fale comigo
              {emailUrl && email && (
                <>
                  {" "}
                  pelo e-mail{" "}
                  <a href={emailUrl} className="text-link break-all">
                    {email}
                  </a>
                </>
              )}
              {whatsappUrl && (
                <>
                  {emailUrl ? " ou " : " "}
                  pelo{" "}
                  <ExternalLink href={whatsappUrl} className="text-link">
                    WhatsApp
                  </ExternalLink>
                </>
              )}
              .
            </p>
          ) : (
            <p>O canal para essas solicitações será informado aqui assim que os contatos forem configurados.</p>
          )}
        </div>
      </div>
    </>
  );
}
