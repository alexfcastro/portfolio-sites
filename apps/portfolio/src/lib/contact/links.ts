import { siteConfig } from "@/config/site";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/contact/channels";

const GREETING = "Olá, Alex! Vim pelo seu portfólio e gostaria de conversar sobre um site.";

/** Link direto de conversa, ou `null` quando o WhatsApp não está configurado. */
export function getWhatsAppChatUrl(): string | null {
  const recipient = siteConfig.contact.whatsapp;
  return recipient ? buildWhatsAppUrl(recipient, GREETING) : null;
}

export function getEmailUrl(): string | null {
  const recipient = siteConfig.contact.email;
  return recipient ? buildMailtoUrl(recipient, "Contato pelo portfólio", "") : null;
}

export function formatWhatsAppDisplay(digits: string): string {
  if (siteConfig.contact.phoneDisplay) return siteConfig.contact.phoneDisplay;
  // Formato brasileiro: +55 (11) 91234-5678
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `+55 (${match[1]}) ${match[2]}-${match[3]}` : `+${digits}`;
}
