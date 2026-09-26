import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
} as const;

/** Imagem de compartilhamento: só anunciada com URL pública válida (nunca localhost). */
export const shareImages = siteConfig.url
  ? [{ url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt }]
  : undefined;

interface PageMetadataInput {
  /** Título da página, sem o sufixo da marca (aplicado pelo template). */
  title?: string;
  description: string;
  path: string;
}

/**
 * Metadata por página. Canonical e URLs absolutas só são geradas
 * quando existe uma URL pública válida para o ambiente.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;

  return {
    title: title ?? { absolute: siteConfig.title },
    description,
    alternates: siteConfig.url ? { canonical: path } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: siteConfig.url ? path : undefined,
      images: shareImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: shareImages,
    },
  };
}
