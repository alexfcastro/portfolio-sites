import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Foto, Retrato, temFoto } from "@/components/foto";
import { intensityLabels, modalities, plans, teachers, weeklyClasses } from "@/data/studio";
import { formatBRL } from "@/lib/money";

const intensityBars = { leve: 1, moderada: 2, alta: 3 } as const;

export default function HomePage() {
  const cheapest = Math.min(...plans.map((p) => p.monthlyCents));
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-edge">
        {temFoto("hero") && (
          <>
            <Foto id="hero" preload sizes="100vw" className="absolute inset-0 -z-20 size-full" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/90 to-night/55" />
          </>
        )}
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-25"
        >
          <path
            d="M0 120 H240 L270 60 L310 170 L350 30 L385 140 L410 110 H800"
            stroke="#c6f432"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
        <div className="wrap relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
          <div>
          <p className="kicker">Estúdio de treino em grupo</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            Treine no seu ritmo. <span className="text-lime">Sinta o pulso.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {modalities.length} modalidades, {weeklyClasses.length} aulas por semana e turmas pequenas. Veja a grade, filtre
            pelo seu horário e reserve uma aula experimental.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/aulas" className="btn btn-primary">
              Reservar aula experimental
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/planos" className="btn btn-secondary">
              Planos a partir de {formatBRL(cheapest)}/mês
            </Link>
          </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              [String(modalities.length), "modalidades"],
              [String(weeklyClasses.length), "aulas por semana"],
              [String(teachers.length), "professores"],
              [`${Math.max(...weeklyClasses.map((c) => c.capacity))}`, "vagas no máximo por turma"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-card border border-edge bg-panel/80 p-6">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-5xl font-bold text-lime">{value}</span>
                  <span className="mt-1 block text-sm text-muted">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="modalidades-title" className="wrap py-16">
        <p className="kicker">Modalidades</p>
        <h2 id="modalidades-title" className="mt-2 text-4xl">Escolha como quer suar</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modalities.map((modality) => (
            <li key={modality.id}>
              <Link
                href={`/aulas?modalidade=${modality.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-edge bg-panel hover:border-lime"
              >
                {temFoto(`mod-${modality.id}`) && (
                  <span className="block overflow-hidden">
                    <Foto
                      id={`mod-${modality.id}`}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col p-6">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold">{modality.name}</span>
                  <ArrowRight aria-hidden className="size-5 text-muted group-hover:text-lime" />
                </span>
                <span className="mt-2 flex-1 text-muted">{modality.description}</span>
                <span className="mt-5 flex items-center gap-2 text-sm">
                  <span aria-hidden className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={`h-2 w-5 rounded-full ${n <= intensityBars[modality.intensity] ? "bg-lime" : "bg-edge"}`} />
                    ))}
                  </span>
                  Intensidade {intensityLabels[modality.intensity].toLowerCase()}
                </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="professores-title" className="border-y border-edge bg-panel">
        <div className="wrap py-16">
          <p className="kicker">Professores</p>
          <h2 id="professores-title" className="mt-2 text-4xl">Quem conduz as aulas</h2>
          <p className="mt-3 text-muted">Equipe fictícia desta demonstração, sem registros profissionais inventados.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teachers.map((teacher) => (
              <li key={teacher.id} className="rounded-card border border-edge bg-night p-6">
                <Retrato
                  id={`equipe-${teacher.id}`}
                  inicial={teacher.name[0] ?? ""}
                  className="size-20 border-2 border-lime"
                  fallback="bg-lime text-2xl font-bold text-night"
                />
                <p className="mt-4 text-xl font-bold">{teacher.name}</p>
                <p className="mt-1 text-sm text-lime">
                  {teacher.modalityIds.map((id) => modalities.find((m) => m.id === id)?.name).join(" · ")}
                </p>
                <p className="mt-2 text-sm text-muted">{teacher.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="como-title" className="wrap py-16">
        <h2 id="como-title" className="text-4xl">Como funciona a aula experimental</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Filtre a grade", "Por dia, modalidade, professor ou período."],
            ["Veja as vagas", "Cada aula mostra quantas vagas restam; aulas lotadas não aceitam reserva."],
            ["Reserve", "Uma aula experimental por pessoa, com prévia da mensagem de confirmação."],
          ].map(([title, text], index) => (
            <li key={title} className="rounded-card border border-edge p-6">
              <span className="text-5xl font-bold text-lime">0{index + 1}</span>
              <p className="mt-3 text-xl font-bold">{title}</p>
              <p className="mt-1 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <Link href="/aulas" className="btn btn-primary mt-8">
          Ver grade de aulas
        </Link>
      </section>
    </>
  );
}
