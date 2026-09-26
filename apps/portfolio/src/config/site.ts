import { normalizeEmail, normalizeWhatsAppNumber } from "@/lib/contact/channels";
import { parseDeployEnv, parseExternalProfileUrl, parsePublicUrl } from "@/lib/url";

/*
 * Configuração pública central do portfólio.
 *
 * Os valores vêm de variáveis NEXT_PUBLIC_*, embutidas no build. Cada variável
 * precisa ser referenciada literalmente (process.env.NEXT_PUBLIC_...) para que o
 * Next.js faça a substituição. Alterar qualquer valor exige novo build/deploy.
 * Valores ausentes ou inválidos viram `null`, e os links correspondentes somem.
 */

const deployEnv = parseDeployEnv(process.env.NEXT_PUBLIC_DEPLOY_ENV);

const whatsapp = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP);
const email = normalizeEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL);

export type ContactMode = "whatsapp" | "email" | "none";

function optionalText(raw: string | undefined): string | null {
  const value = raw?.trim();
  return value ? value : null;
}

export const siteConfig = {
  name: "Alex Castro",
  monogram: "AX",
  tagline: "Sites e Soluções Digitais",
  title: "Alex Castro | Sites e Soluções Digitais",
  description:
    "Desenvolvo sites modernos para pequenos e médios negócios, com foco em presença digital, atendimento e soluções como agendamentos, orçamentos e contato pelo WhatsApp.",
  locale: "pt_BR",

  deployEnv,
  /** Única fonte da URL pública (canonical, Open Graph, sitemap). */
  url: parsePublicUrl(process.env.NEXT_PUBLIC_SITE_URL, deployEnv),

  contact: {
    whatsapp,
    email,
    /** Número exibido por extenso, apenas se informado. */
    phoneDisplay: optionalText(process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY),
    mode: (whatsapp ? "whatsapp" : email ? "email" : "none") as ContactMode,
  },

  social: {
    instagram: parseExternalProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    linkedin: parseExternalProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    github: parseExternalProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_GITHUB),
  },

  /** Não preencher sem confirmação do proprietário. */
  location: {
    city: optionalText(process.env.NEXT_PUBLIC_CITY),
    serviceArea: optionalText(process.env.NEXT_PUBLIC_SERVICE_AREA),
  },

  features: {
    /** Botão flutuante só aparece com WhatsApp configurado. */
    floatingWhatsApp: whatsapp !== null,
  },
} as const;

/** Indexação apenas em produção com URL pública válida. */
export const isIndexable = siteConfig.deployEnv === "production" && siteConfig.url !== null;

export function absoluteUrl(path: string): string | null {
  if (!siteConfig.url) return null;
  return new URL(path, `${siteConfig.url}/`).toString();
}
