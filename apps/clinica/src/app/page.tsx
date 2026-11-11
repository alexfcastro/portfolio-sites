import { ArrowRight, CalendarCheck, CheckCircle2, ClipboardList, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Foto, Retrato, temFoto } from "@/components/foto";
import { HeroArt, IllustrativeMap } from "@/components/illustrations";
import { MessagePreview } from "@/components/message-preview";
import { faq, getSpecialty, professionals, specialties } from "@/data/clinic";
import { describeSchedule } from "@/lib/schedule-text";

const steps = [
  { icon: ClipboardList, title: "Você solicita", text: "Escolhe especialidade, profissional e a preferência de dia e período." },
  { icon: PhoneCall, title: "A recepção confirma", text: "A equipe retorna com o horário exato. Nesta demo, a confirmação é simulada." },
  { icon: CalendarCheck, title: "Você comparece", text: "Com as orientações de preparo da especialidade em mãos." },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="overflow-hidden">
        <div className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="kicker">Clínica multiprofissional</p>
            <h1 id="hero-title" className="mt-4 text-4xl leading-[1.1] sm:text-6xl">
              Cuidado com hora marcada e informação clara.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Conheça as especialidades, veja quem atende e solicite um horário em poucos passos. A recepção confirma com
              você.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar" className="btn btn-primary">
                Solicitar horário
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="#especialidades" className="btn btn-secondary">
                Ver especialidades
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <HeroArt />
          </div>
        </div>
      </section>

      <section id="especialidades" aria-labelledby="esp-title" className="border-y border-line bg-paper py-20">
        <div className="wrap">
          <p className="kicker">Especialidades</p>
          <h2 id="esp-title" className="mt-3 text-3xl sm:text-4xl">
            O que você procura?
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <li key={specialty.id}>
                <Link
                  href={`/especialidades/${specialty.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-mist transition-colors hover:border-teal"
                >
                  {temFoto(`esp-${specialty.id}`) && (
                    <span className="block overflow-hidden">
                      <Foto
                        id={`esp-${specialty.id}`}
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl">{specialty.name}</h3>
                  <p className="mt-2 flex-1 text-muted">{specialty.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-teal">
                    Saiba mais
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="equipe" aria-labelledby="equipe-title" className="wrap py-20">
        <p className="kicker">Equipe</p>
        <h2 id="equipe-title" className="mt-3 text-3xl sm:text-4xl">
          Quem atende
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Profissionais fictícios, criados para esta demonstração. Por isso, registros profissionais não são exibidos.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional) => (
            <li key={professional.id} className="rounded-card border border-line bg-paper p-6">
              <Retrato
                id={`equipe-${professional.id}`}
                inicial={professional.name.replace(/^Dra?\.\s/, "").slice(0, 1)}
                className="size-20"
                fallback="bg-teal-soft font-serif text-2xl text-teal"
              />
              <h3 className="mt-4 text-lg">{professional.name}</h3>
              <p className="text-sm font-semibold text-teal">{getSpecialty(professional.specialtyId)?.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{professional.approach}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">Atende:</span> {describeSchedule(professional)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="atendimento" aria-labelledby="atend-title" className="border-y border-line bg-paper py-20">
        <div className="wrap">
          <p className="kicker">Atendimento</p>
          <h2 id="atend-title" className="mt-3 text-3xl sm:text-4xl">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-card bg-mist p-6">
                <Icon aria-hidden className="size-6 text-teal" />
                <h3 className="mt-4 text-lg">
                  {index + 1}. {title}
                </h3>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-card border border-line p-6">
              <h3 className="text-lg">Horários de atendimento</h3>
              <p className="mt-2 text-muted">
                Segunda a sexta, manhã (8h às 12h) e tarde (13h às 18h). Sábado pela manhã, conforme o profissional.
              </p>
            </div>
            <div className="rounded-card border border-line p-6">
              <h3 className="text-lg">Particular ou convênio</h3>
              <p className="mt-2 text-muted">
                Você indica a forma de atendimento ao solicitar. Em um site real, aqui estaria a lista de convênios
                aceitos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" aria-labelledby="duvidas-title" className="wrap py-20">
        <p className="kicker">Dúvidas</p>
        <h2 id="duvidas-title" className="mt-3 text-3xl sm:text-4xl">
          Perguntas frequentes
        </h2>
        <div className="mt-8 max-w-3xl divide-y divide-line rounded-card border border-line bg-paper">
          {faq.map((item) => (
            <details key={item.question} className="group px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
                <span aria-hidden className="text-xl text-teal transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="visite-title" className="border-t border-line bg-paper py-20">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="kicker">Visite</p>
            <h2 id="visite-title" className="mt-3 text-3xl sm:text-4xl">
              Fale com a recepção
            </h2>
            <ul className="mt-6 space-y-2 text-muted">
              {["Sem dados de saúde no formulário", "Confirmação feita pela equipe", "Orientações de preparo por especialidade"].map(
                (item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar" className="btn btn-primary">
                Solicitar horário
              </Link>
              <MessagePreview
                businessName="Vita Clínica"
                message="Olá, Vita Clínica! Gostaria de saber mais sobre o atendimento."
                triggerLabel="Prévia do WhatsApp"
              />
            </div>
          </div>
          <figure>
            <div className="overflow-hidden rounded-card border border-line">
              <IllustrativeMap />
            </div>
            <figcaption className="mt-3 flex items-start gap-2 text-sm text-muted">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-teal" />
              Localização ilustrativa. A Vita Clínica é fictícia e não tem endereço.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
