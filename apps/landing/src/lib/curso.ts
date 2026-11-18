/*
 * Curso Volume Perfeito (fictício): turma presencial de dois dias e seis alunas.
 * Data da turma, vagas restantes e parcelamento. Valores em centavos. Tudo puro, para poder ser testado.
 */

export const CURSO = {
  vagasTotal: 6,
  /** Vagas já ocupadas antes de a visitante chegar (simulação). */
  ocupadasIniciais: 2,
  /** No Pix, à vista. */
  pix: 279000,
  /** No cartão, valor cheio parcelado sem juros. */
  cartao: 299000,
  parcelasMax: 12,
} as const;

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekday(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

/** Próxima turma: o primeiro sábado a pelo menos 21 dias de hoje. Ocupa sábado e domingo. */
export function proximaTurma(hoje: string): { sabado: string; domingo: string } {
  let data = addDays(hoje, 21);
  while (weekday(data) !== 6) data = addDays(data, 1);
  return { sabado: data, domingo: addDays(data, 1) };
}

export function vagasRestantes(reservas: number): number {
  return Math.max(0, CURSO.vagasTotal - CURSO.ocupadasIniciais - reservas);
}

export function parcela(n: number): number {
  const parcelas = Math.min(Math.max(1, Math.round(n)), CURSO.parcelasMax);
  return Math.round(CURSO.cartao / parcelas);
}

export function economiaPix(): number {
  return CURSO.cartao - CURSO.pix;
}

const longa = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "numeric", month: "long" });

export function dataTurma(turma: { sabado: string; domingo: string }): string {
  const [ds, ms] = [new Date(`${turma.sabado}T12:00:00Z`), new Date(`${turma.domingo}T12:00:00Z`)];
  const sabado = longa.format(ds);
  const domingo = longa.format(ms);
  const mesmoMes = ds.getUTCMonth() === ms.getUTCMonth();
  return mesmoMes ? `${ds.getUTCDate()} e ${domingo}` : `${sabado} e ${domingo}`;
}
