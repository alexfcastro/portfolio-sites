import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FinalCta } from "@/components/sections/final-cta";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Sobre",
  description:
    "No Estúdio X, Alex Castro desenvolve sites e soluções digitais para pequenos e médios negócios, unindo design, tecnologia e funcionalidades úteis no dia a dia.",
  path: "/sobre",
});

const principles = [
  {
    title: "Clareza antes de efeito",
    description:
      "Um site precisa ser entendido em segundos. Priorizo textos diretos, hierarquia visual clara e caminhos simples até o contato.",
  },
  {
    title: "Proporção",
    description:
      "Nem todo negócio precisa de um sistema complexo. Proponho o que resolve o problema agora e deixo o projeto preparado para crescer.",
  },
  {
    title: "Honestidade",
    description:
      "Neste portfólio, projetos conceituais são identificados como conceituais e recursos planejados aparecem como previstos. Levo a mesma transparência para cada proposta.",
  },
  {
    title: "Cuidado técnico",
    description:
      "Desempenho, acessibilidade, boa leitura no celular e privacidade fazem parte do trabalho desde o início.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page flex flex-col items-center pt-12 pb-16 text-center sm:pt-16">
        {/* Foto de perfil discreta, no estilo de rede profissional: redonda, centralizada, com o texto embaixo. */}
        <div className="rounded-full bg-gradient-to-br from-accent to-[#7a5cff] p-1 shadow-raised">
          <Image
            src="/alex/alex-castro.webp"
            alt={`Foto de ${siteConfig.owner}`}
            width={900}
            height={900}
            sizes="144px"
            preload
            className="size-28 rounded-full border-4 border-canvas object-cover sm:size-36"
          />
        </div>
        <p className="eyebrow mt-6">Sobre · {siteConfig.name}</p>
        <h1 className="mt-3 text-4xl leading-[1.1] font-extrabold sm:text-5xl">Olá, eu sou o {siteConfig.owner}.</h1>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Desenvolvo soluções digitais voltadas para pequenos e médios negócios, unindo design, tecnologia e
            funcionalidades que facilitam o atendimento e melhoram a presença online. Meu objetivo é criar sites
            simples de usar e úteis no dia a dia do negócio.
          </p>
          <p>
            O Estúdio X é o nome do meu trabalho independente: sou eu quem conversa com você, planeja, desenvolve e
            publica o site. Isso torna a comunicação direta e cada decisão pode ser explicada em linguagem simples.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/projetos" className="btn btn-primary">
            Ver projetos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link href="/contato" className="btn btn-secondary">
            Solicitar orçamento
          </Link>
        </div>
      </section>

      <section aria-labelledby="principios" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="container-page">
          <h2 id="principios" className="text-3xl font-extrabold sm:text-4xl">
            Como eu trabalho
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle.title} className="border-l-2 border-accent pl-5">
                <h3 className="text-lg font-bold">{principle.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{principle.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="para-quem" className="container-page py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 id="para-quem" className="text-3xl font-extrabold sm:text-4xl">
            Para quem eu desenvolvo
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Pequenos e médios negócios, comércios locais, prestadores de serviço e profissionais autônomos que querem
            uma presença digital própria e ferramentas que ajudem no atendimento — como agendamentos, pedidos de
            orçamento, catálogos, cardápios e contato pelo WhatsApp.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Os{" "}
            <Link href="/projetos" className="text-link">
              projetos conceituais
            </Link>{" "}
            do portfólio mostram como penso cada segmento. Eles usam negócios fictícios e servem como ponto de partida
            para conversar sobre o seu caso.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
