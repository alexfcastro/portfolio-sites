import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { Foto } from "@/components/foto";
import { ListingCard } from "@/components/listing-card";
import { agents, listings } from "@/data/listings";

export default function HomePage() {
  const featured = listings.filter((listing) => listing.featured).slice(0, 3);
  return (
    <>
      <section aria-labelledby="hero-title" className="bg-gradient-to-b from-blue-soft to-sky">
        <div className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
         <div>
          <p className="kicker">Imobiliária</p>
          <h1 id="hero-title" className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Encontre o imóvel certo sem perder tempo.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">Filtre por bairro, preço e quartos e fale com o corretor já sabendo qual imóvel quer ver.</p>
          <form action="/imoveis" className="mt-8 grid max-w-3xl gap-3 rounded-card bg-paper p-3 shadow-sm shadow-xl shadow-blue/10 sm:grid-cols-[9rem_1fr_auto]">
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
         </div>
         <div aria-hidden className="relative pb-8 pl-6">
            <Foto
              id="hz-0163-fachada"
              preload
              sizes="(min-width: 1024px) 480px, 92vw"
              className="aspect-[4/3] w-full rounded-[2rem] shadow-2xl shadow-blue/25"
            />
            <Foto
              id="hz-0163-sala"
              sizes="220px"
              className="absolute bottom-0 left-0 aspect-[4/3] w-2/5 rounded-2xl border-4 border-paper shadow-xl"
            />
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
                  <span aria-hidden className="grid size-12 place-items-center rounded-full bg-blue-soft font-bold text-blue">
                    {agent.initials}
                  </span>
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
