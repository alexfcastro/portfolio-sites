import { ProjectCard } from "@/components/projects/project-card";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { FinalCta } from "@/components/sections/final-cta";
import { PageIntro } from "@/components/ui/page-intro";
import { categories, solutionTypes } from "@/data/categories";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projetos",
  description:
    "Doze projetos conceituais de sites para barbearia, clínica, restaurante, oficina, imobiliária, floricultura e outros segmentos. Negócios fictícios.",
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

  return (
    <>
      <PageIntro eyebrow="Projetos" title="Doze segmentos, doze problemas diferentes">
        <p>
          Cada projeto é um conceito com um negócio fictício, criado para mostrar como um site pode resolver um
          problema comum do segmento. As demonstrações navegáveis serão publicadas uma de cada vez.
        </p>
      </PageIntro>

      <div className="container-page pb-20">
        <ProjectExplorer
          items={projects.map(({ slug, categoryId, solutionIds }) => ({ slug, categoryId, solutionIds }))}
          cards={cards}
          categories={[...usedCategories]}
          solutions={[...usedSolutions]}
        />
      </div>

      <FinalCta
        title="Não encontrou o seu segmento?"
        description="Os projetos são exemplos. Conte como funciona o seu negócio e eu proponho uma solução sob medida."
      />
    </>
  );
}
