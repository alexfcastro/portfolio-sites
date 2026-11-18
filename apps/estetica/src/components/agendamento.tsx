"use client";

import { CalendarCheck, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { clinica } from "@/data/clinica";
import { formatarWhatsapp, horariosDoDia, mensagemAvaliacao, proximosDias, validarContato, type Contato, type Erros } from "@/lib/agenda";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { montarProtocolo, objetivos, respondidas, resumoProtocolo } from "@/lib/protocolo";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow } from "@/lib/time";

/** Agendamento da avaliação, levando o resumo do protocolo montado na página (se houver). */
export function Agendamento() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-10 text-muted">Carregando a agenda…</p>;
  return <Formulario />;
}

function Formulario() {
  const estado = demoStore.useStore()!;
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje, 8);
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [contato, setContato] = useState<Contato>({ nome: "", whatsapp: "", horario: null });
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const resumoErrosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const objetivo = objetivos.find((o) => o.id === estado.objetivo) ?? null;
  const protocolo = objetivo && respondidas(objetivo, estado.respostas) ? montarProtocolo(objetivo.id, estado.respostas) : null;
  const resumo = protocolo ? resumoProtocolo(protocolo, formatBRL) : null;
  const texto = mensagemAvaliacao(contato, resumo);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados = validarContato(contato);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => resumoErrosRef.current?.focus());
      return;
    }
    const novo = `NC-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
    const atual = demoStore.get();
    demoStore.set({
      ...atual,
      avaliacoes: [
        ...atual.avaliacoes,
        { codigo: novo, nome: contato.nome.trim(), objetivo: estado.objetivo, date: contato.horario!.date, minutes: contato.horario!.minutes },
      ].slice(-5),
    });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo && contato.horario) {
    return (
      <div className="troca mt-10 rounded-card border border-line bg-white p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-agua" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl font-semibold">
          Avaliação reservada, {contato.nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          <span className="first-letter:uppercase">{formatDateLong(contato.horario.date)}</span>, às {formatTime(contato.horario.minutes)}. Código
          de demonstração <strong className="text-ink">{codigo}</strong>. Nada foi enviado: num site real, a clínica confirmaria pelo WhatsApp.
        </p>
        {resumo && <p className="mt-4 rounded-card bg-agua-soft p-4 text-sm leading-relaxed whitespace-pre-line">{resumo}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={clinica.nome} message={texto} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCodigo(null);
              setContato({ nome: "", whatsapp: "", horario: null });
            }}
          >
            Agendar outra avaliação
          </button>
        </div>
      </div>
    );
  }

  const listaErros = (["horario", "nome", "whatsapp"] as const).filter((campo) => erros[campo]);

  return (
    <form onSubmit={enviar} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        {listaErros.length > 0 && (
          <div ref={resumoErrosRef} tabIndex={-1} role="alert" className="rounded-card border border-alert bg-white p-5">
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

        <fieldset id="campo-horario" tabIndex={-1} className="min-w-0 scroll-mt-28" aria-describedby={erros.horario ? "horario-erro" : undefined}>
          <legend className="text-xl font-semibold">Dia e horário da avaliação</legend>
          <p className="mt-1 text-sm text-muted">A avaliação dura cerca de 30 minutos e é gratuita nesta demonstração.</p>
          {erros.horario && (
            <p id="horario-erro" className="mt-1 text-sm font-medium text-alert">
              {erros.horario}
            </p>
          )}
          <div role="group" aria-label="Dias disponíveis" className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((data) => {
              const partes = formatDateParts(data);
              return (
                <button
                  key={data}
                  type="button"
                  aria-pressed={data === dia}
                  onClick={() => setDia(data)}
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-white px-3 transition-colors aria-pressed:border-agua aria-pressed:bg-agua aria-pressed:text-white"
                >
                  <span className="text-xs tracking-wide uppercase">{partes.weekday}</span>
                  <span className="font-semibold">{partes.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {horariosDoDia(dia).map((h) => {
              const escolhido = contato.horario?.date === h.date && contato.horario.minutes === h.minutes;
              return (
                <button
                  key={h.minutes}
                  type="button"
                  disabled={!h.livre}
                  aria-pressed={escolhido}
                  onClick={() => setContato((c) => ({ ...c, horario: { date: h.date, minutes: h.minutes } }))}
                  className="min-h-12 rounded-card border border-line bg-white font-medium transition-colors aria-pressed:border-agua aria-pressed:bg-agua aria-pressed:text-white disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
                >
                  {formatTime(h.minutes)}
                  <span className="sr-only">{h.livre ? "" : " (ocupado)"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div id="campo-nome" className="scroll-mt-28">
            <label htmlFor="nome" className="font-medium">
              Nome
            </label>
            <input
              id="nome"
              autoComplete="given-name"
              value={contato.nome}
              onChange={(e) => setContato((c) => ({ ...c, nome: e.target.value }))}
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
              placeholder="(11) 90000-0000"
              value={contato.whatsapp}
              onChange={(e) => setContato((c) => ({ ...c, whatsapp: formatarWhatsapp(e.target.value) }))}
              aria-invalid={Boolean(erros.whatsapp)}
              aria-describedby={erros.whatsapp ? "whatsapp-erro" : undefined}
              className="field"
            />
            {erros.whatsapp && (
              <p id="whatsapp-erro" className="mt-1 text-sm text-alert">
                {erros.whatsapp}
              </p>
            )}
          </div>
        </div>
      </div>

      <aside className="rounded-card border border-line bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <p className="kicker flex items-center gap-2">
          <ClipboardList aria-hidden className="size-4" />
          Você leva para a avaliação
        </p>
        {resumo ? (
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{resumo}</p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Nenhum protocolo montado. Tudo bem: a avaliação define o tratamento.{" "}
            <Link href="/#montador" className="font-medium text-agua-dark underline underline-offset-4">
              Montar um protocolo
            </Link>
          </p>
        )}
        <p className="mt-4 border-t border-line pt-4 text-sm">
          <span className="text-muted">Horário: </span>
          <span className="font-medium">
            {contato.horario ? `${formatDateLong(contato.horario.date)}, às ${formatTime(contato.horario.minutes)}` : "—"}
          </span>
        </p>
        <button type="submit" className="btn btn-primary mt-6 w-full">
          Reservar avaliação
        </button>
        <div className="mt-3">
          <MessagePreview businessName={clinica.nome} message={texto} triggerLabel="Prefiro chamar no WhatsApp" triggerClassName="btn btn-secondary w-full" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">Demonstração: nenhuma avaliação é marcada e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
