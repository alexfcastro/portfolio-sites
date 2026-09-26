import { describe, expect, it } from "vitest";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  normalizeEmail,
  normalizeWhatsAppNumber,
} from "@/lib/contact/channels";
import {
  buildContactMessage,
  emptyContactForm,
  firstErrorField,
  LIMITS,
  resolveProjectSlug,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contact/form";

// Número usado somente nos testes; não pertence à configuração do site.
const TEST_RECIPIENT = "55 (11) 90000-0000";
const SLUGS = ["barbearia", "clinica"];

function form(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    ...emptyContactForm,
    name: "Maria Teste",
    projectType: "agendamento",
    message: "Quero um site com agendamento.",
    ...overrides,
  };
}

describe("normalizeWhatsAppNumber", () => {
  it("aceita número com código do país e remove a formatação", () => {
    expect(normalizeWhatsAppNumber("+55 (11) 90000-0000")).toBe("5511900000000");
    expect(normalizeWhatsAppNumber("+55 11 3000-0000")).toBe("551130000000");
  });

  it("rejeita número brasileiro sem o código do país", () => {
    expect(normalizeWhatsAppNumber("(11) 90000-0000")).toBeNull();
    expect(normalizeWhatsAppNumber("(12) 90000-0000")).toBeNull();
  });

  it("rejeita ausente, curto demais, letras e número iniciado por zero", () => {
    expect(normalizeWhatsAppNumber(undefined)).toBeNull();
    expect(normalizeWhatsAppNumber("")).toBeNull();
    expect(normalizeWhatsAppNumber("(11) 90000-0000")).toBeNull();
    expect(normalizeWhatsAppNumber("55 11 9000O-0000")).toBeNull();
    expect(normalizeWhatsAppNumber("011900000000")).toBeNull();
    expect(normalizeWhatsAppNumber("1234567890123456")).toBeNull();
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa o destinatário configurado e codifica a mensagem", () => {
    const url = buildWhatsAppUrl(TEST_RECIPIENT, "Olá, Alex!\nOrçamento & prazo? 100%");
    expect(url).toBe(
      "https://wa.me/5511900000000?text=Ol%C3%A1%2C%20Alex!%0AOr%C3%A7amento%20%26%20prazo%3F%20100%25",
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get("text")).toBe("Olá, Alex!\nOrçamento & prazo? 100%");
  });

  it("não gera link sem destinatário válido", () => {
    expect(() => buildWhatsAppUrl("", "oi")).toThrow();
    expect(() => buildWhatsAppUrl("undefined", "oi")).toThrow();
  });

  it("omite o parâmetro de texto quando a mensagem está vazia", () => {
    expect(buildWhatsAppUrl(TEST_RECIPIENT, "   ")).toBe("https://wa.me/5511900000000");
  });
});

describe("e-mail", () => {
  it("normaliza e valida o destinatário", () => {
    expect(normalizeEmail(" Contato@Dominio.com.br ")).toBe("contato@dominio.com.br");
    expect(normalizeEmail("sem-arroba")).toBeNull();
    expect(normalizeEmail(null)).toBeNull();
  });

  it("monta mailto com assunto e corpo codificados", () => {
    expect(buildMailtoUrl("contato@dominio.com.br", "Orçamento", "Linha 1\nLinha 2")).toBe(
      "mailto:contato@dominio.com.br?subject=Or%C3%A7amento&body=Linha%201%0ALinha%202",
    );
    expect(() => buildMailtoUrl("null", "a", "b")).toThrow();
  });
});

describe("validateContactForm", () => {
  it("aceita o formulário mínimo válido", () => {
    expect(validateContactForm(form(), SLUGS)).toEqual({});
  });

  it("exige nome, tipo de projeto e mensagem", () => {
    const errors = validateContactForm({ ...emptyContactForm, name: "   " }, SLUGS);
    expect(Object.keys(errors).sort()).toEqual(["message", "name", "projectType"]);
    expect(firstErrorField(errors)).toBe("name");
  });

  it("aplica os limites de tamanho", () => {
    const errors = validateContactForm(
      form({
        name: "a".repeat(LIMITS.name + 1),
        company: "b".repeat(LIMITS.shortText + 1),
        city: "c".repeat(LIMITS.shortText + 1),
        message: "d".repeat(LIMITS.message + 1),
      }),
      SLUGS,
    );
    expect(Object.keys(errors).sort()).toEqual(["city", "company", "message", "name"]);
  });

  it("valida e-mail e WhatsApp do visitante apenas quando preenchidos", () => {
    expect(validateContactForm(form({ email: "", phone: "" }), SLUGS)).toEqual({});
    const errors = validateContactForm(form({ email: "maria@", phone: "abc" }), SLUGS);
    expect(Object.keys(errors).sort()).toEqual(["email", "phone"]);
    expect(validateContactForm(form({ email: "maria@teste.com.br", phone: "(11) 91234-5678" }), SLUGS)).toEqual({});
  });

  it("rejeita opções fora das listas e projeto desconhecido", () => {
    const errors = validateContactForm(
      form({ projectType: "hackeado", businessType: "x", objective: "y", projectSlug: "inexistente" }),
      SLUGS,
    );
    expect(Object.keys(errors).sort()).toEqual(["businessType", "objective", "projectSlug", "projectType"]);
  });
});

describe("resolveProjectSlug", () => {
  it("pré-seleciona somente slug reconhecido", () => {
    expect(resolveProjectSlug("barbearia", SLUGS)).toBe("barbearia");
    expect(resolveProjectSlug(" Clinica ", SLUGS)).toBe("clinica");
    expect(resolveProjectSlug("<script>", SLUGS)).toBe("");
    expect(resolveProjectSlug(null, SLUGS)).toBe("");
  });
});

describe("buildContactMessage", () => {
  it("inclui apenas os campos preenchidos, com rótulos legíveis", () => {
    const message = buildContactMessage(
      form({ company: "Studio M", objective: "agendamentos", projectSlug: "barbearia" }),
      "Bravus Barbearia",
    );
    expect(message).toContain("Nome: Maria Teste");
    expect(message).toContain("Empresa/negócio: Studio M");
    expect(message).toContain("Tipo de projeto: Site com agendamento");
    expect(message).toContain("Objetivo principal: Facilitar agendamentos");
    expect(message).toContain("Projeto de interesse: Bravus Barbearia (projeto conceitual)");
    expect(message).toContain("Mensagem:\nQuero um site com agendamento.");
    expect(message).not.toContain("E-mail:");
    expect(message).not.toContain("Cidade:");
  });
});
