// Importa as fotos geradas por IA de fotos-ia/<site>/ para a demo.
//
// Uso:
//   node scripts/importar-fotos.mjs restaurante
//
// - Reconhece cada arquivo pelo nome exato (ex.: picanha.png) ou por palavras-chave do nome que o Flow dá
//   (ex.: Sliced_picanha_on_wooden_board_2026….jpg). As palavras-chave de cada site ficam em MAPAS.
// - Converte para WebP (máx. 1200 px de largura) em apps/<site>/public/fotos/<id>.webp.
// - Gera apps/<site>/src/data/fotos.ts com as fotos disponíveis e suas dimensões; onde não houver foto,
//   a demo continua usando a ilustração.
// - Não apaga nada em fotos-ia/. Para no primeiro conflito (arquivo que casa com dois itens, ou item com dois arquivos).

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];

// id do item → palavras (em minúsculas) que identificam o arquivo; o nome exato do id sempre vale.
const MAPAS = {
  restaurante: {
    picanha: ["picanha"],
    costela: ["rib", "costela"],
    frango: ["chicken", "frango"],
    linguica: ["sausage", "linguica"],
    arroz: ["rice", "arroz", "biro"],
    farofa: ["farofa"],
    mandioca: ["cassava", "mandioca"],
    salada: ["salad", "salada"],
    refri: ["soda", "refri", "refrigerante"],
    suco: ["juice", "suco"],
    agua: ["water", "agua"],
    pudim: ["flan", "pudim"],
    brownie: ["brownie"],
  },
};

if (!slug || !MAPAS[slug]) {
  console.error(`Uso: node scripts/importar-fotos.mjs <site>\nSites configurados: ${Object.keys(MAPAS).join(", ")}`);
  process.exit(1);
}

const appDir = join(root, "apps", slug);
// sharp vem como dependência do Next; resolve a partir do próprio app.
const requireFromApp = createRequire(join(appDir, "package.json"));
const sharp = createRequire(requireFromApp.resolve("next/package.json"))("sharp");

const origem = join(root, "fotos-ia", slug);
const destino = join(appDir, "public", "fotos");
const mapa = MAPAS[slug];
const tokens = (nome) =>
  nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\.[a-z0-9]+$/, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const arquivos = readdirSync(origem).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const escolhidos = {};
const problemas = [];
for (const arquivo of arquivos) {
  const base = arquivo.toLowerCase().replace(/\.[a-z0-9]+$/, "");
  const t = tokens(arquivo);
  const ids = mapa[base] ? [base] : Object.entries(mapa).filter(([, palavras]) => palavras.some((p) => t.includes(p))).map(([id]) => id);
  if (ids.length === 0) problemas.push(`sem correspondência: ${arquivo}`);
  else if (ids.length > 1) problemas.push(`${arquivo} casa com mais de um item: ${ids.join(", ")}`);
  else if (escolhidos[ids[0]]) problemas.push(`dois arquivos para "${ids[0]}": ${escolhidos[ids[0]]} e ${arquivo}`);
  else escolhidos[ids[0]] = arquivo;
}
if (problemas.length) {
  console.error(problemas.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });
const manifest = {};
for (const id of Object.keys(mapa)) {
  const arquivo = escolhidos[id];
  if (!arquivo) continue;
  const saida = join(destino, `${id}.webp`);
  const info = await sharp(join(origem, arquivo)).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile(saida);
  manifest[id] = { width: info.width, height: info.height };
  console.log(`✓ ${id}.webp  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB  ← ${arquivo}`);
}

const faltando = Object.keys(mapa).filter((id) => !manifest[id]);
const ts = `// Gerado por scripts/importar-fotos.mjs — não editar à mão.
// Fotos geradas por IA (Nano Banana, Google Flow) para esta demo fictícia; origem registrada em docs/assets.md.
// Itens sem foto continuam com a ilustração.

export const fotos: Readonly<Record<string, { width: number; height: number }>> = ${JSON.stringify(manifest, null, 2)};
`;
writeFileSync(join(appDir, "src", "data", "fotos.ts"), ts);
console.log(`\n${Object.keys(manifest).length} de ${Object.keys(mapa).length} fotos importadas para apps/${slug}/public/fotos/`);
if (faltando.length) console.log(`Sem foto (continuam com ilustração): ${faltando.join(", ")}`);
