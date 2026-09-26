import { getCategory, getService, vehicleTypes, type GarageService } from "@/data/garage";

/*
 * Triagem de orçamento: dados do veículo, sintomas e fotos (só prévia local).
 * A estimativa é uma faixa demonstrativa somada a partir dos serviços prováveis.
 */

export interface Vehicle {
  type: string;
  model: string;
  year: number;
  km: number;
}

export type VehicleErrors = Partial<Record<keyof Vehicle, string>>;

export function validateVehicle(vehicle: Vehicle, currentYear: number): VehicleErrors {
  const errors: VehicleErrors = {};
  if (!vehicleTypes.some((type) => type.id === vehicle.type)) errors.type = "Escolha o tipo do veículo.";
  const model = vehicle.model.trim();
  if (model.length < 2) errors.model = "Informe marca e modelo (ex.: hatch 1.0).";
  else if (model.length > 60) errors.model = "Use no máximo 60 caracteres.";
  if (!Number.isInteger(vehicle.year) || vehicle.year < 1980 || vehicle.year > currentYear + 1) {
    errors.year = `Informe um ano entre 1980 e ${currentYear + 1}.`;
  }
  if (!Number.isInteger(vehicle.km) || vehicle.km < 0 || vehicle.km > 999_999) {
    errors.km = "Informe a quilometragem aproximada (0 a 999.999).";
  }
  return errors;
}

export function validateProblem(categoryId: string, symptomIds: string[], description: string): string | null {
  const category = getCategory(categoryId);
  if (!category) return "Escolha o tipo de problema.";
  if (symptomIds.length === 0) return "Marque ao menos um sintoma.";
  if (symptomIds.some((id) => !category.symptoms.some((symptom) => symptom.id === id))) return "Sintoma inválido para esta categoria.";
  if (description.trim().length > 500) return "Descrição com no máximo 500 caracteres.";
  return null;
}

/** Serviços prováveis, sem repetição, na ordem em que aparecem. */
export function likelyServices(categoryId: string, symptomIds: string[]): GarageService[] {
  const category = getCategory(categoryId);
  if (!category) return [];
  const ids = category.symptoms.filter((symptom) => symptomIds.includes(symptom.id)).flatMap((symptom) => symptom.serviceIds);
  return [...new Set(ids)].map((id) => getService(id)).filter((service): service is GarageService => Boolean(service));
}

export function estimateRange(serviceList: GarageService[]): { minCents: number; maxCents: number } {
  return serviceList.reduce(
    (total, service) => ({ minCents: total.minCents + service.minCents, maxCents: total.maxCents + service.maxCents }),
    { minCents: 0, maxCents: 0 },
  );
}

/* ---------- fotos: apenas prévia local ---------- */

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export interface PhotoMeta {
  name: string;
  type: string;
  size: number;
}

/** Separa arquivos aceitos e recusados, respeitando o total máximo de fotos. */
export function screenPhotos(existing: number, files: PhotoMeta[]): { accepted: PhotoMeta[]; rejected: string[] } {
  const accepted: PhotoMeta[] = [];
  const rejected: string[] = [];
  for (const file of files) {
    if (!PHOTO_TYPES.includes(file.type)) rejected.push(`${file.name}: formato não aceito (use JPG, PNG ou WebP).`);
    else if (file.size > MAX_PHOTO_BYTES) rejected.push(`${file.name}: maior que 5 MB.`);
    else if (existing + accepted.length >= MAX_PHOTOS) rejected.push(`${file.name}: limite de ${MAX_PHOTOS} fotos.`);
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/* ---------- acompanhamento demonstrativo ---------- */

export const STAGES = ["recebido", "em-analise", "orcamento-enviado", "aprovado", "em-servico", "pronto"] as const;
export type Stage = (typeof STAGES)[number];

export const stageLabels: Record<Stage, string> = {
  recebido: "Solicitação recebida",
  "em-analise": "Em análise pela oficina",
  "orcamento-enviado": "Orçamento enviado",
  aprovado: "Orçamento aprovado",
  "em-servico": "Em serviço",
  pronto: "Pronto para retirada",
};

export function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage);
  return index >= 0 && index < STAGES.length - 1 ? STAGES[index + 1]! : null;
}
