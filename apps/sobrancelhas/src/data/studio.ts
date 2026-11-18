import type { ProcedimentoId } from "@/lib/avaliacao";

/*
 * Conteúdo do Studio Linha Fina, negócio fictício. Preços, prazos e depoimentos são exemplos de demonstração.
 * As faixas de preço e de duração seguem o que é comum no segmento, sem representar um estúdio real.
 */

export const studio = {
  nome: "Studio Linha Fina",
  profissional: "Marina Duarte",
  bairro: "Vila Mariana, São Paulo",
  atendimento: "Somente com horário marcado · terça a sábado",
} as const;

export interface Procedimento {
  id: ProcedimentoId;
  nome: string;
  resumo: string;
  duracao: string;
  dura: string;
  preco: string;
  inclui: string;
  foto: string;
}

export const procedimentos: Procedimento[] = [
  {
    id: "design",
    nome: "Design de sobrancelhas",
    resumo: "Mapeamento do formato pelo seu rosto, limpeza com pinça e, se fizer sentido, henna para preencher falhas leves.",
    duracao: "40 min",
    dura: "Manutenção a cada 15 a 20 dias",
    preco: "R$ 60 a R$ 90",
    inclui: "Henna opcional, cobrada à parte",
    foto: "proc-design",
  },
  {
    id: "fio-a-fio",
    nome: "Micropigmentação fio a fio",
    resumo: "Fios desenhados um a um, na direção dos seus, para preencher falhas sem aquele efeito de sobrancelha pintada.",
    duracao: "2h30, com o desenho aprovado antes",
    dura: "De 12 a 18 meses, conforme a pele",
    preco: "R$ 650 a R$ 850",
    inclui: "Retoque de 30 a 40 dias incluído",
    foto: "proc-fio-a-fio",
  },
  {
    id: "nano",
    nome: "Nanopigmentação",
    resumo: "Agulha mais fina e fios ainda mais delicados. Indicada para quem quer o resultado mais natural possível de perto.",
    duracao: "3h, com o desenho aprovado antes",
    dura: "De 18 a 24 meses, conforme a pele",
    preco: "R$ 800 a R$ 1.100",
    inclui: "Retoque de 30 a 40 dias incluído",
    foto: "proc-nano",
  },
  {
    id: "correcao",
    nome: "Correção de trabalho antigo",
    resumo: "Para sobrancelha que ficou acinzentada, avermelhada ou com formato errado. Pode envolver neutralização de cor antes do novo desenho.",
    duracao: "Definida na avaliação (geralmente 2 sessões)",
    dura: "Depende do pigmento que ficou na pele",
    preco: "R$ 700 a R$ 1.300",
    inclui: "Avaliação presencial obrigatória antes",
    foto: "proc-correcao",
  },
];

export const nomesProcedimentos = Object.fromEntries(procedimentos.map((p) => [p.id, p.nome])) as Record<ProcedimentoId, string>;

/** Pares de antes e depois por tipo de sobrancelha (fotos ilustrativas geradas por IA). */
export interface CasoGaleria {
  id: string;
  tipo: string;
  descricao: string;
  procedimento: string;
  antes: string;
  depois: string;
}

export const galeria: CasoGaleria[] = [
  {
    id: "falhas",
    tipo: "Com falhas",
    descricao: "Fios bonitos, mas com buracos no meio e no rabo da sobrancelha.",
    procedimento: "Fio a fio só nas falhas, mantendo o desenho natural.",
    antes: "falhas-antes",
    depois: "falhas-depois",
  },
  {
    id: "ralas",
    tipo: "Ralas",
    descricao: "Poucos fios em toda a sobrancelha, quase sem formato visível.",
    procedimento: "Nanopigmentação com desenho completo, aprovado antes.",
    antes: "ralas-antes",
    depois: "ralas-depois",
  },
  {
    id: "assimetricas",
    tipo: "Assimétricas",
    descricao: "Uma sobrancelha mais alta ou mais curta que a outra.",
    procedimento: "Mapeamento pelas medidas do rosto e fio a fio para igualar.",
    antes: "assimetricas-antes",
    depois: "assimetricas-depois",
  },
  {
    id: "correcao",
    tipo: "Trabalho antigo",
    descricao: "Micropigmentação de anos atrás que ficou acinzentada e larga demais.",
    procedimento: "Neutralização da cor e, depois, novo fio a fio.",
    antes: "correcao-antes",
    depois: "correcao-depois",
  },
];

export const etapasAvaliacao = [
  {
    titulo: "Conversa",
    texto: "Você conta o que incomoda, mostra fotos de referência e, se tiver, o histórico de procedimentos anteriores.",
  },
  {
    titulo: "Análise da pele e dos fios",
    texto: "Tipo de pele (oleosa pega o pigmento de um jeito diferente), quantidade de fios e, se houver, a cor do pigmento antigo.",
  },
  {
    titulo: "Desenho de prova",
    texto: "O formato é desenhado com lápis no seu rosto, pelas suas medidas. Nada é feito sem você aprovar no espelho.",
  },
  {
    titulo: "Plano e valor fechado",
    texto: "Você sai sabendo qual procedimento é indicado, quantas sessões, o valor exato e a data possível.",
  },
];

export const cuidados = {
  antes: [
    "Evite álcool, café em excesso e anti-inflamatórios nas 24 horas anteriores: eles aumentam o sangramento e prejudicam a fixação.",
    "Não faça design, henna ou depilação na região nos 15 dias anteriores; a profissional precisa ver seus fios como estão.",
    "Quem usa ácidos no rosto ou isotretinoína precisa avisar: às vezes é preciso esperar alguns meses.",
    "Grávidas e lactantes não fazem o procedimento. A avaliação pode ser feita e marcada para depois.",
  ],
  depois: [
    "Nos primeiros 7 dias, não molhe a sobrancelha no banho quente nem use maquiagem na região.",
    "Não coce nem tire as casquinhas: elas saem sozinhas e levam o pigmento junto se forem arrancadas.",
    "Evite sol, piscina e mar por 15 dias. Depois disso, protetor solar sempre, para a cor durar mais.",
    "A cor fica mais forte nos primeiros dias e clareia até o retoque. Isso é esperado e faz parte do processo.",
  ],
};

/** Depoimentos de EXEMPLO, escritos para esta demonstração. Não são de clientes reais. */
export const depoimentos = [
  {
    nome: "Juliana, 34",
    procedimento: "Fio a fio",
    texto: "Eu adiei dois anos por medo de ficar artificial. Ela desenhou, me mostrou no espelho e mudou o formato duas vezes até eu ficar segura.",
  },
  {
    nome: "Cláudia, 52",
    procedimento: "Correção",
    texto: "Minha sobrancelha antiga estava cinza. Ela explicou que precisava de duas sessões e por quê. Saí sabendo o valor certo.",
  },
  {
    nome: "Renata, 27",
    procedimento: "Nanopigmentação",
    texto: "De perto parece fio de verdade. O que mais gostei foi a lista de cuidados que ela mandou por escrito no mesmo dia.",
  },
];
