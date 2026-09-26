import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecialty, professionalsFor, specialties } from "@/data/clinic";
import { describeSchedule } from "@/lib/schedule-text";

export const dynamicParams = false;

export function generateStaticParams() {
  return specialties.map((specialty) => ({ id: specialty.id }));
}

export async function generateMetadata({ params }: PageProps<"/especialidades/[id]">): Promise<Metadata> {
  const specialty = getSpecialty((await params).id);
  return specialty ? { title: specialty.name, description: specialty.summary } : {};
}

export default async function SpecialtyPage({ params }: PageProps<"/especialidades/[id]">) {
  const specialty = getSpecialty((await params).id);
  if (!specialty) notFound();
  const team = professionalsFor(specialty.id);

  return (
    <article className="wrap py-12 sm:py-16">
      <Link href="/#especialidades" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-teal">
        <ArrowLeft aria-hidden className="size-4" />
        Todas as especialidades
      </Link>
      <p className="kicker mt-6">Especialidade</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{specialty.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{specialty.description}</p>
      <p className="mt-3 text-sm text-muted">Duração média da consulta: {specialty.durationMin} minutos.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="para-quem" className="rounded-card border border-line bg-paper p-6">
          <h2 id="para-quem" className="text-xl">
            Para quem é
          </h2>
          <ul className="mt-4 space-y-2">
            {specialty.forWhom.map((item) => (
              <li key={item} className="flex gap-2 text-muted">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="preparo" className="rounded-card border border-line bg-paper p-6">
          <h2 id="preparo" className="text-xl">
            Como se preparar
          </h2>
          <ul className="mt-4 space-y-2">
            {specialty.preparation.map((item) => (
              <li key={item} className="flex gap-2 text-muted">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="quem-atende" className="mt-10">
        <h2 id="quem-atende" className="text-2xl">
          Quem atende
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {team.map((professional) => (
            <li key={professional.id} className="rounded-card border border-line bg-paper p-6">
              <h3 className="text-lg">{professional.name}</h3>
              <p className="mt-1 text-sm text-muted">{professional.approach}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">Atende:</span> {describeSchedule(professional)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Profissionais fictícios; registros profissionais não são exibidos.</p>
      </section>

      <div className="mt-10 rounded-card bg-teal p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
        <p className="font-serif text-2xl">Quer um horário em {specialty.name.toLowerCase()}?</p>
        <Link
          href={`/solicitar?especialidade=${specialty.id}`}
          className="btn mt-4 shrink-0 bg-white text-teal-dark hover:bg-teal-soft sm:mt-0"
        >
          Solicitar horário
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </article>
  );
}
