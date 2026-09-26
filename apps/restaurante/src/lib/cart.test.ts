import { describe, expect, it } from "vitest";
import { addonGroups, getItem, menu, MIN_DELIVERY_CENTS } from "@/data/menu";
import {
  addToCart,
  isOpen,
  lineKey,
  lineTotalCents,
  MAX_QUANTITY,
  setQuantity,
  summarize,
  unitPriceCents,
  validateAddons,
  type CartLine,
} from "@/lib/cart";
import { formatBRL } from "@/lib/money";

const picanha = getItem("picanha")!;

describe("cardápio", () => {
  it("usa preços inteiros em centavos e grupos de adicionais existentes", () => {
    const groups = new Set(addonGroups.map((g) => g.id));
    for (const item of menu) {
      expect(Number.isInteger(item.priceCents)).toBe(true);
      expect(item.addonGroupIds.every((id) => groups.has(id))).toBe(true);
    }
    for (const group of addonGroups) {
      expect(group.min).toBeLessThanOrEqual(group.max);
      expect(group.options.every((o) => Number.isInteger(o.priceCents))).toBe(true);
    }
  });
});

describe("adicionais", () => {
  it("exige os grupos obrigatórios e aceita os opcionais", () => {
    expect(validateAddons(picanha, {})).toMatch(/ponto/i);
    expect(validateAddons(picanha, { ponto: ["ponto"] })).toBeNull();
    expect(validateAddons(picanha, { ponto: ["ponto"], extras: ["farofa", "vinagrete"] })).toBeNull();
  });

  it("recusa adicional de outro item, opção inexistente, repetida ou acima do máximo", () => {
    expect(validateAddons(picanha, { ponto: ["ponto"], calda: ["sorvete"] })).toMatch(/não se aplica/);
    expect(validateAddons(picanha, { ponto: ["cru"] })).toMatch(/inválida/);
    expect(validateAddons(picanha, { ponto: ["ponto"], extras: ["farofa", "farofa"] })).toMatch(/repetida/);
    expect(validateAddons(picanha, { ponto: ["mal", "bem"] })).toMatch(/no máximo 1/);
    expect(validateAddons(picanha, { ponto: ["ponto"], extras: ["farofa", "vinagrete", "arroz", "mandioca"] })).toMatch(/no máximo 3/);
  });

  it("soma o preço dos adicionais ao item, em centavos", () => {
    expect(unitPriceCents(picanha, { ponto: ["ponto"], extras: ["farofa", "vinagrete"] })).toBe(8990 + 600 + 400);
    expect(unitPriceCents(getItem("suco")!, { "sabor-suco": ["maracuja"], "tamanho-suco": ["500"] })).toBe(1500);
  });
});

describe("carrinho", () => {
  const addons = { ponto: ["ponto"], extras: ["farofa"] };

  it("junta a mesma configuração em uma linha e separa configurações diferentes", () => {
    let result = addToCart([], "picanha", addons, 1);
    if (!result.ok) throw new Error(result.error);
    result = addToCart(result.lines, "picanha", { extras: ["farofa"], ponto: ["ponto"] }, 2);
    if (!result.ok) throw new Error(result.error);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]!.quantity).toBe(3);
    const other = addToCart(result.lines, "picanha", { ponto: ["mal"] }, 1);
    expect(other.ok && other.lines.length).toBe(2);
    expect(lineKey("picanha", { a: ["2", "1"] }, " Sem sal ")).toBe(lineKey("picanha", { a: ["1", "2"] }, "sem sal"));
  });

  it("valida quantidade, observação e item", () => {
    expect(addToCart([], "picanha", addons, 0).ok).toBe(false);
    expect(addToCart([], "picanha", addons, 1.5).ok).toBe(false);
    expect(addToCart([], "picanha", addons, MAX_QUANTITY + 1).ok).toBe(false);
    expect(addToCart([], "picanha", addons, 1, "x".repeat(141)).ok).toBe(false);
    expect(addToCart([], "nao-existe", {}, 1).ok).toBe(false);
    const full = addToCart([], "refri", {}, MAX_QUANTITY);
    if (!full.ok) throw new Error(full.error);
    expect(addToCart(full.lines, "refri", {}, 1).ok).toBe(false);
  });

  it("altera e remove quantidades", () => {
    const lines: CartLine[] = [{ key: "k", itemId: "refri", addons: {}, quantity: 2, note: "" }];
    expect(setQuantity(lines, "k", 5)[0]!.quantity).toBe(5);
    expect(setQuantity(lines, "k", 99)[0]!.quantity).toBe(MAX_QUANTITY);
    expect(setQuantity(lines, "k", 0)).toEqual([]);
    expect(lineTotalCents({ ...lines[0]!, quantity: 3 })).toBe(2100);
  });
});

describe("resumo e entrega", () => {
  const lines: CartLine[] = [
    { key: "a", itemId: "picanha", addons: { ponto: ["ponto"], extras: ["farofa", "vinagrete"] }, quantity: 1, note: "" },
    { key: "b", itemId: "refri", addons: {}, quantity: 2, note: "" },
  ];

  it("retirada não tem taxa; entrega soma a taxa do bairro", () => {
    expect(summarize(lines, { type: "retirada" })).toEqual({ subtotalCents: 11390, deliveryFeeCents: 0, totalCents: 11390, error: null });
    expect(summarize(lines, { type: "entrega", areaId: "jardim" })).toMatchObject({ deliveryFeeCents: 790, totalCents: 12180, error: null });
    expect(formatBRL(12180)).toMatch(/^R\$\s121,80$/);
  });

  it("exige bairro, pedido mínimo para entrega e carrinho não vazio", () => {
    expect(summarize(lines, { type: "entrega", areaId: "" }).error).toMatch(/bairro/);
    const small: CartLine[] = [{ key: "c", itemId: "refri", addons: {}, quantity: 1, note: "" }];
    expect(700).toBeLessThan(MIN_DELIVERY_CENTS);
    expect(summarize(small, { type: "entrega", areaId: "centro" }).error).toMatch(/mínimo/);
    expect(summarize(small, { type: "retirada" }).error).toBeNull();
    expect(summarize([], { type: "retirada" }).error).toMatch(/vazio/);
  });
});

describe("horário de funcionamento", () => {
  it("considera os turnos de cada dia e o fechamento às segundas", () => {
    expect(isOpen({ date: "2026-09-29", minutes: 12 * 60 })).toBe(true); // terça, almoço
    expect(isOpen({ date: "2026-09-29", minutes: 16 * 60 })).toBe(false); // terça, entre turnos
    expect(isOpen({ date: "2026-09-29", minutes: 23 * 60 })).toBe(false); // fechou às 23h
    expect(isOpen({ date: "2026-10-03", minutes: 23 * 60 + 15 })).toBe(true); // sábado até 23h30
    expect(isOpen({ date: "2026-09-28", minutes: 12 * 60 })).toBe(false); // segunda
  });
});
