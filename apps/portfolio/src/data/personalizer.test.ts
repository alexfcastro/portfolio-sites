import { describe, expect, it } from "vitest";
import { suggestFromSample, type SampleField } from "@/data/personalizer";

const from = (values: Partial<Record<SampleField, string>>) => (field: SampleField) => values[field] ?? null;

describe("suggestFromSample", () => {
  it("sugere tipo de negócio e de projeto quando a relação é clara", () => {
    expect(suggestFromSample(from({ segmento: "clinica", recurso: "agendar" }))).toEqual({
      businessType: "saude",
      projectType: "agendamento",
    });
    expect(suggestFromSample(from({ segmento: "restaurante", recurso: "pedir" }))).toEqual({
      businessType: "alimentacao",
      projectType: "cardapio",
    });
  });

  it("deixa em branco o que não dá para deduzir", () => {
    expect(suggestFromSample(from({ segmento: "outro", recurso: "whatsapp" }))).toEqual({ businessType: "", projectType: "" });
    expect(suggestFromSample(from({ segmento: "barbearia", recurso: "pedir" })).projectType).toBe("");
    expect(suggestFromSample(from({ segmento: "x<script>", recurso: "y" }))).toEqual({ businessType: "", projectType: "" });
  });
});
