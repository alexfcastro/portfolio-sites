import { ArrowUpRight, Target } from "lucide-react";
import Image from "next/image";
import { getLandingBaseUrl } from "@/config/demos";
import type { LandingPage } from "@/data/landing-pages";

/**
 * Cartão de uma landing page de demonstração. Aparece na seção de landing pages, no catálogo (quando um
 * segmento está filtrado) e na seção do segmento na página inicial. O link só aparece com o endereço configurado.
 */
export function LandingCard({
  page,
  headingLevel: Heading = "h3",
  etiqueta = false,
}: {
  page: LandingPage;
  headingLevel?: "h2" | "h3";
  /** Mostra a etiqueta "Landing page", para diferenciar dos sites quando os dois aparecem juntos. */
  etiqueta?: boolean;
}) {
  const base = getLandingBaseUrl();
  const href = base ? `${base}/${page.slug}` : null;
  const frame = (
    <>
      <span className="browser-bar">
        <i />
        <i />
        <i />
        <span className="ml-2 truncate text-xs font-medium text-muted">{page.name}</span>
      </span>
      <span className="block aspect-[16/10] overflow-hidden">
        <Image
          src={`/landing/${page.slug}.png`}
          alt=""
          width={1440}
          height={900}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-auto w-full transition-transform duration-700 group-hover:scale-110"
        />
      </span>
    </>
  );

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card">
      <div className="p-3 pb-0">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir a landing page ${page.name} (abre em nova aba)`}
            className="browser-frame block"
          >
            {frame}
          </a>
        ) : (
          <div className="browser-frame">{frame}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-2">
          {etiqueta && (
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-wide text-canvas uppercase">Landing page</span>
          )}
          <span className="eyebrow !text-xs">{page.kind}</span>
        </p>
        <Heading className="mt-1.5 text-[1.375rem] leading-tight font-extrabold">{page.name}</Heading>
        <p className="mt-3 flex-1 leading-relaxed text-muted max-sm:line-clamp-3">{page.summary}</p>
        <p className="mt-4 flex items-start gap-2 text-sm font-semibold">
          <Target aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
          Objetivo: {page.goal.toLowerCase()}
        </p>
        <div className="pt-5">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Abrir a página<span className="sr-only"> {page.name} (abre em nova aba)</span>
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : (
            <p className="text-sm text-muted">Publicação em breve.</p>
          )}
        </div>
      </div>
    </article>
  );
}
