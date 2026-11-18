"use client";

import { CalendarCheck, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { MessagePreview } from "@/components/message-preview";
import { nomesProcedimentos, procedimentos, studio } from "@/data/studio";
import {
  corLabels,
  formatarWhatsapp,
  horariosDoDia,
  mensagem,
  orientacoes,
  procedimentoSugerido,
  proximosDias,
  tempoLabels,
  validar,
  type Anterior,
  type CorAtual,
  type Erros,
  type Pedido,
  type ProcedimentoId,
  type Tempo,
} from "@/lib/avaliacao";
import { demoStore, type Marcacao } from "@/lib/demo-store";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow } from "@/lib/time";

const vazio: Pedido = {
  nome: "",
  whatsapp: "",
  procedimento: "",
  anterior: "",
  historico: { tempo: "", cor: "", removeu: "" },
  horario: null,
};

const ordemErros: (keyof Erros)[] = ["procedimento", "anterior", "historico", "horario", "nome", "whatsapp"];

/** Lê `?procedimento=` (vindo do botão de cada procedimento) e só aceita ids conhecidos. */
export function AgendamentoComParametros() {
  const pedido = useSearchParams().get("procedimento");
  const inicial = procedimentos.find((p) => p.id === pedido)?.id ?? "";
  return <Agendamento key={inicial} inicial={inicial} />;
}

export function Agendamento({ inicial = "" }: { inicial?: ProcedimentoId | "" }) {
  const estado = demoStore.useStore();
  if (!estado) {
    return <p className="mt-10 text-muted">Carregando a agenda…</p>;
  }
  return <Formulario inicial={inicial} />;
}

function Grupo({ legenda, erro, id, children }: { legenda: string; erro?: string; id: string; children: ReactNode }) {
  return (
    <fieldset id={id} tabIndex={-1} aria-describedby={erro ? `${id}-erro` : undefined} className="min-w-0 scroll-mt-28">
      <legend className="font-serif text-2xl">{legenda}</legend>
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm font-medium text-alert">
          {erro}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Opcao({
  name,
  checked,
  onChange,
  children,
  detalhe,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  detalhe?: ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-card border border-line bg-paper px-4 py-3 transition-colors has-checked:border-cacau has-checked:bg-cacau-soft has-focus-visible:outline-3 has-focus-visible:outline-cacau">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 size-4 shrink-0 accent-cacau focus:outline-none" />
      <span>
        <span className="block font-medium">{children}</span>
        {detalhe && <span className="mt-0.5 block text-sm text-muted">{detalhe}</span>}
      </span>
    </label>
  );
}

function Formulario({ inicial }: { inicial: ProcedimentoId | "" }) {
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje, 8);
  const [pedido, setPedido] = useState<Pedido>({ ...vazio, procedimento: inicial });
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [erros, setErros] = useState<Erros>({});
  const [marcada, setMarcada] = useState<Marcacao | null>(null);
  const resumoRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const atualizar = (parcial: Partial<Pedido>) => setPedido((atual) => ({ ...atual, ...parcial }));
  const historico = (parcial: Partial<Pedido["historico"]>) =>
    setPedido((atual) => ({ ...atual, historico: { ...atual.historico, ...parcial } }));

  const sugerido = procedimentoSugerido(pedido.procedimento, pedido.anterior, pedido.historico);
  const listaOrientacoes = pedido.anterior ? orientacoes(pedido.anterior, pedido.historico) : [];
  const texto = mensagem(pedido, nomesProcedimentos);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados = validar(pedido);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => resumoRef.current?.focus());
      return;
    }
    const nova: Marcacao = {
      codigo: `LF-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`,
      nome: pedido.nome.trim(),
      procedimento: pedido.procedimento as ProcedimentoId,
      anterior: pedido.anterior as Anterior,
      historico: pedido.historico,
      date: pedido.horario!.date,
      minutes: pedido.horario!.minutes,
    };
    const atual = demoStore.get();
    demoStore.set({ ...atual, marcacoes: [...atual.marcacoes, nova].slice(-5) });
    setMarcada(nova);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (marcada) {
    return (
      <div className="troca mt-10 rounded-card border border-line bg-paper p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-cacau" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl sm:text-4xl">
          Avaliação reservada, {marcada.nome.split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          Código de demonstração <strong className="text-ink">{marcada.codigo}</strong>. Nada foi enviado: em um site real,
          a {studio.profissional} confirmaria pelo WhatsApp.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Procedimento</dt>
            <dd className="font-medium">{nomesProcedimentos[marcada.procedimento]}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Quando</dt>
            <dd className="font-medium first-letter:uppercase">
              {formatDateLong(marcada.date)}, às {formatTime(marcada.minutes)}
            </dd>
          </div>
        </dl>
        {listaOrientacoes.length > 0 && (
          <div className="mt-6 rounded-card bg-cacau-soft p-5">
            <p className="font-medium">Para a sua avaliação</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {listaOrientacoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={studio.nome} message={texto} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setMarcada(null);
              setPedido({ ...vazio });
              setErros({});
            }}
          >
            Marcar outra avaliação
          </button>
        </div>
      </div>
    );
  }

  const listaErros = ordemErros.filter((campo) => erros[campo]);

  return (
    <form onSubmit={enviar} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        {listaErros.length > 0 && (
          <div ref={resumoRef} tabIndex={-1} role="alert" className="rounded-card border border-alert bg-paper p-5">
            <p className="font-medium text-alert">Falta pouco. Confira:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {listaErros.map((campo) => (
                <li key={campo}>
                  <a href={`#campo-${campo}`} className="underline underline-offset-4">
                    {erros[campo]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Grupo legenda="1. Qual procedimento você quer avaliar?" id="campo-procedimento" erro={erros.procedimento}>
          <div className="grid gap-2 sm:grid-cols-2">
            {procedimentos.map((p) => (
              <Opcao
                key={p.id}
                name="procedimento"
                checked={pedido.procedimento === p.id}
                onChange={() => atualizar({ procedimento: p.id })}
                detalhe={p.preco}
              >
                {p.nome}
              </Opcao>
            ))}
          </div>
        </Grupo>

        <Grupo legenda="2. Você já tem micropigmentação na sobrancelha?" id="campo-anterior" erro={erros.anterior}>
          <p className="-mt-2 mb-4 text-sm text-muted">Isso muda o que a profissional precisa avaliar: pigmento antigo pede outro cuidado.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["nao", "Não, nunca fiz"],
                ["sim", "Sim, já fiz"],
                ["nao-sei", "Não sei"],
              ] as const
            ).map(([valor, rotulo]) => (
              <Opcao key={valor} name="anterior" checked={pedido.anterior === valor} onChange={() => atualizar({ anterior: valor })}>
                {rotulo}
              </Opcao>
            ))}
          </div>

          {pedido.anterior === "sim" && (
            <div id="campo-historico" tabIndex={-1} className="troca mt-6 space-y-6 rounded-card border border-line bg-sandbg p-5 scroll-mt-28">
              {erros.historico && <p className="text-sm font-medium text-alert">{erros.historico}</p>}
              <fieldset>
                <legend className="font-medium">Há quanto tempo foi feita?</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(Object.keys(tempoLabels) as Tempo[]).map((valor) => (
                    <Opcao key={valor} name="tempo" checked={pedido.historico.tempo === valor} onChange={() => historico({ tempo: valor })}>
                      {tempoLabels[valor]}
                    </Opcao>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-medium">Como está a cor hoje?</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(corLabels) as CorAtual[]).map((valor) => (
                    <Opcao key={valor} name="cor" checked={pedido.historico.cor === valor} onChange={() => historico({ cor: valor })}>
                      {corLabels[valor]}
                    </Opcao>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-medium">Já fez sessões de remoção (laser ou removedor)?</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(
                    [
                      ["nao", "Não"],
                      ["sim", "Sim"],
                    ] as const
                  ).map(([valor, rotulo]) => (
                    <Opcao key={valor} name="removeu" checked={pedido.historico.removeu === valor} onChange={() => historico({ removeu: valor })}>
                      {rotulo}
                    </Opcao>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {sugerido && sugerido !== pedido.procedimento && (
            <div role="status" className="troca mt-5 flex flex-col gap-3 rounded-card bg-cacau-soft p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex gap-2 text-sm leading-relaxed">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-cacau" />
                Pela cor que você descreveu, o mais indicado é avaliar uma correção antes de um novo fio a fio.
              </p>
              <button type="button" className="btn btn-secondary shrink-0 !min-h-11" onClick={() => atualizar({ procedimento: sugerido })}>
                Avaliar correção
              </button>
            </div>
          )}
        </Grupo>

        <Grupo legenda="3. Dia e horário da avaliação" id="campo-horario" erro={erros.horario}>
          <p className="-mt-2 mb-4 text-sm text-muted">A avaliação dura cerca de 40 minutos e é gratuita nesta demonstração.</p>
          <div role="group" aria-label="Dias disponíveis" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((data) => {
              const partes = formatDateParts(data);
              return (
                <button
                  key={data}
                  type="button"
                  aria-pressed={data === dia}
                  onClick={() => setDia(data)}
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-paper px-3 transition-colors aria-pressed:border-cacau aria-pressed:bg-cacau aria-pressed:text-white"
                >
                  <span className="text-xs tracking-wide uppercase">{partes.weekday}</span>
                  <span className="font-medium">{partes.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {horariosDoDia(dia).map((h) => {
              const escolhido = pedido.horario?.date === h.date && pedido.horario.minutes === h.minutes;
              return (
                <button
                  key={h.minutes}
                  type="button"
                  disabled={!h.livre}
                  aria-pressed={escolhido}
                  onClick={() => atualizar({ horario: { date: h.date, minutes: h.minutes } })}
                  className="min-h-12 rounded-card border border-line bg-paper font-medium transition-colors aria-pressed:border-cacau aria-pressed:bg-cacau aria-pressed:text-white disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
                >
                  {formatTime(h.minutes)}
                  <span className="sr-only">{h.livre ? "" : " (ocupado)"}</span>
                </button>
              );
            })}
          </div>
        </Grupo>

        <Grupo legenda="4. Seus dados" id="campo-dados">
          <div className="grid gap-4 sm:grid-cols-2">
            <div id="campo-nome" className="scroll-mt-28">
              <label htmlFor="nome" className="font-medium">
                Nome
              </label>
              <input
                id="nome"
                autoComplete="given-name"
                value={pedido.nome}
                onChange={(event) => atualizar({ nome: event.target.value })}
                aria-invalid={Boolean(erros.nome)}
                aria-describedby={erros.nome ? "nome-erro" : undefined}
                className="field"
              />
              {erros.nome && (
                <p id="nome-erro" className="mt-1 text-sm text-alert">
                  {erros.nome}
                </p>
              )}
            </div>
            <div id="campo-whatsapp" className="scroll-mt-28">
              <label htmlFor="whatsapp" className="font-medium">
                WhatsApp com DDD
              </label>
              <input
                id="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={pedido.whatsapp}
                onChange={(event) => atualizar({ whatsapp: formatarWhatsapp(event.target.value) })}
                aria-invalid={Boolean(erros.whatsapp)}
                aria-describedby={erros.whatsapp ? "whatsapp-erro" : undefined}
                className="field"
                placeholder="(11) 90000-0000"
              />
              {erros.whatsapp && (
                <p id="whatsapp-erro" className="mt-1 text-sm text-alert">
                  {erros.whatsapp}
                </p>
              )}
            </div>
          </div>
        </Grupo>
      </div>

      <aside className="rounded-card border border-line bg-paper p-6 lg:sticky lg:top-24">
        <p className="kicker">Resumo</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Procedimento</dt>
            <dd className="font-medium">{pedido.procedimento ? nomesProcedimentos[pedido.procedimento] : "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Micropigmentação anterior</dt>
            <dd className="font-medium">
              {pedido.anterior === "sim" ? "Sim" : pedido.anterior === "nao" ? "Não" : pedido.anterior === "nao-sei" ? "Não sabe" : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Horário</dt>
            <dd className="font-medium first-letter:uppercase">
              {pedido.horario ? `${formatDateLong(pedido.horario.date)}, às ${formatTime(pedido.horario.minutes)}` : "—"}
            </dd>
          </div>
        </dl>
        {listaOrientacoes.length > 0 && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-sm font-medium">O que a profissional vai precisar saber</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
              {listaOrientacoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full">
          Reservar avaliação
        </button>
        <div className="mt-3">
          <MessagePreview
            businessName={studio.nome}
            message={texto}
            triggerLabel="Prefiro chamar no WhatsApp"
            triggerClassName="btn btn-secondary w-full"
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">Demonstração: nenhuma avaliação é marcada e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
