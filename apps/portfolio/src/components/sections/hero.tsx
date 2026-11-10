import { ArrowRight, CalendarCheck, MessageCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { ShowcaseMarquee, type ShowcaseItem } from "@/components/sections/showcase-marquee";
import { getCategoryLabel } from "@/data/categories";
import { hero } from "@/data/home";
import { quoteHref } from "@/data/navigation";
import { getCaseUrl, projects } from "@/data/projects";

export function Hero() {
  const items: ShowcaseItem[] = projects.flatMap((project) => {
    const cover = project.media[0];
    if (!cover || cover.kind !== "screenshot") return [];
    return [
      {
        slug: project.slug,
        name: project.name,
        category: getCategoryLabel(project.categoryId),
        href: getCaseUrl(project.slug),
        src: cover.src,
        width: cover.width,
        height: cover.height,
      },
    ];
  });

  const facts = [
    { icon: Smartphone, label: "Pensado primeiro para o celular" },
    { icon: CalendarCheck, label: "Agendamentos, pedidos e orçamentos" },
    { icon: MessageCircle, label: "Contato direto pelo WhatsApp" },
  ];

  return (
    <section aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-ink text-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_28rem_at_15%_-10%,color-mix(in_srgb,var(--color-accent)_55%,transparent),transparent_70%),radial-gradient(40rem_24rem_at_95%_10%,rgb(122_92_255_/_0.35),transparent_70%)]"
      />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />

      <div className="container-page relative pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <p className="rise-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-canvas backdrop-blur">
          <span aria-hidden className="size-2 rounded-full bg-accent-on-dark shadow-[0_0_0_4px_rgb(143_166_255_/_0.25)]" />
          {projects.length} projetos com demonstração para explorar
        </p>
        <h1
          id="hero-title"
          style={{ "--i": 1 } as React.CSSProperties}
          className="rise-in mx-auto mt-6 max-w-4xl text-[2.625rem] leading-[1.03] font-extrabold tracking-tight sm:text-7xl lg:text-[5.25rem]"
        >
          {hero.titleStart} <span className="text-gradient">{hero.titleHighlight}</span> {hero.titleEnd}
        </h1>
        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="rise-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-on-dark sm:text-xl"
        >
          {hero.subtitle}
        </p>
        <div style={{ "--i": 3 } as React.CSSProperties} className="rise-in mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/projetos" className="btn btn-primary btn-lg">
            Ver projetos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link href={quoteHref} className="btn btn-secondary btn-lg">
            Solicitar orçamento
          </Link>
        </div>
        <ul
          style={{ "--i": 4 } as React.CSSProperties}
          className="rise-in mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-on-dark sm:flex-row"
        >
          {facts.map((fact) => (
            <li key={fact.label} className="inline-flex items-center gap-2">
              <fact.icon aria-hidden className="size-4 text-accent-on-dark" />
              {fact.label}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ "--i": 5 } as React.CSSProperties} className="rise-in relative pb-10">
        <ShowcaseMarquee items={items} />
      </div>
    </section>
  );
}
