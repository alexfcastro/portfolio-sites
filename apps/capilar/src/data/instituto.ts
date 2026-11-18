/*
 * Conteúdo do Instituto Fio Nobre, negócio fictício. Preços, prazos e equipe são exemplos de demonstração.
 * Nenhum texto promete cura ou resultado garantido.
 */

export const instituto = {
  nome: "Instituto Fio Nobre",
  bairro: "Jardim Paulista, São Paulo",
  horario: "Segunda a sexta, das 9h às 19h · sábado, das 9h às 13h",
  avaliacao: { duracao: "60 minutos", valor: "R$ 180, abatidos do tratamento se você fechar" },
} as const;

export const avaliacaoInclui = [
  { titulo: "Conversa sem pressa", texto: "Histórico do cabelo, da saúde e da rotina, numa sala reservada. Ninguém vai olhar o seu cabelo na frente de outras pessoas." },
  { titulo: "Tricoscopia", texto: "O couro cabeludo é visto de perto, com câmera de aumento, e você acompanha na tela o que a tricologista está vendo." },
  { titulo: "Teste de tração e fotos", texto: "Um teste simples mostra quanto fio solta, e as fotos padronizadas viram a base para comparar a evolução." },
  { titulo: "Plano por escrito", texto: "Você sai com o caminho indicado, o número de sessões, o valor e quando esperar os primeiros sinais." },
];

export const tratamentos = [
  { nome: "Terapia capilar para queda", como: "LED, alta frequência e ativos aplicados no couro cabeludo, em sessões semanais.", resultado: "Primeiros sinais em 6 a 8 semanas; resultado consistente em 3 a 6 meses." },
  { nome: "Estímulo para fios finos", como: "Protocolo de estímulo da raiz combinado com cuidados diários em casa.", resultado: "Fios mais encorpados a partir de 3 meses; avaliação de evolução a cada 6 semanas." },
  { nome: "Reconstrução da fibra", como: "Cronograma de reconstrução e corte das pontas mais danificadas, para fios que quebram.", resultado: "Menos quebra em 4 a 8 semanas." },
  { nome: "Couro cabeludo sensível ou oleoso", como: "Limpeza profunda, equilíbrio da oleosidade e acalmar a irritação.", resultado: "Alívio já nas primeiras sessões; equilíbrio em 1 a 2 meses." },
];

export const equipe = [
  {
    id: "equipe-renata",
    nome: "Renata Albuquerque",
    funcao: "Tricologista",
    formacao: "Biomédica, com pós-graduação em tricologia e terapia capilar. Faz a avaliação e acompanha os tratamentos.",
  },
  {
    id: "equipe-simone",
    nome: "Simone Prado",
    funcao: "Cabeleireira especialista em mega hair",
    formacao: "Formação em técnicas de fita, microlink e queratina. Faz a aplicação, a manutenção e a remoção.",
  },
];

export const antesDepois = [
  { id: "queda", titulo: "Terapia para queda", texto: "Seis meses de terapia capilar, com a mesma luz e o mesmo enquadramento.", antes: "queda-antes", depois: "queda-depois" },
  { id: "mega", titulo: "Mega hair em fita", texto: "Comprimento e volume com técnica leve, em cabelo previamente tratado.", antes: "mega-antes", depois: "mega-depois" },
];
