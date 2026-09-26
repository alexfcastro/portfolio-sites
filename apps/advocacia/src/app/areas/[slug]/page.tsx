import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, articles, getArea, team } from "@/data/firm";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps<"/areas/[slug]">): Promise<Metadata> {
  const area = getArea((await params).slug);
  return area ? { title: area.name, description: area.summary } : {};
}

export default async function AreaPage({ params }: PageProps<"/areas/[slug]">) {
  const area = getArea((await params).slug);
  if (!area) notFound();
  const members = team.filter((member) => member.areas.includes(area.slug));
  const related = articles.filter((article) => article.areaSlug === area.slug);

  return (
    <article className="wrap py-12 sm:py-16">
      <Link href="/#areas" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-text">
        <ArrowLeft aria-hidden className="size-4" /> Todas as áreas
      </Link>
      <p className="kicker mt-6">Área de atuação</p>
      <h1 className="mt-3 text-5xl">{area.name}</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="reading max-w-2xl text-lg leading-relaxed text-muted">
          {area.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2 className="!mt-10 text-3xl text-ink">Temas frequentes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {area.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <p className="!mt-10 border-l-2 border-brass pl-4 text-base">
            Conteúdo informativo. Cada situação depende de análise individual.
          </p>
        </div>
        <aside className="space-y-6">
          <div className="border border-line bg-paper p-6">
            <h2 className="text-2xl">Quem atende</h2>
            <ul className="mt-3 space-y-2">
              {members.map((member) => (
                <li key={member.name}>
                  <span className="font-semibold">{member.name}</span> <span className="text-muted">· {member.role}</span>
                </li>
              ))}
            </ul>
          </div>
          {related.length > 0 && (
            <div className="border border-line bg-paper p-6">
              <h2 className="text-2xl">Leia também</h2>
              <ul className="mt-3 space-y-2">
                {related.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/artigos/${article.slug}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href={`/contato?area=${area.slug}`} className="btn btn-primary w-full">
            Agendar conversa inicial
          </Link>
        </aside>
      </div>
    </article>
  );
}
