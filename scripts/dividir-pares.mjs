// Divide as imagens de comparação "par-<nome>" (gerada como uma foto só, com o ANTES à esquerda e o DEPOIS à
// direita do mesmo rosto) em dois arquivos: "<nome>-antes" e "<nome>-depois". Gerar o par numa imagem só é o
// que garante o mesmo rosto, a mesma luz e o mesmo enquadramento nas duas metades.
//
// Uso: node scripts/dividir-pares.mjs <site>      (lê e grava em fotos-ia/<site>/)

import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [slug] = process.argv.slice(2);
if (!slug) {
  console.error("Uso: node scripts/dividir-pares.mjs <site>");
  process.exit(1);
}

const requireFromApp = createRequire(join(root, "apps", slug, "package.json"));
const sharp = createRequire(requireFromApp.resolve("next/package.json"))("sharp");

const pasta = join(root, "fotos-ia", slug);
const pares = readdirSync(pasta).filter((f) => /^par-.+\.(png|jpe?g|webp)$/i.test(f));
if (pares.length === 0) console.log("Nenhum arquivo par-*.");

for (const arquivo of pares) {
  const nome = arquivo.replace(/^par-/, "").replace(/\.[a-z]+$/i, "");
  const imagem = sharp(join(pasta, arquivo));
  const { width, height } = await imagem.metadata();
  const metade = Math.floor(width / 2);
  // Corta 1% de cada lado da divisão, para não sobrar uma linha de emenda.
  const margem = Math.round(width * 0.01);
  await sharp(join(pasta, arquivo))
    .extract({ left: 0, top: 0, width: metade - margem, height })
    .png()
    .toFile(join(pasta, `${nome}-antes.png`));
  await sharp(join(pasta, arquivo))
    .extract({ left: metade + margem, top: 0, width: width - metade - margem, height })
    .png()
    .toFile(join(pasta, `${nome}-depois.png`));
  console.log(`✓ ${arquivo} → ${nome}-antes.png e ${nome}-depois.png (${metade - margem}×${height} cada)`);
}
