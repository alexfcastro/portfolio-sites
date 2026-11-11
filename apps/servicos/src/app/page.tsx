import { ArrowRight, Check, MapPin, X } from "lucide-react";
import Link from "next/link";
import { Faixa } from "@/components/faixa";
import { Foto } from "@/components/foto";
import { MessagePreview } from "@/components/message-preview";
import { WorkArt } from "@/components/work-art";
import { getServiceType, portfolioWorks, regions, serviceTypes } from "@/data/services";
import { travelFeeLabel } from "@/lib/request";

// Os três passos do pedido, como descritos no fluxo de solicitação.
const passos = [
  { titulo: "Escolha o serviço", texto: "Elétrica, pintura, manutenção, ar-condicionado ou hidráulica." },
  { titulo: "Confirme a região", texto: "Você vê na hora se atendemos o seu bairro e a taxa de deslocamento." },
  { titulo: "Conte o que precisa", texto: "Perguntas rápidas sobre o problema e os dias em que você pode receber a equipe." },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-petrol-dark text-white">
        {/* Foto ilustrativa (gerada por IA) ocupando a abertura; o degradê garante a leitura do texto. */}
        <Foto id="sala" preload sizes="100vw" className="fundo absolute inset-0 -z-20 size-full" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-petrol-dark via-petrol-dark/90 to-petrol-dark/25 max-md:via-petrol-dark/88 max-md:to-petrol-dark/75"
        />
        <div className="wrap relative flex min-h-[76svh] flex-col justify-center py-14 sm:py-20">
         <div className="max-w-3xl">
          <p className="kicker !text-sun">Elétrica · pintura · manutenção · ar · hidráulica</p>
          <h1 id="hero-title" className="mt-4 max-w-3xl text-5xl leading-[1.04] sm:text-7xl">
            Diga o que precisa. A gente chega preparado.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
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
        </div>
      </section>

      <Faixa className="bg-sun text-lg text-petrol-dark" itens={serviceTypes.map((service) => service.name)} />

      <section aria-labelledby="passos-title" className="bg-petrol py-16 text-white sm:py-20">
        <div className="wrap">
          <p className="kicker !text-sun">Como funciona</p>
          <h2 id="passos-title" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Três passos e o orçamento sai certo de primeira.
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {passos.map((passo, index) => (
              <li key={passo.titulo} className="rounded-card border border-white/15 bg-white/5 p-6">
                <span aria-hidden className="block text-6xl font-bold text-sun">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-2xl">{passo.titulo}</h3>
                <p className="mt-2 text-white/85">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="servicos" aria-labelledby="servicos-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Serviços</p>
        <h2 id="servicos-title" className="mt-3 text-4xl sm:text-5xl">
          O que fazemos
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceTypes.map((service) => {
            const foto = portfolioWorks.find((work) => work.serviceId === service.id)?.id;
            return (
            <li key={service.id} className="flex flex-col overflow-hidden rounded-card border border-line bg-paper">
              {foto && <Foto id={foto} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] w-full" />}
              <div className="flex flex-1 flex-col p-6">
              <h3 className="text-2xl">{service.name}</h3>
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
              </div>
            </li>
            );
          })}
        </ul>
      </section>

      <section id="trabalhos" aria-labelledby="trabalhos-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="wrap">
          <p className="kicker">Trabalhos</p>
          <h2 id="trabalhos-title" className="mt-3 text-4xl sm:text-5xl">
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
