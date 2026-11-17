"use client";

import { CheckCircle2 } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";

/*
 * Formulário de conversão das landing pages. É uma demonstração: valida os campos e mostra a
 * confirmação, mas não envia nem guarda nada. Em um site real, o pedido chegaria por WhatsApp,
 * e-mail ou sistema do cliente.
 */
export function LeadForm({
  title,
  cta,
  successTitle,
  successText,
  extraLabel,
  extraOptions,
}: {
  title: string;
  cta: string;
  successTitle: string;
  successText: string;
  /** Campo de escolha opcional (ex.: tipo de planta, plano, dia do evento). */
  extraLabel?: string;
  extraOptions?: readonly string[];
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [extra, setExtra] = useState(extraOptions?.[0] ?? "");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Informe o seu nome.";
    if (contact.trim().length < 5) next.contact = "Informe um WhatsApp ou e-mail para retorno.";
    setErrors(next);
    if (next.name || next.contact) {
      formRef.current?.querySelector<HTMLElement>(next.name ? `#${CSS.escape(id)}-name` : `#${CSS.escape(id)}-contact`)?.focus();
      return;
    }
    setDone(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  if (done) {
    return (
      <div className="lp-card p-6 sm:p-8">
        <CheckCircle2 aria-hidden className="lp-accent size-10" />
        <h3 ref={doneRef} tabIndex={-1} className="mt-4 text-2xl font-bold">
          {successTitle}
        </h3>
        <p className="lp-muted mt-3 leading-relaxed">{successText}</p>
        <p className="lp-muted mt-3 text-sm">
          Isto é uma demonstração: nada foi enviado nem guardado. Em um site real, o pedido de {name.trim()} chegaria
          ao negócio na hora.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setName("");
            setContact("");
          }}
          className="btn lp-btn-ghost mt-6"
        >
          Preencher de novo
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="lp-card p-6 sm:p-8">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor={`${id}-name`} className="font-semibold">
            Nome
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className="lp-input mt-1.5"
          />
          {errors.name && (
            <p id={`${id}-name-error`} role="alert" className="mt-1.5 text-sm font-semibold">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-contact`} className="font-semibold">
            WhatsApp ou e-mail
          </label>
          <input
            id={`${id}-contact`}
            name="contact"
            maxLength={80}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            aria-invalid={errors.contact ? true : undefined}
            aria-describedby={errors.contact ? `${id}-contact-error` : undefined}
            className="lp-input mt-1.5"
          />
          {errors.contact && (
            <p id={`${id}-contact-error`} role="alert" className="mt-1.5 text-sm font-semibold">
              {errors.contact}
            </p>
          )}
        </div>
        {extraLabel && extraOptions && (
          <div>
            <label htmlFor={`${id}-extra`} className="font-semibold">
              {extraLabel}
            </label>
            <select
              id={`${id}-extra`}
              name="extra"
              value={extra}
              onChange={(event) => setExtra(event.target.value)}
              className="lp-input mt-1.5"
            >
              {extraOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button type="submit" className="btn lp-btn mt-6 w-full">
        {cta}
      </button>
      <p className="lp-muted mt-3 text-center text-sm">Demonstração: nada é enviado nem guardado.</p>
    </form>
  );
}
