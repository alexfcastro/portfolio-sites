import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Foto, temFoto } from "@/components/foto";
import { areas, articles, getArea, team } from "@/data/firm";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy text-white">
        {temFoto("hero") && (
          <>
            <Foto id="hero" preload sizes="100vw" className="absolute inset-0 -z-20 size-full" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
          </>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(44rem_26rem_at_95%_0%,rgb(184_155_94/0.22),transparent_70%)]"
        />
        <div className="wrap relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.25fr_1fr]">
         <div>
          <p className="kicker !text-brass">Escritório de advocacia</p>
          <h1 id="hero-title" className="mt-5 max-w-3xl text-4xl leading-tight font-medium sm:text-6xl">
            Orientação jurídica clara, com atenção a cada caso.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Explicamos as possibilidades de forma direta, para que você decida com informação. O primeiro passo é uma
            conversa inicial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contato" className="btn bg-brass text-navy hover:bg-white">
              Agendar conversa inicial
            </Link>
            <Link href="#areas" className="btn border border-white/40 hover:border-white">
              Áreas de atuação
            </Link>
          </div>
         </div>
         <div className="relative border border-brass/40 bg-navy-2/70 p-7 sm:p-9">
            <div aria-hidden className="absolute -top-px left-8 h-px w-24 bg-brass" />
            <h2 className="text-3xl">Como começa</h2>
            <ol className="mt-6 space-y-5">
              {[
                { title: "Você conta o caso", text: "Pelo formulário, com a área e um resumo do que aconteceu." },
                { title: "Conversa inicial", text: "Entendemos o contexto e quais documentos ajudam." },
                { title: "Orientação", text: "Explicamos os caminhos possíveis, em linguagem direta." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span aria-hidden className="font-serif text-3xl leading-none text-brass">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl">{step.title}</h3>
                    <p className="mt-1 text-white/80">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
         </div>
        </div>
      </section>

      <section id="areas" aria-labelledby="areas-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Atuação</p>
        <h2 id="areas-title" className="mt-3 text-4xl">
          Áreas de atuação
        </h2>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.slug} className="bg-paper">
              <Link href={`/areas/${area.slug}`} className="group flex h-full flex-col border-l-2 border-transparent p-6 hover:border-brass">
                <h3 className="text-2xl">{area.name}</h3>
                <p className="mt-2 flex-1 text-muted">{area.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brass-text">
                  Saiba mais <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="equipe" aria-labelledby="equipe-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="wrap">
          <p className="kicker">Equipe</p>
          <h2 id="equipe-title" className="mt-3 text-4xl">
            Quem atende
          </h2>
          <p className="mt-3 text-muted">Profissionais fictícios; registros profissionais não são exibidos.</p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <li key={member.name} className="border-t border-brass pt-5">
                {temFoto(`equipe-${member.id}`) && (
                  <Foto
                    id={`equipe-${member.id}`}
                    sizes="(min-width: 768px) 360px, 100vw"
                    className="mb-5 aspect-[4/5] w-full object-top"
                  />
                )}
                <h3 className="text-2xl">{member.name}</h3>
                <p className="text-sm font-semibold tracking-wider text-brass-text uppercase">{member.role}</p>
                <p className="mt-3 text-muted">{member.bio}</p>
                <p className="mt-3 text-sm">{member.areas.map((slug) => getArea(slug)?.name).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="artigos" aria-labelledby="artigos-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Conteúdo</p>
        <h2 id="artigos-title" className="mt-3 text-4xl">
          Artigos informativos
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/artigos/${article.slug}`} className="group block h-full border border-line bg-paper hover:border-navy">
                {temFoto(`artigo-${article.slug}`) && (
                  <Foto id={`artigo-${article.slug}`} sizes="(min-width: 768px) 380px, 100vw" className="aspect-[16/9] w-full" />
                )}
                <div className="p-6">
                <p className="kicker">{getArea(article.areaSlug)?.name}</p>
                <h3 className="mt-3 text-2xl group-hover:underline">{article.title}</h3>
                <p className="mt-2 text-muted">{article.summary}</p>
                <p className="mt-4 text-sm text-muted">{article.readingMinutes} min de leitura</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
