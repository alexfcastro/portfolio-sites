import { ArrowRight, ExternalLink as ExternalIcon } from "lucide-react";
import Link from "next/link";
import { ProjectCover } from "@/components/projects/project-cover";
import { ConceptBadge, DemoStatusBadge } from "@/components/projects/status-badges";
import { getConfiguredDemoUrl } from "@/config/demos";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/data/categories";
import { getCaseUrl } from "@/data/projects";
import { resolveDemoLink } from "@/lib/demo";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}

export function ProjectCard({ project, headingLevel: Heading = "h3", priority = false }: ProjectCardProps) {
  const cover = project.media[0];
  const demoUrl = resolveDemoLink(project.demoStatus, getConfiguredDemoUrl(project.slug), siteConfig.deployEnv);
  const hasImplemented = project.features.some((feature) => feature.status === "implemented");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card transition-shadow duration-200 hover:shadow-raised">
      {cover && (
        <ProjectCover
          media={cover}
          decorative
          preload={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/10] border-b border-line [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.02]"
        />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm font-medium text-muted">{getCategoryLabel(project.categoryId)}</p>
        <Heading className="mt-1 text-xl font-bold">{project.name}</Heading>

        <div className="mt-3 flex flex-wrap gap-2">
          <ConceptBadge />
          <DemoStatusBadge status={project.demoStatus} />
        </div>

        <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-4">
          <p className="text-xs font-semibold tracking-wide text-ink uppercase">
            {hasImplemented ? "Recursos" : "Recursos previstos"}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.features.slice(0, 4).map((feature) => (
              <li key={feature.title} className="rounded-md bg-canvas px-2 py-1 text-[0.8125rem] text-ink">
                {feature.title}
                {hasImplemented && feature.status === "planned" && <span className="text-muted"> (previsto)</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
          <Link
            href={getCaseUrl(project.slug)}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent after:absolute after:inset-0 after:rounded-card after:content-[''] hover:text-accent-strong"
          >
            Ver projeto<span className="sr-only"> {project.name}</span>
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink hover:text-accent"
            >
              Abrir demonstração<span className="sr-only"> de {project.name} (abre em nova aba)</span>
              <ExternalIcon aria-hidden className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
