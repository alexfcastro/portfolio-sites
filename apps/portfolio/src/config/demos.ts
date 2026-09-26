import { siteConfig } from "@/config/site";
import { parsePublicUrl } from "@/lib/url";

/*
 * URLs das demos independentes (apps/<slug>).
 * Convenção: NEXT_PUBLIC_DEMO_URL_<SLUG em maiúsculas, hífen vira "_">.
 * Referências explícitas são necessárias para a substituição no build.
 * Uma URL preenchida não torna a demo disponível: o estado fica em src/data/projects.ts.
 */
const rawDemoUrls: Record<string, string | undefined> = {
  barbearia: process.env.NEXT_PUBLIC_DEMO_URL_BARBEARIA,
  clinica: process.env.NEXT_PUBLIC_DEMO_URL_CLINICA,
  restaurante: process.env.NEXT_PUBLIC_DEMO_URL_RESTAURANTE,
  oficina: process.env.NEXT_PUBLIC_DEMO_URL_OFICINA,
  servicos: process.env.NEXT_PUBLIC_DEMO_URL_SERVICOS,
  autonomo: process.env.NEXT_PUBLIC_DEMO_URL_AUTONOMO,
  advocacia: process.env.NEXT_PUBLIC_DEMO_URL_ADVOCACIA,
  imobiliaria: process.env.NEXT_PUBLIC_DEMO_URL_IMOBILIARIA,
  petshop: process.env.NEXT_PUBLIC_DEMO_URL_PETSHOP,
  academia: process.env.NEXT_PUBLIC_DEMO_URL_ACADEMIA,
  "produtos-naturais": process.env.NEXT_PUBLIC_DEMO_URL_PRODUTOS_NATURAIS,
  floricultura: process.env.NEXT_PUBLIC_DEMO_URL_FLORICULTURA,
};

export const demoUrlSlugs = Object.keys(rawDemoUrls);

export function getConfiguredDemoUrl(slug: string): string | null {
  return parsePublicUrl(rawDemoUrls[slug], siteConfig.deployEnv);
}
