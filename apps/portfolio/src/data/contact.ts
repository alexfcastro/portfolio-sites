export interface Option {
  value: string;
  label: string;
}

export const businessTypeOptions: Option[] = [
  { value: "servicos", label: "Prestação de serviços" },
  { value: "beleza", label: "Beleza e estética" },
  { value: "saude", label: "Saúde e bem-estar" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "automotivo", label: "Automotivo" },
  { value: "comercio", label: "Comércio / loja" },
  { value: "profissional", label: "Profissional autônomo" },
  { value: "imoveis", label: "Imóveis" },
  { value: "outro", label: "Outro" },
];

export const projectTypeOptions: Option[] = [
  { value: "institucional", label: "Site institucional" },
  { value: "agendamento", label: "Site com agendamento" },
  { value: "orcamento", label: "Site com pedido de orçamento" },
  { value: "catalogo", label: "Catálogo de produtos ou serviços" },
  { value: "cardapio", label: "Cardápio digital" },
  { value: "loja", label: "Loja / pedidos" },
  { value: "outro", label: "Outro" },
  { value: "nao-sei", label: "Ainda não sei" },
];

export const objectiveOptions: Option[] = [
  { value: "contatos", label: "Receber mais contatos" },
  { value: "apresentacao", label: "Melhorar a apresentação do negócio" },
  { value: "agendamentos", label: "Facilitar agendamentos" },
  { value: "pedidos", label: "Receber pedidos" },
  { value: "orcamentos", label: "Receber pedidos de orçamento" },
  { value: "automatizar", label: "Automatizar parte do atendimento" },
  { value: "outro", label: "Outro" },
];

export function optionLabel(options: Option[], value: string): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}
