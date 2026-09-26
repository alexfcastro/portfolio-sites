import type { CategoryId, SolutionId } from "@/types/project";

export const categories: ReadonlyArray<{ id: CategoryId; label: string }> = [
  { id: "servicos", label: "Serviços" },
  { id: "saude-bem-estar", label: "Saúde e bem-estar" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "automotivo", label: "Automotivo" },
  { id: "profissionais", label: "Profissionais" },
  { id: "imoveis", label: "Imóveis" },
  { id: "comercio", label: "Comércio e vendas" },
];

export const solutionTypes: ReadonlyArray<{ id: SolutionId; label: string }> = [
  { id: "agendamento", label: "Agendamento" },
  { id: "orcamento", label: "Orçamento" },
  { id: "catalogo", label: "Catálogo" },
  { id: "pedidos", label: "Pedidos" },
  { id: "institucional", label: "Institucional" },
  { id: "painel", label: "Painel de gestão" },
];

export function getCategoryLabel(id: CategoryId): string {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function getSolutionLabel(id: SolutionId): string {
  return solutionTypes.find((solution) => solution.id === id)?.label ?? id;
}
