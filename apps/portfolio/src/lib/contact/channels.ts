const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normaliza um número de WhatsApp com código do país (ex.: 55 + DDD + número).
 * Aceita espaços, parênteses, hífens e "+"; rejeita letras e tamanhos implausíveis.
 */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (!/^\+?[\d\s().-]+$/.test(value)) return null;

  const digits = value.replace(/\D/g, "");
  // Mínimo de 12 dígitos: 55 + DDD + fixo. Com 10 ou 11 dígitos não dá para
  // distinguir um número brasileiro sem o 55 (ex.: DDD 11) de um código de país.
  if (digits.length < 12 || digits.length > 15) return null;
  if (digits.startsWith("0")) return null;
  return digits;
}

export function isValidEmail(value: string): boolean {
  return value.length <= 150 && EMAIL_PATTERN.test(value);
}

export function normalizeEmail(raw: string | null | undefined): string | null {
  const value = raw?.trim().toLowerCase();
  if (!value) return null;
  return isValidEmail(value) ? value : null;
}

/** Monta o link do WhatsApp. Nunca é chamado sem destinatário válido. */
export function buildWhatsAppUrl(recipient: string, message: string): string {
  const number = normalizeWhatsAppNumber(recipient);
  if (!number) {
    throw new Error("Destinatário de WhatsApp inválido.");
  }
  const base = `https://wa.me/${number}`;
  const text = message.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function buildMailtoUrl(recipient: string, subject: string, body: string): string {
  const email = normalizeEmail(recipient);
  if (!email) {
    throw new Error("Destinatário de e-mail inválido.");
  }
  const params = [`subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  return `mailto:${email}?${params.join("&")}`;
}
