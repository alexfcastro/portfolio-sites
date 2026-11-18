"use client";

import { ArrowDown, ArrowLeft, Info, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { demoStore } from "@/lib/demo-store";
import { completo, orientar, perguntas, type Pergunta } from "@/lib/questionario";

/**
 * Questionário de seis perguntas, uma por vez, com barra de progresso. No fim, a orientação inicial com o porquê
 * de cada ponto. As respostas ficam salvas neste navegador e vão junto para o agendamento.
 */
export function Questionario() {
  const estado = demoStore.useStore();
  if (!estado) return <div aria-hidden className="mt-8 h-96 rounded-card bg-paper" />;
  return <Passos />;
}

function Passos() {
  const estado = demoStore.useStore()!;
  const primeiraSemResposta = perguntas.findIndex((p) => !estado.respostas[p.id]);
  const [indice, setIndice] = useState(primeiraSemResposta === -1 ? perguntas.length : primeiraSemResposta);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const terminou = indice >= perguntas.length && completo(estado.respostas);

  const focar = () => requestAnimationFrame(() => tituloRef.current?.focus());
  const responder = (pergunta: Pergunta, opcao: string) => {
    demoStore.set({ ...demoStore.get(), respostas: { ...demoStore.get().respostas, [pergunta.id]: opcao } });
    setIndice((i) => i + 1);
    focar();
  };
  const recomecar = () => {
    demoStore.set({ ...demoStore.get(), respostas: {} });
    setIndice(0);
    focar();
  };

  if (terminou) {
    const o = orientar(estado.respostas);
    return (
      <div className="troca mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-card border border-line bg-paper p-6 sm:p-8">
          <p className="kicker">Orientação inicial</p>
          <h3 ref={tituloRef} tabIndex={-1} className="mt-3 text-3xl leading-tight outline-none">
            {o.titulo}
          </h3>
          <p className="mt-5 font-semibold">Por que este caminho</p>
          <ul className="mt-3 space-y-3">
            {o.porques.map((p) => (
              <li key={p} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ambar-escuro" />
                {p}
              </li>
            ))}
          </ul>
          {o.cuidados.length > 0 && (
            <div className="mt-6 rounded-card bg-creme-escuro p-5">
              <p className="font-semibold">Atenção</p>
              <ul className="mt-2 space-y-2 text-[0.9375rem] leading-relaxed">
                {o.cuidados.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#agendar" className="btn btn-primary">
              Agendar a avaliação presencial
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <button type="button" onClick={recomecar} className="btn btn-secondary">
              <RotateCcw aria-hidden className="size-4" />
              Refazer as perguntas
            </button>
          </div>
        </div>
        <aside className="flex gap-3 self-start rounded-card border border-ambar/40 bg-paper p-6 text-[0.9375rem] leading-relaxed">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-ambar-escuro" />
          <p>
            <strong>Isto não é um diagnóstico.</strong> É uma orientação inicial a partir do que você respondeu, para você saber por onde
            começar. Só a avaliação presencial, com o exame do couro cabeludo, define o tratamento.
          </p>
        </aside>
      </div>
    );
  }

  const atual = Math.min(indice, perguntas.length - 1);
  const pergunta = perguntas[atual]!;
  return (
    <div className="mt-8 max-w-3xl rounded-card border border-line bg-paper p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 text-sm text-muted">
        <span>
          Pergunta {atual + 1} de {perguntas.length}
        </span>
        {atual > 0 && (
          <button
            type="button"
            onClick={() => {
              setIndice(atual - 1);
              focar();
            }}
            className="inline-flex min-h-11 items-center gap-1 font-medium text-ambar-escuro"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Voltar
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Progresso do questionário"
        aria-valuemin={0}
        aria-valuemax={perguntas.length}
        aria-valuenow={atual}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-creme-escuro"
      >
        <div className="h-full rounded-full bg-ambar-escuro transition-[width] duration-500" style={{ width: `${(atual / perguntas.length) * 100}%` }} />
      </div>
      <fieldset key={pergunta.id} className="troca mt-6 min-w-0">
        <legend>
          <h3 ref={tituloRef} tabIndex={-1} className="text-2xl leading-tight outline-none sm:text-3xl">
            {pergunta.texto}
          </h3>
        </legend>
        {pergunta.ajuda && <p className="mt-2 text-sm text-muted">{pergunta.ajuda}</p>}
        <div className="mt-5 grid gap-2">
          {pergunta.opcoes.map((opcao) => {
            const marcada = estado.respostas[pergunta.id] === opcao.id;
            return (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={marcada}
                onClick={() => responder(pergunta, opcao.id)}
                className="min-h-14 rounded-card border border-line bg-sandbg px-5 py-3 text-left font-medium transition-colors hover:border-ambar-escuro aria-pressed:border-ambar-escuro aria-pressed:bg-creme-escuro"
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      </fieldset>
      <p className="mt-6 text-xs text-muted">Orientação inicial, não diagnóstico. Nenhuma resposta sai deste navegador.</p>
    </div>
  );
}
