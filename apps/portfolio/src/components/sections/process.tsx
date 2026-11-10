import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/home";

export function Process() {
  return (
    <section aria-labelledby="como-funciona" className="on-dark relative overflow-hidden bg-ink py-20 text-canvas sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_22rem_at_100%_0%,color-mix(in_srgb,var(--color-accent)_30%,transparent),transparent_70%)]"
      />
      <div className="container-page relative">
        <SectionHeading id="como-funciona" eyebrow="Como funciona" title="Do problema ao site pronto">
          <p className="text-muted-on-dark">
            Um processo simples, com você acompanhando cada etapa e decidindo o que entra na primeira versão.
          </p>
        </SectionHeading>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="reveal rounded-card border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-accent-on-dark/50 hover:bg-white/[0.07]"
            >
              <span aria-hidden className="text-gradient font-display text-4xl font-extrabold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold">
                <span className="sr-only">Etapa {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-on-dark">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
