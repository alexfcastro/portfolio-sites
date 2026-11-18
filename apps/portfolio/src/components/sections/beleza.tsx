import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LandingCard } from "@/components/projects/landing-card";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { landingPages } from "@/data/landing-pages";
import { projects } from "@/data/projects";

/**
 * Vitrine do segmento Beleza e estética na página inicial: os sites do segmento e a landing page do curso.
 * O botão leva ao mesmo link usado nas abordagens (/projetos?segmento=beleza).
 */
export function Beleza() {
  const sites = projects.filter((project) => project.categoryId === "beleza");
  const landings = landingPages.filter((page) => page.categoryId === "beleza");
  if (sites.length === 0) return null;
  const total = sites.length + landings.length;

  return (
    <section id="beleza" aria-labelledby="beleza-title" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="beleza-title" eyebrow="Beleza e estética" title="Para quem cuida da beleza dos outros">
            <p>
              Sobrancelhas, estética, cílios, noivas, unhas, terapia capilar e spa: cada site resolve o problema que mais trava a
              agenda daquele negócio. Projetos conceituais, com negócios fictícios.
            </p>
          </SectionHeading>
          <Link href="/projetos?segmento=beleza" className="btn btn-secondary shrink-0 self-start md:self-auto">
            Ver os projetos de beleza
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        {/* No celular, os cartões deslizam na horizontal; `contain: paint` evita que o Firefox alargue a página. */}
        <p className="mt-8 text-sm font-medium text-muted sm:hidden">Deslize para ver os {total} exemplos →</p>
        <ul className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pt-1 pb-4 [contain:paint] sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-7 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 sm:[contain:none] lg:grid-cols-4">
          {sites.map((project) => (
            <li key={project.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <ProjectCard project={project} />
            </li>
          ))}
          {landings.map((page) => (
            <li key={page.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <LandingCard page={page} etiqueta />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
