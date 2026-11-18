import { CalendarClock, Check, Clock, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import { AgendamentoCliente } from "@/components/agendamento-cliente";
import { Foto, temFoto } from "@/components/foto";
import { Portas, PortasComParametros } from "@/components/portas";
import { ReservaVaga, VagasTurma } from "@/components/reserva-vaga";
import { curso, exAlunas, tecnicas } from "@/data/lab";
import { TURMA, parcela } from "@/lib/curso";
import { formatBRL } from "@/lib/money";

const olhares = [
  { id: "olhar-fio-a-fio", legenda: "Fio a fio clássico" },
  { id: "olhar-brasileiro", legenda: "Volume brasileiro" },
  { id: "olhar-russo", legenda: "Volume russo" },
  { id: "olhar-lifting", legenda: "Lash lifting" },
];

/** Caminho da cliente: técnicas, galeria e agendamento. */
function CaminhoCliente() {
  return (
    <>
      <section id="tecnicas" aria-labelledby="tecnicas-titulo" className="wrap py-14 sm:py-20">
        <p className="kicker">Para você</p>
        <h2 id="tecnicas-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">
          Quatro técnicas. Quanto dura e quando voltar
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tecnicas.map((t) => (
            <li key={t.id} className="flex flex-col overflow-hidden rounded-card border border-line bg-paper">
              {temFoto(t.foto) && <Foto id={t.foto} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-square" />}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl">{t.nome}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{t.efeito}</p>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-rosa-escuro" />
                    <dt className="sr-only">Durabilidade</dt>
                    <dd>Dura {t.dura}</dd>
                  </div>
                  <div className="flex gap-2">
                    <RefreshCw aria-hidden className="mt-0.5 size-4 shrink-0 text-rosa-escuro" />
                    <dt className="sr-only">Manutenção</dt>
                    <dd>{t.manutencao}</dd>
                  </div>
                  <div className="flex gap-2">
                    <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-rosa-escuro" />
                    <dt className="sr-only">Tempo de aplicação</dt>
                    <dd>Aplicação: {t.aplicacao}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                  {t.preco}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="olhares" aria-labelledby="olhares-titulo" className="bg-ink py-14 text-offwhite sm:py-20">
        <div className="wrap">
          <p className="kicker !text-rosa-claro">Galeria de olhares</p>
          <h2 id="olhares-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">
            De perto, do jeito que fica
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {olhares.map((o) => (
              <li key={o.id}>
                <figure>
                  {temFoto(`galeria-${o.id}`) ? (
                    <Foto id={`galeria-${o.id}`} sizes="(min-width: 1024px) 280px, 50vw" className="aspect-[4/5] rounded-card" />
                  ) : (
                    <div aria-hidden className="aspect-[4/5] rounded-card bg-white/10" />
                  )}
                  <figcaption className="mt-2 text-sm text-white/80">{o.legenda}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/60">Fotos ilustrativas, geradas por IA para esta demonstração.</p>
        </div>
      </section>

      <section id="agendar" aria-labelledby="agendar-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Agendamento</p>
        <h2 id="agendar-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">
          Marque o seu horário
        </h2>
        <AgendamentoCliente />
      </section>
    </>
  );
}

/** Caminho da aluna: turma, conteúdo, investimento, ex-alunas e reserva de vaga. */
function CaminhoAluna() {
  return (
    <>
      <section id="turma" aria-labelledby="turma-titulo" className="wrap py-14 sm:py-20">
        <p className="kicker">Para quem quer aprender</p>
        <h2 id="turma-titulo" className="mt-3 max-w-3xl text-3xl leading-tight sm:text-5xl">
          {curso.nome}: dois dias, no máximo três alunas
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{curso.paraQuem}</p>
        <div className="mt-8">
          <VagasTurma />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {curso.dias.map((dia) => (
            <div key={dia.titulo} className="rounded-card border border-line bg-paper p-6 sm:p-8">
              <h3 className="text-2xl">{dia.titulo}</h3>
              <ul className="mt-4 space-y-3">
                {dia.itens.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-rosa-escuro" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-card border border-line bg-paper p-6 sm:p-8">
            <h3 className="text-2xl">O que você leva para casa</h3>
            <ul className="mt-4 space-y-3">
              {curso.kit.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-rosa-escuro" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-ink p-6 text-offwhite sm:p-8">
            <h3 className="text-2xl">Investimento</h3>
            <p className="mt-4 text-sm text-white/70">No cartão, sem juros</p>
            <p className="text-4xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              {TURMA.parcelasMax}× {formatBRL(parcela(TURMA.parcelasMax))}
            </p>
            <p className="mt-1 text-sm text-white/70">total de {formatBRL(TURMA.cartao)}</p>
            <p className="mt-5 border-t border-white/15 pt-4">
              ou <strong>{formatBRL(TURMA.aVista)}</strong> no Pix, com sinal de {formatBRL(TURMA.sinal)} para garantir a vaga
            </p>
            <p className="mt-2 text-sm text-white/70">{curso.carga}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="exalunas-titulo" className="bg-ink py-14 text-offwhite sm:py-20">
        <div className="wrap">
          <p className="kicker !text-rosa-claro">Trabalhos de ex-alunas</p>
          <h2 id="exalunas-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">
            O que dá para fazer depois do curso
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {exAlunas.map((a) => (
              <li key={a.id}>
                <figure>
                  {temFoto(a.id) ? (
                    <Foto id={a.id} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] rounded-card" />
                  ) : (
                    <div aria-hidden className="aspect-[4/3] rounded-card bg-white/10" />
                  )}
                  <figcaption className="mt-3">
                    <span className="font-semibold">{a.nome}</span> <span className="text-white/60">· {a.turma}</span>
                    <span className="mt-1 block text-white/80">“{a.texto}”</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/60">
            Exemplos desta demonstração: nomes, falas e fotos (geradas por IA) não são de alunas reais.
          </p>
        </div>
      </section>

      <section id="reserva" aria-labelledby="reserva-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Reserva de vaga</p>
        <h2 id="reserva-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">
          Garanta a sua vaga na turma
        </h2>
        <div className="mt-8 max-w-3xl">
          <VagasTurma />
          <ReservaVaga />
        </div>
      </section>
    </>
  );
}

export default function Home() {
  const caminhos = { cliente: <CaminhoCliente />, aluna: <CaminhoAluna /> };
  return (
    <Suspense fallback={<Portas {...caminhos} />}>
      <PortasComParametros {...caminhos} />
    </Suspense>
  );
}
