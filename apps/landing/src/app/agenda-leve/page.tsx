import { BellRing, CalendarCheck, ChartNoAxesColumn, Link2, Users } from "lucide-react";
import type { Metadata } from "next";
import { Heading, Hero, Rodape } from "@/components/blocks";
import { Faixa } from "@/components/faixa";
import { LeadForm } from "@/components/lead-form";
import { PlanosAgenda } from "@/components/widgets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Agenda Leve — aplicativo de agendamento",
  description: "Landing page de demonstração para aplicativo: o que resolve, recursos, planos e teste grátis. Produto fictício.",
};

const horarios = [
  { hora: "09:00", nome: "Marina", servico: "Corte e escova", estado: "Confirmado" },
  { hora: "10:30", nome: "Rafael", servico: "Barba", estado: "Confirmado" },
  { hora: "11:15", nome: "Horário livre", servico: "Toque para oferecer", estado: "Livre" },
  { hora: "14:00", nome: "Dona Lúcia", servico: "Coloração", estado: "Lembrete enviado" },
];

/** Tela do aplicativo desenhada em HTML: mostra o produto preenchido, sem depender de imagem. */
function Telefone() {
  return (
    <div aria-hidden className="parallax mx-auto w-full max-w-[19rem] lg:justify-self-end">
      <div className="rounded-[2.5rem] border-[10px] border-[#0f1b33] bg-white p-4 shadow-2xl shadow-[#1657e0]/30">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-[#d8e2f5]" />
        <p className="mt-5 text-xs font-bold tracking-wide text-[#4a5873] uppercase">Hoje · terça-feira</p>
        <p className="lp-display text-2xl font-bold text-[#0f1b33]">4 horários</p>
        <ul className="mt-4 space-y-2.5">
          {horarios.map((item) => (
            <li
              key={item.hora}
              className={`rounded-2xl border p-3 ${item.estado === "Livre" ? "border-dashed border-[#1657e0] bg-[#f4f8ff]" : "border-[#d8e2f5] bg-white"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="lp-display text-lg font-bold text-[#0f1b33]">{item.hora}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold ${item.estado === "Livre" ? "bg-[#1657e0] text-white" : "bg-[#e3f4ea] text-[#17603a]"}`}
                >
                  {item.estado}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-[#0f1b33]">{item.nome}</p>
              <p className="text-xs text-[#4a5873]">{item.servico}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-2xl bg-[#1657e0] py-3 text-center text-sm font-bold text-white">+ Novo agendamento</div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="lp" data-lp="agenda">
      <Hero
        fotoId="agenda-hero"
        kicker="Aplicativo de agendamento"
        title={
          <>
            Sua agenda cheia, <span className="lp-accent">sem ficar no WhatsApp.</span>
          </>
        }
        text="O cliente marca sozinho pelo link, recebe o lembrete e você vê o dia inteiro em uma tela só."
        aside={<Telefone />}
      >
        <a href="#testar" className="btn lp-btn">
          Testar 14 dias grátis
        </a>
        <a href="#planos" className="btn lp-btn-ghost">
          Ver os planos
        </a>
      </Hero>

      <Faixa
        className="text-lg"
        itens={["Salões", "Barbearias", "Clínicas", "Estúdios", "Pet shops", "Profissionais autônomos"]}
      />

      <section aria-labelledby="recursos-title" className="wrap py-16 sm:py-24">
        <Heading id="recursos-title" kicker="Recursos" title="Menos mensagem, mais atendimento.">
          <p>O que o aplicativo faz por você enquanto você trabalha.</p>
        </Heading>
        <ul className="mt-10 grid gap-5 md:grid-cols-6">
          {[
            { icon: Link2, titulo: "Link de agendamento", texto: "O cliente escolhe serviço, profissional e horário livre, a qualquer hora.", span: "md:col-span-3" },
            { icon: BellRing, titulo: "Lembrete automático", texto: "Mensagem na véspera para reduzir faltas e atrasos.", span: "md:col-span-3" },
            { icon: Users, titulo: "Agenda por profissional", texto: "Cada um vê os seus horários; você vê todos.", span: "md:col-span-2" },
            { icon: CalendarCheck, titulo: "Sem conflito", texto: "Dois clientes nunca ficam no mesmo horário.", span: "md:col-span-2" },
            { icon: ChartNoAxesColumn, titulo: "Resumo do mês", texto: "Atendimentos, faltas e horários mais procurados.", span: "md:col-span-2" },
          ].map((item) => (
            <li key={item.titulo} className={`lp-card rounded-card p-7 ${item.span}`}>
              <span
                className="flex size-12 items-center justify-center rounded-2xl"
                style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}
              >
                <item.icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-5 text-2xl font-bold">{item.titulo}</h3>
              <p className="lp-muted mt-2 text-lg">{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="planos" aria-labelledby="planos-title" className="lp-band py-16 sm:py-24">
        <div className="wrap">
          <Heading id="planos-title" kicker="Planos" title="Comece pequeno e cresça quando precisar.">
            <p>Valores de exemplo. Todos os planos começam com 14 dias grátis.</p>
          </Heading>
          <div className="mt-8">
            <PlanosAgenda />
          </div>
        </div>
      </section>

      <section id="testar" aria-labelledby="testar-title" className="wrap grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading id="testar-title" kicker="Teste grátis" title="Monte a sua agenda em poucos minutos.">
            <p>Sem cartão de crédito. Se não gostar, é só não continuar.</p>
          </Heading>
          <ol className="mt-8 space-y-4">
            {["Cadastre os serviços e os horários de atendimento.", "Compartilhe o link com os clientes.", "Acompanhe os agendamentos chegando."].map((passo, index) => (
              <li key={passo} className="flex items-center gap-4 text-lg">
                <span
                  className="lp-display flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                  style={{ background: "var(--lp-accent)", color: "var(--lp-on-accent)" }}
                >
                  {index + 1}
                </span>
                {passo}
              </li>
            ))}
          </ol>
        </div>
        <LeadForm
          title="Criar minha conta de teste"
          cta="Começar o teste grátis"
          extraLabel="Qual o seu tipo de negócio?"
          extraOptions={["Salão ou barbearia", "Clínica ou consultório", "Estúdio ou academia", "Outro"]}
          successTitle="Conta de teste criada"
          successText="Você receberia o acesso ao aplicativo e um guia de primeiros passos."
        />
      </section>

      <Rodape nome="Agenda Leve" quoteUrl={siteConfig.portfolio.quoteUrl} />
    </div>
  );
}
