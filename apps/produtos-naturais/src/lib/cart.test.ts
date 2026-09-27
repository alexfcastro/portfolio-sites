import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories, FREE_DELIVERY_FROM_CENTS, getProduct, MAX_QUANTITY, products, WEIGHT_OPTIONS } from "@/data/catalog";
import {
  addLine,
  buildOrderMessage,
  computeTotals,
  divRound,
  formatWeight,
  fromPrice,
  listPrice,
  searchProducts,
  setQuantity,
  unitPrice,
  validateLine,
  validateOrder,
  type CartLine,
  type CatalogFilters,
} from "@/lib/cart";

const p = (id: string) => getProduct(id)!;
const base: CatalogFilters = { query: "", categoryId: "todas", tags: [], onlyPromo: false, sort: "relevancia" };

describe("dados do catálogo", () => {
  it("ids únicos, categorias válidas e preços inteiros em centavos", () => {
    expect(new Set(products.map((x) => x.id)).size).toBe(products.length);
    for (const product of products) {
      expect(categories.some((c) => c.id === product.categoryId), product.id).toBe(true);
      const price = product.sale.kind === "peso" ? product.sale.pricePerKgCents : product.sale.priceCents;
      expect(Number.isInteger(price) && price > 0, product.id).toBe(true);
      if (product.sale.kind === "peso") {
        expect(product.sale.options.length).toBeGreaterThan(0);
        expect(product.sale.options.every((g) => (WEIGHT_OPTIONS as readonly number[]).includes(g))).toBe(true);
      }
      if (product.promoPercent !== undefined) expect(Number.isInteger(product.promoPercent) && product.promoPercent > 0 && product.promoPercent < 100).toBe(true);
    }
    expect(categories.every((c) => products.some((x) => x.categoryId === c.id))).toBe(true);
  });
});

describe("preço por peso", () => {
  it("arredonda para o centavo mais próximo, meio centavo para cima", () => {
    expect([divRound(5, 2), divRound(1, 3), divRound(2, 3), divRound(0, 7)]).toEqual([3, 0, 1, 0]);
    expect(() => divRound(1.5, 2)).toThrow();
    // Canela: R$ 59,90/kg → 250 g = 1.497,5 centavos → R$ 14,98
    expect(listPrice(p("canela-em-po"), 250)).toBe(1498);
    expect(listPrice(p("canela-em-po"), 100)).toBe(599);
    expect(listPrice(p("canela-em-po"), 500)).toBe(2995);
    expect(() => listPrice(p("canela-em-po"), null)).toThrow();
    expect(listPrice(p("mel-silvestre"), null)).toBe(3490);
  });

  it("promoção é aplicada sobre o preço da opção e também arredondada", () => {
    // Lentilha: 250 g = 572,5 → 573; 15% de 573 = 85,95 → 86; 573 − 86 = 487
    expect(unitPrice(p("lentilha"), 250)).toBe(487);
    expect(unitPrice(p("lentilha"), 1000)).toBe(2290 - 344);
    expect(unitPrice(p("amendoas"), 100)).toBe(1099 - 110);
    expect(fromPrice(p("quinoa"))).toEqual({ cents: 499, label: "100 g" });
    expect(fromPrice(p("kit-chas"))).toEqual({ cents: 5490, label: "kit com 3 itens" });
    expect([formatWeight(250), formatWeight(1000), formatWeight(1500), formatWeight(2250)]).toEqual(["250 g", "1 kg", "1,5 kg", "2,25 kg"]);
  });
});

describe("carrinho", () => {
  it("valida peso, unidade, quantidade e estoque", () => {
    expect(validateLine({ productId: "quinoa", grams: 250, quantity: 2 })).toBeNull();
    expect(validateLine({ productId: "canela-em-po", grams: 1000, quantity: 1 })).toMatch(/pesos disponíveis/);
    expect(validateLine({ productId: "quinoa", grams: 300, quantity: 1 })).toMatch(/pesos disponíveis/);
    expect(validateLine({ productId: "quinoa", grams: null, quantity: 1 })).toMatch(/pesos disponíveis/);
    expect(validateLine({ productId: "mel-silvestre", grams: 250, quantity: 1 })).toMatch(/por unidade/);
    expect(validateLine({ productId: "quinoa", grams: 250, quantity: 0 })).toMatch(/de 1 a/);
    expect(validateLine({ productId: "quinoa", grams: 250, quantity: 1.5 })).toMatch(/de 1 a/);
    expect(validateLine({ productId: "castanha-para", grams: 250, quantity: 1 })).toMatch(/esgotado/);
    expect(validateLine({ productId: "nada", grams: null, quantity: 1 })).toMatch(/não encontrado/);
  });

  it("soma o mesmo produto e peso, separa pesos diferentes e respeita o limite", () => {
    let cart: CartLine[] = [];
    for (const line of [
      { productId: "quinoa", grams: 250, quantity: 1 },
      { productId: "quinoa", grams: 250, quantity: 2 },
      { productId: "quinoa", grams: 500, quantity: 1 },
    ]) {
      const result = addLine(cart, line);
      if (!result.ok) throw new Error(result.error);
      cart = result.cart;
    }
    expect(cart).toEqual([
      { productId: "quinoa", grams: 250, quantity: 3 },
      { productId: "quinoa", grams: 500, quantity: 1 },
    ]);
    expect(addLine(cart, { productId: "quinoa", grams: 250, quantity: MAX_QUANTITY })).toMatchObject({ ok: false });
    expect(setQuantity(cart, 0, 0)).toHaveLength(1);
    expect(setQuantity(cart, 0, 99)[0]!.quantity).toBe(MAX_QUANTITY);
  });

  it("calcula subtotal, economia, peso e frete por bairro, com frete grátis acima do mínimo", () => {
    const cart: CartLine[] = [
      { productId: "lentilha", grams: 250, quantity: 2 }, // 2 × 487
      { productId: "mel-silvestre", grams: null, quantity: 1 }, // 3490
    ];
    const pickup = computeTotals(cart, { kind: "retirada" });
    expect(pickup).toEqual({ subtotal: 974 + 3490, savings: 172, delivery: 0, total: 4464, grams: 500 });
    expect(computeTotals(cart, { kind: "entrega", regionId: "vila-aroeira" })).toMatchObject({ delivery: 1200, total: 5664 });
    const big: CartLine[] = [{ productId: "castanha-caju", grams: 1000, quantity: 2 }];
    expect(computeTotals(big, { kind: "entrega", regionId: "vila-aroeira" }).subtotal).toBeGreaterThanOrEqual(FREE_DELIVERY_FROM_CENTS);
    expect(computeTotals(big, { kind: "entrega", regionId: "vila-aroeira" }).delivery).toBe(0);
  });

  it("valida o pedido e monta a mensagem com itens, entrega e total", () => {
    const cart: CartLine[] = [{ productId: "canela-em-po", grams: 250, quantity: 1 }];
    expect(validateOrder([], { kind: "retirada" })).toMatch(/vazio/);
    expect(validateOrder(cart, null)).toMatch(/retirada ou entrega/);
    expect(validateOrder(cart, { kind: "entrega", regionId: "" })).toMatch(/bairro/);
    expect(validateOrder(cart, { kind: "retirada" })).toBeNull();
    const message = buildOrderMessage(cart, { kind: "entrega", regionId: "centro" }, "RG-1001");
    expect(message).toContain("RG-1001");
    expect(message).toMatch(/1× Canela em pó \(250 g\) — R\$\s14,98/);
    expect(message).toMatch(/Entrega em Centro: R\$\s8,00/);
    expect(message).toMatch(/Total: R\$\s22,98/);
  });
});

describe("busca e filtros", () => {
  it("busca sem acento, filtra por categoria, selo e promoção, e ordena por preço", () => {
    expect(searchProducts({ ...base, query: "curcuma" }).map((x) => x.id)).toEqual(["curcuma"]);
    expect(searchProducts({ ...base, categoryId: "castanhas" }).at(-1)!.stock).toBe("esgotado");
    const glutenFree = searchProducts({ ...base, tags: ["sem-gluten", "sem-acucar"] });
    expect(glutenFree.length).toBeGreaterThan(0);
    expect(glutenFree.every((x) => x.tags.includes("sem-gluten") && x.tags.includes("sem-acucar"))).toBe(true);
    expect(searchProducts({ ...base, onlyPromo: true }).every((x) => (x.promoPercent ?? 0) > 0)).toBe(true);
    const cheap = searchProducts({ ...base, sort: "menor-preco" }).map((x) => fromPrice(x).cents);
    expect(cheap).toEqual([...cheap].sort((a, b) => a - b));
    expect(searchProducts({ ...base, query: "xyz" })).toEqual([]);
  });
});

describe("conteúdo", () => {
  // Sem alegações de saúde (briefing): nada de cura, tratamento, emagrecimento etc.
  const claims = [/\bcura(s|r)?\b/i, /trat(a|am|ar)\s+doen/i, /emagrec/i, /substitu\w*\s+(o|os)?\s*medicament/i, /milagr/i, /\bdetox\b/i, /imunidade/i];

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.tsx?$/.test(name) && !name.endsWith(".test.ts") ? [path] : [];
    });
  }

  it("não há alegações de saúde nos textos", () => {
    for (const file of sourceFiles(join(__dirname, ".."))) {
      const text = readFileSync(file, "utf8");
      for (const claim of claims) expect(claim.test(text), `${file}: ${claim}`).toBe(false);
    }
  });
});
