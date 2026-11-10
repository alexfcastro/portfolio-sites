import Image from "next/image";
import type { ProjectMedia } from "@/types/project";

interface ProjectCoverProps {
  media: ProjectMedia;
  /** Use apenas para a imagem principal visível sem rolagem. */
  preload?: boolean;
  sizes: string;
  className?: string;
  /** Em cards, o nome do projeto já é lido; a imagem pode ser decorativa. */
  decorative?: boolean;
  /** Em cards, a moldura de navegador já indica a captura; o selo só aparece para prévias conceituais. */
  hideScreenshotLabel?: boolean;
}

export function ProjectCover({
  media,
  preload = false,
  sizes,
  className,
  decorative = false,
  hideScreenshotLabel = false,
}: ProjectCoverProps) {
  const showLabel = !(hideScreenshotLabel && media.kind === "screenshot");

  return (
    <div className={`relative overflow-hidden bg-sand ${className ?? ""}`}>
      <Image
        src={media.src}
        alt={decorative ? "" : media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        preload={preload}
        // Capas conceituais são SVGs leves; não passam pelo otimizador de imagens.
        unoptimized={media.src.endsWith(".svg")}
        className="h-auto w-full"
      />
      {showLabel && (
        <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-canvas backdrop-blur-sm">
          {media.kind === "concept" ? "Prévia conceitual" : "Captura da demonstração"}
        </span>
      )}
    </div>
  );
}
