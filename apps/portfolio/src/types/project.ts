export type DemoStatus = "planned" | "in_progress" | "available" | "unavailable";
export type FeatureStatus = "planned" | "implemented";
export type MediaKind = "concept" | "screenshot";

export type CategoryId =
  | "servicos"
  | "saude-bem-estar"
  | "alimentacao"
  | "automotivo"
  | "profissionais"
  | "imoveis"
  | "comercio";

/** Tipo de solução que o projeto demonstra; usado nos filtros da listagem. */
export type SolutionId =
  | "agendamento"
  | "orcamento"
  | "catalogo"
  | "pedidos"
  | "institucional"
  | "painel";

export interface ProjectFeature {
  title: string;
  description: string;
  status: FeatureStatus;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: MediaKind;
  caption: string;
}

export interface FlowStep {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  categoryId: CategoryId;
  solutionIds: SolutionId[];
  isConceptual: true;
  /** Frase curta usada em cards. */
  summary: string;
  /** Tipo de negócio representado, em linguagem do visitante. */
  audience: string;
  problem: string;
  solution: string;
  flow: FlowStep[];
  demoStatus: DemoStatus;
  featuredOrder: number | null;
  features: ProjectFeature[];
  media: ProjectMedia[];
  /** Vazio enquanto a stack da demo não estiver definida. */
  technologies: string[];
  seo: { title: string; description: string };
}
