import { LandingCard } from "@/components/projects/landing-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { landingPages } from "@/data/landing-pages";

/** Vitrine das landing pages de demonstração. O link só aparece quando o endereço do app está configurado. */
export function LandingPages() {
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
          {landingPages.map((page) => (
            <li key={page.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <LandingCard page={page} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">Projetos conceituais: as ofertas, os preços e as datas são fictícios.</p>
      </div>
    </section>
  );
}
