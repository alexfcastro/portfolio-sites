import { Camera, ClipboardList, Gauge, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { MessagePreview } from "@/components/message-preview";
import { problemCategories, services } from "@/data/garage";
import { formatBRL } from "@/lib/money";

const steps = [
  { icon: Gauge, title: "Veículo", text: "Tipo, modelo, ano e quilometragem aproximada." },
  { icon: ClipboardList, title: "Problema", text: "Categoria e sintomas, com perguntas objetivas." },
  { icon: Camera, title: "Fotos", text: "Até 4 fotos com prévia no seu navegador." },
  { icon: Wrench, title: "Estimativa", text: "Faixa inicial e acompanhamento da solicitação." },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="bg-graphite text-white">
        <div className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="kicker !text-orange">Mecânica geral · orçamento on-line</p>
            <h1 id="hero-title" className="mt-4 text-4xl leading-tight uppercase sm:text-6xl">
              Conte o problema. A gente já chega sabendo.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Uma triagem rápida com dados do veículo, sintomas e fotos, para uma primeira estimativa mais precisa antes
              da visita.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/orcamento" className="btn bg-orange text-graphite hover:bg-white">
                Pedir orçamento
              </Link>
              <Link href="/acompanhamento" className="btn border border-white/30 hover:border-white">
                Acompanhar solicitação
              </Link>
            </div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-card bg-graphite-2 p-5">
                <Icon aria-hidden className="size-6 text-orange" />
                <p className="mt-3 font-extrabold">
                  {index + 1}. {title}
                </p>
                <p className="mt-1 text-sm text-white/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="servicos" aria-labelledby="servicos-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Serviços</p>
        <h2 id="servicos-title" className="mt-3 text-3xl uppercase sm:text-4xl">
          O que fazemos
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Faixas de preço demonstrativas (peças e mão de obra), só para ilustrar o funcionamento do site.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {problemCategories.map((category) => {
            const ids = [...new Set(category.symptoms.flatMap((symptom) => symptom.serviceIds))];
            return (
              <section key={category.id} aria-labelledby={`cat-${category.id}`} className="rounded-card border border-line bg-paper p-5">
                <h3 id={`cat-${category.id}`} className="text-lg uppercase">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
                <ul className="mt-4 divide-y divide-line">
                  {ids.map((id) => {
                    const service = services.find((item) => item.id === id);
                    if (!service) return null;
                    return (
                      <li key={id} className="py-2.5">
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-muted">
                          {formatBRL(service.minCents)} a {formatBRL(service.maxCents)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="contato-title" className="border-t border-line bg-paper py-16">
        <div className="wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="contato-title" className="text-2xl uppercase">
              Dúvida rápida?
            </h2>
            <p className="mt-2 flex items-start gap-2 text-muted">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-dark" />
              Oficina fictícia, sem endereço. Em um site real, aqui ficariam o mapa e o WhatsApp.
            </p>
          </div>
          <MessagePreview
            businessName="Torque Auto Center"
            message="Olá, Torque! Vocês fazem alinhamento no sábado?"
            triggerLabel="Prévia do WhatsApp"
          />
        </div>
      </section>
    </>
  );
}
