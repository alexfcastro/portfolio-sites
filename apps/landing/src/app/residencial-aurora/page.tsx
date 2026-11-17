import { BedDouble, Car, Maximize, Trees } from "lucide-react";
import type { Metadata } from "next";
import { Cena, Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { Abas } from "@/components/widgets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Residencial Aurora — lançamento imobiliário",
  description: "Landing page de demonstração para lançamento imobiliário: fotos, plantas e cadastro de interesse. Empreendimento fictício.",
};

const plantas = [
  { id: "2d", titulo: "2 dormitórios", area: "68 m²", quartos: "2 dormitórios (1 suíte)", vagas: "1 vaga", destaque: "Varanda integrada à sala" },
  { id: "3d", titulo: "3 dormitórios", area: "92 m²", quartos: "3 dormitórios (1 suíte)", vagas: "2 vagas", destaque: "Varanda gourmet com churrasqueira" },
  { id: "cob", titulo: "Cobertura", area: "140 m²", quartos: "3 suítes", vagas: "2 vagas", destaque: "Terraço privativo com vista livre" },
];

export default function Page() {
  return (
    <div className="lp" data-lp="aurora">
      <Hero
        fotoId="aurora-fachada"
        kicker="Lançamento · Parque das Águas"
        title={
          <>
            Acorde com a cidade <em className="lp-accent">aos seus pés.</em>
          </>
        }
        text="Apartamentos de 2 e 3 dormitórios e coberturas, com varanda gourmet, lazer completo e o parque como vizinho."
        aside={
          <div id="tabela" className="lg:justify-self-end">
            <LeadForm
              title="Receba a tabela e as plantas"
              cta="Quero receber"
              extraLabel="Qual planta interessa?"
              extraOptions={plantas.map((planta) => `${planta.titulo} · ${planta.area}`)}
              successTitle="Pedido registrado"
              successText="Um corretor enviaria a tabela de preços, as plantas e as condições de lançamento."
            />
          </div>
        }
      >
        <a href="#tabela" className="btn lp-btn">
          Receber tabela e plantas
        </a>
        <a href="#plantas" className="btn lp-btn-ghost">
          Ver as plantas
        </a>
      </Hero>

      <Faixa
        className="lp-display text-xl"
        itens={["68 a 140 m²", "Varanda gourmet", "Lazer na cobertura", "Ao lado do parque", "2 e 3 dormitórios"]}
      />

      <section aria-labelledby="viver-title" className="wrap py-16 sm:py-24">
        <Heading id="viver-title" kicker="O empreendimento" title="Cada ambiente pensado para ficar.">
          <p>Fotos ilustrativas do decorado e das áreas comuns.</p>
        </Heading>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { id: "aurora-living", titulo: "Sala integrada", texto: "Estar e jantar em um só ambiente, com janelas do piso ao teto." },
            { id: "aurora-varanda", titulo: "Varanda gourmet", texto: "Churrasqueira, bancada e espaço para a mesa dos domingos." },
            { id: "aurora-lazer", titulo: "Lazer na cobertura", texto: "Piscina com borda infinita, deck e a vista do parque." },
          ].map((item) => (
            <li key={item.id}>
              <div className="painel-foto aspect-[3/4] rounded-card p-6 text-white">
                <Cena id={item.id} sizes="(min-width: 768px) 33vw, 100vw" />
                <div className="painel-texto">
                  <h3 className="text-3xl font-bold">{item.titulo}</h3>
                  <p className="mt-2 text-white/90">{item.texto}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="plantas" aria-labelledby="plantas-title" className="lp-band py-16 sm:py-24">
        <div className="wrap">
          <Heading id="plantas-title" kicker="Plantas" title="Escolha o tamanho da sua rotina." />
          <div className="mt-8">
            <Abas
              label="Tipo de planta"
              abas={plantas.map((planta) => ({
                id: planta.id,
                titulo: planta.titulo,
                conteudo: (
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                    <div>
                      <p className="lp-display lp-accent text-7xl font-bold">{planta.area}</p>
                      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                        {[
                          { icon: BedDouble, label: "Dormitórios", value: planta.quartos },
                          { icon: Car, label: "Garagem", value: planta.vagas },
                          { icon: Maximize, label: "Área privativa", value: planta.area },
                          { icon: Trees, label: "Destaque", value: planta.destaque },
                        ].map((item) => (
                          <div key={item.label} className="flex gap-3">
                            <item.icon aria-hidden className="lp-accent mt-1 size-5 shrink-0" />
                            <div>
                              <dt className="lp-muted text-sm">{item.label}</dt>
                              <dd className="font-semibold">{item.value}</dd>
                            </div>
                          </div>
                        ))}
                      </dl>
                      <a href="#tabela" className="btn lp-btn mt-8">
                        Quero a planta de {planta.titulo.toLowerCase()}
                      </a>
                    </div>
                    {/* Planta esquemática, só para ilustrar a distribuição dos ambientes. */}
                    <div
                      aria-hidden
                      className="grid aspect-[4/3] grid-cols-6 grid-rows-4 gap-1.5 rounded-card border p-3 text-xs font-semibold"
                      style={{ borderColor: "var(--lp-line)", background: "var(--lp-bg)" }}
                    >
                      {[
                        ["Sala", "col-span-4 row-span-2"],
                        ["Varanda", "col-span-2 row-span-2"],
                        ["Cozinha", "col-span-2 row-span-2"],
                        ["Suíte", "col-span-2 row-span-2"],
                        [planta.id === "2d" ? "Dormitório" : "Dormitórios", "col-span-2 row-span-2"],
                      ].map(([nome, span]) => (
                        <div
                          key={nome}
                          className={`flex items-center justify-center rounded-lg border ${span}`}
                          style={{ borderColor: "var(--lp-accent)", color: "var(--lp-fg)" }}
                        >
                          {nome}
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="numeros-title" className="wrap py-16 sm:py-24">
        <h2 id="numeros-title" className="sr-only">
          O empreendimento em números
        </h2>
        <dl className="grid gap-8 text-center sm:grid-cols-4">
          {[
            ["18", "andares"],
            ["72", "apartamentos"],
            ["4", "por andar"],
            ["300 m", "do parque"],
          ].map(([valor, rotulo]) => (
            <div key={rotulo}>
              <dt className="sr-only">{rotulo}</dt>
              <dd>
                <span className="lp-display lp-accent block text-6xl font-bold">{valor}</span>
                <span className="lp-muted mt-1 block">{rotulo}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="lp-muted mt-10 text-center text-sm">
          Números de exemplo. O Residencial Aurora e o bairro Parque das Águas são fictícios.
        </p>
      </section>

      <Rodape nome="Residencial Aurora" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
