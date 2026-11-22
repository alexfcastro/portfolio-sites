import { business, demoCustomerName, getService, plans, professionals, seedCustomerNames, services } from "@/data/business";
import { createRandom } from "@/lib/random";
import { addDays, getWeekday } from "@/lib/time";

/*
 * Histórico fictício de atendimentos dos últimos 90 dias. É sempre calculado a partir da data de hoje
 * (não fica salvo), para alimentar o resumo do mês, a lista de clientes sumidos e os assinantes.
 */

export interface CustomerProfile {
  name: string;
  /** De quantos em quantos dias costuma voltar. */
  everyDays: number;
  serviceId: string;
  professionalId: string;
  /** Há quantos dias foi a última visita. */
  lastVisitAgo: number;
  planId: string | null;
}

export interface Visit {
  date: string;
  startMin: number;
  customerName: string;
  serviceId: string;
  professionalId: string;
  priceCents: number;
  viaPlan: boolean;
}

/** Posições na lista de nomes de quem parou de vir e de quem assina um plano. */
const MISSING = new Set([3, 8, 13, 17, 21]);
const PLAN_BY_INDEX: Record<number, string> = {
  0: "clube-corte",
  5: "clube-corte",
  10: "clube-corte",
  15: "clube-corte",
  2: "clube-completo",
  12: "clube-completo",
  19: "clube-completo",
};

/** Nome usado nos atendimentos avulsos do histórico. */
export const WALK_IN = "Cliente avulso";

let profilesCache: CustomerProfile[] | null = null;

export function customerProfiles(): CustomerProfile[] {
  if (profilesCache) return profilesCache;
  const random = createRandom("clientes-bravus");
  profilesCache = seedCustomerNames.map((name, index) => {
    const planId = PLAN_BY_INDEX[index] ?? null;
    const plan = plans.find((item) => item.id === planId);
    const options = plan ? services.filter((s) => (plan.serviceIds as readonly string[]).includes(s.id)) : services;
    const service = options[Math.floor(random() * options.length)] ?? services[0]!;
    const professionalId = service.professionalIds[Math.floor(random() * service.professionalIds.length)] ?? "rafa";
    const missing = MISSING.has(index);
    return {
      name,
      // Assinantes vêm toda semana; os demais, a cada 2 a 5 semanas.
      everyDays: plan ? 7 : 14 + Math.floor(random() * 4) * 7,
      serviceId: service.id,
      professionalId,
      lastVisitAgo: missing ? 34 + Math.floor(random() * 40) : 1 + Math.floor(random() * 12),
      planId,
    };
  });
  return profilesCache;
}

/** Clientes que ainda frequentam (usados também na agenda de exemplo). */
export function activeCustomers(): string[] {
  return customerProfiles()
    .filter((profile) => profile.lastVisitAgo < business.missingAfterDays)
    .map((profile) => profile.name);
}

export function subscriberPlan(name: string): string | null {
  return customerProfiles().find((profile) => profile.name === name)?.planId ?? null;
}

/** Visitas anteriores do cliente de demonstração, para "repetir meu último corte". */
const DEMO_VISITS = [
  { ago: 19, serviceId: "corte", professionalId: "rafa", startMin: 10 * 60 },
  { ago: 44, serviceId: "corte", professionalId: "rafa", startMin: 11 * 60 },
];

/** Recua para o dia aberto mais próximo (a barbearia fecha aos domingos). */
function openDayOnOrBefore(date: string): string {
  let current = date;
  while (!business.hours[getWeekday(current)]) current = addDays(current, -1);
  return current;
}

const historyCache = new Map<string, Visit[]>();

export function generateHistory(today: string): Visit[] {
  const cached = historyCache.get(today);
  if (cached) return cached;

  const visits: Visit[] = [];
  for (const profile of customerProfiles()) {
    const random = createRandom(`historico:${profile.name}`);
    const service = getService(profile.serviceId)!;
    for (let ago = profile.lastVisitAgo; ago <= 90; ago += profile.everyDays + Math.floor(random() * 3)) {
      visits.push({
        date: openDayOnOrBefore(addDays(today, -ago)),
        startMin: 9 * 60 + Math.floor(random() * 15) * 20,
        customerName: profile.name,
        serviceId: service.id,
        professionalId: profile.professionalId,
        priceCents: service.priceCents,
        viaPlan: profile.planId !== null,
      });
    }
  }
  for (const visit of DEMO_VISITS) {
    const service = getService(visit.serviceId)!;
    visits.push({
      date: openDayOnOrBefore(addDays(today, -visit.ago)),
      startMin: visit.startMin,
      customerName: demoCustomerName,
      serviceId: service.id,
      professionalId: visit.professionalId,
      priceCents: service.priceCents,
      viaPlan: false,
    });
  }

  // Clientes avulsos (quem passa sem ser frequente): enchem o dia de cada barbeiro como numa barbearia real.
  for (let ago = 1; ago <= 90; ago += 1) {
    const date = addDays(today, -ago);
    if (!business.hours[getWeekday(date)]) continue;
    for (const professional of professionals) {
      const random = createRandom(`avulsos:${date}:${professional.id}`);
      const options = services.filter((s) => s.professionalIds.includes(professional.id));
      const count = 4 + Math.floor(random() * 4);
      for (let i = 0; i < count; i += 1) {
        const service = options[Math.floor(random() * options.length)] ?? services[0]!;
        visits.push({
          date,
          startMin: 9 * 60 + i * 60,
          customerName: WALK_IN,
          serviceId: service.id,
          professionalId: professional.id,
          priceCents: service.priceCents,
          viaPlan: false,
        });
      }
    }
  }

  // Nunca inclui hoje: o dia atual vem da agenda.
  const result = visits.filter((visit) => visit.date < today).sort((a, b) => b.date.localeCompare(a.date));
  historyCache.set(today, result);
  return result;
}
