/*
 * Configuração pública da demo. Valores embutidos no build (NEXT_PUBLIC_*).
 * Esta app não importa código do portfólio: conhece-o apenas pela URL.
 */

type DeployEnv = "development" | "preview" | "production";

const deployEnv: DeployEnv =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "preview" || process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? process.env.NEXT_PUBLIC_DEPLOY_ENV
    : "development";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** HTTPS em host público; em desenvolvimento aceita também http://localhost. */
export function parsePortfolioUrl(raw: string | undefined, env: DeployEnv): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || /(^|\.)example\.(com|org|net)$/.test(url.hostname)) return null;
    const local = LOCAL_HOSTS.has(url.hostname) || url.hostname.endsWith(".localhost");
    const allowed = url.protocol === "https:" ? !local || env === "development" : url.protocol === "http:" && local && env === "development";
    return allowed ? url.origin + url.pathname.replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

// Em `next dev`, o portfólio local (porta 3000) é o padrão explícito.
const rawPortfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);

const portfolioUrl = parsePortfolioUrl(rawPortfolioUrl, deployEnv);

export const siteConfig = {
  name: "Sabor & Brasa",
  slug: "restaurante",
  deployEnv,
  portfolio: {
    home: portfolioUrl,
    caseUrl: portfolioUrl ? `${portfolioUrl}/projetos/restaurante` : null,
    quoteUrl: portfolioUrl ? `${portfolioUrl}/contato?projeto=restaurante` : null,
  },
} as const;
