export type DeployEnv = "development" | "preview" | "production";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);
const EXAMPLE_HOSTNAMES = new Set(["example.com", "example.org", "example.net"]);

function isLocalHostname(hostname: string): boolean {
  return (
    LOCAL_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".test")
  );
}

function isExampleHostname(hostname: string): boolean {
  return (
    EXAMPLE_HOSTNAMES.has(hostname) ||
    [...EXAMPLE_HOSTNAMES].some((domain) => hostname.endsWith(`.${domain}`)) ||
    hostname.endsWith(".example") ||
    hostname.endsWith(".invalid")
  );
}

export function parseDeployEnv(raw: string | undefined): DeployEnv {
  return raw === "preview" || raw === "production" ? raw : "development";
}

/**
 * Valida uma URL pública configurada para o ambiente.
 * - produção: somente HTTPS, sem hosts locais ou de exemplo;
 * - preview: HTTPS, sem hosts locais ou de exemplo;
 * - desenvolvimento: aceita também http em hosts locais, configurados explicitamente.
 * Retorna a URL normalizada (sem barra final) ou `null`.
 */
export function parsePublicUrl(raw: string | null | undefined, env: DeployEnv): string | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.username || url.password) return null;
  if (isExampleHostname(url.hostname)) return null;

  const local = isLocalHostname(url.hostname);
  if (env === "development") {
    if (url.protocol === "https:") return stripTrailingSlash(url);
    if (url.protocol === "http:" && local) return stripTrailingSlash(url);
    return null;
  }

  if (url.protocol !== "https:" || local) return null;
  return stripTrailingSlash(url);
}

function stripTrailingSlash(url: URL): string {
  const text = url.toString();
  return text.endsWith("/") ? text.slice(0, -1) : text;
}

/** Aceita apenas perfis externos em HTTPS. */
export function parseExternalProfileUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || isLocalHostname(url.hostname) || isExampleHostname(url.hostname)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
