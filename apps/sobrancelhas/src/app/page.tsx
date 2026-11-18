import { ArrowDown, Clock, Hourglass, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Agendamento, AgendamentoComParametros } from "@/components/agendamento";
import { Comparador } from "@/components/comparador";
import { Foto, temFoto } from "@/components/foto";
import { Galeria } from "@/components/galeria";
import { cuidados, depoimentos, etapasAvaliacao, procedimentos, studio } from "@/data/studio";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
        <div>
          <p className="kicker">Sobrancelhas · micropigmentação</p>
          <h1 id="titulo" className="mt-4 text-[2.75rem] leading-[1.02] font-light sm:text-6xl lg:text-7xl">
            Sobrancelhas que parecem <em className="font-normal text-cacau">suas</em>. Só que completas.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Antes de qualquer agulha, você vê o desenho no seu rosto e aprova no espelho. Arraste a linha da foto e compare o
            antes e o depois do mesmo rosto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#agendar" className="btn btn-primary">
              Marcar avaliação
            </Link>
            <Link href="/#antes-e-depois" className="btn btn-secondary">
              Ver antes e depois
              <ArrowDown aria-hidden className="size-4" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">{studio.atendimento}</p>
        </div>

        <figure>
          <Comparador
            antes="hero-antes"
            depois="hero-depois"
            rotulo="micropigmentação fio a fio em sobrancelha com falhas"
            sizes="(min-width: 1024px) 600px, 100vw"
            preload
            inicial={46}
            className="aspect-[4/5] rounded-card sm:aspect-[5/4]"
          />
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-muted">
            <span>Arraste a linha para comparar.</span>
            <span>Imagem ilustrativa (IA)</span>
          </figcaption>
        </figure>
      </section>

      <section id="procedimentos" aria-labelledby="procedimentos-titulo" className="border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker">Procedimentos</p>
          <h2 id="procedimentos-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Do design simples à correção de um trabalho antigo
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Faixas de preço de referência. O valor exato sai na avaliação, depois que a profissional vê a sua pele e os seus fios.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {procedimentos.map((p) => (
              <li key={p.id} className="flex flex-col rounded-card border border-line bg-sandbg">
                {temFoto(p.foto) && <Foto id={p.foto} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-2xl leading-tight">{p.nome}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{p.resumo}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-cacau" />
                      <dt className="sr-only">Duração</dt>
                      <dd>{p.duracao}</dd>
                    </div>
                    <div className="flex gap-2">
                      <Hourglass aria-hidden className="mt-0.5 size-4 shrink-0 text-cacau" />
                      <dt className="sr-only">Quanto dura</dt>
                      <dd>{p.dura}</dd>
                    </div>
                    <div className="flex gap-2">
                      <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-cacau" />
                      <dt className="sr-only">Incluído</dt>
                      <dd>{p.inclui}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 font-serif text-2xl">{p.preco}</p>
                  <Link href={`/?procedimento=${p.id}#agendar`} className="btn btn-secondary mt-4 !min-h-11">
                    Avaliar este<span className="sr-only">: {p.nome}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="antes-e-depois" aria-labelledby="galeria-titulo" className="wrap py-16 sm:py-24">
        <p className="kicker">Antes e depois</p>
        <h2 id="galeria-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Encontre uma sobrancelha parecida com a sua
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Cada tipo de sobrancelha pede uma técnica diferente. Escolha o caso mais próximo do seu e arraste para comparar.
        </p>
        <Galeria />
      </section>

      <section id="avaliacao" aria-labelledby="avaliacao-titulo" className="bg-cacau py-16 text-white sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="kicker !text-nude">Como é a avaliação</p>
            <h2 id="avaliacao-titulo" className="mt-3 text-4xl leading-tight sm:text-5xl">
              Você só decide depois de ver o desenho no seu rosto
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              Atendimento individual com a {studio.profissional}, sem pressa e sem compromisso de fazer o procedimento no mesmo dia.
            </p>
            {temFoto("profissional") && (
              <figure className="mt-8 max-w-sm">
                <Foto id="profissional" sizes="384px" className="aspect-[4/5] rounded-card" alt="" />
                <figcaption className="mt-2 text-sm text-white/70">{studio.profissional} (pessoa fictícia, imagem gerada por IA)</figcaption>
              </figure>
            )}
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {etapasAvaliacao.map((etapa, index) => (
              <li key={etapa.titulo} className="rounded-card border border-white/15 p-6">
                <span className="font-serif text-4xl text-nude">{index + 1}</span>
                <h3 className="mt-2 text-2xl">{etapa.titulo}</h3>
                <p className="mt-2 leading-relaxed text-white/80">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="cuidados" aria-labelledby="cuidados-titulo" className="wrap py-16 sm:py-24">
        <p className="kicker">Cuidados</p>
        <h2 id="cuidados-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          O resultado depende também do que você faz antes e depois
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(
            [
              ["Antes do procedimento", cuidados.antes],
              ["Depois do procedimento", cuidados.depois],
            ] as const
          ).map(([titulo, itens]) => (
            <div key={titulo} className="rounded-card border border-line bg-paper p-6 sm:p-8">
              <h3 className="text-3xl">{titulo}</h3>
              <ul className="mt-5 space-y-4">
                {itens.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-cacau" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="depoimentos-titulo" className="border-y border-line bg-paper py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker">Depoimentos de exemplo</p>
          <h2 id="depoimentos-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            O medo de errar é o que mais aparece na conversa
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Textos escritos para esta demonstração, para mostrar como a seção funciona. Não são de clientes reais.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {depoimentos.map((d) => (
              <li key={d.nome} className="flex flex-col rounded-card bg-sandbg p-6">
                <blockquote className="flex-1 font-serif text-2xl leading-snug">“{d.texto}”</blockquote>
                <p className="mt-5 text-sm">
                  <span className="font-medium">{d.nome}</span> <span className="text-muted">· {d.procedimento}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="agendar" aria-labelledby="agendar-titulo" className="wrap scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">Agendamento</p>
        <h2 id="agendar-titulo" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Marque a sua avaliação
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Quatro passos. Se você já fez micropigmentação antes, a página pergunta o que a profissional precisa saber.
        </p>
        <Suspense fallback={<Agendamento />}>
          <AgendamentoComParametros />
        </Suspense>
      </section>
    </>
  );
}
