import { ProjectCard } from "@/components/projects/project-card";
import { Suspense } from "react";
import { ProjectExplorer, ProjectExplorerWithParams } from "@/components/projects/project-explorer";
import { FinalCta } from "@/components/sections/final-cta";
import { LandingPages } from "@/components/sections/landing-pages";
import { PageIntro } from "@/components/ui/page-intro";
import { categories, solutionTypes } from "@/data/categories";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projetos",
  description:
    `${projects.length} projetos conceituais de sites para barbearia, clínica, restaurante, estética, sobrancelhas, unhas, spa e outros segmentos. Negócios fictícios.`,
  path: "/projetos",
});

export default function ProjectsPage() {
  const usedCategories = categories.filter((category) => projects.some((project) => project.categoryId === category.id));
  const usedSolutions = solutionTypes.filter((solution) =>
    projects.some((project) => project.solutionIds.includes(solution.id)),
  );

  const cards = Object.fromEntries(
    projects.map((project, index) => [
      project.slug,
      <ProjectCard key={project.slug} project={project} headingLevel="h2" priority={index < 3} />,
    ]),
  );

  const explorerProps = {
    items: projects.map(({ slug, categoryId, solutionIds }) => ({ slug, categoryId, solutionIds })),
    cards,
    categories: [...usedCategories],
    solutions: [...usedSolutions],
  };

  return (
    <>
      <PageIntro eyebrow="Projetos" title={`${projects.length} projetos, diferentes desafios de negócio`}>
        <p>
          Cada projeto é um conceito com um negócio fictício, criado para mostrar como um site pode resolver um
          problema comum do segmento. Em cada demonstração, dá para testar o fluxo como se fosse o cliente.
        </p>
      </PageIntro>

      <div className="container-page pb-20">
        <Suspense fallback={<ProjectExplorer {...explorerProps} />}>
          <ProjectExplorerWithParams {...explorerProps} />
        </Suspense>
      </div>

      <LandingPages />
      <div className="pt-20" />

      <FinalCta
        title="Não encontrou o seu segmento?"
        description="Os projetos são exemplos. Conte como funciona o seu negócio e eu proponho uma solução sob medida."
      />
    </>
  );
}
