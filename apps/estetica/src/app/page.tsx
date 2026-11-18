import { ArrowDown, Check, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Agendamento } from "@/components/agendamento";
import { Foto, Retrato, temFoto } from "@/components/foto";
import { Montador } from "@/components/montador";
import { clinica, equipe, estrutura, estruturaItens, perguntas, prazosPosOperatorio, sessao } from "@/data/clinica";
import { objetivos } from "@/lib/protocolo";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div>
          <p className="kicker">Estética facial e corporal · {clinica.bairro}</p>
          <h1 id="titulo" className="mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl">
            Saiba quantas sessões e quanto vai investir, antes de começar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Monte o seu protocolo em um minuto: escolha o objetivo, responda duas ou três perguntas e veja o número de sessões,
            o intervalo entre elas e o investimento total do pacote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#montador" className="btn btn-primary">
              Montar meu protocolo
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <Link href="/#pos-operatorio" className="btn btn-secondary">
              Acabei de operar
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck aria-hidden className="size-4 text-agua" />
            Sem promessa de resultado: protocolo revisto a cada quatro sessões.
          </p>
        </div>
        <div className="relative">
          {temFoto("hero-sala") ? (
            <Foto id="hero-sala" sizes="(min-width: 1024px) 560px, 100vw" preload className="aspect-[4/3] rounded-card shadow-lg" />
          ) : (
            <div aria-hidden className="aspect-[4/3] rounded-card bg-agua-soft" />
          )}
          <div className="absolute -bottom-6 left-4 hidden max-w-60 rounded-card border border-line bg-white p-4 shadow-lg sm:block">
            <p className="text-sm text-muted">Exemplo de protocolo</p>
            <p className="mt-1 font-semibold">Drenagem pós-lipo</p>
            <p className="text-sm">10 sessões · 4 semanas</p>
          </div>
        </div>
      </section>

      <section id="objetivos" aria-labelledby="objetivos-titulo" className="border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <span aria-hidden className="linha-agua block" />
          <h2 id="objetivos-titulo" className="mt-5 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Quatro objetivos, um protocolo para cada caso
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Quase tudo aqui é feito em pacote de sessões, porque um resultado consistente pede continuidade. O montador mostra o
            pacote inteiro, não só o preço de uma sessão.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {objetivos.map((o) => (
              <li key={o.id} className="overflow-hidden rounded-card border border-line bg-sandbg">
                {temFoto(o.foto) && <Foto id={o.foto} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />}
                <div className="p-5">
                  <h3 className="text-lg">{o.nome}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{o.resumo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="montador" aria-labelledby="montador-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Montador de protocolo</p>
        <h2 id="montador-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Quantas sessões você precisa e quanto vai investir
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Uma estimativa honesta para você se planejar. O protocolo final é fechado na avaliação, depois que a esteticista vê a sua
          pele.
        </p>
        <Montador />
      </section>

      <section aria-labelledby="sessao-titulo" className="bg-agua-dark py-16 text-white sm:py-24">
        <div className="wrap">
          <p className="kicker !text-agua-claro">O que esperar</p>
          <h2 id="sessao-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Como é cada sessão
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sessao.map((etapa, i) => (
              <li key={etapa.titulo} className="rounded-card border border-white/15 p-6">
                <span className="text-sm font-semibold text-agua-claro">0{i + 1}</span>
                <h3 className="mt-2 text-xl">{etapa.titulo}</h3>
                <p className="mt-2 leading-relaxed text-white/80">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="equipe" aria-labelledby="equipe-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <span aria-hidden className="linha-agua block" />
        <h2 id="equipe-titulo" className="mt-5 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Duas esteticistas, cada uma na sua especialidade
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {equipe.map((pessoa) => (
            <li key={pessoa.id} className="flex flex-col gap-5 rounded-card border border-line bg-paper p-6 sm:flex-row sm:items-center">
              <Retrato id={pessoa.id} inicial={pessoa.nome[0] ?? ""} className="size-28" fallback="bg-agua-soft text-3xl font-bold text-agua" />
              <div>
                <h3 className="text-xl">{pessoa.nome}</h3>
                <p className="mt-1 font-medium text-agua-dark">{pessoa.funcao}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{pessoa.formacao}</p>
                <p className="mt-2 inline-flex rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted">{pessoa.registro}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Pessoas fictícias, com retratos gerados por IA.</p>
      </section>

      <section aria-labelledby="estrutura-titulo" className="border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="kicker">A estrutura</p>
            <h2 id="estrutura-titulo" className="mt-3 text-3xl leading-tight sm:text-4xl">
              Um espaço pequeno, de propósito
            </h2>
            <ul className="mt-6 space-y-3">
              {estruturaItens.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-agua" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {estrutura.map((item) => (
              <li key={item.id}>
                <figure>
                  {temFoto(item.id) ? (
                    <Foto id={item.id} sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] rounded-card" />
                  ) : (
                    <div aria-hidden className="aspect-[4/3] rounded-card bg-agua-soft" />
                  )}
                  <figcaption className="mt-3">
                    <span className="block font-semibold">{item.titulo}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{item.texto}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pos-operatorio" aria-labelledby="pos-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="kicker">Pós-operatório</p>
            <h2 id="pos-titulo" className="mt-3 text-3xl leading-tight sm:text-4xl">
              Acabou de operar? Veja quando dá para começar
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              A drenagem ajuda a reduzir o inchaço e o desconforto, mas só começa com a liberação do seu cirurgião. Se você ainda vai
              operar, já dá para fazer a avaliação e reservar a agenda das primeiras semanas.
            </p>
            <Link href="/#montador" className="btn btn-primary mt-6">
              Montar protocolo de pós-operatório
            </Link>
          </div>
          <div className="overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[30rem] text-left">
              <caption className="sr-only">Prazos usuais para começar a drenagem pós-operatória</caption>
              <thead className="bg-agua-soft text-sm">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Cirurgia
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Começo mais comum
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Pacote usual
                  </th>
                </tr>
              </thead>
              <tbody>
                {prazosPosOperatorio.map((linha) => (
                  <tr key={linha.cirurgia} className="border-t border-line">
                    <th scope="row" className="px-5 py-4 font-medium">
                      {linha.cirurgia}
                    </th>
                    <td className="px-5 py-4">{linha.inicio}</td>
                    <td className="px-5 py-4 text-muted">{linha.sessoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-line px-5 py-3 text-sm text-muted">Sempre com liberação do cirurgião, que pode indicar outro prazo.</p>
          </div>
        </div>
      </section>

      <section id="duvidas" aria-labelledby="duvidas-titulo" className="border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap max-w-3xl">
          <p className="kicker">Perguntas frequentes</p>
          <h2 id="duvidas-titulo" className="mt-3 text-3xl leading-tight sm:text-4xl">
            Antes de agendar
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {perguntas.map((item) => (
              <details key={item.pergunta} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold">
                  {item.pergunta}
                  <ChevronDown aria-hidden className="size-5 shrink-0 text-agua transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{item.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="agendar" aria-labelledby="agendar-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Agendamento</p>
        <h2 id="agendar-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Agende a avaliação levando o seu protocolo
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          O resumo que você montou vai junto, para a esteticista já chegar sabendo o que você procura.
        </p>
        <Agendamento />
      </section>
    </>
  );
}
