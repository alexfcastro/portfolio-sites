"use client";

import { CheckCircle2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { createLocalStore } from "@/lib/local-store";
import { CURSO, dataTurma, parcela, proximaTurma, vagasRestantes } from "@/lib/curso";

/*
 * Reserva de vaga do Curso Volume Perfeito (demonstração). As reservas ficam só neste navegador e tiram
 * vagas da contagem. Nada é cobrado nem enviado.
 */

interface Estado {
  versao: 1;
  reservas: { codigo: string; turma: string }[];
}

const store = createLocalStore<Estado>({
  key: "ax-volume-perfeito-demo",
  initial: () => ({ versao: 1, reservas: [] }),
  parse: (v) => {
    const e = v as Partial<Estado> | null;
    return e && e.versao === 1 && Array.isArray(e.reservas) ? { versao: 1, reservas: e.reservas.slice(-10) } : null;
  },
});

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function novoCodigo(): string {
  return `VP-${String(Math.floor(Date.now() / 1000) % 100000).padStart(5, "0")}`;
}

function brl(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

function formatarWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Contagem de vagas, usada no topo, no investimento e na barra fixa do celular. */
export function Vagas({ className = "" }: { className?: string }) {
  const estado = store.useStore();
  if (!estado) return <span className={className}>&nbsp;</span>;
  const turma = proximaTurma(hoje());
  const restantes = vagasRestantes(estado.reservas.filter((r) => r.turma === turma.sabado).length);
  return (
    <span className={className}>
      {restantes === 0 ? "Turma completa" : `${restantes} de ${CURSO.vagasTotal} vagas`} · {dataTurma(turma)}
    </span>
  );
}

/** Data da próxima turma (calculada no navegador; o HTML estático não sabe o dia da visita). */
export function DataTurma() {
  const estado = store.useStore();
  if (!estado) return <span>&nbsp;</span>;
  return <span>{dataTurma(proximaTurma(hoje()))}</span>;
}

export function ReservaCurso() {
  const estado = store.useStore();
  if (!estado) return <div aria-hidden className="lp-card h-96" />;
  return <Formulario />;
}

function Formulario() {
  const id = useId();
  const estado = store.useStore()!;
  const turma = proximaTurma(hoje());
  const restantes = vagasRestantes(estado.reservas.filter((r) => r.turma === turma.sabado).length);
  const [pagamento, setPagamento] = useState<"pix" | "cartao">("cartao");
  const [parcelas, setParcelas] = useState<number>(CURSO.parcelasMax);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [experiencia, setExperiencia] = useState("Já atendo cílios");
  const [erros, setErros] = useState<{ nome?: string; whatsapp?: string }>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const prontoRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const valor =
    pagamento === "pix" ? `${brl(CURSO.pix)} no Pix, à vista` : `${parcelas}× de ${brl(parcela(parcelas))} sem juros no cartão (total ${brl(CURSO.cartao)})`;
  const mensagem = [
    restantes === 0 && !codigo ? "Olá! A turma do Curso Volume Perfeito completou. Quero entrar na lista de espera." : "Olá! Quero reservar uma vaga no Curso Volume Perfeito.",
    `Turma: ${dataTurma(turma)}`,
    `Pagamento: ${valor}`,
    `Experiência: ${experiencia}`,
    nome.trim() ? `Nome: ${nome.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const e: typeof erros = {};
    if (nome.trim().length < 2) e.nome = "Informe o seu nome.";
    if (whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "Informe um WhatsApp com DDD.";
    setErros(e);
    if (e.nome || e.whatsapp) {
      formRef.current?.querySelector<HTMLElement>(e.nome ? `#${CSS.escape(id)}-nome` : `#${CSS.escape(id)}-whats`)?.focus();
      return;
    }
    const novo = novoCodigo();
    store.set({ ...store.get(), reservas: [...store.get().reservas, { codigo: novo, turma: turma.sabado }].slice(-10) });
    setCodigo(novo);
    requestAnimationFrame(() => prontoRef.current?.focus());
  };

  if (codigo) {
    return (
      <div className="lp-card p-6 sm:p-8">
        <CheckCircle2 aria-hidden className="lp-accent size-10" />
        <h3 ref={prontoRef} tabIndex={-1} className="mt-4 text-2xl font-bold">
          Vaga reservada, {nome.trim().split(" ")[0]}
        </h3>
        <p className="lp-muted mt-3 leading-relaxed">
          Código de demonstração <strong className="text-[var(--lp-fg)]">{codigo}</strong>. A vaga saiu da contagem. Nada foi cobrado nem
          enviado: num site real, a professora confirmaria o pagamento pelo WhatsApp.
        </p>
        <p className="mt-3">{valor}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <MessagePreview businessName="Curso Volume Perfeito" message={mensagem} triggerLabel="Enviar pelo WhatsApp" triggerClassName="btn lp-btn" />
          <button type="button" onClick={() => setCodigo(null)} className="btn lp-btn-ghost">
            Reservar outra vaga
          </button>
        </div>
      </div>
    );
  }

  if (restantes === 0) {
    return (
      <div className="lp-card p-6 sm:p-8">
        <h3 className="text-2xl font-bold">Esta turma completou</h3>
        <p className="lp-muted mt-3">A próxima abre em cerca de um mês. Na lista de espera, você fica sabendo da data antes de todo mundo.</p>
        <div className="mt-6">
          <MessagePreview businessName="Curso Volume Perfeito" message={mensagem} triggerLabel="Entrar na lista de espera" triggerClassName="btn lp-btn" />
        </div>
      </div>
    );
  }

  const opcao = "flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--lp-line)] p-4 has-checked:border-[var(--lp-accent)] has-focus-visible:outline-3 has-focus-visible:outline-[var(--lp-accent)]";
  const campo = "mt-1.5 block w-full rounded-xl border border-[var(--lp-line)] bg-[var(--lp-bg)] px-3.5 py-3 text-[var(--lp-fg)] outline-none focus:border-[var(--lp-accent)] aria-[invalid=true]:border-[#ff8a8a]";

  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="lp-card space-y-6 p-6 sm:p-8">
      <p className="text-lg font-bold">
        <Vagas />
      </p>
      <fieldset>
        <legend className="font-bold">Forma de pagamento</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className={opcao}>
            <input type="radio" name={`${id}-pag`} checked={pagamento === "cartao"} onChange={() => setPagamento("cartao")} className="mt-1 size-4 shrink-0 accent-[var(--lp-accent)] focus:outline-none" />
            <span>
              <span className="block font-semibold">Cartão em até {CURSO.parcelasMax}×</span>
              <span className="lp-muted text-sm">sem juros, total {brl(CURSO.cartao)}</span>
            </span>
          </label>
          <label className={opcao}>
            <input type="radio" name={`${id}-pag`} checked={pagamento === "pix"} onChange={() => setPagamento("pix")} className="mt-1 size-4 shrink-0 accent-[var(--lp-accent)] focus:outline-none" />
            <span>
              <span className="block font-semibold">Pix à vista</span>
              <span className="lp-muted text-sm">{brl(CURSO.pix)}, economia de {brl(CURSO.cartao - CURSO.pix)}</span>
            </span>
          </label>
        </div>
        {pagamento === "cartao" && (
          <div className="mt-4">
            <label htmlFor={`${id}-parcelas`} className="font-semibold">
              Parcelas
            </label>
            <select id={`${id}-parcelas`} value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className={campo}>
              {Array.from({ length: CURSO.parcelasMax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}× de {brl(parcela(n))}
                </option>
              ))}
            </select>
          </div>
        )}
        <p className="lp-accent mt-3 font-bold" aria-live="polite">
          {valor}
        </p>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nome`} className="font-semibold">
            Nome
          </label>
          <input id={`${id}-nome`} autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? `${id}-nome-erro` : undefined} className={campo} />
          {erros.nome && (
            <p id={`${id}-nome-erro`} className="mt-1 text-sm text-[#ff9b9b]">
              {erros.nome}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-whats`} className="font-semibold">
            WhatsApp com DDD
          </label>
          <input
            id={`${id}-whats`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 90000-0000"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
            aria-invalid={Boolean(erros.whatsapp)}
            aria-describedby={erros.whatsapp ? `${id}-whats-erro` : undefined}
            className={campo}
          />
          {erros.whatsapp && (
            <p id={`${id}-whats-erro`} className="mt-1 text-sm text-[#ff9b9b]">
              {erros.whatsapp}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-exp`} className="font-semibold">
          Sua experiência
        </label>
        <select id={`${id}-exp`} value={experiencia} onChange={(e) => setExperiencia(e.target.value)} className={campo}>
          {["Já atendo cílios", "Faço só fio a fio e quero volume", "Sou da área da beleza, mas não de cílios"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn lp-btn w-full">
        Reservar minha vaga
      </button>
      <p className="lp-muted text-xs">Demonstração: nada é cobrado e nenhuma mensagem é enviada.</p>
    </form>
  );
}
