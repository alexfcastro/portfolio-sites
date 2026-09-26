import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { AxSymbol } from "@/components/ui/ax-symbol";
import { SectionHeading } from "@/components/ui/section-heading";
import { differentials } from "@/data/home";

export function AboutTeaser() {
  return (
    <section aria-labelledby="diferenciais-title" className="py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="diferenciais-title" eyebrow="Diferenciais" title="Um profissional, atenção completa ao seu projeto" />
          <ul className="mt-10 space-y-6">
            {differentials.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <Check aria-hidden className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-card border border-line bg-paper p-8 shadow-card sm:p-10">
          <AxSymbol className="pointer-events-none absolute -right-10 -bottom-12 size-64 opacity-[0.06]" />
          <div className="relative">
            <p className="eyebrow">Quem desenvolve</p>
            <h3 className="mt-3 text-2xl font-extrabold">Olá, eu sou o Alex Castro.</h3>
            <p className="mt-4 leading-relaxed text-muted">
              Desenvolvo soluções digitais para pequenos e médios negócios, unindo design, tecnologia e funcionalidades
              que facilitam o atendimento. Meu objetivo é criar sites simples de usar e úteis no dia a dia.
            </p>
          </div>
          <Link href="/sobre" className="text-link relative mt-8 inline-flex min-h-11 items-center gap-1.5 self-start">
            Conheça meu trabalho
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
