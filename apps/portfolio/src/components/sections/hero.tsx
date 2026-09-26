import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { hero } from "@/data/home";
import { quoteHref } from "@/data/navigation";
import { getProjectBySlug } from "@/data/projects";

const showcase = ["barbearia", "floricultura", "imobiliaria"] as const;

export function Hero() {
  const covers = showcase
    .map((slug) => getProjectBySlug(slug))
    .flatMap((project) => (project?.media[0] ? [{ name: project.name, media: project.media[0] }] : []));

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-accent-soft),transparent_70%)]"
      />
      <div className="container-page relative grid items-center gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-24">
        <div>
          <p className="eyebrow">Alex Castro · Sites e Soluções Digitais</p>
          <h1 id="hero-title" className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/projetos" className="btn btn-primary">
              Ver projetos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href={quoteHref} className="btn btn-secondary">
              Solicitar orçamento
            </Link>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[16/12]">
            {covers.map((cover, index) => (
              <div
                key={cover.name}
                className={[
                  "absolute w-[78%] overflow-hidden rounded-2xl border border-line bg-paper shadow-raised",
                  index === 0 && "top-0 left-0 z-10 -rotate-2",
                  index === 1 && "top-[18%] right-0 z-20 rotate-2",
                  index === 2 && "bottom-0 left-[8%] z-30 -rotate-1",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Image
                  src={cover.media.src}
                  alt=""
                  width={cover.media.width}
                  height={cover.media.height}
                  sizes="(min-width: 1024px) 460px, 78vw"
                  preload={index === 0}
                  // Estão na primeira dobra: não esperam o carregamento sob demanda.
                  loading={index === 0 ? undefined : "eager"}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
          <figcaption className="mt-5 text-center text-sm text-muted lg:text-right">
            Prévias conceituais de três dos doze projetos: {covers.map((cover) => cover.name).join(", ")}.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
