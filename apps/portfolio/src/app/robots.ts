import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/config/site";

/*
 * Fora da produção, a desindexação é feita pela meta tag `noindex` (layout).
 * O robots.txt não bloqueia o rastreamento, para que os robôs consigam ler essa diretiva.
 * O sitemap só é anunciado em produção com URL pública válida.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemap = isIndexable ? absoluteUrl("/sitemap.xml") : null;
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
