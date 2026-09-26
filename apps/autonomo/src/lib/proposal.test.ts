import { describe, expect, it } from "vitest";
import { offers, professional, workCategories, works } from "@/data/profile";
import { budgets, buildProposalMessage, deadlines, suggestPackage, validateProposal } from "@/lib/proposal";

describe("dados", () => {
  it("todo trabalho pertence a uma categoria existente e ofertas têm preço em centavos", () => {
    const categories = new Set(workCategories.map((c) => c.id));
    expect(works.every((w) => categories.has(w.category))).toBe(true);
    expect(offers.every((o) => Number.isInteger(o.fromCents) && o.fromCents > 0)).toBe(true);
  });

  it("não exibe redes sociais inventadas", () => {
    expect(professional.social).toEqual([]);
  });
});

describe("pedido de proposta", () => {
  const input = { offerId: "ecommerce", quantity: 12, deadline: deadlines[1], budget: budgets[1], description: "Catálogo de cafés especiais." };

  it("aceita um pedido completo", () => {
    expect(validateProposal(input)).toEqual({});
  });

  it("aponta cada campo inválido", () => {
    const errors = validateProposal({ offerId: "x", quantity: 0, deadline: "amanhã", budget: "", description: "curto" });
    expect(Object.keys(errors).sort()).toEqual(["budget", "deadline", "description", "offerId", "quantity"]);
    expect(validateProposal({ ...input, quantity: 2.5 }).quantity).toBeDefined();
    expect(validateProposal({ ...input, description: "x".repeat(601) }).description).toBeDefined();
  });

  it("sugere pacote por volume com desconto progressivo em centavos", () => {
    expect(suggestPackage("ecommerce", 5)).toEqual({ name: "Essencial", discount: 0, minCents: 17500, maxCents: 22750 });
    expect(suggestPackage("ecommerce", 12)).toMatchObject({ name: "Completo", discount: 10, minCents: 3150 * 12 });
    expect(suggestPackage("ecommerce", 60)).toMatchObject({ name: "Sob medida", discount: 20 });
    expect(suggestPackage("x", 5)).toBeNull();
  });

  it("monta a mensagem com o pacote sugerido", () => {
    const text = buildProposalMessage(input);
    expect(text).toContain("Trabalho: Fotos para loja on-line");
    expect(text).toContain("Pacote sugerido no site: Completo");
    expect(text).toContain("Catálogo de cafés especiais.");
  });
});
