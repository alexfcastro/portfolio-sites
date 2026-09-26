import { describe, expect, it } from "vitest";
import { problemCategories, services } from "@/data/garage";
import {
  estimateRange,
  likelyServices,
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  nextStage,
  screenPhotos,
  STAGES,
  validateProblem,
  validateVehicle,
} from "@/lib/quote";

describe("dados da oficina", () => {
  it("todo sintoma aponta para serviços existentes e as faixas são coerentes", () => {
    const ids = new Set(services.map((s) => s.id));
    for (const category of problemCategories) {
      for (const symptom of category.symptoms) {
        expect(symptom.serviceIds.every((id) => ids.has(id)), symptom.id).toBe(true);
      }
    }
    for (const service of services) {
      expect(Number.isInteger(service.minCents) && Number.isInteger(service.maxCents)).toBe(true);
      expect(service.minCents).toBeLessThanOrEqual(service.maxCents);
    }
  });
});

describe("veículo", () => {
  const ok = { type: "hatch", model: "Hatch 1.0", year: 2019, km: 58000 };

  it("aceita dados plausíveis", () => {
    expect(validateVehicle(ok, 2026)).toEqual({});
  });

  it("recusa tipo, modelo, ano e quilometragem inválidos", () => {
    const errors = validateVehicle({ type: "trator", model: " ", year: 2030, km: -1 }, 2026);
    expect(Object.keys(errors).sort()).toEqual(["km", "model", "type", "year"]);
    expect(validateVehicle({ ...ok, year: 2027 }, 2026)).toEqual({});
    expect(validateVehicle({ ...ok, year: 1979 }, 2026).year).toBeDefined();
    expect(validateVehicle({ ...ok, km: 12.5 }, 2026).km).toBeDefined();
    expect(validateVehicle({ ...ok, model: "x".repeat(61) }, 2026).model).toBeDefined();
  });
});

describe("problema e estimativa", () => {
  it("exige categoria e sintomas da própria categoria", () => {
    expect(validateProblem("", [], "")).toMatch(/tipo/);
    expect(validateProblem("freios", [], "")).toMatch(/sintoma/);
    expect(validateProblem("freios", ["nao-gela"], "")).toMatch(/inválido/);
    expect(validateProblem("freios", ["ruido-freio"], "x".repeat(501))).toMatch(/500/);
    expect(validateProblem("freios", ["ruido-freio"], "Chia pela manhã")).toBeNull();
  });

  it("junta os serviços prováveis sem repetir e soma a faixa em centavos", () => {
    const list = likelyServices("motor", ["luz-injecao", "falhando"]);
    expect(list.map((s) => s.id)).toEqual(["diagnostico", "velas"]);
    expect(estimateRange(list)).toEqual({ minCents: 9000 + 16000, maxCents: 15000 + 38000 });
    expect(likelyServices("x", ["luz-injecao"])).toEqual([]);
  });
});

describe("fotos (prévia local)", () => {
  const photo = (name: string, type = "image/jpeg", size = 1000) => ({ name, type, size });

  it("aceita só JPG, PNG e WebP de até 5 MB", () => {
    const { accepted, rejected } = screenPhotos(0, [
      photo("a.jpg"),
      photo("b.gif", "image/gif"),
      photo("c.png", "image/png", MAX_PHOTO_BYTES + 1),
      photo("d.webp", "image/webp", MAX_PHOTO_BYTES),
    ]);
    expect(accepted.map((p) => p.name)).toEqual(["a.jpg", "d.webp"]);
    expect(rejected).toHaveLength(2);
  });

  it("respeita o limite total de fotos", () => {
    const { accepted, rejected } = screenPhotos(MAX_PHOTOS - 1, [photo("1.jpg"), photo("2.jpg")]);
    expect(accepted).toHaveLength(1);
    expect(rejected[0]).toMatch(/limite/);
  });
});

describe("acompanhamento", () => {
  it("avança etapa por etapa até 'pronto'", () => {
    expect(nextStage("recebido")).toBe("em-analise");
    expect(nextStage(STAGES[STAGES.length - 1]!)).toBeNull();
  });
});
