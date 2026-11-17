import { Check, Headphones, MessageSquareText, Plane, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Fluente na Mala — curso de inglês para viagem",
  description: "Landing page de demonstração para curso on-line: para quem é, conteúdo por semana e matrícula. Curso fictício.",
};

const semanas = [
  { titulo: "Semana 1 · Aeroporto e imigração", texto: "Check-in, bagagem, conexão e as perguntas que o agente de imigração costuma fazer." },
  { titulo: "Semana 2 · Hotel e transporte", texto: "Fazer check-in, pedir ajuda na recepção, comprar passagem e pedir informação na rua." },
  { titulo: "Semana 3 · Restaurante e compras", texto: "Ler o cardápio, pedir, falar de restrição alimentar, pagar e trocar um produto." },
  { titulo: "Semana 4 · Imprevistos e conversa", texto: "Farmácia, perda de documento, e como puxar assunto sem travar." },
];

export default function Page() {
  return (
    <div className="lp" data-lp="fluente">
      <Hero
        fotoId="fluente-hero"
        kicker="Curso on-line · 4 semanas"
        title={
          <>
            Inglês para viajar <span className="lp-accent">sem travar.</span>
          </>
        }
        text="Em 20 minutos por dia, você aprende o que vai usar de verdade: aeroporto, hotel, restaurante e imprevistos."
      >
        <a href="#matricula" className="btn lp-btn">
          Garantir minha vaga
        </a>
        <a href="#conteudo-curso" className="btn lp-btn-ghost">
          Ver o que eu aprendo
        </a>
      </Hero>

      <Faixa
        className="text-lg"
        itens={["20 minutos por dia", "Aulas no celular", "Áudios para treinar", "Frases prontas", "Acesso por 1 ano"]}
      />

      <section aria-labelledby="para-quem-title" className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading id="para-quem-title" kicker="Para quem é" title="Você entende um pouco, mas na hora de falar some tudo?">
            <p>O curso foi pensado para quem tem viagem marcada e pouco tempo.</p>
          </Heading>
          <ul className="mt-8 space-y-4">
            {[
              "Vai viajar nos próximos meses e quer se virar sozinho.",
              "Já estudou inglês, mas trava na hora de falar.",
              "Tem pouco tempo e prefere estudar pelo celular.",
              "Quer frases prontas para as situações de viagem.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-lg">
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}
                >
                  <Check aria-hidden className="size-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4" aria-hidden>
          <Cena id="fluente-viagem" sizes="(min-width: 1024px) 280px, 50vw" className="parallax aspect-[3/4] w-full rounded-card" />
          <Cena id="fluente-aula" sizes="(min-width: 1024px) 280px, 50vw" className="parallax-inv mt-10 aspect-[3/4] w-full rounded-card" />
        </div>
      </section>

      <section id="conteudo-curso" aria-labelledby="semanas-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Heading id="semanas-title" kicker="Conteúdo" title="Quatro semanas, quatro momentos da viagem.">
            <p>Cada semana termina com um diálogo completo para você ouvir e repetir.</p>
          </Heading>
          <div className="divide-y" style={{ borderColor: "var(--lp-line)" }}>
            {semanas.map((semana, index) => (
              <details key={semana.titulo} open={index === 0} className="group py-2" style={{ borderColor: "var(--lp-line)" }}>
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 text-xl font-bold [&::-webkit-details-marker]:hidden">
                  {semana.titulo}
                  <span aria-hidden className="lp-accent text-3xl leading-none transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="lp-muted pb-4 text-lg leading-relaxed">{semana.texto}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="como-title" className="wrap py-16 sm:py-24">
        <Heading id="como-title" kicker="Como funciona" title="Feito para caber no seu dia." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Smartphone, titulo: "Aulas curtas", texto: "Vídeos de até 8 minutos, no celular ou no computador." },
            { icon: Headphones, titulo: "Áudios para treinar", texto: "Ouça e repita no trânsito, na academia ou em casa." },
            { icon: MessageSquareText, titulo: "Frases prontas", texto: "Um guia para salvar no celular e consultar na viagem." },
            { icon: Plane, titulo: "Simulações", texto: "Diálogos de aeroporto, hotel e restaurante para praticar." },
          ].map((item) => (
            <li key={item.titulo} className="lp-card rounded-card p-6">
              <item.icon aria-hidden className="lp-accent size-8" />
              <h3 className="mt-4 text-xl font-bold">{item.titulo}</h3>
              <p className="lp-muted mt-2">{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="matricula" aria-labelledby="matricula-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading id="matricula-title" kicker="Matrícula" title="Comece hoje e chegue pronto ao embarque." />
            <p className="lp-display mt-8 text-6xl font-bold">
              12× <span className="lp-accent">R$ 29,70</span>
            </p>
            <p className="lp-muted mt-2">ou R$ 297,00 à vista. Valores de exemplo.</p>
            <ul className="mt-6 space-y-2">
              {["Acesso por 1 ano", "4 semanas de aulas e áudios", "Guia de frases para a viagem", "7 dias para desistir"].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check aria-hidden className="lp-accent mt-0.5 size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm
            title="Garanta a sua vaga"
            cta="Quero começar"
            extraLabel="Quando é a sua viagem?"
            extraOptions={["Nos próximos 30 dias", "Em 2 ou 3 meses", "Ainda não marquei"]}
            successTitle="Vaga reservada"
            successText="Você receberia o link de pagamento e o acesso à primeira aula."
          />
        </div>
      </section>

      <Rodape nome="Fluente na Mala" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
