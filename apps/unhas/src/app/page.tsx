import { ArrowDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Agendamento } from "@/components/agendamento";
import { Catalogo } from "@/components/catalogo";
import { Foto, temFoto } from "@/components/foto";
import { Montador } from "@/components/montador";
import { biosseguranca, cuidados, esmalteria } from "@/data/esmalteria";
import { planos } from "@/lib/unhas";

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo" className="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <p className="kicker">Gel, fibra e banho em gel · {esmalteria.bairro}</p>
          <h1 id="titulo" className="mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl">
            Achou uma unha no Pinterest? A gente diz o que é, quanto custa e quanto tempo leva.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Escolha uma foto do catálogo ou monte a sua: formato, comprimento, cor e decoração. Depois é só marcar, uma vez ou já com a
            manutenção no seu horário fixo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#catalogo" className="btn btn-primary">
              Ver o catálogo
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <Link href="/#montador" className="btn btn-secondary">
              Montar do zero
            </Link>
          </div>
        </div>
        {temFoto("hero-maos") ? (
          <Foto id="hero-maos" sizes="(min-width: 1024px) 560px, 100vw" preload className="aspect-[4/3] rounded-card" />
        ) : (
          <div aria-hidden className="aspect-[4/3] rounded-card bg-rosa-suave" />
        )}
      </section>

      <section id="catalogo" aria-labelledby="catalogo-titulo" className="scroll-mt-20 border-y border-line bg-paper py-14 sm:py-20">
        <div className="wrap">
          <p className="kicker">Catálogo</p>
          <h2 id="catalogo-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Encontre a sua por formato e estilo
          </h2>
          <p className="mt-3 max-w-2xl text-muted">Cada foto já mostra o nome do serviço, o preço e a duração do atendimento.</p>
          <Catalogo />
          <p className="mt-4 text-sm text-muted">Fotos ilustrativas, geradas por IA para esta demonstração.</p>
        </div>
      </section>

      <section id="montador" aria-labelledby="montador-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Montador da combinação</p>
        <h2 id="montador-titulo" tabIndex={-1} className="mt-3 max-w-2xl text-3xl leading-tight outline-none sm:text-4xl">
          Monte a sua e veja preço e duração na hora
        </h2>
        <Montador />
      </section>

      <section id="planos" aria-labelledby="planos-titulo" className="scroll-mt-20 bg-ink py-14 text-white sm:py-20">
        <div className="wrap">
          <p className="kicker !text-rosa">Planos de manutenção</p>
          <h2 id="planos-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Seu horário fixo, sem precisar lembrar de marcar
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            A unha dura bonita quando a manutenção é feita no prazo. No plano, o seu dia e horário ficam reservados e você recebe um
            lembrete dois dias antes.
          </p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            <li className="rounded-card border border-white/15 p-6">
              <h3 className="text-xl">Avulso</h3>
              <p className="mt-2 text-white/80">Você marca cada manutenção quando lembrar. Sem desconto e sujeito a horário livre.</p>
            </li>
            {planos.map((p) => (
              <li key={p.id} className="rounded-card border border-rosa/60 bg-white/5 p-6">
                <h3 className="text-xl">{p.nome}</h3>
                <p className="mt-1 text-2xl font-bold text-rosa">{Math.round(p.desconto * 100)}% de desconto</p>
                <p className="mt-2 text-white/80">{p.vantagem}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cuidados" aria-labelledby="cuidados-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Para durar</p>
        <h2 id="cuidados-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Cuidados para a unha durar até a manutenção
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cuidados.map((c) => (
            <li key={c.titulo} className="rounded-card border border-line bg-paper p-5">
              <h3 className="font-semibold">{c.titulo}</h3>
              <p className="mt-2 leading-relaxed text-muted">{c.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="biosseguranca" aria-labelledby="bio-titulo" className="scroll-mt-20 border-y border-line bg-paper py-14 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="kicker flex items-center gap-2">
              <ShieldCheck aria-hidden className="size-4" />
              Biossegurança
            </p>
            <h2 id="bio-titulo" className="mt-3 text-3xl leading-tight sm:text-4xl">
              Material esterilizado, aberto na sua frente
            </h2>
            {temFoto("autoclave") && <Foto id="autoclave" sizes="(min-width: 1024px) 460px, 100vw" className="mt-8 aspect-[4/3] rounded-card" />}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {biosseguranca.map((b) => (
              <li key={b.titulo} className="rounded-card bg-sandbg p-5">
                <h3 className="font-semibold">{b.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="agendar" aria-labelledby="agendar-titulo" className="wrap scroll-mt-20 py-14 sm:py-20">
        <p className="kicker">Agendamento</p>
        <h2 id="agendar-titulo" className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Marque uma vez ou garanta a manutenção
        </h2>
        <Agendamento />
      </section>
    </>
  );
}
