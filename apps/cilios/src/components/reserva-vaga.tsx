"use client";

import { CalendarDays, Users } from "lucide-react";
import { useRef, useState } from "react";
import { CampoTexto, Opcao, ResumoErros } from "@/components/campos";
import { MessagePreview } from "@/components/message-preview";
import { curso, lab } from "@/data/lab";
import { formatarWhatsapp } from "@/lib/agenda";
import { TURMA, experienciaLabels, parcela, proximaTurma, vagasRestantes, validarReserva, type ErrosReserva, type Experiencia, type Reserva } from "@/lib/curso";
import { demoStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatDateParts, getBusinessNow } from "@/lib/time";

/** Cabeçalho da turma com as vagas que restam (diminuem a cada reserva feita nesta demonstração). */
export function VagasTurma() {
  const estado = demoStore.useStore();
  // A data depende do dia de hoje: só é calculada no navegador (o HTML estático não sabe a data da visita).
  if (!estado) return <div aria-hidden className="h-40 rounded-card bg-paper" />;
  const turma = proximaTurma(getBusinessNow().date);
  const sabado = formatDateParts(turma.sabado);
  const domingo = formatDateParts(turma.domingo);
  const restantes: number | null = vagasRestantes(estado.reservas.filter((r) => r.turma === turma.sabado).length);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-paper p-5">
        <CalendarDays aria-hidden className="size-6 text-rosa-escuro" />
        <p className="mt-3 text-sm text-muted">Próxima turma</p>
        <p className="mt-1 text-2xl font-semibold">
          {sabado.dayMonth} e {domingo.dayMonth}
        </p>
        <p className="text-sm text-muted">sábado e domingo, das 9h às 18h</p>
      </div>
      <div className="rounded-card bg-ink p-5 text-offwhite">
        <Users aria-hidden className="size-6 text-rosa-claro" />
        <p className="mt-3 text-sm text-white/75">Vagas</p>
        <p className="mt-1 text-2xl font-semibold" aria-live="polite">
          {restantes === null ? "…" : restantes === 0 ? "Turma completa" : `${restantes} de ${TURMA.vagasTotal} restante${restantes > 1 ? "s" : ""}`}
        </p>
        <div aria-hidden className="mt-3 flex gap-1.5">
          {Array.from({ length: TURMA.vagasTotal }, (_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${restantes !== null && i < TURMA.vagasTotal - restantes ? "bg-white/25" : "bg-rosa-claro"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Formulário curto de reserva de vaga. Ao reservar, a vaga sai da contagem; sem vagas, vira lista de espera. */
export function ReservaVaga() {
  const estado = demoStore.useStore();
  if (!estado) return <p className="mt-8 text-muted">Carregando a turma…</p>;
  return <Formulario />;
}

function Formulario() {
  const estado = demoStore.useStore()!;
  const [hoje] = useState(() => getBusinessNow().date);
  const turma = proximaTurma(hoje);
  const restantes = vagasRestantes(estado.reservas.filter((r) => r.turma === turma.sabado).length);
  const [reserva, setReserva] = useState<Reserva>({ nome: "", whatsapp: "", experiencia: "", pagamento: "", parcelas: TURMA.parcelasMax });
  const [erros, setErros] = useState<ErrosReserva>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const atualizar = (parcial: Partial<Reserva>) => setReserva((r) => ({ ...r, ...parcial }));
  const valorPagamento =
    reserva.pagamento === "pix"
      ? `Pix: sinal de ${formatBRL(TURMA.sinal)} agora e ${formatBRL(TURMA.aVista - TURMA.sinal)} no primeiro dia (total ${formatBRL(TURMA.aVista)})`
      : reserva.pagamento === "cartao"
        ? `Cartão: ${reserva.parcelas}× de ${formatBRL(parcela(reserva.parcelas))} sem juros (total ${formatBRL(TURMA.cartao)})`
        : "";

  const linhas = [
    restantes === 0 && !codigo ? "Olá, Lash Lab! A turma está completa: quero entrar na lista de espera." : "Olá, Lash Lab! Quero reservar uma vaga no curso.",
    `Turma: ${formatDateLong(turma.sabado)} e domingo`,
  ];
  if (reserva.experiencia) linhas.push(`Experiência: ${experienciaLabels[reserva.experiencia]}`);
  if (valorPagamento) linhas.push(valorPagamento);
  if (reserva.nome.trim()) linhas.push(`Nome: ${reserva.nome.trim()}`);
  const mensagem = linhas.join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados = validarReserva(reserva);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const novo = `CT-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
    const atual = demoStore.get();
    demoStore.set({ ...atual, reservas: [...atual.reservas, { codigo: novo, nome: reserva.nome.trim(), turma: turma.sabado }].slice(-10) });
    setCodigo(novo);
    requestAnimationFrame(() => confirmacaoRef.current?.focus());
  };

  if (codigo) {
    return (
      <div className="troca mt-8 rounded-card border border-line bg-paper p-6 sm:p-10">
        <h3 ref={confirmacaoRef} tabIndex={-1} className="text-3xl">
          Vaga reservada, {reserva.nome.trim().split(" ")[0]}
        </h3>
        <p className="mt-3 text-muted">
          Código de demonstração <strong className="text-ink">{codigo}</strong>. A vaga saiu da contagem acima. Nada foi cobrado nem
          enviado: num site real, a {lab.profissional} confirmaria o pagamento pelo WhatsApp.
        </p>
        <p className="mt-4 text-sm">{valorPagamento}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName={lab.nome} message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn btn-primary" />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCodigo(null);
              setReserva({ nome: "", whatsapp: "", experiencia: "", pagamento: "", parcelas: TURMA.parcelasMax });
            }}
          >
            Reservar para outra pessoa
          </button>
        </div>
      </div>
    );
  }

  if (restantes === 0) {
    return (
      <div className="mt-8 rounded-card border border-line bg-paper p-6 sm:p-8">
        <h3 className="text-2xl">Esta turma completou</h3>
        <p className="mt-2 text-muted">
          A próxima abre em cerca de um mês. Entre na lista de espera: quem está nela fica sabendo da data antes de divulgar.
        </p>
        <div className="mt-6">
          <MessagePreview businessName={lab.nome} message={mensagem} triggerLabel="Entrar na lista de espera" triggerClassName="btn btn-primary" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 space-y-8">
      <ResumoErros
        ref={errosRef}
        erros={(["nome", "whatsapp", "experiencia", "pagamento"] as const).flatMap((c) => (erros[c] ? [[c, erros[c]!] as [string, string]] : []))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto id="nome" rotulo="Nome" valor={reserva.nome} onChange={(v) => atualizar({ nome: v })} erro={erros.nome} autoComplete="name" />
        <CampoTexto
          id="whatsapp"
          rotulo="WhatsApp com DDD"
          tipo="tel"
          valor={reserva.whatsapp}
          onChange={(v) => atualizar({ whatsapp: formatarWhatsapp(v) })}
          erro={erros.whatsapp}
          autoComplete="tel-national"
          placeholder="(11) 90000-0000"
        />
      </div>

      <fieldset id="campo-experiencia" tabIndex={-1} className="min-w-0 scroll-mt-28">
        <legend className="font-semibold">Sua experiência</legend>
        {erros.experiencia && <p className="mt-1 text-sm text-alert">{erros.experiencia}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(Object.keys(experienciaLabels) as Experiencia[]).map((valor) => (
            <Opcao key={valor} name="experiencia" checked={reserva.experiencia === valor} onChange={() => atualizar({ experiencia: valor })}>
              {experienciaLabels[valor]}
            </Opcao>
          ))}
        </div>
      </fieldset>

      <fieldset id="campo-pagamento" tabIndex={-1} className="min-w-0 scroll-mt-28">
        <legend className="font-semibold">Forma de pagamento</legend>
        {erros.pagamento && <p className="mt-1 text-sm text-alert">{erros.pagamento}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Opcao name="pagamento" checked={reserva.pagamento === "pix"} onChange={() => atualizar({ pagamento: "pix" })} detalhe={`${formatBRL(TURMA.aVista)} à vista, com sinal de ${formatBRL(TURMA.sinal)} para garantir a vaga`}>
            Pix
          </Opcao>
          <Opcao name="pagamento" checked={reserva.pagamento === "cartao"} onChange={() => atualizar({ pagamento: "cartao" })} detalhe={`${formatBRL(TURMA.cartao)} em até ${TURMA.parcelasMax}× sem juros`}>
            Cartão de crédito
          </Opcao>
        </div>
        {reserva.pagamento === "cartao" && (
          <div className="troca mt-4 max-w-xs">
            <label htmlFor="parcelas" className="font-medium">
              Parcelas
            </label>
            <select id="parcelas" value={reserva.parcelas} onChange={(e) => atualizar({ parcelas: Number(e.target.value) })} className="field">
              {Array.from({ length: TURMA.parcelasMax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}× de {formatBRL(parcela(n))}
                </option>
              ))}
            </select>
          </div>
        )}
        {valorPagamento && <p className="mt-3 text-sm text-muted">{valorPagamento}</p>}
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary">
          Reservar minha vaga
        </button>
        <MessagePreview businessName={lab.nome} message={mensagem} triggerLabel="Tirar dúvida pelo WhatsApp" triggerClassName="btn btn-secondary" />
      </div>
      <p className="text-xs text-muted">Demonstração: nenhuma cobrança é feita e nenhuma mensagem é enviada. {curso.paraQuem}</p>
    </form>
  );
}
