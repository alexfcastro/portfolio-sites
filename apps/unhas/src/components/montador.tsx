"use client";

import { ArrowDown, Clock, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { calcular, catalogo, comprimentos, cores, decoracoes, formatos, type Combinacao } from "@/lib/unhas";

function Grupo({ legenda, children }: { legenda: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="font-semibold">{legenda}</legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Escolha({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-medium transition-colors has-checked:border-rosa-escuro has-checked:bg-rosa-escuro has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-rosa-escuro">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function duracao(min: number) {
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")}`;
}

/** Montador: formato, comprimento, técnica, cor e decoração → serviço, preço, duração e manutenção. */
export function Montador() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando o montador…</p>;

  const c = estado.combinacao;
  const r = calcular(c);
  const origem = catalogo.find((i) => i.id === estado.origem);
  const mudar = (parcial: Partial<Combinacao>) => demoStore.set({ ...demoStore.get(), combinacao: { ...c, ...parcial }, origem: null });

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-7">
        {origem && (
          <p className="rounded-card bg-rosa-suave px-4 py-3 text-sm">
            Combinação da foto <strong>{origem.nome}</strong>. Mude o que quiser abaixo.
          </p>
        )}
        <Grupo legenda="Formato">
          {formatos.map((f) => (
            <Escolha key={f.id} name="formato" checked={c.formato === f.id} onChange={() => mudar({ formato: f.id })}>
              {f.nome}
            </Escolha>
          ))}
        </Grupo>
        <Grupo legenda="Comprimento">
          {comprimentos.map((x) => (
            <Escolha key={x.id} name="comprimento" checked={c.comprimento === x.id} onChange={() => mudar({ comprimento: x.id })}>
              {x.nome}
            </Escolha>
          ))}
        </Grupo>
        <p className="-mt-4 text-sm text-muted">{comprimentos.find((x) => x.id === c.comprimento)!.detalhe}</p>
        {c.comprimento !== "curta" && (
          <Grupo legenda="Técnica do alongamento">
            <Escolha name="tecnica" checked={c.tecnica === "gel"} onChange={() => mudar({ tecnica: "gel" })}>
              Gel
            </Escolha>
            <Escolha name="tecnica" checked={c.tecnica === "fibra"} onChange={() => mudar({ tecnica: "fibra" })}>
              Fibra de vidro
            </Escolha>
          </Grupo>
        )}
        <Grupo legenda="Cor">
          {cores.map((x) => (
            <Escolha key={x.id} name="cor" checked={c.cor === x.id} onChange={() => mudar({ cor: x.id })}>
              <span aria-hidden className="size-5 rounded-full ring-1 ring-black/15" style={{ background: x.amostra }} />
              {x.nome}
            </Escolha>
          ))}
        </Grupo>
        <Grupo legenda="Decoração">
          {decoracoes.map((x) => (
            <Escolha key={x.id} name="decoracao" checked={c.decoracao === x.id} onChange={() => mudar({ decoracao: x.id })}>
              {x.nome}
            </Escolha>
          ))}
        </Grupo>
      </div>

      <aside aria-labelledby="resultado-titulo" className="rounded-card border border-line bg-paper p-6 shadow-sm lg:sticky lg:top-24">
        <p className="kicker">Sua combinação</p>
        <div aria-live="polite">
          <div aria-hidden className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`unha unha-${c.formato} unha-${c.comprimento}`}
                style={{ background: cores.find((x) => x.id === c.cor)!.amostra, outline: c.decoracao !== "nenhuma" && i % 2 ? "2px dashed rgb(255 255 255 / 0.8)" : undefined, outlineOffset: "-6px" }}
              />
            ))}
          </div>
          <h3 id="resultado-titulo" className="mt-5 text-xl leading-tight font-semibold">
            {r.servico}
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex gap-3">
              <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-rosa-escuro" />
              <div>
                <dt className="text-muted">Preço</dt>
                <dd className="text-2xl font-semibold">{formatBRL(r.preco)}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-rosa-escuro" />
              <div>
                <dt className="text-muted">Duração do atendimento</dt>
                <dd className="font-medium">{duracao(r.minutos)}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <RefreshCw aria-hidden className="mt-0.5 size-5 shrink-0 text-rosa-escuro" />
              <div>
                <dt className="text-muted">Manutenção</dt>
                <dd className="font-medium">
                  A cada {r.manutencaoDias} dias · {formatBRL(r.precoManutencao)}
                </dd>
              </div>
            </div>
          </dl>
          {r.avisos.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm leading-relaxed text-muted">
              {r.avisos.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/#agendar" className="btn btn-primary mt-6 w-full">
          Agendar esta combinação
          <ArrowDown aria-hidden className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
