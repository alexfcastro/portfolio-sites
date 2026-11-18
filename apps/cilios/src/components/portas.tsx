"use client";

import { ArrowDown, Eye, GraduationCap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { Foto, temFoto } from "@/components/foto";

type Caminho = "cliente" | "aluna";

const portas: { id: Caminho; titulo: string; texto: string; foto: string; icone: typeof Eye }[] = [
  {
    id: "cliente",
    titulo: "Quero fazer meus cílios",
    texto: "Técnicas, quanto dura, manutenção e horário livre para marcar.",
    foto: "porta-cliente",
    icone: Eye,
  },
  {
    id: "aluna",
    titulo: "Quero aprender",
    texto: "Turma de 3 alunas, conteúdo por dia, vagas e parcelamento.",
    foto: "porta-aluna",
    icone: GraduationCap,
  },
];

/** Lê `?caminho=cliente|aluna` (link direto para cada público) e só aceita os dois valores. */
export function PortasComParametros(props: { cliente: ReactNode; aluna: ReactNode }) {
  const pedido = useSearchParams().get("caminho");
  const inicial = pedido === "cliente" || pedido === "aluna" ? pedido : null;
  return <Portas key={inicial ?? "nenhum"} {...props} inicial={inicial} />;
}

/**
 * As duas portas do topo. Cada uma abre um caminho diferente da mesma página, para a cliente e a aluna não
 * lerem o texto uma da outra. A escolha vai para a URL, então cada caminho tem o próprio link.
 */
export function Portas({ cliente, aluna, inicial = null }: { cliente: ReactNode; aluna: ReactNode; inicial?: Caminho | null }) {
  const [caminho, setCaminho] = useState<Caminho | null>(inicial);
  const tituloRef = useRef<HTMLDivElement>(null);

  const abrir = (escolha: Caminho) => {
    setCaminho(escolha);
    window.history.replaceState(null, "", `?caminho=${escolha}#caminho`);
    requestAnimationFrame(() => {
      tituloRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      tituloRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <section aria-labelledby="titulo" className="bg-ink text-offwhite">
        <div className="wrap py-12 sm:py-16">
          <p className="kicker !text-rosa-claro">Extensão de cílios · curso presencial</p>
          <h1 id="titulo" className="mt-4 max-w-3xl text-[2.5rem] leading-[1.02] sm:text-6xl">
            Você veio para fazer os cílios ou para aprender a fazer?
          </h1>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {portas.map((porta) => {
              const Icone = porta.icone;
              const ativa = caminho === porta.id;
              return (
                <button
                  key={porta.id}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => abrir(porta.id)}
                  className={`porta group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-card p-6 text-left sm:min-h-96 sm:p-8 ${ativa ? "ring-4 ring-rosa" : ""}`}
                >
                  {temFoto(porta.foto) && <Foto id={porta.foto} sizes="(min-width: 768px) 50vw, 100vw" preload className="absolute inset-0 -z-10 size-full" />}
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
                  <Icone aria-hidden className="size-7 text-rosa-claro" />
                  <span className="mt-3 block text-3xl leading-tight font-semibold sm:text-4xl">{porta.titulo}</span>
                  <span className="mt-2 block max-w-sm text-white/85">{porta.texto}</span>
                  <span className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-offwhite px-4 py-2 text-sm font-semibold text-ink">
                    {ativa ? "Você está aqui" : "Entrar"}
                    <ArrowDown aria-hidden className="size-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div ref={tituloRef} id="caminho" tabIndex={-1} className="scroll-mt-16 outline-none" aria-live="polite">
        {caminho === null ? (
          <p className="wrap py-10 text-center text-muted">Escolha uma das portas acima para ver o caminho certo para você.</p>
        ) : (
          <div key={caminho} className="troca">
            <div className="border-b border-line bg-paper">
              <div className="wrap flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <p>
                  Caminho: <strong>{caminho === "cliente" ? "fazer meus cílios" : "aprender a fazer"}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => abrir(caminho === "cliente" ? "aluna" : "cliente")}
                  className="inline-flex min-h-11 items-center font-semibold text-rosa-escuro underline underline-offset-4"
                >
                  {caminho === "cliente" ? "Na verdade, quero aprender" : "Na verdade, quero fazer meus cílios"}
                </button>
              </div>
            </div>
            {caminho === "cliente" ? cliente : aluna}
          </div>
        )}
      </div>
    </>
  );
}
