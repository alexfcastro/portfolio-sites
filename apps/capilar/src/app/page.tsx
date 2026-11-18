import { ArrowDown, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { Agendamento } from "@/components/agendamento";
import { Comparador } from "@/components/comparador";
import { Foto, Retrato, temFoto } from "@/components/foto";
import { Questionario } from "@/components/questionario";
import { TabelaMega } from "@/components/tabela-mega";
import { antesDepois, avaliacaoInclui, equipe, instituto, tratamentos } from "@/data/instituto";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-20">
        <div>
          <p className="kicker">Terapia capilar · mega hair · {instituto.bairro}</p>
          <h1 id="titulo" className="mt-4 text-[2.5rem] leading-[1.08] sm:text-6xl">
            Seu caso é tratamento ou mega hair? Comece por seis perguntas.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Responda sobre queda, química, rotina e objetivo e veja uma orientação inicial do caminho, com o porquê. Depois, a avaliação
            presencial confirma, num espaço reservado e sem constrangimento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#questionario" className="btn btn-primary">
              Responder as perguntas
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <Link href="/#mega-hair" className="btn btn-secondary">
              Ver tabela de mega hair
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Lock aria-hidden className="size-4 text-ambar-escuro" />
            Orientação inicial, não diagnóstico. As respostas ficam só no seu aparelho.
          </p>
        </div>
        {temFoto("hero-tricoscopia") ? (
          <Foto id="hero-tricoscopia" sizes="(min-width: 1024px) 540px, 100vw" preload className="aspect-[4/3] rounded-card" />
        ) : (
          <div aria-hidden className="aspect-[4/3] rounded-card bg-creme" />
        )}
      </section>

      <div aria-hidden className="regua" />

      <section id="questionario" aria-labelledby="questionario-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Questionário</p>
        <h2 id="questionario-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Seis perguntas para saber por onde começar
        </h2>
        <Questionario />
      </section>

      <section id="avaliacao" aria-labelledby="avaliacao-titulo" className="scroll-mt-20 border-y border-line bg-paper py-14 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <p className="kicker">A avaliação presencial</p>
            <h2 id="avaliacao-titulo" className="mt-3 text-3xl leading-tight sm:text-4xl">
              O que a avaliação inclui
            </h2>
            <p className="mt-4 text-muted">
              {instituto.avaliacao.duracao} · {instituto.avaliacao.valor}.
            </p>
            {temFoto("avaliacao") && <Foto id="avaliacao" sizes="(min-width: 1024px) 420px, 100vw" className="mt-8 aspect-[4/3] rounded-card" />}
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {avaliacaoInclui.map((item, i) => (
              <li key={item.titulo} className="rounded-card border border-line bg-sandbg p-5">
                <span className="font-serif text-2xl text-ambar-escuro">{i + 1}</span>
                <h3 className="mt-1 text-xl">{item.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="tratamentos" aria-labelledby="tratamentos-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Tratamentos</p>
        <h2 id="tratamentos-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Quanto tempo até ver resultado
        </h2>
        <p className="mt-4 max-w-2xl text-muted">Prazos realistas. Cabelo cresce cerca de 1 centímetro por mês; nenhum tratamento sério promete milagre em semanas.</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {tratamentos.map((t) => (
            <li key={t.nome} className="rounded-card border border-line bg-paper p-6">
              <h3 className="text-xl">{t.nome}</h3>
              <p className="mt-2 leading-relaxed text-muted">{t.como}</p>
              <p className="mt-4 flex gap-2 text-[0.9375rem] font-medium">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ambar-escuro" />
                {t.resultado}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="mega-hair" aria-labelledby="mega-titulo" className="scroll-mt-20 border-y border-line bg-paper py-14 sm:py-20">
        <div className="wrap">
          <p className="kicker">Mega hair</p>
          <h2 id="mega-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            O preço depende de comprimento e quantidade. Aqui está a tabela.
          </h2>
          <TabelaMega />
        </div>
      </section>

      <section aria-labelledby="antes-titulo" className="wrap py-14 sm:py-20">
        <p className="kicker">Antes e depois</p>
        <h2 id="antes-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Arraste para comparar
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {antesDepois.map((caso) => (
            <li key={caso.id}>
              <figure>
                <Comparador antes={caso.antes} depois={caso.depois} rotulo={caso.titulo.toLowerCase()} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] rounded-card" />
                <figcaption className="mt-3">
                  <span className="font-semibold">{caso.titulo}</span>
                  <span className="mt-1 block text-[0.9375rem] text-muted">{caso.texto}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Imagens ilustrativas, geradas por IA para esta demonstração. Não são resultados de clientes.</p>
      </section>

      <section id="equipe" aria-labelledby="equipe-titulo" className="scroll-mt-20 bg-ink py-14 text-creme sm:py-20">
        <div className="wrap">
          <p className="kicker !text-ambar">A equipe</p>
          <h2 id="equipe-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Quem cuida do seu cabelo e o que estudou para isso
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {equipe.map((p) => (
              <li key={p.id} className="flex flex-col gap-5 rounded-card border border-creme/15 p-6 sm:flex-row sm:items-center">
                <Retrato id={p.id} inicial={p.nome[0] ?? ""} className="size-28" fallback="bg-creme/10 text-3xl font-semibold text-ambar" />
                <div>
                  <h3 className="text-xl">{p.nome}</h3>
                  <p className="mt-1 font-semibold text-ambar">{p.funcao}</p>
                  <p className="mt-2 leading-relaxed text-creme/80">{p.formacao}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-creme/60">Pessoas fictícias, com retratos gerados por IA.</p>
        </div>
      </section>

      <section id="agendar" aria-labelledby="agendar-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Agendamento</p>
        <h2 id="agendar-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Agende a avaliação presencial
        </h2>
        <Agendamento />
      </section>
    </>
  );
}
