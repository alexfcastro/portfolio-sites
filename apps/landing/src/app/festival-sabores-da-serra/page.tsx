import { CalendarDays, MapPin, Music, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { Abas } from "@/components/widgets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Festival Sabores da Serra — evento gastronômico",
  description: "Landing page de demonstração para evento: programação por dia, atrações, ingressos e reserva. Evento fictício.",
};

const dias = [
  {
    id: "sex",
    titulo: "Sexta",
    itens: [
      ["18h", "Abertura dos portões e praça de food trucks"],
      ["19h30", "Aula-show: fogo de chão"],
      ["21h", "Show de abertura no palco principal"],
    ],
  },
  {
    id: "sab",
    titulo: "Sábado",
    itens: [
      ["12h", "Almoço dos produtores da serra"],
      ["15h", "Oficina de queijos e harmonização"],
      ["17h", "Aula-show: massas artesanais"],
      ["21h", "Noite de samba e MPB"],
    ],
  },
  {
    id: "dom",
    titulo: "Domingo",
    itens: [
      ["11h", "Feira de produtores e café colonial"],
      ["14h", "Cozinha para crianças"],
      ["17h", "Show de encerramento ao pôr do sol"],
    ],
  },
];

const ingressos = [
  { nome: "Um dia", preco: "R$ 60,00", texto: "Entrada para um dia à sua escolha." },
  { nome: "Passaporte", preco: "R$ 140,00", texto: "Os três dias, com acesso às aulas-show.", destaque: true },
  { nome: "Mesa para 4", preco: "R$ 480,00", texto: "Mesa reservada perto do palco, para um dia." },
];

export default function Page() {
  return (
    <div className="lp" data-lp="festival">
      <Hero
        fotoId="festival-hero"
        kicker="14 a 16 de março · Vale do Sol"
        title={
          <>
            Três dias de fogo, <span className="lp-accent">sabor e música.</span>
          </>
        }
        text="Mais de 30 cozinhas, aulas-show com chefs, feira de produtores e palco ao ar livre no alto da serra."
      >
        <a href="#ingressos" className="btn lp-btn">
          Reservar ingresso
        </a>
        <a href="#programacao" className="btn lp-btn-ghost">
          Ver a programação
        </a>
      </Hero>

      <Faixa
        className="text-xl"
        itens={["30 cozinhas", "Aulas-show", "Feira de produtores", "Palco ao ar livre", "Espaço para crianças"]}
      />

      <section aria-labelledby="festival-title" className="wrap py-16 sm:py-24">
        <Heading id="festival-title" kicker="O festival" title="Venha com fome e sem pressa." />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { id: "festival-prato", icon: UtensilsCrossed, titulo: "Comida de verdade", texto: "Do fogo de chão ao doce de tacho, feito na hora." },
            { id: "festival-palco", icon: Music, titulo: "Música ao vivo", texto: "Um show por noite, do samba ao rock, com a serra ao fundo." },
            { id: "festival-feira", icon: MapPin, titulo: "Produtores da região", texto: "Queijos, cafés, mel e geleias direto de quem faz." },
          ].map((item) => (
            <li key={item.id}>
              <div className="painel-foto aspect-[3/4] rounded-card p-6 text-white">
                <Cena id={item.id} sizes="(min-width: 768px) 33vw, 100vw" />
                <div className="painel-texto">
                  <item.icon aria-hidden className="size-8" />
                  <h3 className="mt-3 text-3xl font-bold">{item.titulo}</h3>
                  <p className="mt-2 text-white/90">{item.texto}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="programacao" aria-labelledby="programacao-title" className="lp-band py-16 sm:py-24">
        <div className="wrap">
          <Heading id="programacao-title" kicker="Programação" title="O que acontece em cada dia." />
          <div className="mt-8">
            <Abas
              label="Dia do festival"
              abas={dias.map((dia) => ({
                id: dia.id,
                titulo: dia.titulo,
                conteudo: (
                  <ol className="divide-y" style={{ borderColor: "var(--lp-line)" }}>
                    {dia.itens.map(([hora, atividade]) => (
                      <li key={hora} className="flex items-baseline gap-6 py-4" style={{ borderColor: "var(--lp-line)" }}>
                        <span className="lp-display lp-accent w-20 shrink-0 text-3xl font-bold">{hora}</span>
                        <span className="text-xl">{atividade}</span>
                      </li>
                    ))}
                  </ol>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section id="ingressos" aria-labelledby="ingressos-title" className="wrap py-16 sm:py-24">
        <Heading id="ingressos-title" kicker="Ingressos" title="Escolha como você quer viver o festival.">
          <p>Valores de exemplo. Crianças até 10 anos não pagam.</p>
        </Heading>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {ingressos.map((ingresso) => (
              <li
                key={ingresso.nome}
                className="lp-card flex flex-col rounded-card p-6"
                style={ingresso.destaque ? { borderColor: "var(--lp-accent)" } : undefined}
              >
                <h3 className="text-2xl font-bold">{ingresso.nome}</h3>
                <p className="lp-display lp-accent mt-3 text-4xl font-bold">{ingresso.preco}</p>
                <p className="lp-muted mt-3 flex-1">{ingresso.texto}</p>
              </li>
            ))}
          </ul>
          <LeadForm
            title="Reserve o seu ingresso"
            cta="Reservar"
            extraLabel="Qual ingresso?"
            extraOptions={ingressos.map((ingresso) => `${ingresso.nome} · ${ingresso.preco}`)}
            successTitle="Reserva registrada"
            successText="Você receberia o link de pagamento e o ingresso com QR code."
          />
        </div>
        <p className="lp-muted mt-10 flex items-center gap-2">
          <CalendarDays aria-hidden className="lp-accent size-5" />
          14 a 16 de março, no Parque Vale do Sol. Evento, local e datas fictícios.
        </p>
      </section>

      <Rodape nome="Festival Sabores da Serra" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
