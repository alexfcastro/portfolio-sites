import {
  businessTypeOptions,
  objectiveOptions,
  optionLabel,
  projectTypeOptions,
  type Option,
} from "@/data/contact";
import { isValidEmail } from "@/lib/contact/channels";

export const LIMITS = {
  name: 100,
  shortText: 150,
  message: 2000,
} as const;

export interface ContactFormValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  businessType: string;
  projectType: string;
  objective: string;
  message: string;
  projectSlug: string;
}

export type ContactField = keyof ContactFormValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Ordem visual dos campos, usada para focar o primeiro erro. */
export const FIELD_ORDER: ContactField[] = [
  "name",
  "projectType",
  "message",
  "company",
  "phone",
  "email",
  "city",
  "businessType",
  "objective",
  "projectSlug",
];

export const emptyContactForm: ContactFormValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  businessType: "",
  projectType: "",
  objective: "",
  message: "",
  projectSlug: "",
};

function isOption(options: Option[], value: string): boolean {
  return options.some((option) => option.value === value);
}

function isValidVisitorPhone(value: string): boolean {
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function validateContactForm(
  values: ContactFormValues,
  knownSlugs: readonly string[],
): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const message = values.message.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();

  if (!name) errors.name = "Informe seu nome.";
  else if (name.length > LIMITS.name) errors.name = `Use no máximo ${LIMITS.name} caracteres.`;

  if (!values.projectType) errors.projectType = "Escolha o tipo de projeto. Se ainda não souber, selecione “Ainda não sei”.";
  else if (!isOption(projectTypeOptions, values.projectType)) errors.projectType = "Escolha uma opção da lista.";

  if (!message) errors.message = "Escreva uma mensagem contando o que você precisa.";
  else if (message.length > LIMITS.message) errors.message = `Use no máximo ${LIMITS.message} caracteres.`;

  for (const field of ["company", "city"] as const) {
    if (values[field].trim().length > LIMITS.shortText) {
      errors[field] = `Use no máximo ${LIMITS.shortText} caracteres.`;
    }
  }

  if (phone && !isValidVisitorPhone(phone)) {
    errors.phone = "Informe um número com DDD, por exemplo (11) 91234-5678.";
  }

  if (email && !isValidEmail(email)) {
    errors.email = "Informe um e-mail válido, por exemplo nome@dominio.com.br.";
  }

  if (values.businessType && !isOption(businessTypeOptions, values.businessType)) {
    errors.businessType = "Escolha uma opção da lista.";
  }

  if (values.objective && !isOption(objectiveOptions, values.objective)) {
    errors.objective = "Escolha uma opção da lista.";
  }

  if (values.projectSlug && !knownSlugs.includes(values.projectSlug)) {
    errors.projectSlug = "Projeto não reconhecido.";
  }

  return errors;
}

export function firstErrorField(errors: ContactErrors): ContactField | null {
  return FIELD_ORDER.find((field) => errors[field]) ?? null;
}

/** Aceita o slug da URL somente se corresponder a um projeto cadastrado. */
export function resolveProjectSlug(raw: string | null | undefined, knownSlugs: readonly string[]): string {
  if (!raw) return "";
  const slug = raw.trim().toLowerCase();
  return knownSlugs.includes(slug) ? slug : "";
}

/** Monta o texto que o visitante revisa antes de continuar no WhatsApp ou e-mail. */
export function buildContactMessage(values: ContactFormValues, projectName: string | null): string {
  const lines: string[] = ["Olá, Alex! Vim pelo seu portfólio e gostaria de conversar sobre um projeto.", ""];

  const add = (label: string, value: string | null | undefined) => {
    const text = value?.trim();
    if (text) lines.push(`${label}: ${text}`);
  };

  add("Nome", values.name);
  add("Empresa/negócio", values.company);
  add("Cidade", values.city);
  add("Tipo de negócio", optionLabel(businessTypeOptions, values.businessType));
  add("Tipo de projeto", optionLabel(projectTypeOptions, values.projectType));
  add("Objetivo principal", optionLabel(objectiveOptions, values.objective));
  add("Projeto de interesse", projectName ? `${projectName} (projeto conceitual)` : null);
  add("WhatsApp para retorno", values.phone);
  add("E-mail", values.email);

  lines.push("", "Mensagem:", values.message.trim());
  return lines.join("\n");
}
