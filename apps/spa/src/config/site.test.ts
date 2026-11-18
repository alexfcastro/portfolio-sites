import { describe, expect, it } from "vitest";
import { parsePortfolioUrl } from "@/config/site";

describe("URL do portfólio", () => {
  it("aceita HTTPS público e normaliza a barra final", () => {
    expect(parsePortfolioUrl("https://alexcastro.dev/", "production")).toBe("https://alexcastro.dev");
  });

  it("aceita localhost apenas em desenvolvimento", () => {
    expect(parsePortfolioUrl("http://localhost:3000", "development")).toBe("http://localhost:3000");
    expect(parsePortfolioUrl("http://localhost:3000", "production")).toBeNull();
    expect(parsePortfolioUrl("https://localhost:3000", "preview")).toBeNull();
  });

  it("rejeita vazio, HTTP público, domínios de exemplo e protocolos arbitrários", () => {
    expect(parsePortfolioUrl(undefined, "production")).toBeNull();
    expect(parsePortfolioUrl("http://alexcastro.dev", "production")).toBeNull();
    expect(parsePortfolioUrl("https://example.com", "production")).toBeNull();
    expect(parsePortfolioUrl("javascript:alert(1)", "development")).toBeNull();
  });
});
