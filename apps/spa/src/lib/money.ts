const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Valores são sempre inteiros em centavos; a divisão acontece só na exibição. */
export function formatBRL(cents: number): string {
  if (!Number.isInteger(cents)) throw new Error("Valor em centavos deve ser inteiro.");
  return brl.format(cents / 100);
}

export function sumCents(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
