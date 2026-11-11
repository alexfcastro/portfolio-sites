import { ArrowLeft, ArrowRight, CircleDashed, CircleCheck, ExternalLink as ExternalIcon, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover } from "@/components/projects/project-cover";
import { ConceptBadge, DemoStatusBadge } from "@/components/projects/status-badges";
import { getConfiguredDemoUrl } from "@/config/demos";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/data/categories";
import { getCaseUrl, getProjectBySlug, projects } from "@/data/projects";
import { demoStatusDescriptions, resolveDemoPresentation } from "@/lib/demo";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return pageMetadata({ title: project.seo.title, description: project.seo.description, path: getCaseUrl(slug) });
}

export default async function ProjectCasePage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const demo = resolveDemoPresentation(project.demoStatus, getConfiguredDemoUrl(project.slug), siteConfig.deployEnv);
  const hasImplemented = project.features.some((feature) => feature.status === "implemented");
  const allPlanned = project.features.every((feature) => feature.status === "planned");
  const [cover, ...screens] = project.media;

  return (
    <article>
      <div className="container-page pt-8 sm:pt-10">
        <nav aria-label="Trilha de navegação" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/projetos" className="inline-flex min-h-11 items-center hover:text-ink">
                Projetos
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-ink">
              {project.name}
            </li>
          </ol>
        </nav>
      </div>

      <header className="container-page grid gap-10 pt-4 pb-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <p className="eyebrow">{getCategoryLabel(project.categoryId)}</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">{project.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <ConceptBadge />
            <DemoStatusBadge status={demo.state} href={demo.link} />
          </div>
          <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{project.summary}</p>
          <p className="mt-4 text-sm text-muted">
            <span className="font-semibold text-ink">Para quem: </span>
            {project.audience}
          </p>
          <div className="mt-6 flex gap-3 rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-muted">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <p>
              <strong className="text-ink">{project.name}</strong> é um negócio fictício. Este é um projeto conceitual,
              criado para demonstrar uma solução para o segmento — não um trabalho feito para um cliente.
            </p>
          </div>
        </div>

        {cover && (
          <figure>
            {demo.link ? (
              // Com a demo publicada, a captura principal também abre a demonstração.
              <a
                href={demo.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir a demonstração de ${project.name} (abre em nova aba)`}
                className="group relative block rounded-card"
              >
                <div className="browser-frame shadow-raised transition-shadow group-hover:ring-2 group-hover:ring-accent/40">
                  <div aria-hidden className="browser-bar">
                    <i />
                    <i />
                    <i />
                    <span className="ml-2 truncate text-xs font-medium text-muted">{project.name}</span>
                  </div>
                  <ProjectCover
                    media={cover}
                    preload
                    hideScreenshotLabel
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="[&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105"
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-raised transition-colors group-hover:bg-accent-strong"
                >
                  Abrir demonstração
                  <ExternalIcon className="size-3.5" />
                </span>
              </a>
            ) : (
              <div className="browser-frame shadow-raised">
                <ProjectCover media={cover} preload hideScreenshotLabel sizes="(min-width: 1024px) 640px, 100vw" />
              </div>
            )}
            <figcaption className="mt-3 text-sm text-muted">{cover.caption}</figcaption>
          </figure>
        )}
      </header>

      <div className="border-t border-line bg-paper">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:gap-16">
          <section aria-labelledby="problema">
            <h2 id="problema" className="text-2xl font-extrabold sm:text-3xl">
              O problema comum do segmento
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{project.problem}</p>
          </section>
          <section aria-labelledby="solucao">
            <h2 id="solucao" className="text-2xl font-extrabold sm:text-3xl">
              {hasImplemented ? "Solução desenvolvida na demonstração" : "Solução proposta"}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{project.solution}</p>
          </section>
        </div>
      </div>

      <section aria-labelledby="fluxo" className="container-page py-16">
        <h2 id="fluxo" className="text-2xl font-extrabold sm:text-3xl">
          Fluxo principal
        </h2>
        <p className="mt-3 max-w-2xl text-muted">O caminho que o cliente percorre no site, do primeiro clique ao resumo.</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {project.flow.map((step, stepIndex) => (
            <li key={step.title} className="reveal card-lift rounded-card border border-line bg-paper p-5 shadow-card">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#7a5cff] font-display text-sm font-bold text-white">
                {stepIndex + 1}
              </span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {screens.length > 0 && (
        <section aria-labelledby="telas" className="container-page pb-16">
          <h2 id="telas" className="text-2xl font-extrabold sm:text-3xl">
            Telas da demonstração
          </h2>
          <p className="mt-3 max-w-2xl text-muted">Capturas reais da demo, com a agenda e os dados fictícios dela.</p>
          <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_16rem] lg:grid-cols-[1fr_18rem]">
            {screens.map((media) => {
              const portrait = media.height > media.width;
              return (
                <figure key={media.src} className={`reveal group ${portrait ? "mx-auto w-full max-w-72 md:row-span-2" : ""}`}>
                  <ProjectCover
                    media={media}
                    sizes={portrait ? "288px" : "(min-width: 1024px) 800px, 100vw"}
                    className={`border border-line shadow-card transition-shadow duration-500 group-hover:shadow-raised [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105 ${portrait ? "rounded-[1.75rem]" : "rounded-card"}`}
                  />
                  <figcaption className="mt-3 text-sm text-muted">{media.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="funcionalidades" className="border-y border-line bg-sand/60">
        <div className="container-page py-16">
          <h2 id="funcionalidades" className="text-2xl font-extrabold sm:text-3xl">
            {allPlanned ? "Funcionalidades previstas" : "Funcionalidades"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {allPlanned
              ? "Recursos planejados para a demonstração deste projeto. Nenhum deles está implementado ainda."
              : "Recursos implementados na demonstração e recursos ainda previstos."}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature) => (
              <li key={feature.title} className="reveal rounded-card border border-line bg-paper p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">{feature.title}</h3>
                  {feature.status === "implemented" ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
                      <CircleCheck aria-hidden className="size-3.5" /> Implementado
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-muted">
                      <CircleDashed aria-hidden className="size-3.5" /> Previsto
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="demonstracao" className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-card border border-line bg-paper p-6 sm:p-8">
            <h2 id="demonstracao" className="text-xl font-extrabold">
              Demonstração
            </h2>
            <div className="mt-3">
              <DemoStatusBadge status={demo.state} href={demo.link} />
            </div>
            <p className="mt-4 leading-relaxed text-muted">{demoStatusDescriptions[demo.state]}</p>
            {project.technologies.length > 0 && (
              <p className="mt-3 text-sm text-muted">
                <span className="font-semibold text-ink">Feita com: </span>
                {project.technologies.join(", ")}
              </p>
            )}
            {demo.link && (
              <a
                href={demo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary mt-6"
              >
                Abrir demonstração
                <ExternalIcon aria-hidden className="size-4" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
          </div>

          <div className="on-dark relative flex flex-col justify-between overflow-hidden rounded-card bg-ink p-6 text-canvas shadow-raised sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(26rem_16rem_at_100%_0%,color-mix(in_srgb,var(--color-accent)_50%,transparent),transparent_70%)]"
            />
            <div className="relative">
              <h2 className="text-2xl font-extrabold">Quer algo parecido para o seu negócio?</h2>
              <p className="mt-3 leading-relaxed text-muted-on-dark">
                A proposta pode ser adaptada ao seu segmento, ao seu fluxo de atendimento e ao que realmente faz sentido
                na primeira versão.
              </p>
            </div>
            <Link href={`/contato?projeto=${project.slug}`} className="btn btn-primary relative mt-6 self-start">
              Quero uma solução como esta
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {previous && next && (
        <nav aria-label="Outros projetos" className="border-t border-line">
          <div className="container-page grid gap-4 py-10 sm:grid-cols-2">
            <Link
              href={getCaseUrl(previous.slug)}
              className="group flex min-h-11 flex-col rounded-card border border-line bg-paper p-5 transition-colors hover:border-accent"
            >
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <ArrowLeft aria-hidden className="size-4" /> Projeto anterior
              </span>
              <span className="mt-1 font-bold">{previous.name}</span>
            </Link>
            <Link
              href={getCaseUrl(next.slug)}
              className="group flex min-h-11 flex-col rounded-card border border-line bg-paper p-5 text-right transition-colors hover:border-accent"
            >
              <span className="inline-flex items-center justify-end gap-1.5 text-sm text-muted">
                Próximo projeto <ArrowRight aria-hidden className="size-4" />
              </span>
              <span className="mt-1 font-bold">{next.name}</span>
            </Link>
          </div>
        </nav>
      )}
    </article>
  );
}
