import { Coffee, PackageCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { MontarPlano } from "@/components/widgets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Clube Serra Alta — assinatura de café especial",
  description: "Landing page de demonstração para assinatura de produto: como funciona, montagem do plano e assinatura. Marca fictícia.",
};

export default function Page() {
  return (
    <div className="lp" data-lp="cafe">
      <Hero
        fotoId="cafe-hero"
        kicker="Clube de café especial"
        title={
          <>
            Café torrado na semana, <em className="lp-accent">na sua porta.</em>
          </>
        }
        text="Você escolhe a quantidade e a moagem. A gente torra, embala e entrega todo mês, direto da serra."
      >
        <a href="#plano" className="btn lp-btn">
          Montar meu plano
        </a>
        <a href="#como-funciona" className="btn lp-btn-ghost">
          Como funciona
        </a>
      </Hero>

      <Faixa
        className="lp-display text-xl"
        itens={["Torra fresca", "Grãos da serra", "Moagem do seu jeito", "Entrega mensal", "Pause quando quiser"]}
      />

      <section id="como-funciona" aria-labelledby="como-title" className="wrap py-16 sm:py-24">
        <Heading id="como-title" kicker="Como funciona" title="Três passos entre o pé de café e a sua xícara." />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Coffee, titulo: "Você monta", texto: "Quantidade, frequência e moagem para o seu jeito de preparar." },
            { icon: PackageCheck, titulo: "A gente torra", texto: "O lote é torrado na semana do envio, nunca fica em estoque." },
            { icon: Truck, titulo: "Chega em casa", texto: "Entrega no dia combinado. Dá para pausar ou trocar o plano." },
          ].map((item, index) => (
            <li key={item.titulo} className="lp-card rounded-card p-7">
              <span className="lp-display lp-accent text-6xl font-bold">{index + 1}</span>
              <item.icon aria-hidden className="lp-accent mt-4 size-8" />
              <h3 className="mt-3 text-2xl font-bold">{item.titulo}</h3>
              <p className="lp-muted mt-2 text-lg">{item.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="plano" aria-labelledby="plano-title" className="lp-band py-16 sm:py-24">
        <div className="wrap">
          <Heading id="plano-title" kicker="Monte o seu plano" title="O preço aparece enquanto você escolhe.">
            <p>Valores de exemplo, com frete incluído nesta demonstração.</p>
          </Heading>
          <div className="mt-10">
            <MontarPlano />
          </div>
        </div>
      </section>

      <section aria-labelledby="origem-title" className="wrap grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-4" aria-hidden>
          <Cena id="cafe-fazenda" sizes="(min-width: 1024px) 560px, 100vw" className="col-span-2 aspect-[16/9] w-full rounded-card" />
          <Cena id="cafe-preparo" sizes="(min-width: 1024px) 280px, 50vw" className="aspect-square w-full rounded-card" />
          <Cena id="cafe-caixa" sizes="(min-width: 1024px) 280px, 50vw" className="aspect-square w-full rounded-card" />
        </div>
        <div>
          <Heading id="origem-title" kicker="A origem" title="De pequenos produtores, a 1.200 metros de altitude.">
            <p>
              Trabalhamos com lotes pequenos, colhidos à mão e secos em terreiro suspenso. Cada pacote traz o nome do
              sítio e a data da torra.
            </p>
          </Heading>
          <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              ["1.200 m", "de altitude"],
              ["7 dias", "da torra à entrega"],
              ["4", "sítios parceiros"],
            ].map(([valor, rotulo]) => (
              <div key={rotulo} className="lp-card rounded-card p-4">
                <dt className="sr-only">{rotulo}</dt>
                <dd>
                  <span className="lp-display lp-accent block text-3xl font-bold">{valor}</span>
                  <span className="lp-muted text-sm">{rotulo}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="lp-muted mt-4 text-sm">Números de exemplo: o Clube Serra Alta e os sítios são fictícios.</p>
        </div>
      </section>

      <section id="assinar" aria-labelledby="assinar-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <Heading id="assinar-title" kicker="Assinatura" title="O primeiro pacote sai na próxima torra.">
            <p>Sem fidelidade: pause, troque de plano ou cancele quando quiser.</p>
          </Heading>
          <LeadForm
            title="Assinar o clube"
            cta="Quero assinar"
            extraLabel="Moagem"
            extraOptions={["Em grãos", "Moído para coador", "Moído para prensa", "Moído para espresso"]}
            successTitle="Assinatura iniciada"
            successText="Você receberia o link de pagamento e a data da primeira entrega."
          />
        </div>
      </section>

      <Rodape nome="Clube Serra Alta" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
