import { ArrowDown, Check, Clock, Gift, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Foto, temFoto } from "@/components/foto";
import { Reserva } from "@/components/reserva";
import { ValeDaCasa } from "@/components/vale-da-casa";
import { comoChegar, dayspaInclui, espaco, experiencias, levar, reagendamento, serena } from "@/data/serena";
import { formatBRL } from "@/lib/money";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="relative isolate overflow-hidden bg-verde">
        {temFoto("hero-sala") ? (
          <Foto id="hero-sala" sizes="100vw" preload className="fundo absolute inset-0 -z-20 size-full" />
        ) : (
          <div aria-hidden className="absolute inset-0 -z-20 bg-verde" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-verde/90 via-verde/70 to-verde/20 max-md:bg-verde/75" />
        <div className="wrap flex min-h-[80svh] flex-col justify-center py-16 text-areia">
          <p className="kicker !text-areia/80">Spa · massagem · {serena.bairro}</p>
          <h1 id="titulo" className="mt-5 max-w-2xl text-[2.75rem] leading-[1.08] sm:text-7xl">
            Um presente que é silêncio.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-areia/85">
            Monte o vale-presente, escreva a mensagem e veja o cartão pronto antes de finalizar. Ou reserve uma tarde só sua.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#vale-presente" className="btn bg-areia text-verde hover:bg-white">
              <Gift aria-hidden className="size-4" />
              Montar um vale-presente
            </Link>
            <Link href="/#experiencias" className="btn border border-areia/60 text-areia hover:border-areia">
              Ver as experiências
              <ArrowDown aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="experiencias" aria-labelledby="experiencias-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Experiências</p>
        <h2 id="experiencias-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Quanto tempo e para quem é cada uma
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiencias.map((e) => (
            <li key={e.id} className="flex flex-col overflow-hidden rounded-card bg-paper">
              {temFoto(e.foto) ? (
                <Foto id={e.foto} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/5]" />
              ) : (
                <div aria-hidden className="aspect-[4/5] bg-areia-escura" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-2xl">{e.nome}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Clock aria-hidden className="size-4 text-verde" />
                  {e.duracao}
                  {e.pessoas === 2 && (
                    <>
                      <Users aria-hidden className="ml-2 size-4 text-verde" />2 pessoas
                    </>
                  )}
                </p>
                <p className="mt-3 flex-1 leading-relaxed">{e.descricao}</p>
                <p className="mt-3 text-sm text-muted italic">{e.paraQuem}</p>
                <p className="mt-4 font-serif text-2xl">{formatBRL(e.valor)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="vale-presente" aria-labelledby="vale-titulo" className="scroll-mt-16 border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker">Vale-presente</p>
          <h2 id="vale-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Monte o presente e veja o cartão antes de finalizar
          </h2>
          <p className="mt-4 mb-10 max-w-2xl text-muted">
            Uma experiência ou um valor livre, a sua mensagem e a entrega por e-mail ou em cartão impresso. Quem recebe marca quando
            quiser, em até seis meses.
          </p>
          <ValeDaCasa />
        </div>
      </section>

      <section id="day-spa" aria-labelledby="dayspa-titulo" className="scroll-mt-20 bg-verde py-16 text-areia sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {temFoto("dayspa-ofuro") ? (
            <Foto id="dayspa-ofuro" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3] rounded-card" />
          ) : (
            <div aria-hidden className="aspect-[4/3] rounded-card bg-white/10" />
          )}
          <div>
            <p className="kicker !text-areia/80">Day spa para dois</p>
            <h2 id="dayspa-titulo" className="mt-3 text-4xl leading-tight sm:text-5xl">
              Quatro horas, lado a lado
            </h2>
            <ul className="mt-6 space-y-3">
              {dayspaInclui.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-verde-claro" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif text-3xl">{formatBRL(experiencias.find((e) => e.id === "dayspa-dois")!.valor)} <span className="text-base text-areia/75">para os dois</span></p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/#reserva" className="btn bg-areia text-verde hover:bg-white">
                Reservar para dois
              </Link>
              <Link href="/#vale-presente" className="btn border border-areia/60 text-areia hover:border-areia">
                Dar de presente
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="espaco-titulo" className="wrap py-16 sm:py-24">
        <p className="kicker">O espaço</p>
        <h2 id="espaco-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Uma casa, não uma recepção de shopping
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {espaco.map((item) => (
            <li key={item.id}>
              <figure>
                {temFoto(item.id) ? (
                  <Foto id={item.id} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] rounded-card" />
                ) : (
                  <div aria-hidden className="aspect-[4/3] rounded-card bg-areia-escura" />
                )}
                <figcaption className="mt-3">
                  <span className="block font-serif text-xl">{item.titulo}</span>
                  <span className="mt-1 block leading-relaxed text-muted">{item.texto}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="visita" aria-labelledby="visita-titulo" className="scroll-mt-20 border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker">Sua visita</p>
          <h2 id="visita-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            O que levar, como chegar e se precisar remarcar
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-card bg-sandbg p-6">
              <h3 className="text-2xl">O que levar</h3>
              <ul className="mt-4 space-y-3">
                {levar.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-verde" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-sandbg p-6">
              <h3 className="text-2xl">Como chegar</h3>
              <ul className="mt-4 space-y-3">
                {comoChegar.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-verde" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-sandbg p-6">
              <h3 className="text-2xl">Reagendamento</h3>
              <dl className="mt-4 space-y-4">
                {reagendamento.map((item) => (
                  <div key={item.titulo}>
                    <dt className="font-semibold">{item.titulo}</dt>
                    <dd className="mt-1 leading-relaxed text-muted">{item.texto}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="reserva" aria-labelledby="reserva-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Reserva</p>
        <h2 id="reserva-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Reserve o seu horário
        </h2>
        <Reserva />
      </section>
    </>
  );
}
