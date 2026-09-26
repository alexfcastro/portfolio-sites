import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/home";

export function Process() {
  return (
    <section aria-labelledby="como-funciona" className="on-dark bg-ink py-20 text-canvas sm:py-24">
      <div className="container-page">
        <SectionHeading id="como-funciona" eyebrow="Como funciona" title="Do problema ao site pronto">
          <p className="text-muted-on-dark">
            Um processo simples, com você acompanhando cada etapa e decidindo o que entra na primeira versão.
          </p>
        </SectionHeading>

        <ol className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative md:pt-8">
              <div aria-hidden className="absolute top-3 right-0 left-12 hidden h-px bg-ink-line md:block" />
              <span className="font-display text-sm font-bold text-accent-on-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-on-dark">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
