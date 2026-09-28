// Importa as fotos geradas por IA de fotos-ia/<site>/ para a demo.
//
// Uso:
//   node scripts/importar-fotos.mjs restaurante
//
// - Reconhece cada arquivo pelo nome exato (ex.: picanha.png), por palavras-chave do nome que o Flow dá
//   (ex.: Sliced_picanha_on_wooden_board_2026….jpg) ou, quando o nome é ambíguo, pelo início do nome do arquivo
//   escolhido depois de olhar as fotos (texto em MAPAS em vez de lista de palavras).
// - RETOQUES desfoca pequenas áreas (ex.: número de casa que o gerador inventou) só na versão otimizada.
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
  "produtos-naturais": {
    "canela-em-po": "Cinnamon_in_jar",
    curcuma: "Turmeric_powder",
    "paprica-defumada": "Paprika_powder",
    camomila: "Chamomile_flowers",
    hortela: "Mint_leaves",
    quinoa: "Quinoa_grains",
    lentilha: "Lentils_in_jar",
    "aveia-flocos": "Rolled_oats",
    "castanha-caju": "Cashews_spilling",
    "castanha-para": "Brazil_nuts",
    amendoas: "Almonds_in_glass",
    damasco: "Dried_apricots",
    "uva-passa": "Raisins_in_jar",
    "farinha-amendoas": "Almond_flour",
    "farinha-integral": "Whole_wheat_flour",
    chia: "Chia_seeds",
    girassol: "Sunflower_seeds",
    "granola-tradicional": "Granola_bowl_with",
    "granola-sem-acucar": "Granola_in_jar",
    "mel-silvestre": "Honey_jar",
    "pasta-amendoim": "Peanut_butter",
    "kit-cafe-da-manha": "Jars_in_box",
    "kit-chas": "Natural_products_emporium",
  },
  floricultura: {
    "buque-rosas-vermelhas": "Red_roses_bouquet_wrapped",
    "buque-rosas-vermelhas-mesa": "Bouquet_of_red_roses",
    "buque-rosas-vermelhas-detalhe": "Red_roses_wrapped_in_paper",
    "buque-campo": "Bouquet_with_daisies",
    "buque-campo-mesa": "Flower_bouquet_on_wood_table",
    "buque-campo-detalhe": "Bouquet_of_flowers_wrapped",
    "buque-girassois": "Sunflower_bouquet_wrapped",
    "buque-girassois-mesa": "Sunflower_bouquet_on_wood",
    "buque-girassois-detalhe": "Sunflower_bouquet_in_paper",
    "arranjo-rosa-antigo": "Floral_arrangement_in_round_box",
    "arranjo-rosa-antigo-mesa": "Flower_arrangement_on_wooden",
    "arranjo-rosa-antigo-detalhe": "Flowers_in_round_box",
    "arranjo-branco-sereno": "Lilies_and_roses",
    "arranjo-branco-sereno-mesa": "Flowers_on_wooden_table",
    "arranjo-branco-sereno-detalhe": "Flower_arrangement_in_glass",
    "cesta-cafe": "Flower_shop_products_display",
    "cesta-cafe-mesa": "Flower_shop_items_on_table",
    "cesta-cafe-detalhe": "Flowers_and_basket",
    orquidea: "Orchid_in_white_ceramic",
    "orquidea-mesa": "Orchid_in_ceramic_pot",
    "orquidea-detalhe": "Orchid_flowering",
  },
  imobiliaria: {
    "hz-0142-fachada": "Single-story_house",
    "hz-0142-sala": "Living_room_and_kitchen",
    "hz-0142-quarto": "Master_bedroom",
    "hz-0157-fachada": "Exterior_view_of_residential",
    "hz-0157-sala": "Renovated_living_room_with_balcony",
    "hz-0157-quarto": "Renovated_bedroom",
    "hz-0163-fachada": "Modern_two_story_house",
    "hz-0163-sala": "Modern_living_room",
    "hz-0163-quarto": "Master_suite",
    "hz-0171-fachada": "Residential_building_photography",
    "hz-0171-sala": "Studio_apartment_interior",
    "hz-0171-quarto": "Bed_in_furnished_studio",
    "hz-0178-fachada": "Commercial_building_exterior",
    "hz-0178-sala": "Commercial_room_interior",
    "hz-0184-fachada": "Residential_tower",
    "hz-0184-sala": "Living_room_with_city_view",
    "hz-0184-quarto": "Apartment_suite_with_city_view",
    "hz-0190-fachada": "Renovated_single-story",
    "hz-0190-sala": "Renovated_living_room_interior",
    "hz-0190-quarto": "Bright_bedroom",
    "hz-0203-fachada": "House_with_swimming_pool",
    "hz-0203-sala": "Living_room_and_pool",
    "hz-0203-quarto": "Large_bedroom_with_garden",
    "hz-0211-fachada": "Residential_condominium",
    "hz-0211-sala": "Apartment_living_and_dining",
    "hz-0211-quarto": "Children_bedroom",
    "hz-0219-fachada": "Residential_building_exterior",
    "hz-0219-sala": "Living_room_in_apartment",
    "hz-0219-quarto": "Bedroom_with_made-up_bed",
    "hz-0226-fachada": "Business_center",
    "hz-0226-sala": "Modern_commercial_room",
    "hz-0232-fachada": "Townhouse_exterior",
    "hz-0232-sala": "Living_room_with_indoor_garden",
    "hz-0232-quarto": "Suite_in_house",
  },
  autonomo: {
    cafe: "Coffee_bags",
    sabonetes: "Handmade_bar_soaps",
    tenis: "Running_shoe",
    doces: "Confectionery_sweets",
    bolsas: "Leather_bag",
    serum: "Amber_glass_serum",
  },
  petshop: {
    "cao-caramelo": "Dog_wearing_red_bandana",
    "gato-cinza": "Gray_cat_wearing_bow",
    "cao-creme": "Groomed_dog_wearing_red_bow",
    "gato-preto": "Black_cat_on_towel",
  },
  servicos: {
    quadro: "Circuit_breaker_panel",
    sala: "Living_room_with_green_wall",
    painel: "Wooden_TV_panel",
    split: "Air_conditioner_installed",
    banheiro: "New_sink_plumbing",
    fachada: "Painted_single-story_house",
  },
  barbearia: {
    classico: "Haircut_in_barbershop",
    degrade: "Fade_haircut",
    barba: "Bearded_man_profile",
    texturizado: "Textured_haircut",
    raspado: "Person_with_beard_in_profile",
    topete: "Pompadour_haircut",
  },
  clinica: {
    recepcao: "Empty_modern_clinic_reception",
  },
};

// Áreas desfocadas antes de redimensionar (coordenadas no arquivo original).
const RETOQUES = {
  imobiliaria: {
    // Número "210" na fachada do sobrado.
    "hz-0232-fachada": [{ left: 895, top: 440, width: 65, height: 45 }],
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
  const ids = mapa[base]
    ? [base]
    : Object.entries(mapa)
        .filter(([, regra]) => (typeof regra === "string" ? arquivo.startsWith(regra) : regra.some((p) => t.includes(p))))
        .map(([id]) => id);
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
  let entrada = await sharp(join(origem, arquivo)).rotate().toBuffer();
  for (const area of RETOQUES[slug]?.[id] ?? []) {
    const borrado = await sharp(entrada).extract(area).blur(12).toBuffer();
    entrada = await sharp(entrada).composite([{ input: borrado, left: area.left, top: area.top }]).toBuffer();
    console.log(`  retoque em ${id}: área ${area.width}×${area.height} desfocada`);
  }
  const info = await sharp(entrada).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile(saida);
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
