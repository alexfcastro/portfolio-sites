import { describe, expect, it } from "vitest";
import { addons, categories, getProduct, occasions, products } from "@/data/shop";
import {
  allowedAddons,
  availableDates,
  availablePeriods,
  buildCartMessage,
  cartTotals,
  itemSubtotal,
  MAX_CART_ITEMS,
  validateCart,
  filterProducts,
  minPrice,
  priceFor,
  totalsFor,
  validateAddons,
  validateCard,
  validateDraft,
  type OrderDraft,
} from "@/lib/order";

const now = { date: "2026-09-26", minutes: 9 * 60 }; // sábado, 9h
const p = (id: string) => getProduct(id)!;
const draft: OrderDraft = {
  productId: "buque-campo",
  sizeId: "m",
  addonIds: ["chocolates", "vaso-vidro"],
  card: "Feliz aniversário!\nCom carinho.",
  fulfillment: "entrega",
  regionId: "vila-das-rosas",
  date: "2026-09-28",
  period: "manha",
  personName: "Ana (exemplo)",
};

describe("dados", () => {
  it("ids únicos, referências válidas e preços inteiros crescentes por tamanho", () => {
    expect(new Set(products.map((x) => x.id)).size).toBe(products.length);
    for (const product of products) {
      expect(categories.some((c) => c.id === product.categoryId)).toBe(true);
      expect(product.occasionIds.every((o) => occasions.some((x) => x.id === o))).toBe(true);
      const prices = product.sizes.map((s) => s.priceCents);
      expect(prices.every(Number.isInteger)).toBe(true);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    }
    expect(occasions.every((o) => products.some((x) => x.occasionIds.includes(o.id)))).toBe(true);
    expect(addons.every((a) => Number.isInteger(a.priceCents))).toBe(true);
  });
});

describe("personalização", () => {
  it("bloqueia adicionais incompatíveis com ocasião ou categoria", () => {
    expect(allowedAddons(p("arranjo-branco-sereno")).map((a) => a.id)).toEqual(["chocolates"]);
    expect(allowedAddons(p("buque-rosas-vermelhas")).map((a) => a.id)).toEqual(["chocolates", "balao", "pelucia", "vaso-vidro"]);
    expect(allowedAddons(p("orquidea")).map((a) => a.id)).toEqual(["chocolates", "balao", "pelucia"]);
    expect(validateAddons(p("arranjo-branco-sereno"), ["balao"])).toMatch(/Balão metalizado não está disponível/);
    expect(validateAddons(p("cesta-cafe"), ["vaso-vidro"])).toMatch(/não está disponível/);
    expect(validateAddons(p("buque-campo"), ["chocolates", "chocolates"])).toMatch(/repetido/);
    expect(validateAddons(p("buque-campo"), ["x"])).toMatch(/não encontrado/);
  });

  it("soma tamanho e adicionais em centavos", () => {
    expect(priceFor(p("buque-campo"), "m", ["chocolates", "vaso-vidro"])).toEqual({ base: 15990, extras: 7480, subtotal: 23470 });
    expect(() => priceFor(p("buque-campo"), "x" as never, [])).toThrow();
  });

  it("limita o cartão a 200 caracteres e 6 linhas", () => {
    expect(validateCard("")).toBeNull();
    expect(validateCard("a".repeat(200))).toBeNull();
    expect(validateCard("a".repeat(201))).toMatch(/200/);
    expect(validateCard("a\nb\nc\nd\ne\nf\ng")).toMatch(/6 linhas/);
  });
});

describe("data e período", () => {
  it("sem domingo; hoje só à tarde e até as 11h", () => {
    const dates = availableDates(now);
    expect(dates[0]).toBe("2026-09-26");
    expect(dates).not.toContain("2026-09-27"); // domingo
    expect(availablePeriods("2026-09-26", now)).toEqual(["tarde"]);
    expect(availablePeriods("2026-09-26", { ...now, minutes: 11 * 60 + 1 })).toEqual([]);
    expect(availableDates({ ...now, minutes: 12 * 60 })[0]).toBe("2026-09-28");
    expect(availablePeriods("2026-09-28", now)).toEqual(["manha", "tarde"]);
    expect(availablePeriods("2026-09-25", now)).toEqual([]);
    expect(availablePeriods("2026-10-10", now)).toEqual([]);
  });
});

describe("pedido", () => {
  it("aceita um pedido completo e calcula o total com frete", () => {
    expect(validateDraft(draft, now)).toEqual({});
    expect(totalsFor(draft)).toEqual({ base: 15990, extras: 7480, delivery: 1800, total: 25270 });
    expect(totalsFor({ ...draft, fulfillment: "retirada" }).delivery).toBe(0);
  });

  it("aponta campos pendentes, com bairro só na entrega", () => {
    const empty: OrderDraft = { ...draft, sizeId: "", fulfillment: "", regionId: "", date: "", period: "", personName: " " };
    expect(Object.keys(validateDraft(empty, now)).sort()).toEqual(["date", "fulfillment", "personName", "sizeId"]);
    expect(validateDraft({ ...draft, regionId: "" }, now).regionId).toBeDefined();
    expect(validateDraft({ ...draft, fulfillment: "retirada", regionId: "" }, now)).toEqual({});
    expect(validateDraft({ ...draft, fulfillment: "retirada", personName: "" }, now).personName).toMatch(/retirar/);
    expect(validateDraft({ ...draft, date: "2026-09-26", period: "manha" }, now).period).toBeDefined();
    expect(validateDraft({ ...draft, productId: "arranjo-branco-sereno", addonIds: ["balao"] }, now).addonIds).toBeDefined();
  });
});

describe("carrinho", () => {
  const second: OrderDraft = { ...draft, productId: "buque-girassois", sizeId: "p", addonIds: [], card: "" };

  it("soma itens e cobra uma entrega por bairro, dia, período e destinatário", () => {
    // Mesmo destino e horário (nome com outra caixa e espaços): uma taxa só.
    expect(cartTotals([draft, { ...second, personName: " ana (EXEMPLO) " }])).toEqual({
      products: 15990 + 10990,
      extras: 7480,
      delivery: 1800,
      deliveries: 1,
      total: 15990 + 10990 + 7480 + 1800,
    });
    // Outro período: duas entregas.
    expect(cartTotals([draft, { ...second, period: "tarde" }])).toMatchObject({ delivery: 3600, deliveries: 2 });
    // Retirada não paga.
    expect(cartTotals([{ ...second, fulfillment: "retirada", regionId: "" }])).toMatchObject({ delivery: 0, deliveries: 0, total: 10990 });
    expect(itemSubtotal(draft)).toBe(23470);
  });

  it("valida o carrinho e cada item, apontando datas que venceram", () => {
    expect(validateCart([], now).cart).toMatch(/vazio/);
    expect(validateCart(Array.from({ length: MAX_CART_ITEMS + 1 }, () => draft), now).cart).toMatch(/No máximo/);
    const later = { date: "2026-09-29", minutes: 9 * 60 };
    const result = validateCart([draft, { ...second, date: "2026-10-01" }], later);
    expect(result.cart).toBeNull();
    expect(result.items[0]!.date).toBeDefined(); // 28/09 já passou
    expect(result.items[1]).toEqual({});
  });

  it("monta a mensagem com todos os itens, entregas e total", () => {
    const message = buildCartMessage([draft, { ...second, fulfillment: "retirada", regionId: "", personName: "Bia" }], "FA-1001");
    expect(message).toContain("Pedido de demonstração FA-1001 (2 itens)");
    expect(message).toContain("1. Buquê do campo — médio (12 hastes)");
    expect(message).toContain("   Adicionais: Caixa de chocolates, Vaso de vidro");
    expect(message).toContain('   Cartão: "Feliz aniversário!\nCom carinho."');
    expect(message).toContain("   Entrega para Ana (exemplo) em Vila das Rosas: segunda-feira, 28 de setembro, manhã (8h às 12h)");
    expect(message).toContain("2. Buquê de girassóis — pequeno (6 hastes)");
    expect(message).toContain("   Sem adicionais\n   Cartão sem mensagem\n   Retirada por Bia");
    expect(message).toMatch(/Entregas \(1\): R\$\s18,00/);
    expect(message).toMatch(/Total: R\$\s362,60/);
  });
});

describe("catálogo", () => {
  it("filtra por ocasião, categoria, faixa de preço e busca sem acento", () => {
    expect(filterProducts({ query: "", occasionId: "condolencias", categoryId: "todas", maxPriceCents: null }).map((x) => x.id)).toEqual([
      "arranjo-branco-sereno",
      "orquidea",
    ]);
    const cheap = filterProducts({ query: "", occasionId: "todas", categoryId: "todas", maxPriceCents: 11000 });
    expect(cheap.every((x) => minPrice(x) <= 11000)).toBe(true);
    expect(cheap.length).toBeGreaterThan(0);
    expect(filterProducts({ query: "girassois", occasionId: "todas", categoryId: "buques", maxPriceCents: null }).map((x) => x.id)).toEqual([
      "buque-girassois",
    ]);
  });
});
