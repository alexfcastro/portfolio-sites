import type { DemoStatus } from "@/types/project";
import { parsePublicUrl, type DeployEnv } from "@/lib/url";

export const demoStatusLabels: Record<DemoStatus, string> = {
  planned: "Em breve",
  in_progress: "Em desenvolvimento",
  available: "Demonstração disponível",
  unavailable: "Temporariamente indisponível",
};

/**
 * Retorna a URL da demo somente quando o CTA "Abrir demonstração" pode aparecer:
 * estado `available` e URL válida para o ambiente.
 */
export function resolveDemoLink(
  status: DemoStatus,
  rawUrl: string | null | undefined,
  env: DeployEnv,
): string | null {
  if (status !== "available") return null;
  return parsePublicUrl(rawUrl, env);
}
