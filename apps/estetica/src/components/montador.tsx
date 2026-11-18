"use client";

import { ArrowDown, CalendarClock, CircleAlert, Layers, Repeat, Wallet } from "lucide-react";
import Link from "next/link";
import { Foto, temFoto } from "@/components/foto";
import { Opcao } from "@/components/opcao";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { montarProtocolo, objetivos, respondidas, type ObjetivoId } from "@/lib/protocolo";

/**
 * Montador de protocolo: objetivo → duas ou três perguntas → protocolo sugerido com sessões, intervalo e
 * investimento total. O resultado fica salvo neste navegador e é levado para o agendamento da avaliação.
 */
export function Montador() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-10 text-muted">Carregando o montador…</p>;

  const objetivo = objetivos.find((o) => o.id === estado.objetivo) ?? null;
  const completo = objetivo ? respondidas(objetivo, estado.respostas) : false;
  const protocolo = objetivo && completo ? montarProtocolo(objetivo.id, estado.respostas) : null;

  const escolherObjetivo = (id: ObjetivoId) => demoStore.set({ ...demoStore.get(), objetivo: id, respostas: {} });
  const responder = (pergunta: string, opcao: string) =>
    demoStore.set({ ...demoStore.get(), respostas: { ...demoStore.get().respostas, [pergunta]: opcao } });

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <fieldset className="min-w-0">
          <legend className="text-xl font-semibold">1. Qual é o seu objetivo?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {objetivos.map((o) => (
              <label
                key={o.id}
                className="group flex cursor-pointer overflow-hidden rounded-card border border-line bg-white transition-colors has-checked:border-agua has-checked:ring-2 has-checked:ring-agua has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-agua"
              >
                {temFoto(o.foto) && <Foto id={o.foto} sizes="120px" className="w-24 shrink-0 sm:w-28" />}
                <span className="flex items-start gap-3 p-4">
                  <input
                    type="radio"
                    name="objetivo"
                    checked={estado.objetivo === o.id}
                    onChange={() => escolherObjetivo(o.id)}
                    className="mt-1 size-4 shrink-0 accent-agua focus:outline-none"
                  />
                  <span>
                    <span className="block font-semibold">{o.nome}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{o.resumo}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {objetivo && (
          <div key={objetivo.id} className="troca space-y-8">
            <p className="text-xl font-semibold">2. Responda {objetivo.perguntas.length === 2 ? "duas" : "três"} perguntas rápidas</p>
            {objetivo.perguntas.map((pergunta) => (
              <fieldset key={pergunta.id} className="min-w-0">
                <legend className="font-medium">{pergunta.texto}</legend>
                {pergunta.ajuda && <p className="mt-1 text-sm text-muted">{pergunta.ajuda}</p>}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {pergunta.opcoes.map((opcao) => (
                    <Opcao
                      key={opcao.id}
                      name={`${objetivo.id}-${pergunta.id}`}
                      checked={estado.respostas[pergunta.id] === opcao.id}
                      onChange={() => responder(pergunta.id, opcao.id)}
                    >
                      {opcao.rotulo}
                    </Opcao>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </div>

      <aside aria-labelledby="protocolo-titulo" className="rounded-card border border-line bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <p className="kicker">Seu protocolo</p>
        <div aria-live="polite">
          {!protocolo ? (
            <>
              <h3 id="protocolo-titulo" className="mt-3 text-xl font-semibold">
                {objetivo ? "Responda as perguntas ao lado" : "Escolha um objetivo para começar"}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                O protocolo aparece aqui, com o número de sessões, o intervalo entre elas e o investimento total.
              </p>
            </>
          ) : (
            <div key={`${protocolo.objetivo}-${protocolo.sessoes}-${protocolo.total}`} className="troca">
              <h3 id="protocolo-titulo" className="mt-3 text-2xl leading-tight font-semibold">
                {protocolo.nome}
              </h3>
              <p className="mt-1 text-sm text-muted">{protocolo.tecnica}</p>
              <dl className="mt-5 space-y-3">
                <div className="flex gap-3">
                  <Layers aria-hidden className="mt-0.5 size-5 shrink-0 text-agua" />
                  <div>
                    <dt className="text-sm text-muted">Sessões</dt>
                    <dd className="font-semibold">{protocolo.sessoes} sessões</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Repeat aria-hidden className="mt-0.5 size-5 shrink-0 text-agua" />
                  <div>
                    <dt className="text-sm text-muted">Intervalo</dt>
                    <dd className="font-semibold">
                      {protocolo.intervalo} <span className="font-normal text-muted">· cerca de {protocolo.semanas} semanas</span>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Wallet aria-hidden className="mt-0.5 size-5 shrink-0 text-agua" />
                  <div>
                    <dt className="text-sm text-muted">Investimento total estimado</dt>
                    <dd>
                      <span className="text-2xl font-bold">{formatBRL(protocolo.total)}</span>
                      <span className="block text-sm text-muted">
                        ou 6× de {formatBRL(Math.round(protocolo.total / 6))} sem juros
                        {protocolo.desconto > 0 &&
                          ` · ${Math.round(protocolo.desconto * 100)}% de desconto no pacote (avulsa: ${formatBRL(protocolo.precoSessao)})`}
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarClock aria-hidden className="mt-0.5 size-5 shrink-0 text-agua" />
                  <div>
                    <dt className="text-sm text-muted">Quando começar</dt>
                    <dd className="text-sm leading-relaxed">{protocolo.inicio}</dd>
                  </div>
                </div>
              </dl>
              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm leading-relaxed">
                {protocolo.avisos.map((aviso) => (
                  <li key={aviso} className="flex gap-2">
                    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
                    {aviso}
                  </li>
                ))}
              </ul>
              <Link href="/#agendar" className="btn btn-primary mt-6 w-full">
                Agendar avaliação com este resumo
                <ArrowDown aria-hidden className="size-4" />
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Estimativa para planejamento, com valores de demonstração. O protocolo final é definido na avaliação.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
