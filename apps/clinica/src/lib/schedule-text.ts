import type { Professional } from "@/data/clinic";

const weekdayNames = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const periodShort = { manha: "manhã", tarde: "tarde" } as const;

/** "segunda (manhã e tarde), quarta (manhã)" */
export function describeSchedule(professional: Professional): string {
  return Object.entries(professional.schedule)
    .map(([day, periods]) => `${weekdayNames[Number(day)]} (${(periods ?? []).map((p) => periodShort[p]).join(" e ")})`)
    .join(", ");
}
