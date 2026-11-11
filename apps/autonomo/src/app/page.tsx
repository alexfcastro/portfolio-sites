import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { MessagePreview } from "@/components/message-preview";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { WorkArt } from "@/components/work-art";
import { faq, offers, professional } from "@/data/profile";
import { formatBRL } from "@/lib/money";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="kicker">{professional.role}</p>
          <h1 id="hero-title" className="mt-4 text-5xl leading-[1.05] sm:text-7xl">
            {professional.pitch}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{professional.about}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/proposta" className="btn btn-primary">
              Pedir proposta
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="#portfolio" className="btn btn-secondary">
              Ver portfólio
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-hidden>
          <WorkArt variant={0} sizes="(min-width: 1024px) 520px, 100vw" preload className="parallax col-span-2 h-auto w-full" />
          <WorkArt variant={5} sizes="(min-width: 1024px) 260px, 50vw" className="parallax-inv h-auto w-full" />
          <WorkArt variant={1} sizes="(min-width: 1024px) 260px, 50vw" className="parallax-inv h-auto w-full" />
        </div>
      </section>

      <section id="servicos" aria-labelledby="servicos-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="wrap">
          <p className="kicker">Serviços</p>
          <h2 id="servicos-title" className="mt-3 text-4xl">
            Como posso ajudar
          </h2>
          <p className="mt-3 text-muted">Valores de referência demonstrativos; o valor final vem na proposta.</p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {offers.map((offer) => (
              <li key={offer.id} className="border-t-2 border-ink pt-5">
                <h3 className="text-2xl">{offer.name}</h3>
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
        <h2 id="portfolio-title" className="mt-3 text-4xl">
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
