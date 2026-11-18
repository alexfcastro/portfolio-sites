import { ArrowUpRight, Target } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLandingBaseUrl } from "@/config/demos";
import { landingPages } from "@/data/landing-pages";

/** Vitrine das landing pages de demonstração. O link só aparece quando o endereço do app está configurado. */
export function LandingPages() {
  const base = getLandingBaseUrl();

  return (
    <section id="landing-pages" aria-labelledby="landing-pages-title" className="border-y border-line bg-sand/60 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="landing-pages-title" eyebrow="Landing pages" title="Uma página, um objetivo: fazer o visitante agir">
          <p>
            Para lançar um produto, divulgar um evento ou captar pedidos de orçamento. Sete exemplos com ofertas
            fictícias, cada um pedindo uma ação diferente ao visitante.
          </p>
        </SectionHeading>

        {/* No celular, os exemplos ficam lado a lado e deslizam na horizontal, em vez de cartões empilhados.
            `contain: paint` impede o Firefox de somar a faixa à largura da página. */}
        <p className="mt-8 text-sm font-medium text-muted sm:hidden">Deslize para ver os sete exemplos →</p>
        <ul className="reveal -mx-5 mt-4 flex snap-x pt-1 [contain:paint] sm:pt-0 sm:[contain:none] snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-7 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {landingPages.map((page) => {
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
              <li key={page.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <article className="card-lift group flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card">
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
                    <p className="eyebrow !text-xs">{page.kind}</p>
                    <h3 className="mt-1.5 text-[1.375rem] leading-tight font-extrabold">{page.name}</h3>
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
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-sm text-muted">Projetos conceituais: as ofertas, os preços e as datas são fictícios.</p>
      </div>
    </section>
  );
}
