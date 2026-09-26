import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/data/home";

export function Benefits() {
  return (
    <section aria-labelledby="beneficios-title" className="border-y border-line bg-paper py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id="beneficios-title" eyebrow="Por que ter um site" title="Mais do que um site bonito">
          <p>
            Um bom site ajuda no dia a dia: responde dúvidas antes do contato, organiza pedidos e mostra com clareza o
            que o seu negócio oferece.
          </p>
        </SectionHeading>

        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name={benefit.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{benefit.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{benefit.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
