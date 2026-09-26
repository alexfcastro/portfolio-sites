"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { offers, professional } from "@/data/profile";
import { formatBRL } from "@/lib/money";
import { budgets, buildProposalMessage, deadlines, suggestPackage, validateProposal, type ProposalErrors, type ProposalInput } from "@/lib/proposal";

const FIELDS: Array<keyof ProposalInput> = ["offerId", "quantity", "deadline", "budget", "description"];

export function ProposalForm() {
  const uid = useId();
  const [values, setValues] = useState({ offerId: "", quantity: "", deadline: "", budget: "", description: "" });
  const [errors, setErrors] = useState<ProposalErrors>({});
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (message) resultRef.current?.focus();
  }, [message]);

  const input: ProposalInput = { ...values, quantity: values.quantity ? Number(values.quantity) : NaN };
  const pack = values.offerId && Number(values.quantity) > 0 ? suggestPackage(values.offerId, Math.floor(Number(values.quantity))) : null;

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setMessage(null);
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const described = (key: keyof ProposalInput) => (errors[key] ? `${uid}-${key}-err` : undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <form
        noValidate
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          const next = validateProposal(input);
          setErrors(next);
          const first = FIELDS.find((key) => next[key]);
          if (first) {
            setStatus(`Revise ${Object.keys(next).length === 1 ? "1 campo" : `${Object.keys(next).length} campos`}.`);
            document.getElementById(`${uid}-${first}`)?.focus();
            return;
          }
          setStatus("");
          setMessage(buildProposalMessage(input));
        }}
      >
        <p role="status" className="min-h-5 text-sm font-semibold text-alert">
          {status}
        </p>

        <label className="block">
          <span className="font-bold">Tipo de trabalho</span>
          <select
            id={`${uid}-offerId`}
            value={values.offerId}
            onChange={set("offerId")}
            aria-invalid={errors.offerId ? true : undefined}
            aria-describedby={described("offerId")}
            className="field"
          >
            <option value="">Selecione</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.name}
              </option>
            ))}
          </select>
          {errors.offerId && <span id={`${uid}-offerId-err`} className="mt-1 block text-sm font-semibold text-alert">{errors.offerId}</span>}
        </label>

        <label className="block">
          <span className="font-bold">Quantidade de fotos ou produtos</span>
          <input
            id={`${uid}-quantity`}
            type="number"
            inputMode="numeric"
            min={1}
            max={500}
            value={values.quantity}
            onChange={set("quantity")}
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={described("quantity")}
            className="field"
          />
          {errors.quantity && <span id={`${uid}-quantity-err`} className="mt-1 block text-sm font-semibold text-alert">{errors.quantity}</span>}
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              ["deadline", "Prazo desejado", deadlines],
              ["budget", "Faixa de investimento", budgets],
            ] as const
          ).map(([key, label, options]) => (
            <label key={key} className="block">
              <span className="font-bold">{label}</span>
              <select
                id={`${uid}-${key}`}
                value={values[key]}
                onChange={set(key)}
                aria-invalid={errors[key] ? true : undefined}
                aria-describedby={described(key)}
                className="field"
              >
                <option value="">Selecione</option>
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              {errors[key] && <span id={`${uid}-${key}-err`} className="mt-1 block text-sm font-semibold text-alert">{errors[key]}</span>}
            </label>
          ))}
        </div>

        <label className="block">
          <span className="font-bold">Sobre o projeto</span>
          <textarea
            id={`${uid}-description`}
            rows={5}
            maxLength={600}
            value={values.description}
            onChange={set("description")}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={described("description")}
            placeholder="Ex.: linha de 12 cafés especiais, fotos em fundo claro para a loja on-line."
            className="field resize-y"
          />
          <span className="mt-1 block text-right text-xs text-muted">{values.description.length} de 600</span>
          {errors.description && <span id={`${uid}-description-err`} className="block text-sm font-semibold text-alert">{errors.description}</span>}
        </label>

        <p className="flex gap-2 text-sm text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-terra" />
          Pedido de demonstração: não pedimos nome nem contato, e nada é enviado.
        </p>

        <button type="submit" className="btn btn-primary">
          Revisar pedido de proposta
        </button>
      </form>

      <aside aria-label="Pacote sugerido" className="h-fit rounded-lg border border-line bg-paper p-6 lg:sticky lg:top-24">
        <p className="kicker">Estimativa</p>
        {pack ? (
          <>
            <p className="mt-3 font-serif text-3xl">Pacote {pack.name}</p>
            <p className="mt-2 text-lg font-semibold">
              {formatBRL(pack.minCents)} a {formatBRL(pack.maxCents)}
            </p>
            {pack.discount > 0 && <p className="mt-1 text-sm text-muted">Inclui {pack.discount}% de desconto por volume.</p>}
          </>
        ) : (
          <p className="mt-3 text-muted">Escolha o tipo de trabalho e a quantidade para ver um pacote sugerido.</p>
        )}
        <p className="mt-4 text-xs text-muted">Valores demonstrativos. A proposta real considera o briefing completo.</p>
      </aside>

      {message && (
        <section aria-labelledby="pronto" className="rounded-lg border border-terra/40 bg-paper p-6 lg:col-span-2">
          <CheckCircle2 aria-hidden className="size-8 text-terra" />
          <h2 id="pronto" ref={resultRef} tabIndex={-1} className="mt-3 text-3xl outline-none">
            Pedido de proposta pronto
          </h2>
          <p className="mt-2 text-muted">Nada foi enviado. Em um site real, esta mensagem chegaria direto para {professional.name}.</p>
          <pre className="mt-4 rounded-md bg-sandbg p-4 font-sans text-sm whitespace-pre-wrap">{message}</pre>
          <div className="mt-4">
            <MessagePreview businessName={professional.name} message={message} triggerLabel="Prévia no WhatsApp" triggerClassName="btn btn-primary" />
          </div>
        </section>
      )}
    </div>
  );
}
