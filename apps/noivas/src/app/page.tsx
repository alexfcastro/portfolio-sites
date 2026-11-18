import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Calendario } from "@/components/calendario";
import { Foto, temFoto } from "@/components/foto";
import { MontadorGrupo } from "@/components/montador-grupo";
import { Pedido } from "@/components/pedido";
import { atelie, depoimentos, pacoteInclui, portfolio, teste } from "@/data/atelie";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="relative isolate overflow-hidden">
        {temFoto("hero-noiva") ? (
          <Foto id="hero-noiva" sizes="100vw" preload className="fundo absolute inset-0 -z-20 size-full [&_img]:object-[70%_center]" />
        ) : (
          <div aria-hidden className="absolute inset-0 -z-20 bg-champanhe" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-sandbg via-sandbg/85 to-sandbg/10 max-md:bg-sandbg/80" />
        <div className="wrap flex min-h-[78svh] flex-col justify-center py-16">
          <span aria-hidden className="filete" />
          <p className="kicker mt-6">Dia da noiva · {atelie.bairro}</p>
          <h1 id="titulo" className="mt-4 max-w-2xl text-[2.75rem] leading-[1.05] sm:text-7xl">
            O orçamento do seu grupo, sem vinte mensagens.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Diga quem vai se arrumar e o horário da cerimônia. A página calcula o tempo de produção, a que horas vocês começam e o
            valor estimado, na hora.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#montador" className="btn btn-primary">
              Montar o meu grupo
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <Link href="/#disponibilidade" className="btn btn-secondary">
              Ver datas livres
            </Link>
          </div>
        </div>
      </section>

      <section id="portfolio" aria-labelledby="portfolio-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <span aria-hidden className="filete" />
        <h2 id="portfolio-titulo" className="mt-5 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Penteados e maquiagens
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {portfolio.map((item, i) => (
            <li key={item.id} className={i === 0 ? "row-span-2" : ""}>
              <figure className="h-full">
                {temFoto(item.id) ? (
                  <Foto id={item.id} sizes="(min-width: 1024px) 33vw, 50vw" className={`${i === 0 ? "h-full min-h-80" : "aspect-[4/5]"} rounded-card`} />
                ) : (
                  <div aria-hidden className={`${i === 0 ? "h-full min-h-80" : "aspect-[4/5]"} rounded-card bg-champanhe`} />
                )}
                <figcaption className="mt-2 text-sm">
                  <span className="text-dourado-escuro">{item.tipo}</span> · {item.titulo}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Fotos ilustrativas, geradas por IA para esta demonstração.</p>
      </section>

      <section id="pacote" aria-labelledby="pacote-titulo" className="scroll-mt-20 border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker">O que o pacote inclui</p>
          <h2 id="pacote-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Muito além de cabelo e maquiagem no dia
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {pacoteInclui.map((item) => (
              <li key={item.titulo}>
                <span aria-hidden className="filete" />
                <h3 className="mt-4 text-2xl">{item.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="montador" aria-labelledby="montador-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Montador do grupo</p>
        <h2 id="montador-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Quem vai se arrumar com você?
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Ajuste o grupo e o serviço de cada uma. O horário de início e o valor mudam na hora.
        </p>
        <MontadorGrupo />
      </section>

      <section id="teste" aria-labelledby="teste-titulo" className="scroll-mt-20 bg-ink py-16 text-white sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="kicker !text-champanhe">Antes do casamento</p>
            <h2 id="teste-titulo" className="mt-3 text-4xl leading-tight sm:text-5xl">
              Como funciona o teste
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              De 30 a 60 dias antes, numa terça, quarta, quinta ou sexta. É no teste que tudo é decidido, para o dia ser só de
              execução.
            </p>
            {temFoto("teste") && <Foto id="teste" sizes="(min-width: 1024px) 420px, 100vw" className="mt-8 aspect-[4/3] rounded-card" />}
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {teste.map((etapa, i) => (
              <li key={etapa.titulo} className="rounded-card border border-white/15 p-6">
                <span className="font-serif text-3xl text-champanhe">{i + 1}</span>
                <h3 className="mt-2 text-2xl">{etapa.titulo}</h3>
                <p className="mt-2 leading-relaxed text-white/80">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="depoimentos-titulo" className="wrap py-16 sm:py-24">
        <p className="kicker">Depoimentos de exemplo</p>
        <h2 id="depoimentos-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          O que as noivas mais valorizam
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">Textos escritos para esta demonstração. Não são de noivas reais.</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {depoimentos.map((d) => (
            <li key={d.nome} className="flex flex-col border-t border-dourado pt-6">
              <blockquote className="flex-1 font-serif text-2xl leading-snug">“{d.texto}”</blockquote>
              <p className="mt-5 text-sm">
                <span className="font-semibold">{d.nome}</span> <span className="text-muted">· {d.data}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="disponibilidade" aria-labelledby="disponibilidade-titulo" className="scroll-mt-20 border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <span id="campo-data" className="block scroll-mt-28" />
          <p className="kicker">Disponibilidade</p>
          <h2 id="disponibilidade-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            A sua data ainda está livre?
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Datas riscadas já têm noiva. Escolha a sua (a partir de 30 dias) e ela vai para o pedido de orçamento.
          </p>
          <Calendario />
        </div>
      </section>

      <section id="orcamento" aria-labelledby="orcamento-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Pedido de orçamento</p>
        <h2 id="orcamento-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Confira o resumo e peça o orçamento
        </h2>
        <Pedido />
      </section>
    </>
  );
}
