import { ArrowRight, Check, MapPin, X } from "lucide-react";
import Link from "next/link";
import { Foto } from "@/components/foto";
import { MessagePreview } from "@/components/message-preview";
import { WorkArt } from "@/components/work-art";
import { getServiceType, portfolioWorks, regions, serviceTypes } from "@/data/services";
import { travelFeeLabel } from "@/lib/request";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-petrol text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_24rem_at_100%_0%,rgb(255_255_255/0.12),transparent_70%)]"
        />
        <div className="wrap relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
         <div>
          <p className="kicker !text-sun">Elétrica · pintura · manutenção · ar · hidráulica</p>
          <h1 id="hero-title" className="mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Diga o que precisa. A gente chega preparado.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Escolha o serviço, confirme se atendemos a sua região e responda perguntas rápidas. O orçamento chega com
            menos idas e vindas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/solicitar" className="btn btn-sun">
              Pedir orçamento
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="#regioes" className="btn border border-white/30 hover:border-white">
              Ver regiões atendidas
            </Link>
          </div>
         </div>
         <div aria-hidden className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4">
            <Foto
              id="sala"
              preload
              sizes="(min-width: 1024px) 330px, 60vw"
              className="col-span-3 row-span-2 h-full min-h-64 w-full rounded-3xl shadow-2xl shadow-black/40 sm:min-h-96"
            />
            <Foto id="painel" sizes="(min-width: 1024px) 220px, 40vw" className="col-span-2 aspect-square w-full rounded-3xl shadow-xl shadow-black/30" />
            <Foto id="fachada" sizes="(min-width: 1024px) 220px, 40vw" className="col-span-2 aspect-square w-full rounded-3xl shadow-xl shadow-black/30" />
         </div>
        </div>
      </section>

      <section id="servicos" aria-labelledby="servicos-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Serviços</p>
        <h2 id="servicos-title" className="mt-3 text-3xl sm:text-4xl">
          O que fazemos
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceTypes.map((service) => (
            <li key={service.id} className="flex flex-col rounded-card border border-line bg-paper p-6">
              <h3 className="text-xl">{service.name}</h3>
              <p className="mt-1 text-muted">{service.summary}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/solicitar?servico=${service.id}`} className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-bold text-petrol">
                Pedir orçamento de {service.name.toLowerCase()}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="trabalhos" aria-labelledby="trabalhos-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="wrap">
          <p className="kicker">Trabalhos</p>
          <h2 id="trabalhos-title" className="mt-3 text-3xl sm:text-4xl">
            Portfólio
          </h2>
          <p className="mt-3 text-muted">Fotos ilustrativas geradas por IA para esta demonstração — não são trabalhos reais.</p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioWorks.map((work) => (
              <li key={work.id} className="overflow-hidden rounded-card border border-line">
                <WorkArt serviceId={work.serviceId} workId={work.id} />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-wider text-petrol uppercase">{getServiceType(work.serviceId)?.name}</p>
                  <h3 className="mt-1 text-lg">{work.title}</h3>
                  <p className="mt-1 text-sm text-muted">{work.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="regioes" aria-labelledby="regioes-title" className="wrap grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="kicker">Regiões</p>
          <h2 id="regioes-title" className="mt-3 text-3xl sm:text-4xl">
            Onde atendemos
          </h2>
          <p className="mt-3 flex items-start gap-2 text-muted">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol" />
            Regiões ilustrativas de uma cidade fictícia.
          </p>
          <ul className="mt-6 divide-y divide-line rounded-card border border-line bg-paper">
            {regions.map((region) => (
              <li key={region.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="font-semibold">{region.name}</span>
                {region.served ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-ok">
                    <Check aria-hidden className="size-4" />
                    {travelFeeLabel(region.travelFeeCents)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <X aria-hidden className="size-4" />
                    Não atendida
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="self-center rounded-card bg-sun-soft p-8">
          <h2 className="text-2xl">Prefere perguntar antes?</h2>
          <p className="mt-2 text-muted">Em um site real, este botão abriria o WhatsApp. Aqui, só uma prévia.</p>
          <div className="mt-6">
            <MessagePreview
              businessName="Resolve Serviços"
              message="Olá, Resolve! Vocês instalam ar-condicionado no sábado?"
              triggerLabel="Prévia do WhatsApp"
            />
          </div>
        </div>
      </section>
    </>
  );
}
