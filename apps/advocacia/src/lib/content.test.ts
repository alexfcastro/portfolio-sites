import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { areas, articles, team } from "@/data/firm";
import { buildContactMessage, forbiddenExpressions, validateContact } from "@/lib/contact";

const srcDir = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    // Só textos (TS/TSX); o CSS tem medidas como "100%" que não são conteúdo.
    return /\.tsx?$/.test(name) && !name.endsWith(".test.ts") && !path.endsWith(join("lib", "contact.ts")) ? [path] : [];
  });
}

describe("conteúdo do escritório", () => {
  it("tem slugs únicos e referências consistentes", () => {
    expect(new Set(areas.map((a) => a.slug)).size).toBe(areas.length);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    const slugs = new Set(areas.map((a) => a.slug));
    expect(articles.every((a) => slugs.has(a.areaSlug))).toBe(true);
    expect(team.every((member) => member.areas.every((slug) => slugs.has(slug)))).toBe(true);
  });

  it("não exibe números de registro profissional inventados", () => {
    const all = sourceFiles(srcDir).map((file) => readFileSync(file, "utf8")).join("\n");
    expect(all).not.toMatch(/OAB\s*\/?\s*[A-Z]{2}\s*\d/);
  });

  it("não usa promessa de resultado, comparação ou depoimento em nenhum texto do site", () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, "utf8");
      for (const expression of forbiddenExpressions) {
        expect(expression.test(text), `${file}: ${expression}`).toBe(false);
      }
    }
  });
});

describe("pedido de conversa inicial", () => {
  const input = { areaSlug: "familia", subject: "Quero entender meus direitos", period: "Manhã", summary: "" };

  it("aceita o pedido mínimo e aponta campos inválidos", () => {
    expect(validateContact(input)).toEqual({});
    const errors = validateContact({ areaSlug: "x", subject: "y", period: "z", summary: "a".repeat(401) });
    expect(Object.keys(errors).sort()).toEqual(["areaSlug", "period", "subject", "summary"]);
  });

  it("monta a mensagem sem dados pessoais", () => {
    const text = buildContactMessage({ ...input, summary: "Dúvida sobre guarda compartilhada." });
    expect(text).toContain("Área: Direito de Família");
    expect(text).toContain("Dúvida sobre guarda compartilhada.");
  });
});
