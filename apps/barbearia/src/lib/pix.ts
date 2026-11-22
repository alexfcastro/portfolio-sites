import { createRandom } from "@/lib/random";

/*
 * Pix ILUSTRATIVO. O código "copia e cola" é propositalmente inválido para bancos
 * e o desenho do QR Code não é lido por aplicativos: nada pode ser pago por engano.
 * Num site real, o código viria do banco ou do serviço de pagamento contratado.
 */

export function demoPixCode(reference: string, cents: number): string {
  return `DEMONSTRACAO-PIX-BRAVUS-${reference}-${cents}-NAO-E-UM-PAGAMENTO-REAL`;
}

const SIZE = 29;

function finder(matrix: boolean[][], top: number, left: number) {
  for (let y = -1; y <= 7; y += 1) {
    for (let x = -1; x <= 7; x += 1) {
      const row = matrix[top + y];
      if (!row || left + x < 0 || left + x >= SIZE) continue;
      const ring = Math.max(Math.abs(y - 3), Math.abs(x - 3));
      row[left + x] = ring !== 2 && ring !== 4;
    }
  }
}

/** Matriz com cara de QR Code (cantos, linha de sincronia e módulos), gerada a partir do texto. */
export function illustrativeQr(text: string): boolean[][] {
  const random = createRandom(text);
  const matrix = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => random() < 0.48));
  finder(matrix, 0, 0);
  finder(matrix, 0, SIZE - 7);
  finder(matrix, SIZE - 7, 0);
  for (let i = 8; i < SIZE - 8; i += 1) {
    matrix[6]![i] = i % 2 === 0;
    matrix[i]![6] = i % 2 === 0;
  }
  return matrix;
}

/** "09:41" a partir de milissegundos restantes. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
