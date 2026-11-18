import { Check, ChevronDown, X } from "lucide-react";
import type { Metadata } from "next";
import { BarraReserva } from "@/components/barra-reserva";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { DataTurma, ReservaCurso, Vagas } from "@/components/reserva-curso";
import { siteConfig } from "@/config/site";
import { CURSO, parcela } from "@/lib/curso";

export const metadata: Metadata = {
  title: "Curso Volume Perfeito — turma presencial de cílios",
  description: "Landing page de demonstração para curso presencial de volume em cílios: turma de seis alunas, cronograma, investimento e reserva de vaga. Curso fictício.",
};

function brl(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

/** O mesmo botão de reserva, repetido ao longo da página. */
function Cta({ texto = "Reservar minha vaga" }: { texto?: string }) {
  return (
    <a href="#reserva" className="btn lp-btn">
      {texto}
    </a>
  );
}

const paraQuem = [
  "Você já aplica fio a fio e quer cobrar mais com volume",
  "Você trabalha com sobrancelha ou maquiagem e quer somar cílios à agenda",
  "Você quer turma pequena, com a professora do seu lado na modelo real",
];

const naoE = [
  "Para quem nunca segurou uma pinça: comece por um curso de fio a fio",
  "Para quem procura certificado rápido sem prática",
  "Para quem não pode estar presente nos dois dias inteiros",
];

const cronograma = [
  {
    dia: "Sábado · 9h às 18h",
    titulo: "Leque, mapeamento e prática em cabeça",
    itens: ["Volume brasileiro, egípcio e russo: quando usar cada um", "Montagem de leques à mão, do 3D ao 6D", "Mapeamento pelo formato do olho", "Prática guiada em cabeça de treino, com correção individual"],
  },
  {
    dia: "Domingo · 9h às 18h",
    titulo: "Modelo real, manutenção e preço",
    itens: ["Atendimento completo em modelo real, com a professora ao lado", "Manutenção, remoção e como evitar alergia", "Fotos do trabalho com luz de celular", "Preço, tempo de atendimento e como encher a agenda"],
  },
];

const kit = [
  "Kit com pinças de volume, cola, primer e fios em três curvaturas",
  "Cabeça de treino para continuar praticando em casa",
  "Apostila com os mapeamentos e o passo a passo dos leques",
  "Certificado de conclusão de curso livre",
  "60 dias de correção de fotos dos seus trabalhos pelo WhatsApp",
];

const perguntas = [
  { p: "Preciso levar modelo?", r: "Não. A escola providencia as modelos do segundo dia. Se quiser trazer alguém, avise na reserva." },
  { p: "E se eu não puder ir em um dos dias?", r: "A vaga é transferida para a próxima turma uma única vez, avisando com 7 dias de antecedência." },
  { p: "O certificado vale como diploma?", r: "É um certificado de curso livre. Para trabalhar com cílios no Brasil, não é exigido diploma técnico." },
  { p: "Em quanto tempo eu consigo cobrar?", r: "Isso depende da sua prática. A maioria das ex-alunas faz as primeiras clientes pagantes entre 2 e 6 semanas depois." },
  { p: "Tem desistência e reembolso?", r: "Até 15 dias antes da turma, o valor é devolvido integralmente. Depois disso, a vaga pode ser transferida." },
];

const trabalhos = [
  { id: "vp-aluna-1", nome: "Larissa", turma: "turma de agosto" },
  { id: "vp-aluna-2", nome: "Kelly", turma: "turma de setembro" },
  { id: "vp-aluna-3", nome: "Priscila", turma: "turma de outubro" },
];

export default function Page() {
  return (
    <div className="lp pb-20 md:pb-0" data-lp="volume">
      <Hero
        fotoId="vp-hero"
        kicker="Curso presencial · 2 dias · 6 alunas"
        title={
          <>
            Volume que vende. <span className="lp-accent">Em dois dias, na prática.</span>
          </>
        }
        text="Turma pequena em São Paulo, com modelo real no segundo dia e a professora do seu lado. Você sai sabendo montar leque, mapear o olhar e cobrar pelo volume."
      >
        <Cta />
        <p className="lp-muted self-center text-sm font-semibold">
          <Vagas />
        </p>
      </Hero>

      <section aria-labelledby="para-quem-title" className="wrap py-16 sm:py-24">
        <Heading id="para-quem-title" kicker="Antes de reservar" title="Para quem é, e para quem não é." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="lp-card p-7">
            <h3 className="text-2xl font-bold">É para você se…</h3>
            <ul className="mt-5 space-y-4">
              {paraQuem.map((t) => (
                <li key={t} className="flex gap-3 text-lg">
                  <Check aria-hidden className="lp-accent mt-1 size-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-card p-7">
            <h3 className="text-2xl font-bold">Não é para você se…</h3>
            <ul className="mt-5 space-y-4">
              {naoE.map((t) => (
                <li key={t} className="lp-muted flex gap-3 text-lg">
                  <X aria-hidden className="mt-1 size-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="cronograma-title" className="lp-band py-16 sm:py-24">
        <div className="wrap">
          <Heading id="cronograma-title" kicker="Cronograma" title="Dois dias inteiros, com hora marcada.">
            <p>
              Próxima turma: <DataTurma />.
            </p>
          </Heading>
          <ol className="mt-10 grid gap-5 lg:grid-cols-2">
            {cronograma.map((d) => (
              <li key={d.dia} className="lp-card p-7">
                <p className="lp-accent text-sm font-bold tracking-wide uppercase">{d.dia}</p>
                <h3 className="mt-2 text-2xl font-bold">{d.titulo}</h3>
                <ul className="mt-5 space-y-3">
                  {d.itens.map((i) => (
                    <li key={i} className="flex gap-3">
                      <Check aria-hidden className="lp-accent mt-1 size-4 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Cta />
          </div>
        </div>
      </section>

      <section aria-labelledby="kit-title" className="wrap grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading id="kit-title" kicker="O que você leva" title="Você sai com material para começar no dia seguinte." />
          <ul className="mt-8 space-y-4">
            {kit.map((k) => (
              <li key={k} className="flex gap-3 text-lg">
                <Check aria-hidden className="lp-accent mt-1 size-5 shrink-0" />
                {k}
              </li>
            ))}
          </ul>
        </div>
        <Cena id="vp-aula" sizes="(min-width: 1024px) 520px, 100vw" className="aspect-[4/3] rounded-card" />
      </section>

      <section aria-labelledby="professora-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-10 md:grid-cols-[18rem_1fr] md:items-center">
          <Cena id="vp-professora" sizes="288px" className="aspect-square rounded-card" />
          <div>
            <Heading id="professora-title" kicker="Quem ensina" title="Bianca Moraes, lash designer há 9 anos.">
              <p>
                Atende volume todos os dias e dá aula em turmas pequenas porque acredita que leque se aprende com alguém corrigindo a sua mão,
                não assistindo vídeo. Pessoa fictícia, com retrato gerado por IA.
              </p>
            </Heading>
          </div>
        </div>
      </section>

      <section aria-labelledby="trabalhos-title" className="wrap py-16 sm:py-24">
        <Heading id="trabalhos-title" kicker="Trabalhos de ex-alunas" title="O que sai depois de dois dias de prática.">
          <p>Exemplos desta demonstração: nomes e fotos (geradas por IA) não são de alunas reais.</p>
        </Heading>
        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {trabalhos.map((t) => (
            <li key={t.id}>
              <figure>
                <Cena id={t.id} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-square rounded-card" />
                <figcaption className="lp-muted mt-2 text-sm">
                  <span className="font-semibold text-[var(--lp-fg)]">{t.nome}</span> · {t.turma}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="investimento-title" className="lp-band py-16 sm:py-24">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Heading id="investimento-title" kicker="Investimento" title="Parcela que cabe, e a conta fecha nas primeiras clientes.">
            <p>
              Um atendimento de volume custa em média de R$ 180 a R$ 250. Com sete a dez clientes, o curso está pago. Valores de demonstração.
            </p>
          </Heading>
          <div className="lp-card p-7">
            <p className="lp-muted">No cartão, sem juros</p>
            <p className="lp-display mt-1 text-5xl font-bold">
              {CURSO.parcelasMax}× {brl(parcela(CURSO.parcelasMax))}
            </p>
            <p className="lp-muted mt-1">total de {brl(CURSO.cartao)}</p>
            <p className="mt-5 border-t border-[var(--lp-line)] pt-5 text-lg">
              ou <strong className="lp-accent">{brl(CURSO.pix)}</strong> no Pix, à vista
            </p>
            <div className="mt-6">
              <Cta />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap max-w-3xl py-16 sm:py-24">
        <Heading id="faq-title" kicker="Perguntas frequentes" title="Antes de garantir a sua vaga." />
        <div className="mt-8 divide-y divide-[var(--lp-line)] border-y border-[var(--lp-line)]">
          {perguntas.map((q) => (
            <details key={q.p} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold">
                {q.p}
                <ChevronDown aria-hidden className="lp-accent size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="lp-muted pb-5 leading-relaxed">{q.r}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="reserva" aria-labelledby="reserva-title" className="lp-band scroll-mt-4 py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Heading id="reserva-title" kicker="Reserva de vaga" title="Garanta a sua vaga na turma.">
            <p>Escolha a forma de pagamento, veja a parcela e reserve. A confirmação chega pelo WhatsApp.</p>
          </Heading>
          <ReservaCurso />
        </div>
      </section>

      <Rodape nome="Curso Volume Perfeito" quoteUrl={siteConfig.portfolio.quoteUrl} />
      <BarraReserva />
    </div>
  );
}
