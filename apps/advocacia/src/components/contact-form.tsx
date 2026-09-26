"use client";

import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { areas, contactPeriods, contactSubjects, getArea } from "@/data/firm";
import { buildContactMessage, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";

const FIELDS: Array<keyof ContactInput> = ["areaSlug", "subject", "period", "summary"];

export function ContactFormWithParams() {
  const area = useSearchParams().get("area") ?? "";
  return <ContactForm key={area} initialArea={getArea(area) ? area : ""} />;
}

export function ContactForm({ initialArea = "" }: { initialArea?: string }) {
  const uid = useId();
  const [values, setValues] = useState<ContactInput>({ areaSlug: initialArea, subject: "", period: "", summary: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (message) doneRef.current?.focus();
  }, [message]);

  const set = (key: keyof ContactInput) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setMessage(null);
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const error = (key: keyof ContactInput) =>
    errors[key] ? (
      <span id={`${uid}-${key}-err`} className="mt-1 block text-sm font-semibold text-alert">
        {errors[key]}
      </span>
    ) : null;

  const aria = (key: keyof ContactInput) => ({
    id: `${uid}-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
  });

  return (
    <div>
      <form
        noValidate
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          const next = validateContact(values);
          setErrors(next);
          const first = FIELDS.find((key) => next[key]);
          if (first) {
            document.getElementById(`${uid}-${first}`)?.focus();
            return;
          }
          setMessage(buildContactMessage(values));
        }}
      >
        <label className="block">
          <span className="font-semibold">Área relacionada</span>
          <select value={values.areaSlug} onChange={set("areaSlug")} className="field" {...aria("areaSlug")}>
            <option value="">Selecione</option>
            {areas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.name}
              </option>
            ))}
          </select>
          {error("areaSlug")}
        </label>

        <fieldset className="min-w-0">
          <legend className="font-semibold">Assunto</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {contactSubjects.map((subject, index) => (
              <label key={subject} className="flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-paper px-4 has-checked:border-navy">
                <input
                  type="radio"
                  name="subject"
                  checked={values.subject === subject}
                  onChange={() => set("subject")({ target: { value: subject } })}
                  className="size-5 accent-navy"
                  {...(index === 0 ? aria("subject") : {})}
                />
                {subject}
              </label>
            ))}
          </div>
          {error("subject")}
        </fieldset>

        <label className="block">
          <span className="font-semibold">Melhor período para o retorno</span>
          <select value={values.period} onChange={set("period")} className="field" {...aria("period")}>
            <option value="">Selecione</option>
            {contactPeriods.map((period) => (
              <option key={period}>{period}</option>
            ))}
          </select>
          {error("period")}
        </label>

        <label className="block">
          <span className="font-semibold">Em poucas palavras</span> <span className="text-sm text-muted">(opcional)</span>
          <textarea
            rows={4}
            maxLength={400}
            value={values.summary}
            onChange={set("summary")}
            className="field resize-y"
            placeholder="Ex.: dúvida sobre guarda compartilhada."
            {...aria("summary")}
          />
          <span className="mt-1 block text-right text-xs text-muted">{values.summary.length} de 400</span>
          {error("summary")}
        </label>

        <p className="flex gap-2 border-l-2 border-brass bg-paper p-4 text-sm text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brass-text" />
          Não inclua nomes, documentos ou detalhes do processo. Esta é uma demonstração e nada é enviado.
        </p>

        <button type="submit" className="btn btn-primary">
          Preparar pedido de conversa
        </button>
      </form>

      {message && (
        <section aria-labelledby="pedido-pronto" className="mt-10 border border-line bg-paper p-6">
          <h2 id="pedido-pronto" ref={doneRef} tabIndex={-1} className="text-3xl outline-none">
            Pedido de conversa inicial pronto
          </h2>
          <p className="mt-2 text-muted">Nada foi enviado. Em um site real, o escritório retornaria no período indicado.</p>
          <pre className="mt-4 bg-ivory p-4 font-sans text-sm whitespace-pre-wrap">{message}</pre>
          <div className="mt-4">
            <MessagePreview businessName="Almeida & Prado" message={message} triggerLabel="Prévia no WhatsApp" triggerClassName="btn btn-secondary" />
          </div>
        </section>
      )}
    </div>
  );
}
