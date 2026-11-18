"use client";

import { CalendarCheck } from "lucide-react";
import { useRef, useState } from "react";
import { CampoTexto, Opcao, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { lab, nomesTecnicas, tecnicas, type TecnicaId } from "@/data/lab";
import { formatarWhatsapp, horariosDoDia, proximosDias, quando } from "@/lib/agenda";
import { demoStore } from "@/lib/demo-store";
import { formatDateParts, formatTime, getBusinessNow } from "@/lib/time";

type Erros = Partial<Record<"tecnica" | "horario" | "nome" | "whatsapp", string>>;

/** Caminho da cliente: escolher a técnica, o horário e mandar o pedido pronto pelo WhatsApp. */
export function AgendamentoCliente() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando a agenda…</p>;
  return <Formulario />;
}

function Formulario() {
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje, 8);
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [tecnica, setTecnica] = useState<TecnicaId | "">("");
  const [primeiraVez, setPrimeiraVez] = useState(true);
  const [horario, setHorario] = useState<{ date: string; minutes: number } | null>(null);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const linhas = ["Olá, Lash Lab! Quero marcar um horário."];
  if (tecnica) linhas.push(`Técnica: ${nomesTecnicas[tecnica]}${primeiraVez ? " (primeira aplicação)" : " (manutenção)"}`);
  if (horario) linhas.push(`Horário: ${quando(horario.date, horario.minutes)}`);
  if (nome.trim()) linhas.push(`Nome: ${nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados: Erros = {};
    if (!tecnica) encontrados.tecnica = "Escolha a técnica.";
    if (!horario) encontrados.horario = "Escolha um dia e um horário livre.";
    if (nome.trim().length < 2) encontrados.nome = "Informe seu nome.";
    if (whatsapp.replace(/\D/g, "").length < 10) encontrados.whatsapp = "Informe um WhatsApp com DDD.";
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const novo = `LL-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
    const atual = demoStore.get();
    demoStore.set({
      ...atual,
      atendimentos: [...atual.atendimentos, { codigo: novo, nome: nome.trim(), tecnica, date: horario!.date, minutes: horario!.minutes }].slice(-5),
    });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo && horario && tecnica) {
    return (
      <div className="troca mt-8 rounded-card border border-line bg-paper p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-rosa-escuro" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl">
          Horário reservado, {nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          {nomesTecnicas[tecnica]} · <span>{quando(horario.date, horario.minutes)}</span>. Código de demonstração{" "}
          <strong className="text-ink">{codigo}</strong>. Nada foi enviado: num site real, a {lab.profissional} confirmaria pelo WhatsApp.
        </p>
        <p className="mt-4 text-sm text-muted">Venha sem rímel e sem lente de contato. Os cílios não podem molhar nas primeiras 24 horas.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={lab.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => setCodigo(null)}>
            Marcar outro horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <ResumoErros ref={errosRef} erros={(["tecnica", "horario", "nome", "whatsapp"] as const).flatMap((c) => (erros[c] ? [[c, erros[c]!] as [string, string]] : []))} />
        <fieldset id="campo-tecnica" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl font-semibold">Técnica</legend>
          {erros.tecnica && <p className="mt-1 text-sm text-alert">{erros.tecnica}</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {tecnicas.map((t) => (
              <Opcao key={t.id} name="tecnica" checked={tecnica === t.id} onChange={() => setTecnica(t.id)} detalhe={`${t.preco} · ${t.aplicacao}`}>
                {t.nome}
              </Opcao>
            ))}
          </div>
          <label className="mt-4 flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={!primeiraVez} onChange={(e) => setPrimeiraVez(!e.target.checked)} className="size-4 accent-rosa-escuro" />
            É manutenção (já tenho os cílios aplicados)
          </label>
        </fieldset>

        <fieldset id="campo-horario" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl font-semibold">Dia e horário</legend>
          {erros.horario && <p className="mt-1 text-sm text-alert">{erros.horario}</p>}
          <div role="group" aria-label="Dias disponíveis" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((data) => {
              const partes = formatDateParts(data);
              return (
                <button
                  key={data}
                  type="button"
                  aria-pressed={data === dia}
                  onClick={() => setDia(data)}
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-paper px-3 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-offwhite"
                >
                  <span className="text-xs tracking-wide uppercase">{partes.weekday}</span>
                  <span className="font-semibold">{partes.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {horariosDoDia(dia).map((h) => (
              <button
                key={h.minutes}
                type="button"
                disabled={!h.livre}
                aria-pressed={horario?.date === h.date && horario.minutes === h.minutes}
                onClick={() => setHorario({ date: h.date, minutes: h.minutes })}
                className="min-h-12 rounded-card border border-line bg-paper font-medium aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-offwhite disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
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

      <aside className="rounded-card bg-ink p-6 text-offwhite lg:sticky lg:top-24">
        <p className="kicker !text-rosa-claro">Seu horário</p>
        <p className="mt-3 text-lg font-semibold">{tecnica ? nomesTecnicas[tecnica] : "Escolha a técnica"}</p>
        <p className="mt-1 text-sm text-white/75">{horario ? quando(horario.date, horario.minutes) : "Escolha dia e horário"}</p>
        <button type="submit" className="btn mt-6 w-full bg-rosa-claro text-ink hover:bg-white">
          Reservar horário
        </button>
        <div className="mt-3">
          <MessagePreview businessName={lab.nome} message={mensagem} triggerLabel="Prefiro chamar no WhatsApp" triggerClassName="btn w-full border border-white/40 text-offwhite hover:border-white" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/65">Demonstração: nenhum horário é marcado e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
