/*
 * Montador de protocolo da Clínica Núcleo (negócio fictício).
 * A partir do objetivo e de duas ou três respostas, sugere quantas sessões, com que intervalo e quanto custa
 * o pacote. É uma ESTIMATIVA para a cliente se planejar: o protocolo final é definido na avaliação.
 * Valores em centavos. Tudo puro, para poder ser testado.
 */

export type ObjetivoId = "pos-operatorio" | "manchas" | "flacidez" | "acne";

export interface Opcao {
  id: string;
  rotulo: string;
}

export interface Pergunta {
  id: string;
  texto: string;
  ajuda?: string;
  opcoes: Opcao[];
}

export interface Objetivo {
  id: ObjetivoId;
  nome: string;
  resumo: string;
  foto: string;
  perguntas: Pergunta[];
}

export const objetivos: Objetivo[] = [
  {
    id: "pos-operatorio",
    nome: "Recuperação pós-operatória",
    resumo: "Drenagem linfática depois de lipo, abdominoplastia ou cirurgia de mama, com liberação do cirurgião.",
    foto: "obj-pos-operatorio",
    perguntas: [
      {
        id: "cirurgia",
        texto: "Qual cirurgia você fez (ou vai fazer)?",
        opcoes: [
          { id: "lipo", rotulo: "Lipoaspiração" },
          { id: "abdomino", rotulo: "Abdominoplastia" },
          { id: "mama", rotulo: "Cirurgia de mama" },
          { id: "outra", rotulo: "Outra cirurgia plástica" },
        ],
      },
      {
        id: "dias",
        texto: "Há quantos dias foi a cirurgia?",
        opcoes: [
          { id: "ainda-nao", rotulo: "Ainda não operei" },
          { id: "ate-7", rotulo: "Até 7 dias" },
          { id: "8-30", rotulo: "De 8 a 30 dias" },
          { id: "mais-30", rotulo: "Mais de 30 dias" },
        ],
      },
      {
        id: "liberacao",
        texto: "O cirurgião já liberou a drenagem?",
        ajuda: "A drenagem só começa com a liberação de quem operou.",
        opcoes: [
          { id: "sim", rotulo: "Sim, já liberou" },
          { id: "nao", rotulo: "Ainda não" },
        ],
      },
    ],
  },
  {
    id: "manchas",
    nome: "Manchas",
    resumo: "Melasma, marcas deixadas pela acne e manchas de sol, com protocolo e cuidados em casa.",
    foto: "obj-manchas",
    perguntas: [
      {
        id: "tipo",
        texto: "Que tipo de mancha mais incomoda?",
        opcoes: [
          { id: "melasma", rotulo: "Melasma (manchas que escurecem com sol e calor)" },
          { id: "marcas", rotulo: "Marcas que a acne deixou" },
          { id: "sol", rotulo: "Manchas de sol" },
          { id: "nao-sei", rotulo: "Não sei dizer" },
        ],
      },
      {
        id: "tempo",
        texto: "Há quanto tempo elas existem?",
        opcoes: [
          { id: "menos-1", rotulo: "Menos de 1 ano" },
          { id: "mais-1", rotulo: "Mais de 1 ano" },
        ],
      },
    ],
  },
  {
    id: "flacidez",
    nome: "Flacidez",
    resumo: "Radiofrequência para rosto e corpo, com sessões semanais e resultado gradual.",
    foto: "obj-flacidez",
    perguntas: [
      {
        id: "area",
        texto: "Onde você quer tratar?",
        opcoes: [
          { id: "rosto", rotulo: "Rosto e pescoço" },
          { id: "abdome", rotulo: "Abdome" },
          { id: "bracos", rotulo: "Braços" },
          { id: "coxas", rotulo: "Coxas e glúteos" },
        ],
      },
      {
        id: "intensidade",
        texto: "Como você descreveria a flacidez?",
        opcoes: [
          { id: "leve", rotulo: "Leve, percebo de perto" },
          { id: "moderada", rotulo: "Moderada, aparece com roupa justa ou em fotos" },
        ],
      },
    ],
  },
  {
    id: "acne",
    nome: "Acne",
    resumo: "Limpeza de pele e protocolo para cravos e espinhas, junto com o acompanhamento médico quando preciso.",
    foto: "obj-acne",
    perguntas: [
      {
        id: "grau",
        texto: "Como está a sua pele hoje?",
        opcoes: [
          { id: "leve", rotulo: "Cravos e espinhas de vez em quando" },
          { id: "inflamada", rotulo: "Espinhas inflamadas com frequência" },
        ],
      },
      {
        id: "medico",
        texto: "Você faz acompanhamento com dermatologista?",
        opcoes: [
          { id: "sim", rotulo: "Sim" },
          { id: "nao", rotulo: "Não" },
        ],
      },
    ],
  },
];

export type Respostas = Record<string, string>;

export interface Protocolo {
  objetivo: ObjetivoId;
  nome: string;
  tecnica: string;
  sessoes: number;
  intervalo: string;
  /** Semanas aproximadas do começo ao fim. */
  semanas: number;
  precoSessao: number;
  /** Preço do pacote, já com o desconto. */
  total: number;
  desconto: number;
  /** Quando dá para começar (importa sobretudo no pós-operatório). */
  inicio: string;
  /** Avisos honestos: limites, liberação médica, cuidados em casa. */
  avisos: string[];
}

/** Desconto de pacote: 10% a partir de 6 sessões, 15% a partir de 10. */
export function descontoPacote(sessoes: number): number {
  if (sessoes >= 10) return 0.15;
  if (sessoes >= 6) return 0.1;
  return 0;
}

function pacote(sessoes: number, precoSessao: number) {
  const desconto = descontoPacote(sessoes);
  const total = Math.round((sessoes * precoSessao * (1 - desconto)) / 100) * 100;
  return { desconto, total };
}

export function respondidas(objetivo: Objetivo, respostas: Respostas): boolean {
  return objetivo.perguntas.every((pergunta) => pergunta.opcoes.some((opcao) => opcao.id === respostas[pergunta.id]));
}

export function montarProtocolo(id: ObjetivoId, r: Respostas): Protocolo {
  switch (id) {
    case "pos-operatorio": {
      const sessoes = r.cirurgia === "mama" ? 6 : r.cirurgia === "outra" ? 8 : 10;
      const precoSessao = 15000;
      const avisos = ["O número de sessões é revisto na avaliação e pode mudar conforme a evolução do inchaço."];
      let inicio = "Já pode marcar a avaliação; a primeira sessão costuma ser no mesmo dia ou no seguinte.";
      if (r.liberacao !== "sim" || r.dias === "ainda-nao") {
        inicio =
          r.dias === "ainda-nao"
            ? "Marque a avaliação antes da cirurgia: assim a primeira drenagem fica reservada para quando o cirurgião liberar."
            : "Espere a liberação do cirurgião. Enquanto isso, a avaliação já pode ser feita e a agenda fica reservada.";
        avisos.push("Nenhuma drenagem é feita sem a liberação de quem operou.");
      } else if (r.dias === "mais-30") {
        avisos.push("Depois de 30 dias a drenagem ainda ajuda, mas o foco passa a ser fibrose e contorno; isso é avaliado na consulta.");
      }
      return {
        objetivo: id,
        nome: "Drenagem linfática pós-operatória",
        tecnica: "Drenagem manual, sem aparelhos nas primeiras sessões",
        sessoes,
        intervalo: "3 por semana nas 2 primeiras semanas, depois 2 por semana",
        semanas: Math.ceil((sessoes - 6) / 2) + 2,
        precoSessao,
        ...pacote(sessoes, precoSessao),
        inicio,
        avisos,
      };
    }
    case "manchas": {
      const melasma = r.tipo === "melasma";
      const sessoes = melasma ? 8 : r.tempo === "mais-1" ? 6 : 4;
      const precoSessao = 22000;
      const avisos = ["Protetor solar todos os dias faz parte do tratamento: sem ele, a mancha volta."];
      if (melasma) avisos.push("Melasma não tem cura definitiva, tem controle. O objetivo é clarear e manter.");
      if (r.tipo === "nao-sei") avisos.push("Na avaliação, a esteticista identifica o tipo de mancha antes de fechar o protocolo.");
      return {
        objetivo: id,
        nome: melasma ? "Protocolo de clareamento para melasma" : "Protocolo de clareamento de manchas",
        tecnica: melasma ? "Peeling suave e cuidados em casa, sem calor na pele" : "Peeling químico e microagulhamento leve",
        sessoes,
        intervalo: "1 a cada 15 dias",
        semanas: sessoes * 2,
        precoSessao,
        ...pacote(sessoes, precoSessao),
        inicio: "Pode começar logo após a avaliação. Evite começar perto de férias de praia.",
        avisos,
      };
    }
    case "flacidez": {
      const sessoes = r.intensidade === "moderada" ? 10 : 8;
      const precoSessao = r.area === "rosto" ? 18000 : 20000;
      return {
        objetivo: id,
        nome: r.area === "rosto" ? "Radiofrequência facial" : "Radiofrequência corporal",
        tecnica: "Radiofrequência, com a pele aquecida de forma controlada",
        sessoes,
        intervalo: "1 por semana",
        semanas: sessoes,
        precoSessao,
        ...pacote(sessoes, precoSessao),
        inicio: "Pode começar logo após a avaliação.",
        avisos: [
          "O resultado é gradual e aparece melhor de 30 a 60 dias depois da última sessão.",
          "Flacidez acentuada pode precisar de avaliação médica; a esteticista avisa se for o caso.",
        ],
      };
    }
    case "acne": {
      const inflamada = r.grau === "inflamada";
      const sessoes = inflamada ? 6 : 4;
      const precoSessao = 16000;
      const avisos = ["Espremer em casa piora as marcas: a limpeza é feita só na clínica."];
      if (inflamada && r.medico === "nao") {
        avisos.push("Acne inflamada frequente pede acompanhamento com dermatologista. A estética entra junto com o tratamento médico, não no lugar dele.");
      }
      return {
        objetivo: id,
        nome: inflamada ? "Protocolo para acne inflamada" : "Limpeza de pele profunda",
        tecnica: inflamada ? "Limpeza, alta frequência e máscara calmante" : "Limpeza com extração e hidratação",
        sessoes,
        intervalo: inflamada ? "1 a cada 15 dias" : "1 a cada 21 dias",
        semanas: inflamada ? sessoes * 2 : sessoes * 3,
        precoSessao,
        ...pacote(sessoes, precoSessao),
        inicio: "Pode começar logo após a avaliação.",
        avisos,
      };
    }
  }
}

export function resumoProtocolo(p: Protocolo, formatar: (centavos: number) => string): string {
  return [
    `Protocolo sugerido: ${p.nome}`,
    `${p.sessoes} sessões, ${p.intervalo} (cerca de ${p.semanas} semanas)`,
    `Investimento estimado: ${formatar(p.total)}${p.desconto ? ` no pacote (${Math.round(p.desconto * 100)}% de desconto)` : ""}`,
  ].join("\n");
}
