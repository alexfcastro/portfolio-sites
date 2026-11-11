import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { Foto, Retrato } from "@/components/foto";
import { ListingCard } from "@/components/listing-card";
import { agents, listings } from "@/data/listings";

export default function HomePage() {
  const featured = listings.filter((listing) => listing.featured).slice(0, 3);
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ink text-white">
        {/* Foto ilustrativa (gerada por IA) ocupando a abertura; o degradê garante a leitura do texto. */}
        <Foto id="hz-0163-fachada" preload sizes="100vw" className="fundo absolute inset-0 -z-20 size-full" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20 max-md:via-ink/85 max-md:to-ink/70"
        />
        <div className="wrap flex min-h-[78svh] flex-col justify-center py-14 sm:py-20">
         <div className="max-w-3xl">
          <p className="kicker !text-white">Imobiliária</p>
          <h1 id="hero-title" className="mt-3 max-w-3xl text-5xl leading-[1.03] sm:text-7xl">
            Encontre o imóvel certo sem perder tempo.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">Filtre por bairro, preço e quartos e fale com o corretor já sabendo qual imóvel quer ver.</p>
          <form action="/imoveis" className="mt-8 grid max-w-3xl gap-3 rounded-card bg-paper p-3 text-ink shadow-2xl shadow-black/40 sm:grid-cols-[9rem_1fr_auto]">
            <label className="sr-only" htmlFor="finalidade">
              Finalidade
            </label>
            <select id="finalidade" name="finalidade" className="min-h-12 rounded-lg border border-line px-3">
              <option value="venda">Comprar</option>
              <option value="aluguel">Alugar</option>
            </select>
            <label className="sr-only" htmlFor="q">
              Bairro, código ou característica
            </label>
            <input id="q" name="q" type="search" maxLength={60} placeholder="Bairro, código ou característica" className="min-h-12 rounded-lg border border-line px-3" />
            <button type="submit" className="btn btn-primary">
              <Search aria-hidden className="size-4" /> Buscar
            </button>
          </form>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-white">
            <div>
              <dt className="text-sm text-white/80">Imóveis no site</dt>
              <dd className="text-3xl font-bold">{listings.length}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/80">Para comprar</dt>
              <dd className="text-3xl font-bold">{listings.filter((l) => l.purpose === "venda").length}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/80">Para alugar</dt>
              <dd className="text-3xl font-bold">{listings.filter((l) => l.purpose === "aluguel").length}</dd>
            </div>
          </dl>
         </div>
        </div>
      </section>

      <section aria-labelledby="destaques-title" className="wrap py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Destaques</p>
            <h2 id="destaques-title" className="mt-2 text-3xl">
              Imóveis em destaque
            </h2>
          </div>
          <Link href="/imoveis" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue">
            Ver todos os {listings.length} imóveis <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <li key={listing.code}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="corretores-title" className="border-y border-line bg-paper py-14">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="kicker">Equipe</p>
            <h2 id="corretores-title" className="mt-2 text-3xl">
              Nossos corretores
            </h2>
            <p className="mt-3 text-muted">Corretores fictícios; registros profissionais não são exibidos.</p>
            <ul className="mt-6 space-y-4">
              {agents.map((agent) => (
                <li key={agent.name} className="flex items-center gap-4">
                  <Retrato
                    id={`equipe-${agent.initials.toLowerCase()}`}
                    inicial={agent.initials}
                    className="size-16"
                    fallback="bg-blue-soft font-bold text-blue"
                  />
                  <span>
                    <span className="block font-semibold">{agent.name}</span>
                    <span className="block text-sm text-muted">{agent.focus}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-blue p-8 text-white">
            <h2 className="text-2xl">Quer vender ou alugar?</h2>
            <p className="mt-2 text-white/85">Conte sobre o seu imóvel e um corretor avalia com você.</p>
            <Link href="/anunciar" className="btn mt-6 bg-white text-blue hover:bg-blue-soft">
              Quero anunciar meu imóvel
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
