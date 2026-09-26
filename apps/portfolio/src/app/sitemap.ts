import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/config/site";
import { getCaseUrl, projects } from "@/data/projects";

/** Somente rotas existentes e canônicas; vazio fora da produção. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];

  const paths = ["/", "/projetos", "/sobre", "/contato", "/privacidade", ...projects.map((p) => getCaseUrl(p.slug))];
  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
