import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/data/home";

export function Benefits() {
  return (
    <section aria-labelledby="beneficios-title" className="bg-paper py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="beneficios-title" eyebrow="Por que ter um site" title="Mais do que um site bonito">
          <p>
            Um bom site ajuda no dia a dia: responde dúvidas antes do contato, organiza pedidos e mostra com clareza o
            que o seu negócio oferece.
          </p>
        </SectionHeading>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <li
              key={benefit.title}
              className="reveal card-lift relative overflow-hidden rounded-card border border-line bg-canvas p-6 sm:p-7"
            >
              <span aria-hidden className="absolute top-4 right-5 font-display text-5xl font-extrabold text-ink/[0.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-[#7a5cff] text-white shadow-[0_10px_24px_-10px_var(--color-accent)]">
                <Icon name={benefit.icon} className="size-5" />
              </span>
              <h3 className="mt-6 text-lg leading-snug font-bold">{benefit.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{benefit.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
