/*
 * Questionário do Instituto Fio Nobre (fictício). Seis perguntas sobre queda, química, rotina e objetivo que
 * terminam numa ORIENTAÇÃO INICIAL de caminho: tratamento, mega hair ou os dois, com o porquê.
 * Não é diagnóstico: a página deixa isso claro e leva para a avaliação presencial.
 * Tudo puro, para poder ser testado.
 */

export interface Opcao {
  id: string;
  rotulo: string;
}

export interface Pergunta {
  id: "incomodo" | "tempo" | "quimica" | "mudanca" | "objetivo" | "historico";
  texto: string;
  ajuda?: string;
  opcoes: Opcao[];
}

export const perguntas: Pergunta[] = [
  {
    id: "incomodo",
    texto: "O que mais incomoda hoje?",
    opcoes: [
      { id: "queda", rotulo: "Cai muito cabelo no banho ou na escova" },
      { id: "afinamento", rotulo: "Os fios estão mais ralos e o couro aparece" },
      { id: "quebra", rotulo: "Os fios quebram no meio do comprimento" },
      { id: "volume", rotulo: "Quero mais comprimento ou volume" },
    ],
  },
  {
    id: "tempo",
    texto: "Há quanto tempo você percebe isso?",
    opcoes: [
      { id: "recente", rotulo: "Menos de 3 meses" },
      { id: "meses", rotulo: "De 3 meses a 1 ano" },
      { id: "anos", rotulo: "Mais de 1 ano" },
    ],
  },
  {
    id: "quimica",
    texto: "Fez química no cabelo nos últimos 6 meses?",
    opcoes: [
      { id: "nenhuma", rotulo: "Nenhuma" },
      { id: "coloracao", rotulo: "Coloração ou tonalizante" },
      { id: "alisamento", rotulo: "Alisamento ou progressiva" },
      { id: "descoloracao", rotulo: "Descoloração ou luzes" },
    ],
  },
  {
    id: "mudanca",
    texto: "Algo mudou na sua saúde ou na rotina nos últimos meses?",
    ajuda: "Isso ajuda a entender o momento do cabelo. Você conta os detalhes só se quiser, na avaliação.",
    opcoes: [
      { id: "nada", rotulo: "Nada que eu lembre" },
      { id: "parto", rotulo: "Gravidez ou pós-parto" },
      { id: "saude", rotulo: "Cirurgia, doença, dieta forte ou remédio novo" },
      { id: "estresse", rotulo: "Um período de muito estresse" },
    ],
  },
  {
    id: "objetivo",
    texto: "O que você quer conseguir?",
    opcoes: [
      { id: "recuperar", rotulo: "Parar a queda e recuperar o meu fio" },
      { id: "rapido", rotulo: "Ter comprimento e volume logo" },
      { id: "ambos", rotulo: "As duas coisas" },
    ],
  },
  {
    id: "historico",
    texto: "Já tratou o cabelo antes?",
    opcoes: [
      { id: "nunca", rotulo: "Nunca" },
      { id: "sem-resultado", rotulo: "Sim, mas não vi resultado" },
      { id: "voltou", rotulo: "Sim, melhorou, mas voltou" },
    ],
  },
];

export type Respostas = Partial<Record<Pergunta["id"], string>>;
export type Caminho = "tratamento" | "mega" | "ambos";

export interface Orientacao {
  caminho: Caminho;
  titulo: string;
  porques: string[];
  /** Avisos de cuidado: quando procurar médico, quando esperar antes do mega hair. */
  cuidados: string[];
}

export function completo(r: Respostas): boolean {
  return perguntas.every((p) => p.opcoes.some((o) => o.id === r[p.id]));
}

export function orientar(r: Respostas): Orientacao {
  const porques: string[] = [];
  const cuidados: string[] = [];
  const problemaDeFio = r.incomodo === "queda" || r.incomodo === "afinamento";
  const fioFragil = r.incomodo === "quebra" || r.quimica === "descoloracao" || r.quimica === "alisamento";

  let tratar = problemaDeFio || r.incomodo === "quebra" || r.objetivo === "recuperar";
  const mega = r.objetivo === "rapido" || r.incomodo === "volume" || r.objetivo === "ambos";
  if (r.objetivo === "ambos") tratar = true;

  if (r.incomodo === "queda") porques.push("Queda acima do normal pede entender a causa no couro cabeludo antes de qualquer outra coisa.");
  if (r.incomodo === "afinamento") porques.push("Fios mais finos e couro aparecendo indicam que a raiz precisa de estímulo; o mega hair sozinho não resolve isso.");
  if (r.incomodo === "quebra") porques.push("Fio que quebra no meio está fragilizado na fibra: o primeiro passo é reconstruir o comprimento.");
  if (r.incomodo === "volume" && !problemaDeFio) porques.push("Se o seu cabelo está saudável e o desejo é comprimento ou volume, o mega hair é o caminho mais rápido.");
  if (r.tempo === "anos" && problemaDeFio) porques.push("Quando a queda ou o afinamento passam de um ano, o tratamento leva mais tempo e vale começar logo.");
  if (r.tempo === "recente" && (r.mudanca === "parto" || r.mudanca === "saude" || r.mudanca === "estresse")) {
    porques.push("Queda que começou há pouco tempo, depois de uma mudança importante, muitas vezes é passageira. A avaliação ajuda a confirmar e a acelerar a recuperação.");
  }
  if (r.historico === "voltou") porques.push("Se melhorou e voltou, é sinal de que faltou manutenção: o plano inclui o acompanhamento depois da melhora.");
  if (r.historico === "sem-resultado") porques.push("Tratamento sem resultado costuma ser tratamento sem causa definida. Por isso a avaliação começa pelo exame do couro cabeludo.");

  // Fio fragilizado: o mega hair espera, porque o peso e a fixação pioram a quebra.
  if (mega && fioFragil) {
    cuidados.push("Com química recente ou fios quebrando, o mega hair espera: primeiro o fio é fortalecido, depois a aplicação é feita com segurança.");
    tratar = true;
  }
  if (mega && r.incomodo === "afinamento") {
    cuidados.push("Com fios finos, a técnica de mega hair precisa ser leve (fita ou microlink) para não pesar na raiz.");
  }
  if (r.mudanca === "parto" || r.mudanca === "saude") {
    cuidados.push("Por causa da mudança que você contou, vale passar também com um médico (dermatologista ou o seu médico de confiança). O tratamento capilar anda junto, não no lugar.");
  }

  const caminho: Caminho = tratar && mega ? "ambos" : mega ? "mega" : "tratamento";
  const titulo =
    caminho === "ambos"
      ? "Tratamento primeiro, mega hair na sequência"
      : caminho === "mega"
        ? "Mega hair, com o seu cabelo como base"
        : "Tratamento para a queda e para o fio";
  if (porques.length === 0) porques.push("Pelas suas respostas, o caminho mais seguro começa por entender o couro cabeludo de perto.");
  return { caminho, titulo, porques, cuidados };
}

export function resumoOrientacao(o: Orientacao): string {
  return `Orientação inicial do site: ${o.titulo}`;
}

/** Mega hair: preço por comprimento e quantidade (centavos), e manutenção por técnica. */
export const comprimentosMega = [40, 50, 60, 70] as const;
export const gramasMega = [100, 150, 200] as const;

export function precoMega(cm: (typeof comprimentosMega)[number], gramas: (typeof gramasMega)[number]): number {
  const porGrama: Record<number, number> = { 40: 1400, 50: 1700, 60: 2050, 70: 2450 };
  return Math.round(((porGrama[cm] ?? 0) * gramas + 35000) / 1000) * 1000;
}

export const tecnicasMega = [
  { nome: "Fita adesiva", manutencao: "A cada 6 a 8 semanas", indicada: "Fios finos; é a mais leve" },
  { nome: "Microlink (anel)", manutencao: "A cada 8 a 10 semanas", indicada: "Fios médios; sem cola nem calor" },
  { nome: "Queratina", manutencao: "A cada 12 semanas", indicada: "Fios grossos e saudáveis" },
];
