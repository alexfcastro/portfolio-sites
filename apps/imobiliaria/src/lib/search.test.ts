import { describe, expect, it } from "vitest";
import { getListing, listings, neighborhoods } from "@/data/listings";
import {
  buildInterestMessage,
  emptyFilters,
  formatPrice,
  priceRangeError,
  search,
  toggleFavorite,
  validateOwner,
} from "@/lib/search";

describe("dados", () => {
  it("tem códigos únicos, bairros conhecidos e preços inteiros", () => {
    expect(new Set(listings.map((l) => l.code)).size).toBe(listings.length);
    expect(listings.every((l) => (neighborhoods as readonly string[]).includes(l.neighborhood))).toBe(true);
    expect(listings.every((l) => Number.isInteger(l.priceCents) && l.priceCents > 0)).toBe(true);
    expect(getListing("hz-0142")?.title).toBe("Casa com quintal");
  });
});

describe("busca e filtros", () => {
  it("sem filtros retorna tudo, com destaques primeiro", () => {
    const result = search(emptyFilters, "relevancia");
    expect(result).toHaveLength(listings.length);
    expect(result[0]!.featured).toBe(true);
  });

  it("combina finalidade, tipo, bairro e quartos", () => {
    const result = search({ ...emptyFilters, purpose: "venda", type: "casa", minBedrooms: 3 }, "relevancia");
    expect(result.every((l) => l.purpose === "venda" && l.type === "casa" && l.bedrooms >= 3)).toBe(true);
    expect(result.map((l) => l.code).sort()).toEqual(["HZ-0142", "HZ-0163", "HZ-0232"]);
    expect(search({ ...emptyFilters, neighborhood: "Centro", purpose: "venda" }, "relevancia")).toEqual([]);
  });

  it("filtra por faixa de preço em reais e ordena", () => {
    const result = search({ ...emptyFilters, purpose: "aluguel", maxPrice: 2300 }, "menor-preco");
    expect(result.map((l) => l.code)).toEqual(["HZ-0219", "HZ-0171", "HZ-0157"]);
    const expensive = search({ ...emptyFilters, purpose: "venda", minPrice: 800000 }, "maior-preco");
    expect(expensive.map((l) => l.code)).toEqual(["HZ-0232", "HZ-0163"]);
    expect(priceRangeError({ ...emptyFilters, minPrice: 5000, maxPrice: 1000 })).toMatch(/mínimo/);
  });

  it("busca por texto ignora acentos e aceita código", () => {
    expect(search({ ...emptyFilters, query: "piscina" }, "relevancia").map((l) => l.code)).toEqual(["HZ-0203"]);
    expect(search({ ...emptyFilters, query: "suite vista" }, "relevancia").map((l) => l.code)).toEqual(["HZ-0184"]);
    expect(search({ ...emptyFilters, query: "hz-0226" }, "relevancia")).toHaveLength(1);
  });
});

describe("preço, favoritos e mensagens", () => {
  it("mostra aluguel por mês", () => {
    expect(formatPrice(getListing("HZ-0157")!)).toMatch(/2\.300,00\/mês$/);
    expect(formatPrice(getListing("HZ-0142")!)).toMatch(/640\.000,00$/);
  });

  it("alterna favoritos", () => {
    expect(toggleFavorite([], "HZ-0142")).toEqual(["HZ-0142"]);
    expect(toggleFavorite(["HZ-0142"], "HZ-0142")).toEqual([]);
  });

  it("mensagem de interesse leva o código do imóvel", () => {
    const text = buildInterestMessage(getListing("HZ-0184")!, "Quero visitar", "Manhã");
    expect(text).toContain("imóvel HZ-0184");
    expect(text).toContain("Melhor período: Manhã");
  });

  it("valida o formulário de anúncio sem dados pessoais", () => {
    expect(validateOwner({ purpose: "venda", type: "casa", neighborhood: "Centro", bedrooms: 2, expectation: "" })).toEqual({});
    const errors = validateOwner({ purpose: "x", type: "y", neighborhood: "z", bedrooms: 11, expectation: "a".repeat(301) });
    expect(Object.keys(errors).sort()).toEqual(["bedrooms", "expectation", "neighborhood", "purpose", "type"]);
  });
});
