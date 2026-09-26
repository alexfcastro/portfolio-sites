"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { neighborhoods, purposeLabels, typeLabels, type PropertyType } from "@/data/listings";
import { validateOwner, type OwnerInput } from "@/lib/search";

export function OwnerForm() {
  const uid = useId();
  const [values, setValues] = useState({ purpose: "", type: "", neighborhood: "", bedrooms: "", expectation: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof OwnerInput, string>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (message) doneRef.current?.focus();
  }, [message]);

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setMessage(null);
  };

  const field = (key: keyof OwnerInput) => ({
    id: `${uid}-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
  });
  const err = (key: keyof OwnerInput) =>
    errors[key] && (
      <span id={`${uid}-${key}-err`} className="mt-1 block text-sm font-semibold text-alert">
        {errors[key]}
      </span>
    );

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const input: OwnerInput = { ...values, bedrooms: values.bedrooms === "" ? NaN : Number(values.bedrooms) };
        const next = validateOwner(input);
        setErrors(next);
        const first = (["purpose", "type", "neighborhood", "bedrooms", "expectation"] as const).find((key) => next[key]);
        if (first) {
          document.getElementById(`${uid}-${first}`)?.focus();
          return;
        }
        setMessage(
          [
            "Olá, Horizonte! Quero anunciar meu imóvel.",
            "",
            `Finalidade: ${purposeLabels[input.purpose as "venda"]}`,
            `Tipo: ${typeLabels[input.type as PropertyType]}`,
            `Bairro: ${input.neighborhood}`,
            `Quartos: ${input.bedrooms}`,
            ...(input.expectation.trim() ? [`Observações: ${input.expectation.trim()}`] : []),
          ].join("\n"),
        );
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Você quer
          <select value={values.purpose} onChange={set("purpose")} className="field font-normal" {...field("purpose")}>
            <option value="">Selecione</option>
            <option value="venda">Vender</option>
            <option value="aluguel">Alugar</option>
          </select>
          {err("purpose")}
        </label>
        <label className="block text-sm font-semibold">
          Tipo de imóvel
          <select value={values.type} onChange={set("type")} className="field font-normal" {...field("type")}>
            <option value="">Selecione</option>
            {(Object.keys(typeLabels) as PropertyType[]).map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
          {err("type")}
        </label>
        <label className="block text-sm font-semibold">
          Bairro
          <select value={values.neighborhood} onChange={set("neighborhood")} className="field font-normal" {...field("neighborhood")}>
            <option value="">Selecione</option>
            {neighborhoods.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          {err("neighborhood")}
        </label>
        <label className="block text-sm font-semibold">
          Quartos
          <input type="number" min={0} max={10} inputMode="numeric" value={values.bedrooms} onChange={set("bedrooms")} className="field font-normal" {...field("bedrooms")} />
          {err("bedrooms")}
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Observações <span className="font-normal text-muted">(opcional)</span>
        <textarea rows={3} maxLength={300} value={values.expectation} onChange={set("expectation")} className="field font-normal" placeholder="Ex.: imóvel desocupado, aceita pet." {...field("expectation")} />
        {err("expectation")}
      </label>
      <p className="text-sm text-muted">Não pedimos endereço, documentos nem contato nesta demonstração. Nada é enviado.</p>
      <button type="submit" className="btn btn-primary">
        Preparar mensagem
      </button>
      {message && (
        <section aria-labelledby="anuncio-pronto" className="rounded-card border border-line bg-paper p-5">
          <h2 id="anuncio-pronto" ref={doneRef} tabIndex={-1} className="text-xl outline-none">
            Mensagem pronta
          </h2>
          <pre className="mt-3 rounded-lg bg-sky p-4 font-sans text-sm whitespace-pre-wrap">{message}</pre>
          <div className="mt-3">
            <MessagePreview businessName="Horizonte Imóveis" message={message} triggerLabel="Prévia no WhatsApp" />
          </div>
        </section>
      )}
    </form>
  );
}
