/*
 * Resolve Serviços é um prestador fictício. Serviços, regiões, perguntas e
 * trabalhos do portfólio são exemplos de demonstração.
 */

export interface Question {
  id: string;
  label: string;
  options: string[];
}

export interface ServiceType {
  id: string;
  name: string;
  summary: string;
  includes: string[];
  questions: Question[];
}

const urgency: Question = {
  id: "urgencia",
  label: "Para quando você precisa?",
  options: ["Hoje (urgente)", "Nesta semana", "Sem pressa, quero planejar"],
};

export const serviceTypes: ServiceType[] = [
  {
    id: "eletrica",
    name: "Elétrica",
    summary: "Tomadas, disjuntores, chuveiros e iluminação.",
    includes: ["Troca de tomadas e interruptores", "Instalação de chuveiro", "Revisão de quadro de disjuntores"],
    questions: [
      {
        id: "problema",
        label: "O que está acontecendo?",
        options: ["Disjuntor desarmando", "Tomada ou ponto sem energia", "Instalar chuveiro ou luminária", "Outro"],
      },
      { id: "imovel", label: "Tipo de imóvel", options: ["Casa", "Apartamento", "Comércio"] },
      urgency,
    ],
  },
  {
    id: "pintura",
    name: "Pintura",
    summary: "Paredes internas, fachadas e pequenos reparos.",
    includes: ["Preparação e massa corrida", "Pintura interna e externa", "Proteção de móveis e piso"],
    questions: [
      { id: "area", label: "Tamanho aproximado", options: ["Um cômodo", "Dois a três cômodos", "Imóvel inteiro", "Fachada"] },
      { id: "estado", label: "Estado das paredes", options: ["Só pintura", "Pequenas rachaduras", "Infiltração ou mofo"] },
      urgency,
    ],
  },
  {
    id: "manutencao",
    name: "Manutenção",
    summary: "Pequenos reparos, montagem e instalação em geral.",
    includes: ["Montagem de móveis", "Instalação de prateleiras e suportes", "Reparos em portas e fechaduras"],
    questions: [
      { id: "tipo", label: "Tipo de serviço", options: ["Montagem de móveis", "Instalação na parede", "Reparo em porta ou janela", "Outro"] },
      { id: "quantidade", label: "Quantidade de itens", options: ["1 item", "2 a 4 itens", "5 ou mais"] },
      urgency,
    ],
  },
  {
    id: "ar-condicionado",
    name: "Ar-condicionado",
    summary: "Instalação, limpeza e manutenção de split.",
    includes: ["Instalação de split", "Limpeza e higienização", "Verificação de gás e drenagem"],
    questions: [
      { id: "servico", label: "O que você precisa?", options: ["Instalação", "Limpeza", "Não gela", "Pingando água", "Barulho"] },
      { id: "btus", label: "Potência do aparelho", options: ["9.000 BTUs", "12.000 BTUs", "18.000 BTUs ou mais", "Não sei"] },
      urgency,
    ],
  },
  {
    id: "hidraulica",
    name: "Hidráulica",
    summary: "Vazamentos, torneiras, descargas e caixas d’água.",
    includes: ["Troca de torneiras e registros", "Conserto de vazamentos", "Limpeza de caixa d’água"],
    questions: [
      { id: "problema", label: "O que está acontecendo?", options: ["Vazamento", "Descarga com defeito", "Entupimento", "Troca de peça"] },
      { id: "local", label: "Onde?", options: ["Banheiro", "Cozinha", "Área externa", "Caixa d’água"] },
      urgency,
    ],
  },
];

/** Regiões ilustrativas. `served: false` mostra como o site recusa pedidos fora da área. */
export const regions = [
  { id: "centro", name: "Centro", served: true, travelFeeCents: 0 },
  { id: "zona-norte", name: "Zona Norte", served: true, travelFeeCents: 2000 },
  { id: "zona-sul", name: "Zona Sul", served: true, travelFeeCents: 2000 },
  { id: "zona-leste", name: "Zona Leste", served: true, travelFeeCents: 3000 },
  { id: "zona-oeste", name: "Zona Oeste", served: false, travelFeeCents: 0 },
  { id: "regiao-metropolitana", name: "Região metropolitana", served: false, travelFeeCents: 0 },
];

export const portfolioWorks = [
  { id: "quadro", serviceId: "eletrica", title: "Quadro de disjuntores reorganizado", detail: "Circuitos identificados e disjuntores dimensionados." },
  { id: "sala", serviceId: "pintura", title: "Sala com parede de destaque", detail: "Massa corrida, lixamento e duas demãos." },
  { id: "painel", serviceId: "manutencao", title: "Painel de TV instalado", detail: "Fixação com buchas adequadas e fiação escondida." },
  { id: "split", serviceId: "ar-condicionado", title: "Split 12.000 BTUs instalado", detail: "Instalação com dreno e teste de vazamento." },
  { id: "banheiro", serviceId: "hidraulica", title: "Vazamento sob a pia corrigido", detail: "Troca de sifão e vedação do registro." },
  { id: "fachada", serviceId: "pintura", title: "Fachada renovada", detail: "Tratamento de fissuras e tinta acrílica." },
];

export function getServiceType(id: string): ServiceType | undefined {
  return serviceTypes.find((service) => service.id === id);
}

export function getRegion(id: string) {
  return regions.find((region) => region.id === id);
}
