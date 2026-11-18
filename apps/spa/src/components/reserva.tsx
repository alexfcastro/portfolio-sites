"use client";

import { CalendarCheck } from "lucide-react";
import { useRef, useState } from "react";
import { CampoTexto, Opcao, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { experiencias, serena } from "@/data/serena";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, formatDateParts, formatTime, getBusinessNow, getWeekday } from "@/lib/time";

type Erros = Partial<Record<"experiencia" | "horario" | "nome" | "whatsapp", string>>;

function proximosDias(hoje: string, n = 8): string[] {
  const dias: string[] = [];
  for (let i = 1; dias.length < n && i < 40; i += 1) {
    const d = addDays(hoje, i);
    if (getWeekday(d) !== 1) dias.push(d);
  }
  return dias;
}

function horarios(date: string, minutos: number) {
  // Experiências longas só começam cedo, para terminar até as 21h.
  const inicios = [10, 11, 13, 14, 15, 16, 17, 18, 19].filter((h) => h * 60 + minutos <= 21 * 60);
  return inicios.map((h) => {
    let hash = 23;
    for (const ch of `${date}%${h}`) hash = (hash * 37 + ch.charCodeAt(0)) % 971;
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
  return `CS-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
}

/** Reserva de uma experiência, com campo opcional para quem recebeu um vale-presente. */
export function Reserva() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando a agenda…</p>;
  return <Formulario />;
}

function Formulario() {
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje);
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [experienciaId, setExperienciaId] = useState("");
  const [horario, setHorario] = useState<{ date: string; minutes: number } | null>(null);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [vale, setVale] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const exp = experiencias.find((e) => e.id === experienciaId);
  const linhas = ["Olá, Casa Serena! Quero reservar."];
  if (exp) linhas.push(`Experiência: ${exp.nome} (${exp.duracao}${exp.pessoas === 2 ? ", para duas pessoas" : ""})`);
  if (horario) linhas.push(`Horário: ${formatDateLong(horario.date)}, às ${formatTime(horario.minutes)}`);
  if (vale.trim()) linhas.push(`Vou usar o vale-presente ${vale.trim().toUpperCase()}`);
  if (nome.trim()) linhas.push(`Nome: ${nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const e: Erros = {};
    if (!exp) e.experiencia = "Escolha a experiência.";
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
    demoStore.set({ ...atual, reservas: [...atual.reservas, { codigo: novo, nome: nome.trim(), experiencia: exp!.id, date: horario!.date, minutes: horario!.minutes }].slice(-5) });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo && horario && exp) {
    return (
      <div className="troca mt-8 rounded-card border border-line bg-paper p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-verde" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl">
          Reserva feita, {nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          {exp.nome} · <span>{formatDateLong(horario.date)}</span>, às {formatTime(horario.minutes)}. Código de demonstração{" "}
          <strong className="text-ink">{codigo}</strong>. Nada foi enviado: num site real, a Casa Serena confirmaria pelo WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={serena.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => setCodigo(null)}>
            Fazer outra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <ResumoErros ref={errosRef} erros={(["experiencia", "horario", "nome", "whatsapp"] as const).flatMap((k) => (erros[k] ? [[k, erros[k]!] as [string, string]] : []))} />
        <fieldset id="campo-experiencia" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl">Experiência</legend>
          {erros.experiencia && <p className="mt-1 text-sm text-alert">{erros.experiencia}</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {experiencias.map((e) => (
              <Opcao
                key={e.id}
                name="experiencia"
                checked={experienciaId === e.id}
                onChange={() => {
                  setExperienciaId(e.id);
                  setHorario(null);
                }}
                detalhe={`${e.duracao} · ${formatBRL(e.valor)}${e.pessoas === 2 ? " para os dois" : ""}`}
              >
                {e.nome}
              </Opcao>
            ))}
          </div>
        </fieldset>
        <fieldset id="campo-horario" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl">Dia e horário</legend>
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
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-paper px-3 aria-pressed:border-verde aria-pressed:bg-verde aria-pressed:text-areia"
                >
                  <span className="text-xs tracking-wide uppercase">{p.weekday}</span>
                  <span className="font-semibold">{p.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {horarios(dia, exp?.minutos ?? 60).map((h) => (
              <button
                key={h.minutes}
                type="button"
                disabled={!h.livre}
                aria-pressed={horario?.date === h.date && horario.minutes === h.minutes}
                onClick={() => setHorario({ date: h.date, minutes: h.minutes })}
                className="min-h-12 rounded-card border border-line bg-paper font-medium aria-pressed:border-verde aria-pressed:bg-verde aria-pressed:text-areia disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
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
        <div className="max-w-xs">
          <CampoTexto id="vale" rotulo="Ganhou um vale-presente? Código (opcional)" valor={vale} onChange={(v) => setVale(v.slice(0, 11))} placeholder="ABC-DEF-GHJ" />
        </div>
      </div>
      <aside className="rounded-card bg-verde p-6 text-areia lg:sticky lg:top-24">
        <p className="kicker !text-areia/80">Sua reserva</p>
        <p className="mt-3 text-lg">{exp ? exp.nome : "Escolha a experiência"}</p>
        <p className="mt-1 text-sm text-areia/80">{horario ? `${formatDateLong(horario.date)}, às ${formatTime(horario.minutes)}` : "Escolha dia e horário"}</p>
        {exp && <p className="mt-3 text-sm text-areia/80">{formatBRL(exp.valor)} · pagamento no dia</p>}
        <button type="submit" className="btn mt-6 w-full bg-areia text-verde hover:bg-white">
          Reservar
        </button>
        <div className="mt-3">
          <MessagePreview businessName={serena.nome} message={mensagem} triggerLabel="Prefiro chamar no WhatsApp" triggerClassName="btn w-full border border-areia/50 text-areia hover:border-areia" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-areia/70">Demonstração: nenhuma reserva é feita e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
