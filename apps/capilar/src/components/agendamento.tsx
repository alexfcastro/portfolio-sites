"use client";

import { CalendarCheck, Lock } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { CampoTexto, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { instituto } from "@/data/instituto";
import { demoStore } from "@/lib/demo-store";
import { completo, orientar, resumoOrientacao } from "@/lib/questionario";
import { addDays, formatDateLong, formatDateParts, formatTime, getBusinessNow, getWeekday } from "@/lib/time";

type Erros = Partial<Record<"horario" | "nome" | "whatsapp", string>>;

function proximosDias(hoje: string, n = 8): string[] {
  const dias: string[] = [];
  for (let i = 1; dias.length < n && i < 40; i += 1) {
    const d = addDays(hoje, i);
    if (getWeekday(d) !== 0) dias.push(d);
  }
  return dias;
}

function horarios(date: string) {
  const lista = getWeekday(date) === 6 ? [9, 10, 11] : [9, 10, 11, 14, 15, 16, 17, 18];
  return lista.map((h) => {
    let hash = 19;
    for (const ch of `${date}#${h}`) hash = (hash * 31 + ch.charCodeAt(0)) % 983;
    return { date, minutes: h * 60, livre: hash % 3 !== 0 };
  });
}

function formatarWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function novoCodigo(): string {
  return `FN-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
}

/** Agendamento da avaliação presencial, levando a orientação do questionário (se respondido). */
export function Agendamento() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando a agenda…</p>;
  return <Formulario />;
}

function Formulario() {
  const estado = demoStore.useStore()!;
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje);
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [horario, setHorario] = useState<{ date: string; minutes: number } | null>(null);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const orientacao = completo(estado.respostas) ? orientar(estado.respostas) : null;
  const linhas = ["Olá, Instituto Fio Nobre! Quero agendar uma avaliação capilar."];
  if (orientacao) linhas.push(resumoOrientacao(orientacao));
  if (horario) linhas.push(`Horário: ${formatDateLong(horario.date)}, às ${formatTime(horario.minutes)}`);
  if (nome.trim()) linhas.push(`Nome: ${nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const e: Erros = {};
    if (!horario) e.horario = "Escolha um dia e um horário livre.";
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "Informe um WhatsApp com DDD.";
    setErros(e);
    if (Object.keys(e).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const novo = novoCodigo();
    const atual = demoStore.get();
    demoStore.set({ ...atual, avaliacoes: [...atual.avaliacoes, { codigo: novo, nome: nome.trim(), date: horario!.date, minutes: horario!.minutes }].slice(-5) });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo && horario) {
    return (
      <div className="troca mt-8 rounded-card border border-line bg-paper p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-ambar-escuro" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl">
          Avaliação reservada, {nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          <span className="first-letter:uppercase">{formatDateLong(horario.date)}</span>, às {formatTime(horario.minutes)} ({instituto.avaliacao.duracao}). Código de
          demonstração <strong className="text-ink">{codigo}</strong>. Nada foi enviado: num site real, o instituto confirmaria pelo WhatsApp.
        </p>
        <p className="mt-4 text-sm">Venha com o cabelo lavado há um ou dois dias, sem produtos de finalização, para o exame ficar fiel.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={instituto.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => setCodigo(null)}>
            Escolher outro horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <ResumoErros ref={errosRef} erros={(["horario", "nome", "whatsapp"] as const).flatMap((k) => (erros[k] ? [[k, erros[k]!] as [string, string]] : []))} />
        <fieldset id="campo-horario" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl font-semibold">Dia e horário</legend>
          {erros.horario && <p className="mt-1 text-sm text-alert">{erros.horario}</p>}
          <div role="group" aria-label="Dias disponíveis" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((data) => {
              const p = formatDateParts(data);
              return (
                <button
                  key={data}
                  type="button"
                  aria-pressed={data === dia}
                  onClick={() => setDia(data)}
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-paper px-3 aria-pressed:border-ambar-escuro aria-pressed:bg-ambar-escuro aria-pressed:text-white"
                >
                  <span className="text-xs tracking-wide uppercase">{p.weekday}</span>
                  <span className="font-semibold">{p.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {horarios(dia).map((h) => (
              <button
                key={h.minutes}
                type="button"
                disabled={!h.livre}
                aria-pressed={horario?.date === h.date && horario.minutes === h.minutes}
                onClick={() => setHorario({ date: h.date, minutes: h.minutes })}
                className="min-h-12 rounded-card border border-line bg-paper font-medium aria-pressed:border-ambar-escuro aria-pressed:bg-ambar-escuro aria-pressed:text-white disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
              >
                {formatTime(h.minutes)}
                <span className="sr-only">{h.livre ? "" : " (ocupado)"}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto id="nome" rotulo="Nome" valor={nome} onChange={setNome} erro={erros.nome} autoComplete="given-name" />
          <CampoTexto
            id="whatsapp"
            rotulo="WhatsApp com DDD"
            tipo="tel"
            valor={whatsapp}
            onChange={(v) => setWhatsapp(formatarWhatsapp(v))}
            erro={erros.whatsapp}
            autoComplete="tel-national"
            placeholder="(11) 90000-0000"
          />
        </div>
      </div>
      <aside className="rounded-card border border-line bg-paper p-6 lg:sticky lg:top-24">
        <p className="kicker">Avaliação presencial</p>
        <p className="mt-3 text-sm">
          {instituto.avaliacao.duracao} · {instituto.avaliacao.valor}
        </p>
        {orientacao ? (
          <p className="mt-4 border-t border-line pt-4 text-sm">
            Você leva a orientação do site: <strong>{orientacao.titulo}</strong>
          </p>
        ) : (
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
            Sem questionário respondido. Tudo bem: a avaliação começa do zero.{" "}
            <Link href="/#questionario" className="font-medium text-ambar-escuro underline underline-offset-4">
              Responder agora
            </Link>
          </p>
        )}
        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Atendimento em sala reservada. Suas respostas não são compartilhadas.
        </p>
        <button type="submit" className="btn btn-primary mt-6 w-full">
          Reservar avaliação
        </button>
        <div className="mt-3">
          <MessagePreview businessName={instituto.nome} message={mensagem} triggerLabel="Prefiro chamar no WhatsApp" triggerClassName="btn btn-secondary w-full" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">Demonstração: nenhuma avaliação é marcada e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
