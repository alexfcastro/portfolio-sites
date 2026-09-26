import { describe, expect, it } from "vitest";
import { parseDeployEnv, parseExternalProfileUrl, parsePublicUrl } from "@/lib/url";

describe("parseDeployEnv", () => {
  it("usa desenvolvimento como padrão seguro", () => {
    expect(parseDeployEnv(undefined)).toBe("development");
    expect(parseDeployEnv("qualquer")).toBe("development");
    expect(parseDeployEnv("preview")).toBe("preview");
    expect(parseDeployEnv("production")).toBe("production");
  });
});

describe("parsePublicUrl", () => {
  it("normaliza a URL de produção sem barra final", () => {
    expect(parsePublicUrl("https://alexcastro.dev/", "production")).toBe("https://alexcastro.dev");
  });

  it("rejeita valores vazios, inválidos ou com credenciais", () => {
    expect(parsePublicUrl("", "production")).toBeNull();
    expect(parsePublicUrl("   ", "production")).toBeNull();
    expect(parsePublicUrl("não é url", "production")).toBeNull();
    expect(parsePublicUrl("https://user:pass@site.com.br", "production")).toBeNull();
  });

  it("rejeita domínios de exemplo em qualquer ambiente", () => {
    expect(parsePublicUrl("https://example.com", "production")).toBeNull();
    expect(parsePublicUrl("https://www.example.org", "preview")).toBeNull();
    expect(parsePublicUrl("https://meusite.example", "development")).toBeNull();
  });

  it("exige HTTPS e host público fora do desenvolvimento", () => {
    expect(parsePublicUrl("http://alexcastro.dev", "production")).toBeNull();
    expect(parsePublicUrl("https://localhost:3000", "preview")).toBeNull();
    expect(parsePublicUrl("ftp://alexcastro.dev", "production")).toBeNull();
  });

  it("aceita http somente em host local durante o desenvolvimento", () => {
    expect(parsePublicUrl("http://localhost:3000", "development")).toBe("http://localhost:3000");
    expect(parsePublicUrl("http://127.0.0.1:3000", "development")).toBe("http://127.0.0.1:3000");
    expect(parsePublicUrl("http://alexcastro.dev", "development")).toBeNull();
  });
});

describe("parseExternalProfileUrl", () => {
  it("aceita apenas perfis em HTTPS", () => {
    expect(parseExternalProfileUrl("https://www.linkedin.com/in/perfil")).toBe("https://www.linkedin.com/in/perfil");
    expect(parseExternalProfileUrl("http://instagram.com/perfil")).toBeNull();
    expect(parseExternalProfileUrl("javascript:alert(1)")).toBeNull();
    expect(parseExternalProfileUrl(undefined)).toBeNull();
  });
});
