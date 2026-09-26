import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { demoUrlSlugs, getConfiguredDemoUrl } from "@/config/demos";
import { categories, solutionTypes } from "@/data/categories";
import { getFeaturedProjects, projects } from "@/data/projects";
import { resolveDemoLink, resolveDemoPresentation } from "@/lib/demo";

const publicDir = join(__dirname, "..", "..", "public");

describe("matriz de projetos", () => {
  it("tem exatamente os 12 slugs canônicos, sem repetição", () => {
    const slugs = projects.map((project) => project.slug);
    expect(slugs).toEqual([
      "barbearia",
      "clinica",
      "restaurante",
      "oficina",
      "servicos",
      "autonomo",
      "advocacia",
      "imobiliaria",
      "petshop",
      "academia",
      "produtos-naturais",
      "floricultura",
    ]);
    expect(new Set(slugs).size).toBe(12);
  });

  it("usa slugs compatíveis com URL e nomes únicos", () => {
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(new Set(projects.map((project) => project.name)).size).toBe(projects.length);
  });

  it("referencia apenas categorias e tipos de solução existentes", () => {
    const categoryIds = new Set(categories.map((category) => category.id));
    const solutionIds = new Set(solutionTypes.map((solution) => solution.id));
    for (const project of projects) {
      expect(categoryIds.has(project.categoryId), project.slug).toBe(true);
      expect(project.solutionIds.length, project.slug).toBeGreaterThan(0);
      for (const id of project.solutionIds) {
        expect(solutionIds.has(id), `${project.slug}: ${id}`).toBe(true);
      }
    }
  });

  it("tem os textos essenciais preenchidos", () => {
    for (const project of projects) {
      expect(project.name.trim().length, project.slug).toBeGreaterThan(2);
      for (const field of [project.summary, project.audience, project.problem, project.solution]) {
        expect(field.trim().length, project.slug).toBeGreaterThan(20);
      }
      expect(project.seo.title.trim(), project.slug).not.toBe("");
      expect(project.seo.description.trim(), project.slug).not.toBe("");
      expect(project.flow.length, project.slug).toBeGreaterThanOrEqual(3);
      expect(project.features.length, project.slug).toBeGreaterThanOrEqual(4);
    }
  });

  it("não repete o mesmo problema ou solução entre segmentos", () => {
    expect(new Set(projects.map((project) => project.problem)).size).toBe(projects.length);
    expect(new Set(projects.map((project) => project.solution)).size).toBe(projects.length);
  });

  it("aponta para imagens locais existentes, com dimensões e descrição", () => {
    for (const project of projects) {
      expect(project.media.length, project.slug).toBeGreaterThan(0);
      for (const media of project.media) {
        expect(media.src.startsWith("/"), media.src).toBe(true);
        expect(existsSync(join(publicDir, media.src)), media.src).toBe(true);
        expect(media.width).toBeGreaterThan(0);
        expect(media.height).toBeGreaterThan(0);
        expect(media.alt.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it("destaca entre quatro e seis projetos, com ordens únicas", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThanOrEqual(4);
    expect(featured.length).toBeLessThanOrEqual(6);
    const orders = featured.map((project) => project.featuredOrder);
    expect(new Set(orders).size).toBe(orders.length);
  });
});

/** Demos implementadas e validadas até agora (Fase 2: barbearia). */
const IMPLEMENTED_DEMOS = ["barbearia"];

describe("demos implementadas", () => {
  for (const slug of IMPLEMENTED_DEMOS) {
    const project = projects.find((item) => item.slug === slug)!;

    it(`${slug}: tem recursos implementados, stack definida e só capturas reais`, () => {
      expect(project.demoStatus).toBe("available");
      expect(project.features.some((feature) => feature.status === "implemented")).toBe(true);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.media.every((media) => media.kind === "screenshot")).toBe(true);
    });

    it(`${slug}: tem ao menos uma captura desktop e uma mobile`, () => {
      expect(project.media.some((media) => media.width > media.height)).toBe(true);
      expect(project.media.some((media) => media.height > media.width)).toBe(true);
    });
  }
});

describe("estado das demos ainda não implementadas", () => {
  it("mantém as demais demos planejadas, com recursos previstos e prévias conceituais", () => {
    for (const project of projects.filter((item) => !IMPLEMENTED_DEMOS.includes(item.slug))) {
      expect(project.demoStatus, project.slug).toBe("planned");
      expect(project.technologies, project.slug).toEqual([]);
      for (const feature of project.features) {
        expect(feature.status, `${project.slug}: ${feature.title}`).toBe("planned");
      }
      for (const media of project.media) {
        expect(media.kind, project.slug).toBe("concept");
      }
    }
  });

  it("tem uma entrada de URL de demo para cada projeto", () => {
    expect([...demoUrlSlugs].sort()).toEqual(projects.map((project) => project.slug).sort());
  });

  it("não gera link de abertura para nenhuma demo sem URL configurada", () => {
    for (const project of projects) {
      expect(resolveDemoLink(project.demoStatus, getConfiguredDemoUrl(project.slug), "production")).toBeNull();
    }
  });

  it("mostra demo validada sem URL como 'Publicação em breve', nunca como disponível", () => {
    expect(resolveDemoPresentation("available", null, "production")).toEqual({ state: "unpublished", link: null });
    expect(resolveDemoPresentation("available", "http://localhost:3101", "production")).toEqual({ state: "unpublished", link: null });
    expect(resolveDemoPresentation("available", "https://bravus.vercel.app", "production")).toEqual({
      state: "available",
      link: "https://bravus.vercel.app",
    });
    expect(resolveDemoPresentation("planned", "https://bravus.vercel.app", "production")).toEqual({ state: "planned", link: null });
  });

  it("só libera o link com estado disponível e URL válida", () => {
    const url = "https://bravus.vercel.app";
    expect(resolveDemoLink("planned", url, "production")).toBeNull();
    expect(resolveDemoLink("in_progress", url, "production")).toBeNull();
    expect(resolveDemoLink("unavailable", url, "production")).toBeNull();
    expect(resolveDemoLink("available", null, "production")).toBeNull();
    expect(resolveDemoLink("available", url, "production")).toBe(url);
  });

  it("rejeita localhost, exemplo e HTTP em produção, mas aceita localhost em desenvolvimento", () => {
    expect(resolveDemoLink("available", "http://localhost:3001", "production")).toBeNull();
    expect(resolveDemoLink("available", "https://barbearia.example.com", "production")).toBeNull();
    expect(resolveDemoLink("available", "http://bravus.vercel.app", "production")).toBeNull();
    expect(resolveDemoLink("available", "javascript:alert(1)", "development")).toBeNull();
    expect(resolveDemoLink("available", "http://localhost:3001", "development")).toBe("http://localhost:3001");
  });
});
