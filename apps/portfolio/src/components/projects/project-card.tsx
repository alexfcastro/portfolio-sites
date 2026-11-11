import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProjectCover } from "@/components/projects/project-cover";
import { ConceptBadge, DemoStatusBadge } from "@/components/projects/status-badges";
import { getConfiguredDemoUrl } from "@/config/demos";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/data/categories";
import { getCaseUrl } from "@/data/projects";
import { resolveDemoPresentation } from "@/lib/demo";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}

export function ProjectCard({ project, headingLevel: Heading = "h3", priority = false }: ProjectCardProps) {
  const cover = project.media[0];
  const { state: demoState, link: demoUrl } = resolveDemoPresentation(
    project.demoStatus,
    getConfiguredDemoUrl(project.slug),
    siteConfig.deployEnv,
  );

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card">
      {cover && (
        <div className="p-3 pb-0">
          <div className="browser-frame">
            <div aria-hidden className="browser-bar">
              <i />
              <i />
              <i />
              <span className="ml-2 truncate text-xs font-medium text-muted">{project.name}</span>
            </div>
            <ProjectCover
              media={cover}
              decorative
              hideScreenshotLabel
              preload={priority}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="aspect-[16/10] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-110"
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow !text-xs">{getCategoryLabel(project.categoryId)}</p>
        <Heading className="mt-1.5 text-[1.375rem] leading-tight font-extrabold">{project.name}</Heading>
        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <ConceptBadge />
          <DemoStatusBadge status={demoState} />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-5">
          <Link
            href={getCaseUrl(project.slug)}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent after:absolute after:inset-0 after:rounded-card after:content-[''] hover:text-accent-strong"
          >
            Ver projeto<span className="sr-only"> {project.name}</span>
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 text-[0.8125rem] font-semibold text-ink transition-colors hover:border-ink"
            >
              Abrir demonstração<span className="sr-only"> de {project.name} (abre em nova aba)</span>
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
