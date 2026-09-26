import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProjects, projects } from "@/data/projects";

export function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section aria-labelledby="destaques-title" className="border-y border-line bg-sand/60 py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="destaques-title" eyebrow="Projetos" title="Soluções pensadas para cada segmento">
            <p>
              Projetos conceituais com negócios fictícios, que mostram como um site pode resolver problemas reais de
              cada tipo de negócio. As demonstrações navegáveis serão publicadas aos poucos.
            </p>
          </SectionHeading>
          <Link href="/projetos" className="btn btn-secondary shrink-0 self-start md:self-auto">
            Ver todos os {projects.length} projetos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
