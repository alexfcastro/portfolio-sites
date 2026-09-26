"use client";

import { AlertCircle, ArrowLeft, Mail, MessageCircle, PencilLine, Wrench } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { SelectField, TextAreaField, TextField } from "@/components/contact/form-fields";
import type { ContactMode } from "@/config/site";
import { businessTypeOptions, objectiveOptions, projectTypeOptions } from "@/data/contact";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/contact/channels";
import {
  buildContactMessage,
  emptyContactForm,
  firstErrorField,
  LIMITS,
  resolveProjectSlug,
  validateContactForm,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
} from "@/lib/contact/form";

interface ContactFormProps {
  mode: ContactMode;
  whatsappRecipient: string | null;
  emailRecipient: string | null;
  projects: Array<{ slug: string; name: string }>;
}

/** Campos exibidos dentro do grupo "Mais detalhes". */
const DETAIL_FIELDS: ContactField[] = ["company", "phone", "email", "city", "businessType", "objective"];

const noopSubscribe = () => () => {};

/**
 * Verdadeiro somente depois da hidratação. Antes disso o envio fica bloqueado:
 * um submit nativo colocaria os dados pessoais na URL (método GET).
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Lê `?projeto=<slug>` e pré-seleciona apenas slugs cadastrados. */
export function ContactFormWithParams(props: ContactFormProps) {
  const searchParams = useSearchParams();
  const slug = resolveProjectSlug(
    searchParams.get("projeto"),
    props.projects.map((project) => project.slug),
  );
  return <ContactForm {...props} initialProjectSlug={slug} />;
}

export function ContactForm({
  mode,
  whatsappRecipient,
  emailRecipient,
  projects,
  initialProjectSlug = "",
}: ContactFormProps & { initialProjectSlug?: string }) {
  const hydrated = useHydrated();
  const slugs = projects.map((project) => project.slug);
  const [values, setValues] = useState<ContactFormValues>(() => ({
    ...emptyContactForm,
    projectSlug: initialProjectSlug,
  }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusReviewRef = useRef(false);

  const projectName = projects.find((project) => project.slug === values.projectSlug)?.name ?? null;

  const update = (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    // Qualquer alteração invalida a revisão anterior, evitando link com texto desatualizado.
    setReview(null);
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactForm(values, slugs);
    setErrors(nextErrors);

    const first = firstErrorField(nextErrors);
    if (first) {
      const count = Object.keys(nextErrors).length;
      setStatus(count === 1 ? "Há 1 campo para corrigir." : `Há ${count} campos para corrigir.`);
      setReview(null);
      // Os campos já existem no DOM; o grupo de detalhes é aberto antes de focar.
      if (DETAIL_FIELDS.includes(first) && detailsRef.current) {
        detailsRef.current.open = true;
        setDetailsOpen(true);
      }
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("");
    focusReviewRef.current = true;
    setReview(buildContactMessage(values, projectName));
  };

  // O painel de revisão só existe após a renderização; o foco vai para ele em seguida.
  useEffect(() => {
    if (review && focusReviewRef.current) {
      focusReviewRef.current = false;
      reviewHeadingRef.current?.focus();
    }
  }, [review]);

  const backToForm = () => {
    setReview(null);
    formRef.current?.querySelector<HTMLElement>('[name="message"]')?.focus();
  };

  const whatsappUrl = review && mode === "whatsapp" && whatsappRecipient ? buildWhatsAppUrl(whatsappRecipient, review) : null;
  const emailUrl =
    review && mode === "email" && emailRecipient
      ? buildMailtoUrl(emailRecipient, `Orçamento — ${values.name.trim()}`, review)
      : null;

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-intro" className="space-y-6">
        <p id="form-intro" className="text-sm text-muted">
          Campos marcados com <span className="text-danger">*</span> são obrigatórios. Nada é enviado ao clicar em
          revisar: você verá a mensagem completa antes de decidir.
        </p>

        <div role="status" aria-live="polite" className={status ? "" : "sr-only"}>
          {status && (
            <p className="flex items-center gap-2 rounded-control border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              <AlertCircle aria-hidden className="size-4 shrink-0" />
              {status}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="Nome"
            required
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={update("name")}
            error={errors.name}
          />
          <SelectField
            id="projectType"
            label="Tipo de projeto"
            required
            placeholder="Selecione"
            options={projectTypeOptions}
            value={values.projectType}
            onChange={update("projectType")}
            error={errors.projectType}
          />
        </div>

        <SelectField
          id="projectSlug"
          label="Projeto de interesse"
          placeholder="Nenhum em especial"
          options={projects.map((project) => ({ value: project.slug, label: `${project.name} (conceitual)` }))}
          value={values.projectSlug}
          onChange={update("projectSlug")}
          error={errors.projectSlug}
          hint="Se um dos projetos do portfólio se parece com o que você precisa, indique aqui."
        />

        <TextAreaField
          id="message"
          label="Mensagem"
          required
          maxLength={LIMITS.message}
          rows={6}
          value={values.message}
          onChange={update("message")}
          error={errors.message}
          hint="Conte sobre o seu negócio e o que você gostaria que o site fizesse. Não inclua senhas nem dados sensíveis."
          counter={`${values.message.length} de ${LIMITS.message} caracteres`}
        />

        <details
          ref={detailsRef}
          open={detailsOpen}
          onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
          className="group rounded-card border border-line bg-canvas/60"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-semibold [&::-webkit-details-marker]:hidden">
            Mais detalhes (opcional)
            <span aria-hidden className="text-accent transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="grid gap-5 border-t border-line px-5 py-5 sm:grid-cols-2">
            <TextField
              id="company"
              label="Empresa ou negócio"
              autoComplete="organization"
              maxLength={LIMITS.shortText}
              value={values.company}
              onChange={update("company")}
              error={errors.company}
            />
            <TextField
              id="city"
              label="Cidade"
              autoComplete="address-level2"
              maxLength={LIMITS.shortText}
              value={values.city}
              onChange={update("city")}
              error={errors.city}
            />
            <TextField
              id="phone"
              label="Seu WhatsApp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={25}
              value={values.phone}
              onChange={update("phone")}
              error={errors.phone}
              hint="Com DDD. Útil se preferir retorno em outro número."
            />
            <TextField
              id="email"
              label="Seu e-mail"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.shortText}
              value={values.email}
              onChange={update("email")}
              error={errors.email}
            />
            <SelectField
              id="businessType"
              label="Tipo de negócio"
              placeholder="Selecione"
              options={businessTypeOptions}
              value={values.businessType}
              onChange={update("businessType")}
              error={errors.businessType}
            />
            <SelectField
              id="objective"
              label="Objetivo principal"
              placeholder="Selecione"
              options={objectiveOptions}
              value={values.objective}
              onChange={update("objective")}
              error={errors.objective}
            />
          </div>
        </details>

        <button
          type="submit"
          disabled={!hydrated}
          className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <PencilLine aria-hidden className="size-4" />
          Revisar mensagem
        </button>
      </form>

      {review && (
        <section aria-labelledby="revisao-title" className="mt-10 rounded-card border border-line bg-paper p-5 shadow-card sm:p-6">
          <h2 id="revisao-title" ref={reviewHeadingRef} tabIndex={-1} className="text-xl font-extrabold outline-none">
            Revise sua mensagem
          </h2>
          <p className="mt-2 text-sm text-muted">
            Este é o texto exato que será encaminhado. Para mudar algo, volte ao formulário: seus dados continuam
            preenchidos.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-control bg-canvas p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {review}
          </pre>

          {whatsappUrl && (
            <div className="mt-5">
              <p className="text-sm font-medium text-ink">A mensagem será aberta no WhatsApp. Conclua o envio por lá.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:brightness-110">
                  <MessageCircle aria-hidden className="size-4" />
                  Continuar no WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <button type="button" onClick={backToForm} className="btn btn-secondary">
                  <ArrowLeft aria-hidden className="size-4" />
                  Editar mensagem
                </button>
              </div>
            </div>
          )}

          {emailUrl && (
            <div className="mt-5">
              <p className="text-sm font-medium text-ink">
                Seu aplicativo de e-mail será aberto com a mensagem preenchida. O envio só acontece quando você
                confirmar por lá.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a href={emailUrl} className="btn btn-primary">
                  <Mail aria-hidden className="size-4" />
                  Abrir no aplicativo de e-mail
                </a>
                <button type="button" onClick={backToForm} className="btn btn-secondary">
                  <ArrowLeft aria-hidden className="size-4" />
                  Editar mensagem
                </button>
              </div>
            </div>
          )}

          {mode === "none" && (
            <div className="mt-5">
              <p className="flex gap-2 rounded-control border border-line bg-canvas px-4 py-3 text-sm text-muted">
                <Wrench aria-hidden className="mt-0.5 size-4 shrink-0 text-ink" />
                <span>
                  <strong className="text-ink">Contato em configuração.</strong> Os canais de contato ainda não foram
                  configurados, então esta mensagem não pode ser encaminhada. Nada foi enviado.
                </span>
              </p>
              <button type="button" onClick={backToForm} className="btn btn-secondary mt-4">
                <ArrowLeft aria-hidden className="size-4" />
                Voltar ao formulário
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
