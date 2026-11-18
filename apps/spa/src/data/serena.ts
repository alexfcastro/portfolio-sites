import type { ValeConfig } from "@/vale-presente/vale";

/*
 * Conteúdo da Casa Serena, spa fictício. Preços, durações e políticas são exemplos de demonstração.
 */

export const serena = {
  nome: "Casa Serena",
  bairro: "Alto de Pinheiros, São Paulo",
  horario: "Terça a domingo, das 10h às 21h",
} as const;

export interface Experiencia {
  id: string;
  nome: string;
  duracao: string;
  minutos: number;
  paraQuem: string;
  descricao: string;
  valor: number;
  pessoas: 1 | 2;
  foto: string;
}

export const experiencias: Experiencia[] = [
  {
    id: "relaxante",
    nome: "Massagem relaxante",
    duracao: "60 minutos",
    minutos: 60,
    paraQuem: "Para quem precisa desligar depois de uma semana pesada.",
    descricao: "Movimentos lentos e contínuos, óleo morno de lavanda e silêncio.",
    valor: 22000,
    pessoas: 1,
    foto: "exp-relaxante",
  },
  {
    id: "pedras",
    nome: "Pedras quentes",
    duracao: "75 minutos",
    minutos: 75,
    paraQuem: "Para quem sente tensão nas costas e nos ombros.",
    descricao: "Pedras de basalto aquecidas soltam a musculatura antes da massagem.",
    valor: 29000,
    pessoas: 1,
    foto: "exp-pedras",
  },
  {
    id: "ritual",
    nome: "Ritual Serenidade",
    duracao: "2 horas",
    minutos: 120,
    paraQuem: "Para um presente especial ou um dia só seu.",
    descricao: "Escalda-pés, esfoliação corporal, massagem relaxante e chá na varanda.",
    valor: 42000,
    pessoas: 1,
    foto: "exp-ritual",
  },
  {
    id: "dayspa-dois",
    nome: "Day spa para dois",
    duracao: "4 horas",
    minutos: 240,
    paraQuem: "Para casais, mães e filhas ou amigas.",
    descricao: "Sala dupla, banho de ofurô, massagem lado a lado e almoço leve.",
    valor: 98000,
    pessoas: 2,
    foto: "exp-dayspa",
  },
];

export const dayspaInclui = [
  "Recepção com chá e roupão para cada um",
  "Banho de ofurô com sais e ervas, para dois",
  "Massagem relaxante de 60 minutos, lado a lado na sala dupla",
  "Almoço leve na varanda (cardápio do dia, com opção vegetariana)",
  "Tempo livre no jardim, sem relógio",
];

export const espaco = [
  { id: "espaco-sala", titulo: "Salas com luz baixa", texto: "Quatro salas individuais e uma sala dupla, com isolamento acústico." },
  { id: "espaco-jardim", titulo: "Jardim e varanda", texto: "Onde o chá é servido antes e depois, com sombra o dia todo." },
  { id: "espaco-ofuro", titulo: "Ofurô", texto: "Banho de imersão em madeira, usado nos rituais e no day spa." },
];

export const levar = [
  "Nada além de você: roupão, toalha, chinelo e roupa descartável estão inclusos.",
  "Chegue 15 minutos antes, para trocar de roupa e tomar o chá sem pressa.",
  "Evite refeição pesada nas duas horas anteriores.",
  "Celular fica no armário: a casa inteira é sem tela.",
];

export const comoChegar = [
  "A duas quadras da estação de trem mais próxima, numa rua residencial sem saída.",
  "Estacionamento com manobrista incluso nas experiências acima de 2 horas.",
  "Endereço exato enviado na confirmação (este é um negócio fictício).",
];

export const reagendamento = [
  { titulo: "Até 24 horas antes", texto: "Remarque sem custo, quantas vezes precisar, pelo WhatsApp." },
  { titulo: "Menos de 24 horas", texto: "Remarcação com taxa de 30% do valor, porque a terapeuta já estava reservada." },
  { titulo: "Vale-presente", texto: "Válido por 6 meses. Quem recebe marca quando quiser; o vale pode virar outra experiência, pagando a diferença." },
];

/** Configuração do módulo de vale-presente para a Casa Serena. */
export const valeConfig: ValeConfig = {
  negocio: serena.nome,
  experiencias: experiencias.map((e) => ({ id: e.id, nome: e.nome, descricao: `${e.duracao} · ${e.descricao}`, valor: e.valor })),
  valorMin: 10000,
  valorMax: 150000,
  sugestoes: [15000, 30000, 50000],
  validadeMeses: 6,
  entrega: {
    email: { rotulo: "Por e-mail", detalhe: "Chega na caixa de entrada de quem recebe, com o cartão em PDF", taxa: 0 },
    impresso: { rotulo: "Cartão impresso", detalhe: "Em papel algodão, num envelope de linho, para retirar no spa ou receber em casa", taxa: 2500 },
  },
  maxMensagem: 200,
};
