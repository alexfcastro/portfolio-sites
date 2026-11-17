import { ClipboardCheck, PlugZap, Ruler, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { CalculadoraSolar } from "@/components/widgets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Solar Viva — energia solar com simulação",
  description: "Landing page de demonstração para serviço: calculadora de economia, etapas da instalação e pedido de simulação. Empresa fictícia.",
};

export default function Page() {
  return (
    <div className="lp" data-lp="solar">
      <Hero
        fotoId="solar-hero"
        kicker="Energia solar para casas e comércios"
        title={
          <>
            O sol já paga <span className="lp-accent">a sua conta de luz.</span>
          </>
        }
        text="Veja em segundos quanto você pode economizar e receba um estudo feito para o seu telhado."
      >
        <a href="#simular" className="btn lp-btn">
          Simular minha economia
        </a>
        <a href="#etapas" className="btn lp-btn-ghost">
          Como é a instalação
        </a>
      </Hero>

      <Faixa className="text-lg" itens={["Casas", "Comércios", "Sítios", "Projeto sob medida", "Instalação em 1 dia"]} />

      <section id="simular" aria-labelledby="simular-title" className="wrap py-16 sm:py-24">
        <Heading id="simular-title" kicker="Simulação" title="Arraste e veja a economia.">
          <p>Informe o valor médio da sua conta. O resultado muda na hora.</p>
        </Heading>
        <div className="mt-10">
          <CalculadoraSolar />
        </div>
      </section>

      <section id="etapas" aria-labelledby="etapas-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading id="etapas-title" kicker="Etapas" title="Do estudo à energia ligada, sem dor de cabeça." />
            <ol className="mt-8 space-y-6">
              {[
                { icon: Ruler, titulo: "Estudo do telhado", texto: "Medimos a área, a inclinação e a incidência de sol." },
                { icon: ClipboardCheck, titulo: "Projeto e proposta", texto: "Você recebe o número de painéis, o valor e o prazo." },
                { icon: Wrench, titulo: "Instalação", texto: "A equipe instala os painéis e o inversor, normalmente em um dia." },
                { icon: PlugZap, titulo: "Ligação", texto: "Cuidamos do pedido à distribuidora até o sistema entrar em operação." },
              ].map((item, index) => (
                <li key={item.titulo} className="flex gap-4">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}
                  >
                    <item.icon aria-hidden className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">
                      {index + 1}. {item.titulo}
                    </h3>
                    <p className="lp-muted mt-1 text-lg">{item.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative pb-10 pl-8" aria-hidden>
            <Cena id="solar-instalacao" sizes="(min-width: 1024px) 520px, 100vw" className="parallax aspect-[4/3] w-full rounded-card" />
            <Cena
              id="solar-casa"
              sizes="240px"
              className="parallax-inv absolute bottom-0 left-0 aspect-[4/3] w-2/5 rounded-2xl border-4"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="pedido-title" className="wrap grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <Heading id="pedido-title" kicker="Estudo gratuito" title="Receba a simulação completa do seu imóvel.">
          <p>Com o seu consumo e o tipo de telhado, o estudo mostra o tamanho do sistema e em quanto tempo ele se paga.</p>
        </Heading>
        <LeadForm
          title="Pedir minha simulação"
          cta="Quero o estudo gratuito"
          extraLabel="O imóvel é"
          extraOptions={["Casa", "Comércio", "Sítio ou chácara", "Condomínio"]}
          successTitle="Pedido de simulação registrado"
          successText="Um consultor entraria em contato para pedir uma conta de luz recente e fotos do telhado."
        />
      </section>

      <Rodape nome="Solar Viva" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
