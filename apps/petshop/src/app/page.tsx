import { CalendarCheck, Clock, PawPrint, Scissors } from "lucide-react";
import Link from "next/link";
import { PetArt, type Palette, type PetKind } from "@/components/pet-art";
import { faq, groomers, packages, services, sizeHints, sizeLabels, speciesLabels, type Size } from "@/data/petshop";
import { durationFor } from "@/lib/booking";
import { formatBRL } from "@/lib/money";

const sizes: Size[] = ["pequeno", "medio", "grande"];

const steps = [
  { icon: PawPrint, title: "Pet", text: "Nome, espécie e porte." },
  { icon: Scissors, title: "Serviço", text: "Só aparecem os serviços para a espécie; preço e tempo pelo porte." },
  { icon: Clock, title: "Data e horário", text: "Horários livres que comportam a duração do serviço." },
  { icon: CalendarCheck, title: "Resumo", text: "Confira tudo e veja o lembrete que seria preparado." },
];

const gallery: Array<{ kind: PetKind; palette: Palette; accessory: "laco" | "bandana" | "nenhum"; caption: string }> = [
  { kind: "cao", palette: "caramelo", accessory: "bandana", caption: "Banho e tosa higiênica" },
  { kind: "gato", palette: "cinza", accessory: "laco", caption: "Banho com hidratação" },
  { kind: "cao", palette: "creme", accessory: "laco", caption: "Tosa na tesoura" },
  { kind: "gato", palette: "preto", accessory: "nenhum", caption: "Banho tranquilo" },
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="kicker">Pet shop · banho e tosa</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Banho e tosa com hora marcada, do jeito do seu pet</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Informe o porte e veja na hora quanto tempo leva e quanto custa. Escolha o profissional e um horário livre.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/agendar" className="btn btn-primary">
                Agendar agora
              </Link>
              <Link href="#servicos" className="btn btn-secondary">
                Ver serviços e preços
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-[2rem] border-4 border-paper shadow-xl">
              <PetArt kind="cao" palette="caramelo" accessory="bandana" sizes="(min-width: 768px) 448px, 90vw" preload className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-6 -left-4 w-36 overflow-hidden rounded-3xl border-4 border-paper shadow-lg sm:w-44">
              <PetArt kind="gato" palette="cinza" accessory="laco" sizes="176px" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="border-y border-line bg-paper">
        <div className="wrap py-14">
          <h2 id="como-funciona" className="text-3xl">Agendar leva quatro passos</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-card bg-cream p-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-coral text-white">
                  <step.icon aria-hidden className="size-5" />
                </span>
                <p className="mt-4 font-extrabold">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="servicos" aria-labelledby="servicos-title" className="wrap py-16">
        <p className="kicker">Serviços</p>
        <h2 id="servicos-title" className="mt-2 text-3xl">Preço e tempo pelo porte</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Porte pequeno: {sizeHints.pequeno}; médio: {sizeHints.medio}; grande: {sizeHints.grande}. Valores de exemplo.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="rounded-card border-2 border-line bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-xl">{service.name}</h3>
                <p className="rounded-full bg-coral-soft px-3 py-1 text-xs font-bold text-coral-dark">
                  {service.species.map((s) => speciesLabels[s]).join(" e ")}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Preço e duração de {service.name} por porte</caption>
                <thead>
                  <tr className="text-left text-muted">
                    <th scope="col" className="py-1 font-bold">
                      Porte
                    </th>
                    <th scope="col" className="py-1 font-bold">
                      Tempo
                    </th>
                    <th scope="col" className="py-1 text-right font-bold">
                      Preço
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size) => (
                    <tr key={size} className="border-t border-line">
                      <th scope="row" className="py-2 text-left font-bold">
                        {sizeLabels[size]}
                      </th>
                      <td className="py-2">{durationFor(service, size)} min</td>
                      <td className="py-2 text-right font-bold whitespace-nowrap">{formatBRL(service.priceCents[size])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="equipe-title" className="bg-coral-soft">
        <div className="wrap grid gap-8 py-14 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <p className="kicker">Equipe</p>
            <h2 id="equipe-title" className="mt-2 text-3xl">Quem cuida do seu pet</h2>
            <p className="mt-3 text-muted">Profissionais fictícios desta demonstração.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {groomers.map((groomer, index) => (
              <li key={groomer.id} className="flex items-center gap-4 rounded-card bg-paper p-5">
                <span
                  aria-hidden
                  className={`flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-extrabold text-white ${index === 0 ? "bg-coral" : "bg-leaf"}`}
                >
                  {groomer.name[0]}
                </span>
                <span>
                  <span className="block text-lg font-extrabold">{groomer.name}</span>
                  <span className="text-sm text-muted">{groomer.specialty}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pacotes" aria-labelledby="pacotes-title" className="wrap py-16">
        <p className="kicker">Pacotes</p>
        <h2 id="pacotes-title" className="mt-2 text-3xl">Para quem vem todo mês</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {packages.map((item) => (
            <li key={item.name} className="rounded-card border-2 border-line bg-paper p-6">
              <p className="text-xl font-extrabold">{item.name}</p>
              <p className="mt-1 text-muted">{item.detail}</p>
              <p className="mt-4 inline-block rounded-full bg-sun/30 px-3 py-1 text-sm font-bold">{item.discount}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Nesta demonstração, os pacotes são só informativos: o agendamento é sempre avulso.
        </p>
      </section>

      <section id="galeria" aria-labelledby="galeria-title" className="border-y border-line bg-paper">
        <div className="wrap py-16">
          <p className="kicker">Galeria</p>
          <h2 id="galeria-title" className="mt-2 text-3xl">Depois do banho</h2>
          <p className="mt-3 text-muted">Fotos ilustrativas geradas por IA, não são clientes reais.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {gallery.map((item) => (
              <li key={item.caption}>
                <figure className="overflow-hidden rounded-card border-2 border-line">
                  <PetArt kind={item.kind} palette={item.palette} accessory={item.accessory} className="h-auto w-full" />
                  <figcaption className="px-4 py-3 text-sm font-bold">{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap py-16">
        <h2 id="faq-title" className="text-3xl">Perguntas frequentes</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="rounded-2xl border-2 border-line bg-paper px-5 py-4">
              <summary className="cursor-pointer font-bold">{item.q}</summary>
              <p className="mt-2 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start gap-4 rounded-card bg-coral p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-extrabold">Pronto para marcar?</p>
          <Link href="/agendar" className="btn bg-paper text-ink hover:bg-cream">
            Agendar banho ou tosa
          </Link>
        </div>
      </section>
    </>
  );
}
