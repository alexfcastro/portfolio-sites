import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getConfiguredDemoUrl } from "@/config/demos";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/data/categories";
import { getProjectTheme } from "@/data/project-themes";
import { getCaseUrl, getFeaturedProjects, projects } from "@/data/projects";
import { resolveDemoPresentation } from "@/lib/demo";
import type { Project } from "@/types/project";

/** Painel de destaque: o projeto aparece com as cores do próprio negócio, no computador e no celular. */
function Spotlight({ project, index }: { project: Project; index: number }) {
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
      className="reveal group relative grid items-center gap-10 overflow-hidden rounded-[2rem] p-7 shadow-raised sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14"
    >
      <div className={flipped ? "lg:order-2" : ""}>
        <p style={{ color: theme.accent }} className="text-sm font-semibold tracking-[0.12em] uppercase">
          {String(index + 1).padStart(2, "0")} · {getCategoryLabel(project.categoryId)}
        </p>
        <h3 className="mt-3 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl">{project.name}</h3>
        <p style={{ color: theme.muted }} className="mt-5 max-w-md text-lg leading-relaxed">
          {project.summary}
        </p>
        <p style={{ color: theme.muted }} className="mt-3 text-sm">
          Projeto conceitual, com negócio fictício.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
  const featured = getFeaturedProjects();

  return (
    <>
      <section aria-labelledby="destaques-title" className="border-y border-line bg-sand/60 py-20 sm:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="destaques-title" eyebrow="Projetos" title="Cada negócio com a sua cara">
              <p>
                Projetos conceituais com negócios fictícios. Cada um tem identidade, cores e fluxo próprios, pensados
                para o segmento, e funciona de verdade na demonstração, no computador e no celular.
              </p>
            </SectionHeading>
            <Link href="/projetos" className="btn btn-secondary shrink-0 self-start md:self-auto">
              Ver todos os {projects.length} projetos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <ul className="mt-12 space-y-8">
            {featured.map((project, index) => (
              <li key={project.slug}>
                <Spotlight project={project} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="indice-title" className="bg-paper py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading id="indice-title" eyebrow="Índice" title={`Os ${projects.length} projetos, lado a lado`}>
            <p>Passe o mouse para ver a página inicial de cada um; clique para abrir o projeto.</p>
          </SectionHeading>

          <ul className="mt-10 border-t border-line">
            {projects.map((project, index) => {
              const cover = project.media[0];
              return (
                <li key={project.slug} className="reveal">
                  <Link
                    href={getCaseUrl(project.slug)}
                    className="group relative flex min-h-16 items-center gap-4 border-b border-line py-4 transition-colors hover:bg-canvas sm:gap-8 sm:py-6"
                  >
                    <span className="w-8 shrink-0 font-display text-sm font-bold text-muted tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl leading-tight font-extrabold tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">
                      {project.name}
                    </span>
                    <span className="ml-auto hidden text-muted sm:block">{getCategoryLabel(project.categoryId)}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1 max-sm:ml-auto"
                    />
                    {cover && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-40 z-10 hidden w-72 -translate-y-1/2 scale-95 rotate-2 overflow-hidden rounded-xl opacity-0 shadow-raised ring-1 ring-black/10 transition duration-300 group-hover:scale-100 group-hover:opacity-100 lg:block"
                      >
                        <Image src={cover.src} alt="" width={cover.width} height={cover.height} sizes="288px" className="h-auto w-full" />
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
