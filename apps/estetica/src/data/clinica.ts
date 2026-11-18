/*
 * Conteúdo da Clínica Núcleo, negócio fictício. Preços, prazos e equipe são exemplos de demonstração.
 * Os números de registro profissional ficam como espaço reservado: num site real, entram os números verdadeiros.
 */

export const clinica = {
  nome: "Clínica Núcleo",
  bairro: "Moema, São Paulo",
  horario: "Segunda a sexta, das 8h às 19h · sábado, das 8h às 12h",
} as const;

export const sessao = [
  {
    titulo: "Antes",
    texto: "Você chega 10 minutos antes, troca de roupa se o protocolo for corporal e conta como foram os últimos dias. Fotos de acompanhamento só com a sua autorização.",
  },
  {
    titulo: "Durante",
    texto: "De 50 a 60 minutos, numa sala individual. A esteticista explica cada etapa e para quando você pedir. Nada de vender outro pacote no meio da sessão.",
  },
  {
    titulo: "Depois",
    texto: "Você recebe por escrito os cuidados para os próximos dias e já sai com a próxima sessão marcada, no intervalo que o protocolo pede.",
  },
  {
    titulo: "Acompanhamento",
    texto: "A cada quatro sessões, uma reavaliação rápida com fotos comparativas. Se não estiver evoluindo como esperado, o protocolo muda.",
  },
];

export const equipe = [
  {
    id: "equipe-helena",
    nome: "Helena Prado",
    funcao: "Esteticista · pós-operatório e corporal",
    formacao: "Tecnóloga em Estética e Cosmética, com especialização em drenagem linfática pós-cirúrgica.",
    registro: "Registro profissional: espaço para o número real",
  },
  {
    id: "equipe-luana",
    nome: "Luana Ribeiro",
    funcao: "Esteticista · facial",
    formacao: "Tecnóloga em Estética e Cosmética, com cursos em peelings e tratamento de acne e manchas.",
    registro: "Registro profissional: espaço para o número real",
  },
];

export const estrutura = [
  { id: "estrutura-sala", titulo: "Salas individuais", texto: "Duas salas com porta, maca elétrica e controle de temperatura. Ninguém é atendido em box aberto." },
  { id: "estrutura-recepcao", titulo: "Recepção tranquila", texto: "Poucos horários por dia, para você não esperar. Água, chá e banheiro com chuveiro para quem vem do trabalho." },
];

export const estruturaItens = [
  "Material descartável individual e autoclave para o que é reutilizável",
  "Térreo, sem degraus, com acesso para cadeira de rodas",
  "Estacionamento conveniado a uma quadra",
  "Atendimento só com hora marcada",
];

/** Prazos usuais para começar a drenagem. Sempre com liberação do cirurgião. */
export const prazosPosOperatorio = [
  { cirurgia: "Lipoaspiração", inicio: "Do 3º ao 7º dia", sessoes: "10 sessões" },
  { cirurgia: "Abdominoplastia", inicio: "Do 5º ao 10º dia", sessoes: "10 sessões" },
  { cirurgia: "Cirurgia de mama", inicio: "Do 5º ao 10º dia", sessoes: "6 sessões" },
  { cirurgia: "Outras cirurgias plásticas", inicio: "Conforme o cirurgião", sessoes: "8 sessões, em média" },
];

export const perguntas = [
  {
    pergunta: "Preciso fechar o pacote inteiro na avaliação?",
    resposta: "Não. A avaliação serve para entender o seu caso e montar o protocolo. Você decide depois, com o valor total e o número de sessões por escrito.",
  },
  {
    pergunta: "O valor do montador é o valor final?",
    resposta: "É uma estimativa para você se planejar. O protocolo final pode ter mais ou menos sessões, conforme o que a esteticista vê na avaliação.",
  },
  {
    pergunta: "Dá para parcelar?",
    resposta: "Nesta demonstração, os pacotes aparecem com parcelamento em até 6 vezes sem juros no cartão. Cada clínica define as próprias condições.",
  },
  {
    pergunta: "Se eu faltar, perco a sessão?",
    resposta: "Avisando com 24 horas de antecedência, a sessão é remarcada sem custo. No pós-operatório, a equipe ajuda a reorganizar a agenda para não perder o intervalo.",
  },
  {
    pergunta: "Vocês prometem resultado?",
    resposta: "Não. Cada pele e cada corpo respondem de um jeito. O que a clínica garante é acompanhamento: se o protocolo não estiver funcionando, ele é revisto.",
  },
];
