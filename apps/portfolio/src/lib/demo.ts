import type { DemoStatus } from "@/types/project";
import { parsePublicUrl, type DeployEnv } from "@/lib/url";

/**
 * Estado exibido ao visitante. Além dos estados dos dados, "unpublished" cobre a
 * demo já implementada e validada (`available`) que ainda não tem URL válida neste
 * ambiente: não pode ser chamada de "disponível" nem ganhar botão.
 */
export type PublicDemoState = DemoStatus | "unpublished";

export const demoStatusLabels: Record<PublicDemoState, string> = {
  planned: "Em breve",
  in_progress: "Em desenvolvimento",
  available: "Demonstração disponível",
  unpublished: "Publicação em breve",
  unavailable: "Temporariamente indisponível",
};

export const demoStatusDescriptions: Record<PublicDemoState, string> = {
  planned:
    "A demonstração navegável deste projeto ainda não foi iniciada. Por enquanto, este case apresenta a proposta e uma prévia conceitual.",
  in_progress:
    "A demonstração navegável está em desenvolvimento. O link será publicado depois que o fluxo for testado.",
  available:
    "A demonstração navegável está publicada. Ela usa dados fictícios e não cria reservas, pedidos ou mensagens reais.",
  unpublished:
    "A demonstração já foi implementada e testada — as imagens acima são capturas reais dela —, mas ainda não tem endereço público. O link aparecerá aqui quando for publicada.",
  unavailable: "A demonstração está temporariamente fora do ar. A proposta continua descrita nesta página.",
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

export function resolveDemoPresentation(
  status: DemoStatus,
  rawUrl: string | null | undefined,
  env: DeployEnv,
): { state: PublicDemoState; link: string | null } {
  const link = resolveDemoLink(status, rawUrl, env);
  if (status === "available" && !link) return { state: "unpublished", link: null };
  return { state: status, link };
}
