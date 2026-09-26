import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArea, getArticle } from "@/data/firm";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artigos/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title, description: article.summary } : {};
}

export default async function ArticlePage({ params }: PageProps<"/artigos/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const area = getArea(article.areaSlug);

  return (
    <article className="wrap max-w-3xl py-12 sm:py-16">
      <Link href="/#artigos" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-text">
        <ArrowLeft aria-hidden className="size-4" /> Todos os artigos
      </Link>
      <p className="kicker mt-6">{area?.name}</p>
      <h1 className="mt-3 text-5xl leading-tight">{article.title}</h1>
      <p className="mt-3 text-muted">{article.readingMinutes} min de leitura · texto de exemplo</p>
      <div className="reading mt-10 text-lg leading-relaxed">
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-10 border-l-2 border-brass pl-4 text-muted">
        Este artigo é informativo e não constitui orientação para um caso específico.
      </p>
      {area && (
        <Link href={`/areas/${area.slug}`} className="btn btn-secondary mt-8">
          Ver a área de {area.name}
        </Link>
      )}
    </article>
  );
}
