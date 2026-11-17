/*
 * Opções da amostra "Sob medida" da página inicial. Ficam aqui para que o contato consiga ler as
 * escolhas vindas pela URL (`/contato?segmento=…&cor=…&estilo=…&recurso=…`) e montar o resumo.
 * São só preferências de projeto, sem dado pessoal.
 */
export const sampleOptions = {
  segmento: {
    barbearia: "Barbearia",
    clinica: "Clínica",
    restaurante: "Restaurante",
    loja: "Loja",
    outro: "Outro negócio",
  },
  cor: {
    azul: "Azul",
    verde: "Verde",
    terracota: "Terracota",
    rosa: "Rosa",
    escuro: "Escuro e dourado",
  },
  estilo: {
    moderno: "Moderno",
    classico: "Clássico",
    marcante: "Marcante",
  },
  recurso: {
    agendar: "Agendamento",
    pedir: "Pedidos",
    orcamento: "Orçamento",
    whatsapp: "WhatsApp",
  },
} as const;

export type SampleField = keyof typeof sampleOptions;

const labels: Record<SampleField, string> = {
  segmento: "Tipo de negócio",
  cor: "Cor",
  estilo: "Estilo",
  recurso: "O que o cliente mais faz no site",
};

/** Caminho do contato levando as escolhas da amostra. */
export function sampleContactHref(base: string, choices: Record<SampleField, string>): string {
  const params = new URLSearchParams(choices);
  return `${base}?${params.toString()}`;
}

/**
 * Texto inicial da mensagem a partir das escolhas da amostra. Só aceita valores conhecidos;
 * sem nenhuma escolha válida, devolve vazio (o formulário abre em branco).
 */
export function describeSample(read: (field: SampleField) => string | null): string {
  const lines: string[] = [];
  for (const field of Object.keys(sampleOptions) as SampleField[]) {
    const value = read(field);
    const options = sampleOptions[field] as Record<string, string>;
    if (value && Object.hasOwn(options, value)) lines.push(`- ${labels[field]}: ${options[value]}`);
  }
  if (lines.length === 0) return "";
  return `Montei esta amostra no site como ponto de partida:\n${lines.join("\n")}\n\nSobre o meu negócio: `;
}
