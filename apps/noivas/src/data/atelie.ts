/*
 * Conteúdo do Ateliê Véu, salão fictício. Preços, pacote, datas ocupadas e depoimentos são exemplos de demonstração.
 */

export const atelie = {
  nome: "Ateliê Véu",
  bairro: "Pinheiros, São Paulo",
  horario: "Dia da noiva com hora marcada · testes de terça a sexta",
} as const;

export const portfolio = [
  { id: "port-coque", titulo: "Coque baixo com véu", tipo: "Penteado" },
  { id: "port-ondas", titulo: "Ondas soltas", tipo: "Penteado" },
  { id: "port-make-natural", titulo: "Pele iluminada, make leve", tipo: "Maquiagem" },
  { id: "port-semipreso", titulo: "Semipreso com flores", tipo: "Penteado" },
  { id: "port-make-noite", titulo: "Make para cerimônia à noite", tipo: "Maquiagem" },
  { id: "port-madrinhas", titulo: "Madrinhas no mesmo tom", tipo: "Grupo" },
];

export const pacoteInclui = [
  { titulo: "Teste antes do casamento", texto: "Cabelo e maquiagem completos, de 30 a 60 dias antes, com fotos para comparar no grande dia." },
  { titulo: "Equipe no horário certo", texto: "Cabeleireira e maquiadora trabalhando em paralelo; profissional extra quando o grupo pede." },
  { titulo: "Cronograma por escrito", texto: "Quem se arruma a que horas, para ninguém esperar parada e a noiva terminar por último." },
  { titulo: "Retoque para levar", texto: "Batom, pó e grampos extras num estojo para a festa." },
  { titulo: "Café da manhã leve", texto: "Frutas, água e café para o grupo, porque o dia é longo." },
  { titulo: "Espaço reservado", texto: "O salão fica só para o seu grupo no horário marcado." },
];

export const teste = [
  { titulo: "Referências", texto: "Você traz fotos do vestido, do penteado e da maquiagem que gosta. A gente conversa sobre o que funciona no seu rosto e no seu cabelo." },
  { titulo: "Produção completa", texto: "Cabelo e maquiagem feitos como no dia, com os produtos que serão usados. Cerca de 3 horas." },
  { titulo: "Ajustes", texto: "Você vê com calma, tira fotos com luz natural e pede mudanças. Tudo anotado na sua ficha." },
  { titulo: "Ficha do grande dia", texto: "Produtos, tons e detalhes ficam registrados para a produção sair igual (ou melhor) no casamento." },
];

/** Depoimentos de EXEMPLO, escritos para esta demonstração. Não são de noivas reais. */
export const depoimentos = [
  {
    nome: "Aline",
    data: "casou em abril",
    texto: "Pedi orçamento em três salões. Aqui eu soube o valor e o horário de começar no mesmo dia, sem trocar vinte mensagens.",
  },
  {
    nome: "Patrícia",
    data: "casou em setembro",
    texto: "Éramos nove. Teve uma segunda maquiadora e ninguém ficou esperando. Eu terminei por último, como combinado.",
  },
  {
    nome: "Débora",
    data: "casou em dezembro",
    texto: "No teste mudei o penteado duas vezes. No dia estava tudo anotado e saiu exatamente como eu tinha aprovado.",
  },
];
