import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Faixa } from "@/components/faixa";
import { MessagePreview } from "@/components/message-preview";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { WorkArt } from "@/components/work-art";
import { faq, offers, professional } from "@/data/profile";
import { formatBRL } from "@/lib/money";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="overflow-hidden pt-14 sm:pt-20">
        <div className="wrap">
          <p className="kicker">{professional.role}</p>
          <h1 id="hero-title" className="mt-4 max-w-5xl text-6xl leading-[0.98] sm:text-8xl lg:text-9xl">
            {professional.pitch}
          </h1>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-muted">{professional.about}</p>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/proposta" className="btn btn-primary">
                Pedir proposta
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="#portfolio" className="btn btn-secondary">
                Ver portfólio
              </Link>
            </div>
          </div>
        </div>
        {/* Mosaico de trabalhos (fotos ilustrativas, geradas por IA), de ponta a ponta. */}
        <div className="mt-12 grid grid-cols-2 gap-2 px-2 sm:gap-3 sm:px-3 md:grid-cols-4" aria-hidden>
          <WorkArt variant={0} sizes="(min-width: 768px) 50vw, 100vw" preload className="col-span-2 row-span-2 !aspect-auto h-full min-h-72 w-full" />
          <WorkArt variant={5} sizes="(min-width: 768px) 25vw, 50vw" className="h-auto w-full" />
          <WorkArt variant={1} sizes="(min-width: 768px) 25vw, 50vw" className="h-auto w-full" />
          <WorkArt variant={4} sizes="(min-width: 768px) 25vw, 50vw" className="h-auto w-full" />
          <WorkArt variant={3} sizes="(min-width: 768px) 25vw, 50vw" className="h-auto w-full" />
        </div>
      </section>

      <Faixa
        className="mt-2 bg-ink font-serif text-xl text-paper sm:mt-3"
        itens={[...offers.map((offer) => offer.name), "Luz controlada", "Edição cuidadosa"]}
      />

      <section id="servicos" aria-labelledby="servicos-title" className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="wrap">
          <p className="kicker">Serviços</p>
          <h2 id="servicos-title" className="mt-3 text-4xl sm:text-6xl">
            Como posso ajudar
          </h2>
          <p className="mt-3 text-muted">Valores de referência demonstrativos; o valor final vem na proposta.</p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {offers.map((offer, index) => (
              <li key={offer.id} className="border-t-2 border-ink pt-5">
                <span aria-hidden className="block font-serif text-6xl text-terra">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-3xl">{offer.name}</h3>
                <p className="mt-2 text-muted">{offer.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {offer.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-terra" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-semibold">A partir de {formatBRL(offer.fromCents)} por foto</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="portfolio" aria-labelledby="portfolio-title" className="wrap py-16 sm:py-20">
        <p className="kicker">Portfólio</p>
        <h2 id="portfolio-title" className="mt-3 text-4xl sm:text-6xl">
          Trabalhos recentes
        </h2>
        <p className="mt-3 mb-8 text-muted">Fotos ilustrativas geradas por IA para esta demonstração — não são trabalhos para clientes reais.</p>
        <PortfolioGrid />
      </section>

      <section id="duvidas" aria-labelledby="duvidas-title" className="border-t border-line bg-paper py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="kicker">Dúvidas</p>
            <h2 id="duvidas-title" className="mt-3 text-4xl">
              Perguntas frequentes
            </h2>
            <p className="mt-4 text-muted">{professional.area}</p>
            <div className="mt-6">
              <MessagePreview businessName={professional.name} message="Olá, Lia! Você fotografa roupas em modelo?" triggerLabel="Prévia do WhatsApp" />
            </div>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="font-serif text-xl">{item.q}</dt>
                <dd className="mt-2 text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
