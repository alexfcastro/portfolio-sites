/*
 * Conteúdo do Lash Lab, negócio fictício. Preços, durabilidade, turma e trabalhos de ex-alunas são exemplos.
 */

export const lab = {
  nome: "Lash Lab",
  profissional: "Camila Reis",
  bairro: "Santana, São Paulo",
  horario: "Atendimentos de terça a sábado · turmas aos fins de semana",
} as const;

export type TecnicaId = "fio-a-fio" | "brasileiro" | "russo" | "lifting";

export interface Tecnica {
  id: TecnicaId;
  nome: string;
  efeito: string;
  dura: string;
  manutencao: string;
  aplicacao: string;
  preco: string;
  foto: string;
}

export const tecnicas: Tecnica[] = [
  {
    id: "fio-a-fio",
    nome: "Fio a fio clássico",
    efeito: "Um fio sintético em cada fio natural. Parece rímel bem aplicado, sem exagero.",
    dura: "3 a 4 semanas",
    manutencao: "A cada 15 a 21 dias",
    aplicacao: "1h30",
    preco: "R$ 150",
    foto: "olhar-fio-a-fio",
  },
  {
    id: "brasileiro",
    nome: "Volume brasileiro",
    efeito: "Fios em formato de Y que dão mais preenchimento, ainda leve. O mais pedido para o dia a dia.",
    dura: "3 a 4 semanas",
    manutencao: "A cada 15 a 21 dias",
    aplicacao: "2h",
    preco: "R$ 180",
    foto: "olhar-brasileiro",
  },
  {
    id: "russo",
    nome: "Volume russo",
    efeito: "Leques de 3 a 6 fios bem finos em cada fio natural. Olhar marcado, para quem gosta de impacto.",
    dura: "3 a 5 semanas",
    manutencao: "A cada 21 dias",
    aplicacao: "2h30",
    preco: "R$ 220",
    foto: "olhar-russo",
  },
  {
    id: "lifting",
    nome: "Lash lifting",
    efeito: "Curva e tinge os seus próprios cílios, sem nenhum fio a mais. Para quem quer só acordar arrumada.",
    dura: "6 a 8 semanas",
    manutencao: "Sem manutenção; refaz quando baixar",
    aplicacao: "1h",
    preco: "R$ 130",
    foto: "olhar-lifting",
  },
];

export const nomesTecnicas = Object.fromEntries(tecnicas.map((t) => [t.id, t.nome])) as Record<TecnicaId, string>;

/** O curso: dois dias, turma de no máximo três alunas. */
export const curso = {
  nome: "Formação em extensão de cílios",
  carga: "16 horas, em dois dias (sábado e domingo, das 9h às 18h)",
  dias: [
    {
      titulo: "Dia 1 — Base e fio a fio",
      itens: [
        "Anatomia do olho e do fio natural: o que pode e o que não pode",
        "Higiene, biossegurança e ficha de anamnese da cliente",
        "Isolamento e colagem fio a fio em cabeça de treino",
        "Mapeamento do olhar: como escolher curva, espessura e tamanho",
      ],
    },
    {
      titulo: "Dia 2 — Volume e cliente real",
      itens: [
        "Volume brasileiro: montagem e aplicação",
        "Atendimento completo em modelo real, com acompanhamento lado a lado",
        "Manutenção e remoção segura",
        "Preço, agenda e fotos: como começar a atender depois do curso",
      ],
    },
  ],
  kit: [
    "Kit inicial com pinças, cola, primer e fios de três curvaturas",
    "Cabeça de treino para praticar em casa",
    "Apostila com o passo a passo e a ficha de anamnese",
    "Certificado de conclusão do curso livre",
    "30 dias de tira-dúvidas pelo WhatsApp depois da turma",
  ],
  paraQuem: "Para quem nunca aplicou cílios ou já aplica e quer corrigir a base. Não precisa ter formação na área.",
};

/** Trabalhos de ex-alunas: EXEMPLOS desta demonstração (fotos geradas por IA, nomes fictícios). */
export const exAlunas = [
  { id: "aluna-1", nome: "Bruna", turma: "Turma de março", texto: "Comecei atendendo em casa no mês seguinte ao curso." },
  { id: "aluna-2", nome: "Tainá", turma: "Turma de maio", texto: "Já fazia sobrancelha e somei os cílios à agenda." },
  { id: "aluna-3", nome: "Jéssica", turma: "Turma de agosto", texto: "A modelo real no segundo dia foi o que me deu segurança." },
];
