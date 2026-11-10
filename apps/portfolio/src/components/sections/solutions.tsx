import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { solutions } from "@/data/home";

export function Solutions() {
  return (
    <section aria-labelledby="solucoes" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="solucoes" eyebrow="Soluções e serviços" title="O que posso desenvolver para o seu negócio">
          <p>
            Cada projeto combina apenas os recursos de que o negócio precisa. Nem tudo precisa estar na primeira
            versão: o site pode começar simples e crescer com o tempo.
          </p>
        </SectionHeading>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution) => (
            <li
              key={solution.title}
              className="reveal card-lift group rounded-card border border-line bg-paper p-6 shadow-card"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name={solution.icon} className="size-5" />
              </span>
              <h3 className="mt-5 font-bold">{solution.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{solution.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
