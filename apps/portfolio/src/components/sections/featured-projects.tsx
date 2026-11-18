import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getConfiguredDemoUrl } from "@/config/demos";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/data/categories";
import { homeHighlights } from "@/data/home";
import { getProjectTheme } from "@/data/project-themes";
import { getCaseUrl, getProjectBySlug, projects } from "@/data/projects";
import { resolveDemoPresentation } from "@/lib/demo";
import type { Project } from "@/types/project";

/** Painel de destaque: o projeto aparece com as cores do próprio negócio, no computador e no celular. */
function Spotlight({ project, index, task }: { project: Project; index: number; task?: string }) {
  const theme = getProjectTheme(project.slug);
  const desktop = project.media[0];
  const phone = project.media.find((media) => media.height > media.width);
  const { link: demoUrl } = resolveDemoPresentation(
    project.demoStatus,
    getConfiguredDemoUrl(project.slug),
    siteConfig.deployEnv,
  );
  const flipped = index % 2 === 1;

  return (
    <article
      style={{ background: theme.background, color: theme.foreground }}
      className="reveal group relative grid items-center gap-7 overflow-hidden rounded-[2rem] p-6 shadow-raised sm:gap-10 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14"
    >
      <div className={flipped ? "lg:order-2" : ""}>
        <p style={{ color: theme.accent }} className="text-sm font-semibold tracking-[0.12em] uppercase">
          {String(index + 1).padStart(2, "0")} · {getCategoryLabel(project.categoryId)}
        </p>
        <h3 className="mt-3 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl">{project.name}</h3>
        <p style={{ color: theme.muted }} className="mt-5 max-w-md text-lg leading-relaxed">
          {project.summary}
        </p>
        {task && (
          <p className="mt-5 flex max-w-md items-start gap-2.5 text-[0.9375rem] leading-relaxed font-medium">
            <span
              style={{ background: theme.accent, color: theme.background }}
              className="mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase"
            >
              Experimente
            </span>
            {task}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <Link
            href={getCaseUrl(project.slug)}
            style={{ background: theme.foreground, color: theme.background }}
            className="btn"
          >
            Ver projeto<span className="sr-only"> {project.name}</span>
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: theme.foreground }}
              className="btn border bg-transparent"
            >
              Abrir demonstração<span className="sr-only"> de {project.name} (abre em nova aba)</span>
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          )}
        </div>
      </div>

      {desktop && (
        <div aria-hidden className={`relative pb-8 ${flipped ? "lg:order-1 lg:pr-10" : "lg:pl-10"}`}>
          <div className="overflow-hidden rounded-xl shadow-2xl shadow-black/40 ring-1 ring-black/10 transition-transform duration-700 group-hover:-translate-y-2">
            <Image
              src={desktop.src}
              alt=""
              width={desktop.width}
              height={desktop.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full transition-transform duration-[1200ms] group-hover:scale-105"
            />
          </div>
          {phone && (
            <div
              className={`absolute bottom-0 w-[26%] overflow-hidden rounded-[1.25rem] border-4 border-black/80 shadow-2xl shadow-black/50 transition-transform duration-700 group-hover:-translate-y-4 ${flipped ? "right-0" : "left-0"}`}
            >
              <Image
                src={phone.src}
                alt=""
                width={phone.width}
                height={phone.height}
                sizes="160px"
                className="aspect-[9/16] h-auto w-full object-cover object-top"
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function FeaturedProjects() {
  const featured = homeHighlights.flatMap((highlight) => {
    const project = getProjectBySlug(highlight.slug);
    return project ? [{ project, task: highlight.task }] : [];
  });

  return (
    <>
      <section aria-labelledby="destaques-title" className="border-y border-line bg-sand/60 py-20 sm:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="destaques-title" eyebrow="Em destaque" title="Três jeitos de um site trabalhar por você">
              <p>
                Agendar, pedir e encontrar: três projetos conceituais, com negócios fictícios, em que o fluxo principal
                pode ser testado na demonstração, no computador e no celular.
              </p>
            </SectionHeading>
            <Link href="/projetos" className="btn btn-secondary shrink-0 self-start md:self-auto">
              Ver todos os {projects.length} projetos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <ul className="mt-12 space-y-8">
            {featured.map(({ project, task }, index) => (
              <li key={project.slug}>
                <Spotlight project={project} index={index} task={task} />
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-[2rem] border border-line bg-canvas p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-xl text-lg leading-relaxed">
              <strong className="font-display text-xl font-extrabold">
                Mais {projects.length - featured.length} projetos no catálogo.
              </strong>{" "}
              Clínica, oficina, advocacia, academia e outros, cada um com o próprio fluxo para testar.
            </p>
            <Link href="/projetos" className="btn btn-primary shrink-0">
              Ver o catálogo completo
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
