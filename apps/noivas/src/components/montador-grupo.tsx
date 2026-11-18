"use client";

import { ArrowDown, Clock, Minus, Plus, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { calcular, tipos, type PessoaId, type Servico } from "@/lib/orcamento";
import { formatTime } from "@/lib/time";

const nomesServico: Record<Servico, string> = { ambos: "Cabelo e make", cabelo: "Só cabelo", maquiagem: "Só make" };
const horariosCerimonia = Array.from({ length: 27 }, (_, i) => 8 * 60 + i * 30);

function duracao(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

/**
 * Montador do grupo: quem se arruma, com qual serviço, e o horário da cerimônia. Calcula na hora o tempo total,
 * a que horas o grupo começa e o valor estimado. Fica salvo para o pedido de orçamento lá embaixo.
 */
export function MontadorGrupo() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-10 text-muted">Carregando o montador…</p>;

  const calculo = calcular(estado.grupo, estado.cerimonia, estado.noLocal);
  const salvar = (parcial: Partial<typeof estado>) => demoStore.set({ ...demoStore.get(), ...parcial });
  const mudarLinha = (id: PessoaId, parcial: { quantidade?: number; servico?: Servico }) => {
    const atual = demoStore.get();
    salvar({ grupo: { ...atual.grupo, [id]: { ...atual.grupo[id], ...parcial } } });
  };

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <div className="max-w-xs">
          <label htmlFor="cerimonia" className="font-medium">
            Horário da cerimônia
          </label>
          <select id="cerimonia" value={estado.cerimonia} onChange={(e) => salvar({ cerimonia: Number(e.target.value) })} className="field">
            {horariosCerimonia.map((m) => (
              <option key={m} value={m}>
                {formatTime(m)}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="min-w-0">
          <legend className="font-medium">Quem vai se arrumar</legend>
          <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
            {tipos.map((tipo) => {
              const linha = estado.grupo[tipo.id];
              const fixa = tipo.id === "noiva";
              return (
                <li key={tipo.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center justify-between gap-4 sm:justify-start">
                    <span className="min-w-28 font-medium">{tipo.plural}</span>
                    {fixa ? (
                      <span className="text-sm text-muted">1 noiva</span>
                    ) : (
                      <div className="flex items-center gap-1" role="group" aria-label={`Quantidade de ${tipo.plural.toLowerCase()}`}>
                        <button
                          type="button"
                          onClick={() => mudarLinha(tipo.id, { quantidade: Math.max(0, linha.quantidade - 1) })}
                          disabled={linha.quantidade === 0}
                          className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
                        >
                          <Minus aria-hidden className="size-4" />
                          <span className="sr-only">Menos uma</span>
                        </button>
                        <output aria-live="polite" className="w-8 text-center text-lg font-semibold tabular-nums">
                          {linha.quantidade}
                        </output>
                        <button
                          type="button"
                          onClick={() => mudarLinha(tipo.id, { quantidade: Math.min(tipo.max, linha.quantidade + 1) })}
                          disabled={linha.quantidade >= tipo.max}
                          className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
                        >
                          <Plus aria-hidden className="size-4" />
                          <span className="sr-only">Mais uma</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {tipo.servicos.length > 1 ? (
                    <div role="radiogroup" aria-label={`Serviço para ${tipo.plural.toLowerCase()}`} className={`flex flex-wrap gap-1 ${linha.quantidade === 0 ? "opacity-50" : ""}`}>
                      {tipo.servicos.map((servico) => (
                        <label
                          key={servico}
                          className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-3 text-sm whitespace-nowrap transition-colors has-checked:border-dourado-escuro has-checked:bg-dourado-escuro has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-dourado-escuro"
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name={`servico-${tipo.id}`}
                            checked={linha.servico === servico}
                            onChange={() => mudarLinha(tipo.id, { servico })}
                          />
                          {nomesServico[servico]}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted">Penteado infantil</span>
                  )}
                </li>
              );
            })}
          </ul>
        </fieldset>

        <label className="flex min-h-11 items-start gap-3">
          <input type="checkbox" checked={estado.noLocal} onChange={(e) => salvar({ noLocal: e.target.checked })} className="mt-1 size-4 accent-dourado-escuro" />
          <span>
            Atendimento no local da festa
            <span className="block text-sm text-muted">Taxa de deslocamento na Grande São Paulo, somada ao valor.</span>
          </span>
        </label>
      </div>

      <aside aria-labelledby="calculo-titulo" className="rounded-card border border-line bg-paper p-6 shadow-sm lg:sticky lg:top-24">
        <p className="kicker">O dia de vocês</p>
        <div aria-live="polite">
          <h3 id="calculo-titulo" className="mt-3 text-3xl leading-tight">
            Comecem às {formatTime(calculo.inicio)}
          </h3>
          <p className="mt-1 text-sm text-muted">
            para a noiva estar pronta às {formatTime(calculo.fim)}, uma hora antes da cerimônia ({formatTime(estado.cerimonia)})
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex gap-3">
              <Users aria-hidden className="mt-0.5 size-5 shrink-0 text-dourado-escuro" />
              <div>
                <dt className="text-muted">Grupo</dt>
                <dd className="font-medium">
                  {calculo.pessoas} {calculo.pessoas === 1 ? "pessoa" : "pessoas"} · {calculo.cabeleireiras} cabeleireira
                  {calculo.cabeleireiras === 1 ? "" : "s"} e {calculo.maquiadoras} maquiadora{calculo.maquiadoras === 1 ? "" : "s"}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-dourado-escuro" />
              <div>
                <dt className="text-muted">Tempo total de produção</dt>
                <dd className="font-medium">{duracao(calculo.duracao)}, com cabelo e make em paralelo</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-dourado-escuro" />
              <div>
                <dt className="text-muted">Valor estimado</dt>
                <dd>
                  <span className="text-2xl font-semibold">{formatBRL(calculo.total)}</span>
                  <span className="block text-muted">
                    serviços {formatBRL(calculo.servicos)}
                    {calculo.extras > 0 && ` · profissional extra ${formatBRL(calculo.extras)}`}
                    {calculo.deslocamento > 0 && ` · deslocamento ${formatBRL(calculo.deslocamento)}`}
                  </span>
                </dd>
              </div>
            </div>
          </dl>
          {calculo.avisos.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm leading-relaxed">
              {calculo.avisos.map((aviso) => (
                <li key={aviso}>{aviso}</li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/#disponibilidade" className="btn btn-primary mt-6 w-full">
          Escolher a data
          <ArrowDown aria-hidden className="size-4" />
        </Link>
        <p className="mt-3 text-xs leading-relaxed text-muted">Valores de demonstração. O orçamento final é confirmado depois do teste.</p>
      </aside>
    </div>
  );
}
