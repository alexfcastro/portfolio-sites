import type { MetadataRoute } from "next";

/*
 * Demo de negócio fictício: a desindexação vem da meta tag e do header X-Robots-Tag.
 * O rastreio não é bloqueado para que os robôs consigam ler essas diretivas. Sem sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
