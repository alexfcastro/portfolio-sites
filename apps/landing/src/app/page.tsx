import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Cena } from "@/components/blocks";
import { landings } from "@/data/landings";

const temas: Record<string, string> = {
  "residencial-aurora": "aurora",
  "fluente-na-mala": "fluente",
  "festival-sabores-da-serra": "festival",
  "agenda-leve": "agenda",
  "clube-serra-alta": "cafe",
  "solar-viva": "solar",
  "volume-perfeito": "volume",
};

export default function IndexPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap py-16 sm:py-24">
          <p className="kicker !text-[#8fa6ff]">Landing pages</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.03] font-bold sm:text-7xl">
            Uma página, um objetivo: fazer o visitante agir.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            Sete exemplos de landing page, cada um para um tipo de oferta e com um pedido diferente ao visitante. As
            ofertas são fictícias; a estrutura e o cuidado são os de um projeto real.
          </p>
        </div>
      </section>

      <section aria-label="Exemplos" className="wrap py-14 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {landings.map((landing) => (
            <li key={landing.slug} data-lp={temas[landing.slug]}>
              <Link
                href={`/${landing.slug}`}
                className="painel-foto min-h-[26rem] rounded-card p-6 text-white"
              >
                <Cena id={landing.cover} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
                <span className="painel-texto block">
                  <span className="block text-xs font-bold tracking-[0.14em] uppercase">{landing.kind}</span>
                  <span className="mt-2 block text-3xl leading-tight font-bold">{landing.name}</span>
                  <span className="mt-2 block text-white/90">{landing.summary}</span>
                  <span className="mt-4 inline-flex items-center gap-2 font-bold">
                    Objetivo: {landing.goal.toLowerCase()}
                    <ArrowRight aria-hidden className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
