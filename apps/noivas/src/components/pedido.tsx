"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CampoTexto, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { atelie } from "@/data/atelie";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { calcular, resumoGrupo } from "@/lib/orcamento";
import { formatDateLong, formatTime } from "@/lib/time";

type Erros = Partial<Record<"data" | "nome" | "whatsapp", string>>;

function formatarWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Código curto de demonstração (não identifica ninguém). */
function novoCodigo(): string {
  return `AV-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
}

/** Pedido de orçamento com o resumo do grupo, da data e do cálculo. Nada é enviado. */
export function Pedido() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-10 text-muted">Carregando o resumo…</p>;
  return <Formulario />;
}

function Formulario() {
  const estado = demoStore.useStore()!;
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [local, setLocal] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const calculo = calcular(estado.grupo, estado.cerimonia, estado.noLocal);
  const grupo = resumoGrupo(estado.grupo);
  const linhas = [
    "Olá, Ateliê Véu! Quero um orçamento para o dia da noiva.",
    `Data: ${estado.data ? formatDateLong(estado.data) : "a definir"}, cerimônia às ${formatTime(estado.cerimonia)}`,
    ...grupo,
    `Começo às ${formatTime(calculo.inicio)} · valor estimado ${formatBRL(calculo.total)}${estado.noLocal ? " (no local da festa)" : ""}`,
  ];
  if (local.trim()) linhas.push(`Local: ${local.trim()}`);
  if (nome.trim()) linhas.push(`Nome: ${nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados: Erros = {};
    if (!estado.data) encontrados.data = "Escolha a data do casamento no calendário.";
    if (nome.trim().length < 2) encontrados.nome = "Informe seu nome.";
    if (whatsapp.replace(/\D/g, "").length < 10) encontrados.whatsapp = "Informe um WhatsApp com DDD.";
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const novo = novoCodigo();
    const atual = demoStore.get();
    demoStore.set({ ...atual, pedidos: [...atual.pedidos, { codigo: novo, nome: nome.trim(), data: estado.data!, total: calculo.total }].slice(-5) });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  const resumo = (
    <dl className="space-y-3 text-sm">
      <div>
        <dt className="text-muted">Data e cerimônia</dt>
        <dd className="font-medium">
          {estado.data ? (
            <span className="first-letter:uppercase">{formatDateLong(estado.data)}</span>
          ) : (
            <Link href="/#disponibilidade" className="text-dourado-escuro underline underline-offset-4">
              Escolher no calendário
            </Link>
          )}
          , às {formatTime(estado.cerimonia)}
        </dd>
      </div>
      <div>
        <dt className="text-muted">Grupo</dt>
        <dd>
          <ul className="font-medium">
            {grupo.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt className="text-muted">Horário e valor</dt>
        <dd className="font-medium">
          Começo às {formatTime(calculo.inicio)} · {formatBRL(calculo.total)}
        </dd>
      </div>
    </dl>
  );

  if (codigo) {
    return (
      <div className="troca mt-10 rounded-card border border-line bg-paper p-6 sm:p-10">
        <h3 ref={confirmacaoRef} tabIndex={-1} className="text-3xl sm:text-4xl">
          Pedido enviado para a equipe, {nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          Código de demonstração <strong className="text-ink">{codigo}</strong>. Nada foi enviado de verdade: num site real, o ateliê
          responderia confirmando a data e marcando o teste.
        </p>
        <div className="mt-6 rounded-card bg-champanhe-suave p-5">{resumo}</div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={atelie.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => setCodigo(null)}>
            Ajustar o pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="min-w-0 space-y-6">
        <ResumoErros ref={errosRef} erros={(["data", "nome", "whatsapp"] as const).flatMap((c) => (erros[c] ? [[c, erros[c]!] as [string, string]] : []))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto id="nome" rotulo="Nome da noiva" valor={nome} onChange={setNome} erro={erros.nome} autoComplete="name" />
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
        <CampoTexto id="local" rotulo="Local da cerimônia (opcional)" valor={local} onChange={setLocal} placeholder="Ex.: igreja ou espaço de eventos, bairro" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn btn-primary">
            Pedir orçamento
          </button>
          <MessagePreview businessName={atelie.nome} message={mensagem} triggerLabel="Ver a mensagem do WhatsApp" triggerClassName="btn btn-secondary" />
        </div>
        <p className="text-xs text-muted">Demonstração: nenhum pedido é registrado e nenhuma mensagem é enviada.</p>
      </div>
      <aside className="rounded-card border border-line bg-paper p-6 lg:sticky lg:top-24">
        <p className="kicker">Resumo do orçamento</p>
        <div className="mt-4">{resumo}</div>
        <Link href="/#montador" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-dourado-escuro underline underline-offset-4">
          Mudar o grupo
        </Link>
      </aside>
    </form>
  );
}
