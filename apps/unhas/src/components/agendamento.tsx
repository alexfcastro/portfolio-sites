"use client";

import { CalendarCheck, Repeat } from "lucide-react";
import { useRef, useState } from "react";
import { CampoTexto, Opcao, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { esmalteria } from "@/data/esmalteria";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatDateParts, formatTime, getBusinessNow } from "@/lib/time";
import { calcular, datasDoPlano, descreverCombinacao, horariosDoDia, planos, precoPlano, proximosDias, type PlanoId } from "@/lib/unhas";

type Escolha = "uma-vez" | PlanoId;
type Erros = Partial<Record<"plano" | "horario" | "nome" | "whatsapp", string>>;

function formatarWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function novoCodigo(): string {
  return `ML-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
}

const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Agendamento: marcar uma vez ou entrar num plano de manutenção com dia e horário fixos. */
export function Agendamento() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando a agenda…</p>;
  return <Formulario />;
}

function Formulario() {
  const estado = demoStore.useStore()!;
  const [hoje] = useState(() => getBusinessNow().date);
  const dias = proximosDias(hoje, 8);
  const [dia, setDia] = useState(dias[0] ?? hoje);
  const [escolha, setEscolha] = useState<Escolha | "">("");
  const [horario, setHorario] = useState<{ date: string; minutes: number } | null>(null);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const r = calcular(estado.combinacao);
  const plano = escolha && escolha !== "uma-vez" ? planos.find((p) => p.id === escolha)! : null;
  const datas = plano && horario ? datasDoPlano(horario.date, plano.id, 4) : [];
  const diaSemana = horario ? SEMANA[new Date(`${horario.date}T12:00:00Z`).getUTCDay()] : "";

  const linhas = ["Olá, Esmalteria Meia-Lua! Quero agendar."];
  linhas.push(`${r.servico}: ${descreverCombinacao(estado.combinacao)} (${formatBRL(r.preco)})`);
  if (escolha === "uma-vez") linhas.push("Só esta vez, sem plano.");
  if (plano) linhas.push(`Plano de manutenção ${plano.nome.toLowerCase()}: ${formatBRL(precoPlano(r.precoManutencao, plano.id))} cada manutenção`);
  if (horario) linhas.push(`Primeiro horário: ${formatDateLong(horario.date)}, às ${formatTime(horario.minutes)}${plano ? ` (fixo às ${diaSemana}s)` : ""}`);
  if (nome.trim()) linhas.push(`Nome: ${nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados: Erros = {};
    if (!escolha) encontrados.plano = "Escolha entre marcar uma vez ou entrar num plano.";
    if (!horario) encontrados.horario = "Escolha um dia e um horário livre.";
    if (nome.trim().length < 2) encontrados.nome = "Informe seu nome.";
    if (whatsapp.replace(/\D/g, "").length < 10) encontrados.whatsapp = "Informe um WhatsApp com DDD.";
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const novo = novoCodigo();
    const atual = demoStore.get();
    demoStore.set({
      ...atual,
      agendamentos: [...atual.agendamentos, { codigo: novo, nome: nome.trim(), plano: escolha, date: horario!.date, minutes: horario!.minutes }].slice(-5),
    });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo && horario) {
    return (
      <div className="troca mt-8 rounded-card border border-line bg-paper p-6 sm:p-10">
        <CalendarCheck aria-hidden className="size-8 text-rosa-escuro" />
        <h3 ref={confirmacaoRef} tabIndex={-1} className="mt-4 text-3xl font-semibold">
          {plano ? "Plano reservado" : "Horário reservado"}, {nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          {r.servico} · <span>{formatDateLong(horario.date)}</span>, às {formatTime(horario.minutes)}. Código de demonstração{" "}
          <strong className="text-ink">{codigo}</strong>. Nada foi enviado: num site real, a esmalteria confirmaria pelo WhatsApp.
        </p>
        {plano && (
          <div className="mt-5 rounded-card bg-rosa-suave p-5 text-sm">
            <p className="font-semibold">Suas próximas manutenções ({plano.nome.toLowerCase()})</p>
            <ul className="mt-2 space-y-1">
              {datas.slice(1).map((d) => (
                <li key={d}>
                  <span className="first-letter:uppercase">{formatDateLong(d)}</span>, às {formatTime(horario.minutes)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-muted">A esmalteria manda um lembrete dois dias antes de cada uma.</p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={esmalteria.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => setCodigo(null)}>
            Fazer outro agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <ResumoErros ref={errosRef} erros={(["plano", "horario", "nome", "whatsapp"] as const).flatMap((k) => (erros[k] ? [[k, erros[k]!] as [string, string]] : []))} />

        <fieldset id="campo-plano" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl font-semibold">Uma vez ou com manutenção marcada?</legend>
          {erros.plano && <p className="mt-1 text-sm text-alert">{erros.plano}</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Opcao name="plano" checked={escolha === "uma-vez"} onChange={() => setEscolha("uma-vez")} detalhe={`${formatBRL(r.preco)} hoje; manutenção avulsa ${formatBRL(r.precoManutencao)}`}>
              Marcar uma vez
            </Opcao>
            {planos.map((p) => (
              <Opcao key={p.id} name="plano" checked={escolha === p.id} onChange={() => setEscolha(p.id)} detalhe={`${formatBRL(precoPlano(r.precoManutencao, p.id))} cada manutenção · ${p.vantagem}`}>
                Plano {p.nome.toLowerCase()}
              </Opcao>
            ))}
          </div>
        </fieldset>

        <fieldset id="campo-horario" tabIndex={-1} className="min-w-0 scroll-mt-28">
          <legend className="text-xl font-semibold">{plano ? "Primeiro horário (vira o seu horário fixo)" : "Dia e horário"}</legend>
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
                  className="flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-card border border-line bg-paper px-3 aria-pressed:border-rosa-escuro aria-pressed:bg-rosa-escuro aria-pressed:text-white"
                >
                  <span className="text-xs tracking-wide uppercase">{p.weekday}</span>
                  <span className="font-semibold">{p.dayMonth}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {horariosDoDia(dia).map((h) => (
              <button
                key={h.minutes}
                type="button"
                disabled={!h.livre}
                aria-pressed={horario?.date === h.date && horario.minutes === h.minutes}
                onClick={() => setHorario({ date: h.date, minutes: h.minutes })}
                className="min-h-12 rounded-card border border-line bg-paper font-medium aria-pressed:border-rosa-escuro aria-pressed:bg-rosa-escuro aria-pressed:text-white disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted disabled:line-through"
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
        <p className="kicker">Resumo</p>
        <p className="mt-3 font-semibold">{r.servico}</p>
        <p className="text-sm text-muted">
          {descreverCombinacao(estado.combinacao)} · {formatBRL(r.preco)}
        </p>
        {plano && horario && (
          <div className="mt-4 border-t border-line pt-4 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Repeat aria-hidden className="size-4 text-rosa-escuro" />
              Fixo às {diaSemana}s, {formatTime(horario.minutes)}
            </p>
            <ul className="mt-2 space-y-1 text-muted">
              {datas.map((d, i) => (
                <li key={d}>
                  {i === 0 ? "Aplicação" : `Manutenção ${i}`}: {formatDateParts(d).dayMonth}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full">
          {plano ? "Reservar plano" : "Reservar horário"}
        </button>
        <div className="mt-3">
          <MessagePreview businessName={esmalteria.nome} message={mensagem} triggerLabel="Prefiro chamar no WhatsApp" triggerClassName="btn btn-secondary w-full" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">Demonstração: nenhum horário é marcado e nenhuma mensagem é enviada.</p>
      </aside>
    </form>
  );
}
