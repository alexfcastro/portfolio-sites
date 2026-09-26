// Gera as capas conceituais (SVG) dos projetos sem demo em public/projects/<slug>/cover.svg.
// Projetos com demo implementada usam capturas reais (scripts/capture-screenshots.mjs na raiz).
// Composições originais: nenhuma foto, marca ou dado de empresa real.
// Uso: pnpm --filter @ax/portfolio covers
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "projects");
const W = 1600;
const H = 1000;
const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// ---------- primitivas ----------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rect = (x, y, w, h, r, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const circle = (cx, cy, r, fill, extra = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, size, fill, { weight = 400, anchor = "start", family = FONT, spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${
    spacing ? ` letter-spacing="${spacing}"` : ""
  }>${esc(s)}</text>`;
const bar = (x, y, w, fill, h = 10) => rect(x, y, w, h, h / 2, fill);
const group = (x, y, inner) => `<g transform="translate(${x} ${y})">${inner}</g>`;

function pill(x, y, label, { bg, fg, size = 15, padX = 16, h = 34, weight = 600, stroke }) {
  const w = Math.round(label.length * size * 0.56 + padX * 2);
  return (
    rect(x, y, w, h, h / 2, bg, stroke ? `stroke="${stroke}" stroke-width="1.5"` : "") +
    text(x + w / 2, y + h / 2 + size * 0.36, label, size, fg, { weight, anchor: "middle" })
  );
}

function button(x, y, w, h, label, bg, fg, size = 16, r = 10) {
  return rect(x, y, w, h, r, bg) + text(x + w / 2, y + h / 2 + size * 0.36, label, size, fg, { weight: 700, anchor: "middle" });
}

// ---------- molduras ----------
// Sombra em camadas simples, sem filtro de desfoque: bem mais barata de rasterizar
// em celulares (o filtro atrasava a exibição da capa, que é o LCP da Home).
function softShadow(x, y, w, h, r) {
  return [
    [28, 0.05],
    [18, 0.06],
    [10, 0.07],
    [4, 0.08],
  ]
    .map(([s, o]) => rect(x - s / 2, y + s, w + s, h + s / 2, r + s / 2, "#000", `opacity="${o}"`))
    .join("");
}

function browser(x, y, w, h, { frame, bar: barColor, dots, url, urlFg, content, body }) {
  const top = 44;
  return `
  ${softShadow(x, y, w, h, 18)}
  ${rect(x, y, w, h, 18, frame)}
  <g clip-path="url(#browser-clip)">
    ${rect(x, y, w, h, 18, body)}
    ${rect(x, y, w, top, 0, barColor)}
    ${circle(x + 24, y + 22, 6, dots[0])}${circle(x + 44, y + 22, 6, dots[1])}${circle(x + 64, y + 22, 6, dots[2])}
    ${rect(x + w / 2 - 170, y + 11, 340, 22, 11, url)}
    ${text(x + w / 2, y + 27, "prévia conceitual", 12, urlFg, { anchor: "middle", weight: 500 })}
    ${group(x, y + top, content)}
  </g>`;
}

function phone(x, y, { frame, screen, content }) {
  const w = 330;
  const h = 680;
  return `
  ${softShadow(x, y, w, h, 48)}
  ${rect(x, y, w, h, 48, frame)}
  ${rect(x + 12, y + 12, w - 24, h - 24, 38, screen)}
  <g clip-path="url(#phone-clip)">${group(x + 12, y + 12, content)}</g>
  ${rect(x + w / 2 - 50, y + 22, 100, 24, 12, frame)}`;
}

function svgDoc({ bg, decor = "", browserBox, phoneBox, desktop, mobile }) {
  const [bx, by, bw, bh] = browserBox;
  const [px, py] = phoneBox;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/>
    </linearGradient>
    <clipPath id="browser-clip">${rect(bx, by, bw, bh, 18, "#000")}</clipPath>
    <clipPath id="phone-clip">${rect(px + 12, py + 12, 306, 656, 38, "#000")}</clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${decor}
  ${browser(bx, by, bw, bh, desktop)}
  ${phone(px, py, mobile)}
</svg>
`;
}

const BROWSER = [70, 80, 1160, 800];
const PHONE = [1200, 230];

// ---------- 2. Clínica ----------
function clinica() {
  const c = { bg: "#f7fbfa", teal: "#1f8a7a", tealSoft: "#dff1ed", ink: "#16323a", muted: "#5d7479", line: "#d8e7e4" };
  const specialties = ["Clínica geral", "Dermatologia", "Nutrição", "Fisioterapia", "Psicologia", "Pediatria"];
  const icons = (x, y, i) => {
    const shapes = [
      `<path d="M${x - 12} ${y} h24 M${x} ${y - 12} v24" stroke="${c.teal}" stroke-width="5" stroke-linecap="round"/>`,
      circle(x, y, 11, "none", `stroke="${c.teal}" stroke-width="4"`),
      `<path d="M${x} ${y - 12} q14 12 0 24 q-14 -12 0 -24z" fill="${c.teal}"/>`,
      `<path d="M${x - 12} ${y + 8} l8 -16 l8 12 l8 -8" stroke="${c.teal}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      circle(x - 5, y, 7, c.teal) + circle(x + 6, y, 7, c.teal, 'opacity="0.55"'),
      rect(x - 11, y - 11, 22, 22, 6, "none", `stroke="${c.teal}" stroke-width="4"`),
    ];
    return shapes[i];
  };
  const cards = specialties
    .map((s, i) => {
      const x = 60 + (i % 3) * 250;
      const y = 250 + Math.floor(i / 3) * 150;
      const active = i === 1;
      return (
        rect(x, y, 230, 130, 16, active ? c.tealSoft : "#ffffff", `stroke="${active ? c.teal : c.line}" stroke-width="${active ? 2 : 1}"`) +
        circle(x + 44, y + 44, 24, active ? "#ffffff" : c.tealSoft) +
        icons(x + 44, y + 44, i) +
        text(x + 24, y + 100, s, 18, c.ink, { weight: 700 })
      );
    })
    .join("");
  const pros = [
    ["Dra. Helena M.", "Dermatologia"],
    ["Dr. Paulo R.", "Dermatologia"],
  ]
    .map(([n, s], i) => {
      const y = 250 + i * 110;
      return (
        rect(840, y, 260, 94, 14, "#ffffff", `stroke="${i === 0 ? c.teal : c.line}" stroke-width="${i === 0 ? 2 : 1}"`) +
        circle(884, y + 47, 26, i === 0 ? c.teal : c.tealSoft) +
        circle(884, y + 40, 9, i === 0 ? "#fff" : "#9cc9c0") +
        `<path d="M${868} ${y + 64} q16 -16 32 0" fill="${i === 0 ? "#fff" : "#9cc9c0"}"/>` +
        text(924, y + 42, n, 17, c.ink, { weight: 700 }) +
        text(924, y + 66, s, 14, c.muted)
      );
    })
    .join("");
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${circle(78, 58, 16, c.teal)}${`<path d="M70 58 h16 M78 50 v16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`}
    ${text(104, 66, "Vita Clínica", 24, c.ink, { weight: 700 })}
    ${text(1100, 64, "Especialidades   Equipe   Atendimento   Dúvidas", 15, c.muted, { anchor: "end" })}
    ${text(60, 160, "Qual especialidade você procura?", 32, c.ink, { weight: 700 })}
    ${text(60, 196, "Escolha a área e depois o profissional. A equipe confirma o horário com você.", 17, c.muted)}
    ${cards}
    ${text(840, 226, "Profissionais", 18, c.ink, { weight: 700 })}
    ${pros}
    ${rect(840, 480, 260, 170, 14, c.tealSoft)}
    ${text(864, 516, "Preferência de período", 15, c.ink, { weight: 700 })}
    ${pill(864, 534, "Manhã", { bg: c.teal, fg: "#fff", size: 13, h: 30 })}${pill(946, 534, "Tarde", { bg: "#fff", fg: c.ink, size: 13, h: 30 })}
    ${button(864, 590, 212, 44, "Solicitar horário", c.teal, "#fff", 15)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 84, "Vita Clínica", 20, c.ink, { weight: 700 })}
    ${text(24, 128, "Solicitar horário", 22, c.ink, { weight: 700 })}
    ${bar(24, 146, 258, c.line, 6)}${bar(24, 146, 172, c.teal, 6)}
    ${text(24, 186, "Etapa 2 de 3 · Profissional", 13, c.muted, { weight: 600 })}
    ${[0, 1, 2].map((i) => rect(24, 206 + i * 96, 258, 82, 14, "#fff", `stroke="${i === 0 ? c.teal : c.line}" stroke-width="${i === 0 ? 2 : 1}"`) + circle(64, 247 + i * 96, 22, i === 0 ? c.teal : c.tealSoft) + bar(100, 236 + i * 96, 130, "#c9dcd8", 10) + bar(100, 256 + i * 96, 86, "#e1ecea", 8)).join("")}
    ${rect(24, 506, 258, 58, 12, c.tealSoft)}
    ${text(40, 541, "Sem dados de saúde no formulário", 13, c.teal, { weight: 600 })}
    ${button(24, 582, 258, 52, "Continuar", c.teal, "#fff", 16, 12)}
  `;
  const decor = `${circle(1480, 120, 260, "#ffffff", 'opacity="0.35"')}${circle(140, 930, 200, "#ffffff", 'opacity="0.3"')}`;
  return svgDoc({
    bg: ["#e3f3ef", "#c6e4de"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#eef5f4", dots: ["#c9dcd8", "#c9dcd8", "#c9dcd8"], url: "#ffffff", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#16323a", screen: c.bg, content: mobile },
  });
}

// ---------- 3. Restaurante ----------
function restaurante() {
  const c = { bg: "#fff8ef", red: "#c43d1f", ember: "#e2562c", ink: "#2a130c", muted: "#7a5e52", line: "#f0dfcc", cream: "#fdeedd" };
  const plate = (cx, cy, r, food) =>
    circle(cx, cy, r, "#ffffff", `stroke="${c.line}" stroke-width="3"`) + circle(cx, cy, r * 0.72, food[0]) + circle(cx - r * 0.2, cy - r * 0.15, r * 0.28, food[1]) + circle(cx + r * 0.25, cy + r * 0.12, r * 0.22, food[2]);
  const dishes = [
    ["Picanha na brasa", "R$ 89,90", ["#9b3b1f", "#c9602e", "#7aa33a"]],
    ["Costela assada", "R$ 74,90", ["#8a3417", "#d8893b", "#e9c46a"]],
    ["Frango na brasa", "R$ 52,90", ["#c7792c", "#e3a347", "#6f9a37"]],
    ["Linguiça artesanal", "R$ 38,90", ["#a4401f", "#7b2a14", "#e7c16b"]],
  ];
  const menu = dishes
    .map(([n, p, food], i) => {
      const x = 60 + (i % 2) * 360;
      const y = 250 + Math.floor(i / 2) * 230;
      return (
        rect(x, y, 340, 210, 18, "#ffffff", `stroke="${c.line}"`) +
        plate(x + 80, y + 80, 56, food) +
        text(x + 160, y + 64, n, 19, c.ink, { weight: 700 }) +
        bar(x + 160, y + 82, 140, c.cream, 8) +
        bar(x + 160, y + 98, 100, c.cream, 8) +
        text(x + 160, y + 140, p, 20, c.red, { weight: 800 }) +
        button(x + 24, y + 158, 292, 36, "Adicionar", i === 0 ? c.red : c.cream, i === 0 ? "#fff" : c.red, 14, 18)
      );
    })
    .join("");
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${text(60, 70, "Sabor & Brasa", 30, c.red, { weight: 800, family: SERIF })}
    ${text(1100, 64, "Cardápio   Promoções   Horários", 15, c.muted, { anchor: "end" })}
    ${["Destaques", "Carnes", "Acompanhamentos", "Bebidas", "Sobremesas"].map((t, i) => pill(60 + [0, 128, 234, 418, 520][i], 150, t, { bg: i === 1 ? c.ink : "#fff", fg: i === 1 ? "#fff" : c.ink, size: 14, stroke: i === 1 ? undefined : c.line })).join("")}
    ${text(60, 226, "Carnes na brasa", 22, c.ink, { weight: 700 })}
    ${menu}
    ${rect(820, 150, 280, 546, 18, "#ffffff", `stroke="${c.line}"`)}
    ${text(844, 192, "Seu pedido", 20, c.ink, { weight: 800 })}
    ${[["1× Picanha na brasa", "89,90"], ["   + Farofa da casa", "6,00"], ["   + Vinagrete", "4,00"], ["2× Refrigerante lata", "14,00"]].map(([n, p], i) => text(844, 236 + i * 34, n, 15, i % 3 ? c.muted : c.ink, { weight: i % 3 ? 400 : 600 }) + text(1076, 236 + i * 34, p, 15, c.ink, { anchor: "end" })).join("")}
    ${rect(844, 380, 232, 1, 0, c.line)}
    ${text(844, 414, "Como receber", 14, c.muted, { weight: 600 })}
    ${rect(844, 426, 232, 42, 21, c.cream)}${rect(962, 430, 110, 34, 17, c.ink)}
    ${text(903, 452, "Retirada", 14, c.muted, { weight: 600, anchor: "middle" })}${text(1017, 452, "Entrega", 14, "#fff", { weight: 600, anchor: "middle" })}
    ${text(844, 540, "Total", 17, c.muted)}
    ${text(1076, 540, "R$ 113,90", 24, c.ink, { weight: 800, anchor: "end" })}
    ${button(844, 580, 232, 52, "Revisar pedido", c.red, "#fff", 16, 26)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 84, "Sabor & Brasa", 22, c.red, { weight: 800, family: SERIF })}
    ${plate(153, 190, 84, ["#9b3b1f", "#c9602e", "#7aa33a"])}
    ${text(24, 310, "Picanha na brasa", 20, c.ink, { weight: 800 })}
    ${text(24, 334, "Adicionais", 14, c.muted, { weight: 600 })}
    ${["Farofa da casa", "Vinagrete", "Arroz biro-biro"].map((t, i) => rect(24, 350 + i * 50, 258, 42, 10, "#fff", `stroke="${c.line}"`) + rect(38, 363 + i * 50, 16, 16, 4, i < 2 ? c.red : "#fff", `stroke="${c.red}" stroke-width="2"`) + text(66, 377 + i * 50, t, 14, c.ink) + text(268, 377 + i * 50, ["+6,00", "+4,00", "+9,00"][i], 13, c.muted, { anchor: "end" })).join("")}
    ${button(24, 574, 258, 54, "Adicionar · R$ 99,90", c.red, "#fff", 15, 27)}
  `;
  const decor = `
    <g opacity="0.25">${[120, 260, 400].map((x, i) => `<path d="M${x} 1000 q${40 - i * 10} -120 0 -200 q-40 -60 10 -140" stroke="#ff8a4c" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("")}</g>
    ${circle(1450, 110, 180, "#ff8a4c", 'opacity="0.18"')}`;
  return svgDoc({
    bg: ["#3a110a", "#7a2410"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#f7ebdd", dots: ["#e8cdb2", "#e8cdb2", "#e8cdb2"], url: "#fff8ef", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#1d0a05", screen: c.bg, content: mobile },
  });
}

// ---------- 4. Oficina ----------
function oficina() {
  const c = { bg: "#f4f5f7", dark: "#1c1f24", orange: "#f28c28", ink: "#1c1f24", muted: "#646b76", line: "#dfe2e7" };
  const car = (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M20 90 L50 40 Q60 26 80 26 L200 26 Q222 26 236 42 L270 80 L320 90 Q340 94 340 112 L340 130 L20 130 Z" fill="${color}"/>
      <path d="M70 44 L96 44 L96 80 L48 80 Z M110 44 L196 44 Q208 44 216 54 L234 80 L110 80 Z" fill="#cfd6df"/>
      ${circle(90, 132, 30, "#1c1f24")}${circle(90, 132, 13, "#9aa3ae")}
      ${circle(270, 132, 30, "#1c1f24")}${circle(270, 132, 13, "#9aa3ae")}
    </g>`;
  const steps = ["Veículo", "Problema", "Fotos", "Resumo"];
  const stepper = steps
    .map((s, i) => {
      const x = 60 + i * 180;
      const done = i < 2;
      return (
        circle(x + 18, 190, 18, done ? c.orange : "#fff", `stroke="${done ? c.orange : c.line}" stroke-width="2"`) +
        text(x + 18, 196, String(i + 1), 15, done ? "#fff" : c.muted, { weight: 700, anchor: "middle" }) +
        text(x + 46, 196, s, 16, done ? c.ink : c.muted, { weight: 600 }) +
        (i < 3 ? rect(x + 132, 189, 36, 2, 1, c.line) : "")
      );
    })
    .join("");
  const problems = ["Freios", "Suspensão", "Motor", "Elétrica", "Ar-condicionado", "Revisão"];
  const probs = problems
    .map((p, i) => {
      const x = 60 + (i % 3) * 230;
      const y = 300 + Math.floor(i / 3) * 84;
      const active = i === 0;
      return rect(x, y, 214, 68, 12, active ? "#fff4e8" : "#fff", `stroke="${active ? c.orange : c.line}" stroke-width="${active ? 2 : 1}"`) + text(x + 22, y + 42, p, 18, c.ink, { weight: 600 });
    })
    .join("");
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${rect(0, 0, 1160, 104, 0, c.dark)}
    ${text(60, 66, "TORQUE", 28, "#fff", { weight: 900, spacing: 3 })}
    ${text(212, 66, "AUTO CENTER", 15, c.orange, { weight: 700, spacing: 3 })}
    ${text(1100, 62, "Serviços   Orçamento   Acompanhamento", 15, "#aab1bb", { anchor: "end" })}
    ${stepper}
    ${text(60, 272, "Qual é o problema?", 26, c.ink, { weight: 800 })}
    ${probs}
    ${text(60, 510, "Descreva o que está acontecendo", 16, c.ink, { weight: 700 })}
    ${rect(60, 526, 674, 120, 12, "#fff", `stroke="${c.line}"`)}
    ${bar(84, 556, 420, "#e6e9ee", 10)}${bar(84, 578, 360, "#e6e9ee", 10)}${bar(84, 600, 240, "#e6e9ee", 10)}
    ${rect(790, 150, 310, 546, 16, "#fff", `stroke="${c.line}"`)}
    ${rect(790, 150, 310, 200, 16, "#eef1f5")}
    ${car(810, 190, 0.8, c.orange)}
    ${text(814, 392, "Seu veículo", 14, c.muted, { weight: 600 })}
    ${text(814, 420, "Hatch 1.0 · 2019", 20, c.ink, { weight: 800 })}
    ${text(814, 446, "58.000 km aproximados", 15, c.muted)}
    ${rect(814, 470, 262, 1, 0, c.line)}
    ${text(814, 504, "Problema: Freios", 16, c.ink, { weight: 600 })}
    ${text(814, 530, "Ruído ao frear em baixa velocidade", 14, c.muted)}
    ${button(814, 610, 262, 52, "Continuar para fotos", c.orange, c.dark, 16)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${rect(0, 0, 306, 110, 0, c.dark)}
    ${text(24, 88, "TORQUE", 20, "#fff", { weight: 900, spacing: 2 })}
    ${text(24, 150, "Fotos do problema", 20, c.ink, { weight: 800 })}
    ${text(24, 174, "Prévia local — nada é enviado", 13, c.muted)}
    ${[0, 1, 2, 3].map((i) => rect(24 + (i % 2) * 132, 194 + Math.floor(i / 2) * 132, 124, 120, 12, i < 3 ? "#dde2e9" : "#fff", i < 3 ? "" : `stroke="${c.line}" stroke-dasharray="6 6" stroke-width="2"`) + (i < 3 ? `<path d="M${40 + (i % 2) * 132} ${290 + Math.floor(i / 2) * 132} l30 -34 l22 22 l16 -14 l26 26 z" fill="#b7c0cc"/>` + circle(118 + (i % 2) * 132, 226 + Math.floor(i / 2) * 132, 10, "#c9d0da") : text(86 + (i % 2) * 132, 262 + Math.floor(i / 2) * 132, "+", 34, c.orange, { weight: 700, anchor: "middle" }))).join("")}
    ${text(24, 488, "3 de 4 fotos · até 5 MB cada", 13, c.muted, { weight: 600 })}
    ${button(24, 574, 258, 54, "Revisar orçamento", c.orange, c.dark, 16, 12)}
  `;
  const decor = `
    <g opacity="0.1" fill="none" stroke="#f28c28" stroke-width="3">
      ${circle(1460, 140, 150, "none")}${circle(1460, 140, 100, "none")}${circle(1460, 140, 50, "none")}
    </g>
    <g opacity="0.07">${Array.from({ length: 20 }, (_, i) => rect(i * 90, 950, 50, 50, 0, "#f28c28", `transform="skewX(-30)"`)).join("")}</g>`;
  return svgDoc({
    bg: ["#16181c", "#353b45"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#e8ebef", dots: ["#c3c9d1", "#c3c9d1", "#c3c9d1"], url: "#ffffff", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#0d0f12", screen: c.bg, content: mobile },
  });
}

// ---------- 5. Serviços ----------
function servicos() {
  const c = { bg: "#ffffff", petrol: "#0f4c55", yellow: "#f5c542", ink: "#0f2d33", muted: "#5b7075", line: "#dbe6e7", soft: "#eef5f5" };
  const glyph = (x, y, i) =>
    [
      `<path d="M${x + 4} ${y - 14} l-12 16 h10 l-6 14 l14 -18 h-10 z" fill="${c.petrol}"/>`,
      rect(x - 12, y - 14, 18, 24, 3, c.petrol) + rect(x + 6, y - 6, 8, 20, 2, c.yellow),
      circle(x, y, 12, "none", `stroke="${c.petrol}" stroke-width="5" stroke-dasharray="7 4"`),
      `<path d="M${x - 14} ${y - 6} h28 M${x - 14} ${y + 2} h28 M${x - 14} ${y + 10} h28" stroke="${c.petrol}" stroke-width="4" stroke-linecap="round"/>`,
      `<path d="M${x - 14} ${y + 12} l14 -26 l14 26 z" fill="none" stroke="${c.petrol}" stroke-width="4" stroke-linejoin="round"/>`,
    ][i];
  const services = ["Elétrica", "Pintura", "Manutenção", "Ar-condicionado", "Instalação"];
  const tiles = services
    .map((s, i) => {
      const x = 60 + i * 206;
      const active = i === 3;
      return (
        rect(x, 250, 190, 150, 16, active ? "#fff8e1" : "#fff", `stroke="${active ? c.yellow : c.line}" stroke-width="${active ? 3 : 1}"`) +
        circle(x + 50, 300, 28, active ? c.yellow : c.soft) +
        glyph(x + 50, 300, i) +
        text(x + 24, 370, s, 17, c.ink, { weight: 700 })
      );
    })
    .join("");
  const map = `
    ${rect(60, 450, 560, 240, 16, "#e4eeee")}
    <g stroke="#c8d8d9" stroke-width="10" fill="none" stroke-linecap="round">
      <path d="M60 540 Q220 500 320 560 T620 520"/><path d="M200 450 Q240 580 190 690"/><path d="M430 450 Q470 560 520 690"/>
    </g>
    <path d="M150 480 Q300 450 420 500 Q560 540 540 630 Q420 690 260 660 Q120 630 150 480 z" fill="${c.petrol}" opacity="0.14" stroke="${c.petrol}" stroke-width="2" stroke-dasharray="8 6"/>
    ${text(80, 482, "Área atendida (ilustrativa)", 14, c.petrol, { weight: 700 })}
    ${circle(340, 575, 12, c.yellow, `stroke="${c.petrol}" stroke-width="4"`)}`;
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${rect(60, 44, 36, 36, 10, c.petrol)}${`<path d="M70 62 l6 6 l12 -14" stroke="${c.yellow}" stroke-width="4" fill="none" stroke-linecap="round"/>`}
    ${text(108, 70, "Resolve Serviços", 24, c.ink, { weight: 800 })}
    ${text(1100, 66, "Serviços   Trabalhos   Região   Contato", 15, c.muted, { anchor: "end" })}
    ${text(60, 170, "Que serviço você precisa?", 32, c.ink, { weight: 800 })}
    ${text(60, 208, "Escolha o tipo, confirme a região e descreva o problema.", 17, c.muted)}
    ${tiles}
    ${map}
    ${rect(660, 450, 440, 240, 16, c.soft)}
    ${text(684, 490, "Seu endereço está na área atendida?", 17, c.ink, { weight: 700 })}
    ${rect(684, 510, 392, 50, 10, "#fff", `stroke="${c.line}"`)}${text(704, 541, "Bairro ou CEP", 15, "#98a8ab")}
    ${rect(684, 578, 392, 44, 10, "#e3f3ea")}${text(704, 606, "✓ Atendemos esta região", 15, "#1b7a4b", { weight: 700 })}
    ${button(684, 634, 392, 44, "Descrever o problema", c.petrol, "#fff", 15)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${rect(0, 0, 306, 120, 0, c.petrol)}
    ${text(24, 90, "Resolve Serviços", 20, "#fff", { weight: 800 })}
    ${text(24, 160, "Ar-condicionado", 21, c.ink, { weight: 800 })}
    ${text(24, 186, "Conte o que está acontecendo", 14, c.muted)}
    ${["Não gela", "Pingando água", "Barulho", "Instalação"].map((t, i) => pill(24 + (i % 2) * 132, 206 + Math.floor(i / 2) * 48, t, { bg: i === 1 ? c.petrol : c.soft, fg: i === 1 ? "#fff" : c.ink, size: 13, h: 36 })).join("")}
    ${rect(24, 316, 258, 110, 12, "#fff", `stroke="${c.line}"`)}
    ${bar(40, 342, 190, "#e2eaeb", 9)}${bar(40, 362, 150, "#e2eaeb", 9)}${bar(40, 382, 110, "#e2eaeb", 9)}
    ${text(24, 458, "Melhor período para visita", 14, c.ink, { weight: 700 })}
    ${["Manhã", "Tarde", "Sábado"].map((t, i) => pill(24 + i * 88, 472, t, { bg: i === 0 ? c.yellow : "#fff", fg: c.ink, size: 13, h: 34, stroke: i === 0 ? undefined : c.line })).join("")}
    ${button(24, 574, 258, 54, "Enviar solicitação", c.petrol, "#fff", 16, 12)}
  `;
  const decor = `${rect(1280, -60, 400, 400, 60, "#f5c542", 'opacity="0.18" transform="rotate(20 1480 140)"')}${circle(120, 940, 160, "#f5c542", 'opacity="0.12"')}`;
  return svgDoc({
    bg: ["#0c3a41", "#17656a"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#eef4f4", dots: ["#c6d6d8", "#c6d6d8", "#c6d6d8"], url: "#ffffff", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#072a2f", screen: c.bg, content: mobile },
  });
}

// ---------- 6. Autônomo ----------
function autonomo() {
  const c = { bg: "#fbf8f2", ink: "#23201c", terra: "#b5563a", muted: "#6f675c", line: "#e7dfd1", sand: "#efe6d6" };
  const art = (x, y, w, h, i) => {
    const palettes = [
      ["#d9c6a5", "#b5563a", "#23201c"],
      ["#c9d3c0", "#5f7a5b", "#23201c"],
      ["#e6d0c4", "#23201c", "#b5563a"],
      ["#d2d6de", "#3d4a63", "#e0b66b"],
    ][i];
    return (
      rect(x, y, w, h, 12, palettes[0]) +
      [
        circle(x + w * 0.62, y + h * 0.42, h * 0.26, palettes[1]) + rect(x, y + h * 0.7, w, h * 0.3, 0, palettes[2], `opacity="0.85"`),
        `<path d="M${x} ${y + h} L${x + w * 0.4} ${y + h * 0.35} L${x + w * 0.65} ${y + h * 0.7} L${x + w * 0.8} ${y + h * 0.5} L${x + w} ${y + h} Z" fill="${palettes[1]}"/>`,
        rect(x + w * 0.2, y + h * 0.2, w * 0.35, h * 0.6, 4, palettes[1]) + rect(x + w * 0.45, y + h * 0.35, w * 0.35, h * 0.45, 4, palettes[2], 'opacity="0.8"'),
        circle(x + w * 0.35, y + h * 0.5, h * 0.22, palettes[1]) + circle(x + w * 0.6, y + h * 0.5, h * 0.22, palettes[2], 'opacity="0.85"'),
      ][i]
    );
  };
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${text(60, 70, "Linha Direta", 26, c.ink, { weight: 800, family: SERIF })}
    ${text(238, 70, "Profissional", 26, c.terra, { weight: 400, family: SERIF })}
    ${text(1100, 66, "Sobre   Serviços   Portfólio   Proposta", 15, c.muted, { anchor: "end" })}
    ${circle(170, 250, 90, c.sand)}${circle(170, 228, 34, "#c9b79a")}${`<path d="M110 312 q60 -70 120 0" fill="#c9b79a"/>`}
    ${text(300, 206, "Fotografia de produto", 15, c.terra, { weight: 700, spacing: 2 })}
    ${text(300, 250, "Imagens que ajudam", 38, c.ink, { weight: 700, family: SERIF })}
    ${text(300, 294, "pequenas marcas a vender.", 38, c.ink, { weight: 700, family: SERIF })}
    ${text(300, 334, "Atendimento individual, do planejamento à entrega.", 17, c.muted)}
    ${pill(60, 380, "Todos", { bg: c.ink, fg: "#fff", size: 14 })}${pill(150, 380, "Alimentos", { bg: "#fff", fg: c.ink, size: 14, stroke: c.line })}${pill(276, 380, "Moda", { bg: "#fff", fg: c.ink, size: 14, stroke: c.line })}${pill(366, 380, "Cosméticos", { bg: "#fff", fg: c.ink, size: 14, stroke: c.line })}
    ${art(60, 440, 250, 250, 0)}${art(326, 440, 250, 250, 1)}${art(592, 440, 250, 250, 2)}
    ${rect(870, 190, 230, 500, 16, "#fff", `stroke="${c.line}"`)}
    ${text(894, 230, "Pedir proposta", 20, c.ink, { weight: 800 })}
    ${["Tipo de trabalho", "Quantidade de fotos", "Prazo desejado", "Faixa de investimento"].map((l, i) => text(894, 274 + i * 84, l, 13, c.muted, { weight: 600 }) + rect(894, 284 + i * 84, 182, 40, 8, c.bg, `stroke="${c.line}"`)).join("")}
    ${button(894, 624, 182, 46, "Solicitar", c.terra, "#fff", 15, 23)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 84, "Linha Direta", 20, c.ink, { weight: 800, family: SERIF })}
    ${circle(62, 138, 38, c.sand)}${circle(62, 128, 14, "#c9b79a")}${`<path d="M38 164 q24 -30 48 0" fill="#c9b79a"/>`}
    ${text(116, 132, "Fotografia", 16, c.ink, { weight: 700 })}
    ${text(116, 154, "de produto", 16, c.ink, { weight: 700 })}
    ${art(24, 196, 124, 124, 3)}${art(158, 196, 124, 124, 0)}${art(24, 330, 124, 124, 1)}${art(158, 330, 124, 124, 2)}
    ${text(24, 494, "Como funciona", 15, c.ink, { weight: 700 })}
    ${bar(24, 510, 230, c.line, 9)}${bar(24, 528, 180, c.line, 9)}
    ${button(24, 574, 258, 54, "Pedir proposta", c.terra, "#fff", 16, 27)}
  `;
  const decor = `
    <g stroke="#23201c" stroke-width="2" fill="none" opacity="0.12">
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${1300 + i * 30} 0 v1000"/>`).join("")}
    </g>
    ${circle(140, 900, 220, "#b5563a", 'opacity="0.12"')}`;
  return svgDoc({
    bg: ["#efe6d6", "#dccbb0"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#f4eee3", dots: ["#ddd1bd", "#ddd1bd", "#ddd1bd"], url: "#fbf8f2", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#23201c", screen: c.bg, content: mobile },
  });
}

// ---------- 7. Advocacia ----------
function advocacia() {
  const c = { bg: "#faf7f0", navy: "#132343", brass: "#b89b5e", ink: "#132343", muted: "#5d6679", line: "#e4ddcd" };
  const areas = ["Direito de Família", "Direito do Trabalho", "Direito do Consumidor", "Direito Imobiliário", "Sucessões e Inventário", "Direito Empresarial"];
  const list = areas
    .map((a, i) => {
      const x = 60 + (i % 2) * 380;
      const y = 400 + Math.floor(i / 2) * 96;
      return rect(x, y, 360, 80, 4, "#fff", `stroke="${c.line}"`) + rect(x, y, 4, 80, 0, c.brass) + text(x + 28, y + 36, a, 18, c.ink, { weight: 600, family: SERIF }) + text(x + 28, y + 60, "Saiba mais →", 13, c.brass, { weight: 600 });
    })
    .join("");
  const pillars = `
    <g fill="${c.brass}" opacity="0.9">
      ${rect(0, 0, 150, 12, 1, c.brass)}${`<path d="M-6 0 L75 -40 L156 0 Z" fill="${c.brass}"/>`}
      ${[12, 52, 92, 126].map((x) => rect(x, 20, 12, 90, 1, c.brass)).join("")}
      ${rect(-6, 114, 162, 12, 1, c.brass)}
    </g>`;
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${rect(0, 0, 1160, 330, 0, c.navy)}
    ${text(60, 70, "ALMEIDA & PRADO", 22, "#fff", { weight: 600, family: SERIF, spacing: 4 })}
    ${text(60, 94, "ADVOCACIA", 12, c.brass, { weight: 600, spacing: 6 })}
    ${text(1100, 70, "O escritório   Áreas   Equipe   Artigos   Contato", 15, "#b7c0d4", { anchor: "end" })}
    ${text(60, 200, "Orientação jurídica clara,", 42, "#fff", { weight: 400, family: SERIF })}
    ${text(60, 252, "com atenção a cada caso.", 42, "#fff", { weight: 400, family: SERIF })}
    ${button(60, 276, 250, 42, "Agendar conversa inicial", c.brass, c.navy, 14, 2)}
    ${group(920, 170, pillars)}
    ${text(60, 380, "Áreas de atuação", 22, c.ink, { weight: 700, family: SERIF })}
    ${list}
    ${rect(840, 380, 260, 310, 4, "#fff", `stroke="${c.line}"`)}
    ${text(864, 416, "Artigos recentes", 16, c.ink, { weight: 700, family: SERIF })}
    ${[0, 1, 2].map((i) => text(864, 452 + i * 76, ["Família", "Consumidor", "Trabalho"][i].toUpperCase(), 11, c.brass, { weight: 700, spacing: 2 }) + bar(864, 464 + i * 76, 210, "#e6e1d5", 9) + bar(864, 482 + i * 76, 150, "#efebe2", 8)).join("")}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${rect(0, 0, 306, 250, 0, c.navy)}
    ${text(24, 88, "ALMEIDA & PRADO", 15, "#fff", { weight: 600, family: SERIF, spacing: 2 })}
    ${text(24, 150, "Direito de", 28, "#fff", { family: SERIF })}
    ${text(24, 186, "Família", 28, "#fff", { family: SERIF })}
    ${rect(24, 208, 60, 3, 0, c.brass)}
    ${bar(24, 284, 250, "#e6e1d5", 9)}${bar(24, 304, 230, "#e6e1d5", 9)}${bar(24, 324, 190, "#e6e1d5", 9)}
    ${text(24, 376, "Perguntas frequentes", 16, c.ink, { weight: 700, family: SERIF })}
    ${[0, 1, 2].map((i) => rect(24, 392 + i * 52, 258, 44, 3, "#fff", `stroke="${c.line}"`) + bar(40, 410 + i * 52, 170, "#e6e1d5", 8) + text(266, 420 + i * 52, "+", 18, c.brass, { anchor: "end", weight: 700 })).join("")}
    ${button(24, 574, 258, 50, "Solicitar conversa inicial", c.navy, "#fff", 14, 2)}
  `;
  const decor = `<g opacity="0.14" stroke="#b89b5e" fill="none" stroke-width="1.5">${Array.from({ length: 12 }, (_, i) => circle(1500, 880, 60 + i * 45, "none")).join("")}</g>`;
  return svgDoc({
    bg: ["#0d182f", "#22355c"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#f1ede3", dots: ["#d8d0bd", "#d8d0bd", "#d8d0bd"], url: "#faf7f0", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#0a1223", screen: c.bg, content: mobile },
  });
}

// ---------- 8. Imobiliária ----------
function imobiliaria() {
  const c = { bg: "#ffffff", blue: "#1f5fbf", ink: "#10233f", muted: "#5a6b82", line: "#dde5f0", soft: "#eef3fa" };
  const house = (x, y, w, h, i) => {
    const skies = [["#bcd6f5", "#e8f1fc"], ["#f6d6b8", "#fcefe3"], ["#cfe5d4", "#eef7f0"], ["#d8d2f0", "#f1eefb"]][i];
    const body = ["#f4f1ea", "#fbfaf7", "#ece8df", "#f7f4ee"][i];
    const roof = ["#2d4a73", "#b0553a", "#4f6b4a", "#5b4f86"][i];
    return `
      <defs><linearGradient id="sky${i}${x}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skies[0]}"/><stop offset="1" stop-color="${skies[1]}"/></linearGradient></defs>
      ${rect(x, y, w, h, 12, `url(#sky${i}${x})`)}
      ${rect(x, y + h * 0.82, w, h * 0.18, 0, "#9fc38a")}
      ${rect(x + w * 0.22, y + h * 0.42, w * 0.56, h * 0.42, 2, body)}
      <path d="M${x + w * 0.16} ${y + h * 0.44} L${x + w * 0.5} ${y + h * 0.16} L${x + w * 0.84} ${y + h * 0.44} Z" fill="${roof}"/>
      ${rect(x + w * 0.3, y + h * 0.52, w * 0.12, h * 0.1, 2, "#8fb3dc")}${rect(x + w * 0.58, y + h * 0.52, w * 0.12, h * 0.1, 2, "#8fb3dc")}
      ${rect(x + w * 0.45, y + h * 0.64, w * 0.1, h * 0.2, 2, roof)}`;
  };
  const listings = [
    ["Casa · 3 quartos", "Jardim das Flores", "R$ 640.000"],
    ["Casa · 2 quartos", "Vila Nova", "R$ 2.300/mês"],
    ["Casa · 4 quartos", "Parque do Lago", "R$ 890.000"],
  ]
    .map(([t, b, p], i) => {
      const x = 380 + i * 250;
      return (
        rect(x, 250, 234, 330, 14, "#fff", `stroke="${c.line}"`) +
        house(x, 250, 234, 160, i) +
        circle(x + 206, 278, 16, "#ffffff", 'opacity="0.95"') +
        `<path d="M${x + 206} ${287} l-8 -8 a5 5 0 0 1 8 -6 a5 5 0 0 1 8 6 z" fill="${i === 0 ? "#e0455b" : "none"}" stroke="#e0455b" stroke-width="2"/>` +
        text(x + 18, 444, p, 20, c.ink, { weight: 800 }) +
        text(x + 18, 470, t, 15, c.ink, { weight: 600 }) +
        text(x + 18, 494, b, 14, c.muted) +
        rect(x + 18, 516, 198, 1, 0, c.line) +
        text(x + 18, 548, "Ver detalhes →", 14, c.blue, { weight: 700 })
      );
    })
    .join("");
  const filters = `
    ${rect(60, 250, 290, 440, 14, c.soft)}
    ${text(84, 290, "Filtros", 18, c.ink, { weight: 800 })}
    ${rect(84, 308, 242, 40, 20, "#fff")}${rect(88, 312, 118, 32, 16, c.blue)}${text(147, 333, "Comprar", 14, "#fff", { weight: 700, anchor: "middle" })}${text(266, 333, "Alugar", 14, c.muted, { weight: 600, anchor: "middle" })}
    ${text(84, 384, "Tipo", 13, c.muted, { weight: 700 })}
    ${pill(84, 394, "Casa", { bg: c.ink, fg: "#fff", size: 13, h: 30 })}${pill(162, 394, "Apartamento", { bg: "#fff", fg: c.ink, size: 13, h: 30 })}
    ${text(84, 456, "Faixa de preço", 13, c.muted, { weight: 700 })}
    ${rect(84, 474, 242, 6, 3, "#cfdbeb")}${rect(124, 474, 140, 6, 3, c.blue)}${circle(124, 477, 10, "#fff", `stroke="${c.blue}" stroke-width="3"`)}${circle(264, 477, 10, "#fff", `stroke="${c.blue}" stroke-width="3"`)}
    ${text(84, 530, "Quartos", 13, c.muted, { weight: 700 })}
    ${["1+", "2+", "3+", "4+"].map((q, i) => rect(84 + i * 60, 542, 52, 38, 8, i === 2 ? c.blue : "#fff") + text(110 + i * 60, 566, q, 14, i === 2 ? "#fff" : c.ink, { weight: 700, anchor: "middle" })).join("")}
    ${text(84, 640, "28 imóveis encontrados", 14, c.ink, { weight: 700 })}`;
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${`<path d="M60 76 l20 -26 l20 26 z" fill="${c.blue}"/>`}${rect(64, 72, 32, 8, 2, c.blue)}
    ${text(112, 76, "Horizonte Imóveis", 24, c.ink, { weight: 800 })}
    ${text(1100, 70, "Comprar   Alugar   Anunciar   Corretores", 15, c.muted, { anchor: "end" })}
    ${rect(60, 130, 1040, 80, 16, c.soft)}
    ${rect(80, 146, 700, 48, 10, "#fff")}${text(104, 176, "Bairro, cidade ou código do imóvel", 16, "#98a6b8")}
    ${button(800, 146, 280, 48, "Buscar imóveis", c.blue, "#fff", 16)}
    ${filters}
    ${listings}
    ${rect(380, 600, 734, 90, 14, c.soft)}
    ${text(404, 640, "Gostou de um imóvel?", 17, c.ink, { weight: 800 })}
    ${text(404, 666, "O formulário de interesse já leva o código do imóvel.", 14, c.muted)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${house(0, 0, 306, 260, 0)}
    ${pill(20, 60, "Cód. HZ-0142", { bg: "#ffffff", fg: c.ink, size: 12, h: 28 })}
    ${text(24, 300, "R$ 640.000", 24, c.ink, { weight: 800 })}
    ${text(24, 326, "Casa · Jardim das Flores", 15, c.muted)}
    ${["3 quartos", "2 vagas", "180 m²"].map((t, i) => pill(24 + i * 90, 346, t, { bg: c.soft, fg: c.ink, size: 12, h: 30, padX: 12 })).join("")}
    ${text(24, 416, "Localização ilustrativa", 13, c.muted, { weight: 700 })}
    ${rect(24, 428, 258, 120, 12, "#e7eef7")}${`<path d="M24 490 Q120 470 180 500 T282 480" stroke="#cdd9ea" stroke-width="10" fill="none"/>`}${circle(150, 488, 10, c.blue, 'stroke="#fff" stroke-width="4"')}
    ${button(24, 574, 258, 54, "Tenho interesse", c.blue, "#fff", 16, 12)}
  `;
  const decor = `${circle(1470, 150, 220, "#ffffff", 'opacity="0.4"')}${`<path d="M0 900 Q400 820 800 900 T1600 880 V1000 H0 Z" fill="#ffffff" opacity="0.35"/>`}`;
  return svgDoc({
    bg: ["#d6e6f8", "#a9c9ee"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#eef3fa", dots: ["#cad6e6", "#cad6e6", "#cad6e6"], url: "#ffffff", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#10233f", screen: c.bg, content: mobile },
  });
}

// ---------- 9. Pet shop ----------
function petshop() {
  const c = { bg: "#fffaf5", coral: "#e8664a", ink: "#3b2320", muted: "#7c625c", line: "#f3dfd3", soft: "#fdebe2", teal: "#3fa39a" };
  const dog = (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="60" rx="70" ry="44" fill="${color}"/>
      ${circle(-40, -10, 46, color)}
      <ellipse cx="-80" cy="-20" rx="16" ry="30" fill="#7a4a3a" transform="rotate(20 -80 -20)"/>
      <ellipse cx="-2" cy="-24" rx="16" ry="30" fill="#7a4a3a" transform="rotate(-20 -2 -24)"/>
      ${circle(-54, -14, 6, "#3b2320")}${circle(-26, -14, 6, "#3b2320")}
      <ellipse cx="-40" cy="8" rx="11" ry="8" fill="#3b2320"/>
    </g>`;
  const cat = (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="56" rx="54" ry="42" fill="${color}"/>
      ${circle(0, -6, 40, color)}
      <path d="M-34 -24 L-28 -62 L-8 -38 Z M34 -24 L28 -62 L8 -38 Z" fill="${color}"/>
      ${circle(-14, -8, 5, "#3b2320")}${circle(14, -8, 5, "#3b2320")}
      <path d="M-6 8 l6 5 l6 -5" stroke="#3b2320" stroke-width="3" fill="none"/>
    </g>`;
  const sizes = ["Pequeno", "Médio", "Grande"];
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${circle(78, 58, 18, c.coral)}${circle(72, 52, 4, "#fff")}${circle(84, 52, 4, "#fff")}${circle(78, 64, 5, "#fff")}
    ${text(106, 68, "PetVille", 26, c.ink, { weight: 800 })}
    ${text(1100, 64, "Banho e tosa   Serviços   Pacotes   Dúvidas", 15, c.muted, { anchor: "end" })}
    ${rect(60, 120, 1040, 190, 24, c.soft)}
    ${text(100, 186, "Agende o banho e tosa", 34, c.ink, { weight: 800 })}
    ${text(100, 222, "Conte sobre o seu pet e veja só os horários que servem para ele.", 17, c.muted)}
    ${button(100, 244, 210, 46, "Começar agendamento", c.coral, "#fff", 15, 23)}
    ${dog(880, 210, 1, "#d9a066")}${cat(1010, 220, 0.9, "#9aa4ad")}
    ${text(60, 364, "1. Sobre o pet", 20, c.ink, { weight: 800 })}
    ${text(60, 400, "Nome", 13, c.muted, { weight: 700 })}${rect(60, 410, 320, 48, 12, "#fff", `stroke="${c.line}"`)}${text(80, 441, "Tobias", 16, c.ink, { weight: 600 })}
    ${text(60, 490, "Espécie", 13, c.muted, { weight: 700 })}
    ${pill(60, 500, "Cachorro", { bg: c.coral, fg: "#fff", size: 14 })}${pill(176, 500, "Gato", { bg: "#fff", fg: c.ink, size: 14, stroke: c.line })}
    ${text(60, 570, "Porte", 13, c.muted, { weight: 700 })}
    ${sizes.map((s, i) => rect(60 + i * 110, 580, 100, 90, 14, i === 1 ? "#fff3ee" : "#fff", `stroke="${i === 1 ? c.coral : c.line}" stroke-width="${i === 1 ? 2 : 1}"`) + circle(110 + i * 110, 612, 8 + i * 5, i === 1 ? c.coral : "#e7cfc4") + text(110 + i * 110, 654, s, 14, c.ink, { weight: 600, anchor: "middle" })).join("")}
    ${text(440, 364, "2. Serviço", 20, c.ink, { weight: 800 })}
    ${[["Banho", "60 min"], ["Banho e tosa higiênica", "90 min"], ["Banho e tosa completa", "120 min"]].map(([s, d], i) => rect(440, 390 + i * 92, 320, 78, 14, "#fff", `stroke="${i === 1 ? c.coral : c.line}" stroke-width="${i === 1 ? 2 : 1}"`) + text(464, 424 + i * 92, s, 16, c.ink, { weight: 700 }) + text(464, 448 + i * 92, `${d} · porte médio`, 13, c.muted)).join("")}
    ${rect(800, 364, 300, 306, 18, "#fff", `stroke="${c.line}"`)}
    ${text(824, 404, "Resumo", 18, c.ink, { weight: 800 })}
    ${["Pet: Tobias (médio)", "Banho e tosa higiênica", "Qua, 19/03 · 10:30"].map((t, i) => text(824, 444 + i * 30, t, 15, i ? c.muted : c.ink, { weight: i ? 400 : 600 })).join("")}
    ${rect(824, 540, 252, 44, 10, "#e8f5f3")}${text(840, 568, "Lembrete: preparado para integração", 13, c.teal, { weight: 600 })}
    ${button(824, 600, 252, 48, "Confirmar", c.coral, "#fff", 16, 24)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 84, "PetVille", 22, c.ink, { weight: 800 })}
    ${rect(24, 104, 258, 150, 20, c.soft)}
    ${dog(150, 170, 0.62, "#d9a066")}
    ${text(24, 290, "Qual o porte do Tobias?", 18, c.ink, { weight: 800 })}
    ${sizes.map((s, i) => rect(24, 308 + i * 64, 258, 54, 12, i === 1 ? "#fff3ee" : "#fff", `stroke="${i === 1 ? c.coral : c.line}" stroke-width="${i === 1 ? 2 : 1}"`) + text(44, 341 + i * 64, s, 15, c.ink, { weight: 600 }) + text(266, 341 + i * 64, ["até 10 kg", "10 a 25 kg", "acima de 25 kg"][i], 12, c.muted, { anchor: "end" })).join("")}
    ${button(24, 574, 258, 54, "Escolher serviço", c.coral, "#fff", 16, 27)}
  `;
  const decor = `<g fill="#e8664a" opacity="0.12">${[[120, 140], [260, 900], [1480, 120], [1420, 900], [700, 960]].map(([x, y]) => circle(x, y, 26, "#e8664a") + circle(x - 30, y - 34, 11, "#e8664a") + circle(x - 8, y - 46, 11, "#e8664a") + circle(x + 18, y - 42, 11, "#e8664a") + circle(x + 34, y - 22, 11, "#e8664a")).join("")}</g>`;
  return svgDoc({
    bg: ["#fde3d7", "#f9c7b2"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#fbeee6", dots: ["#efd3c5", "#efd3c5", "#efd3c5"], url: "#fffaf5", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#3b2320", screen: c.bg, content: mobile },
  });
}

// ---------- 10. Academia ----------
function academia() {
  const c = { bg: "#0f1112", panel: "#181b1d", line: "#2a2e31", lime: "#c6f432", text: "#f2f5ea", muted: "#8e968f" };
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const classes = [
    [0, 0, "Funcional"], [1, 1, "Pilates"], [2, 0, "Funcional"], [3, 2, "Dança"], [4, 0, "Funcional"],
    [0, 2, "Força"], [2, 1, "Pilates"], [4, 2, "Força"], [5, 0, "Funcional"], [1, 3, "Dança"], [3, 3, "Pilates"], [5, 1, "Força"],
  ];
  const grid = `
    ${days.map((d, i) => text(210 + i * 140, 250, d, 15, c.muted, { weight: 700, anchor: "middle" })).join("")}
    ${["07:00", "12:00", "18:00", "19:30"].map((h, r) => text(96, 306 + r * 92, h, 15, c.muted, { weight: 600, anchor: "end" }) + rect(120, 270 + r * 92, 850, 1, 0, c.line)).join("")}
    ${classes.map(([d, r, name]) => {
      const active = d === 2 && r === 0;
      const fn = name === "Funcional";
      return rect(146 + d * 140, 278 + r * 92, 128, 74, 12, active ? c.lime : fn ? "#1f2a12" : c.panel, `stroke="${active ? c.lime : c.line}"`) +
        text(162 + d * 140, 308 + r * 92, name, 15, active ? "#0f1112" : c.text, { weight: 700 }) +
        text(162 + d * 140, 332 + r * 92, active ? "4 vagas" : "Aula de 50 min", 12, active ? "#0f1112" : c.muted);
    }).join("")}`;
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${text(60, 72, "PULSE", 30, c.text, { weight: 900, spacing: 4, family: FONT })}
    ${circle(182, 62, 7, c.lime)}
    ${text(200, 72, "STUDIO", 16, c.muted, { weight: 700, spacing: 4 })}
    ${text(1100, 68, "Modalidades   Grade   Planos   Professores", 15, c.muted, { anchor: "end" })}
    ${text(60, 160, "Grade de aulas", 34, c.text, { weight: 900 })}
    ${["Todas", "Funcional", "Pilates", "Dança", "Força"].map((t, i) => pill(60 + [0, 92, 214, 318, 414][i], 184, t, { bg: i === 1 ? c.lime : c.panel, fg: i === 1 ? "#0f1112" : c.text, size: 14, stroke: i === 1 ? undefined : c.line })).join("")}
    ${grid}
    ${rect(1000, 270, 130, 360, 14, c.panel, `stroke="${c.line}"`)}
    ${text(1016, 306, "Aula", 13, c.muted, { weight: 700 })}
    ${text(1016, 330, "experimental", 13, c.muted, { weight: 700 })}
    ${text(1016, 372, "Funcional", 17, c.text, { weight: 800 })}
    ${text(1016, 396, "Qua · 07:00", 14, c.lime, { weight: 700 })}
    ${button(1016, 560, 98, 48, "Agendar", c.lime, "#0f1112", 14, 24)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 88, "PULSE", 22, c.text, { weight: 900, spacing: 3 })}${circle(116, 80, 5, c.lime)}
    ${text(24, 140, "Aula experimental", 21, c.text, { weight: 900 })}
    ${text(24, 164, "Escolha a turma", 14, c.muted)}
    ${days.slice(0, 5).map((d, i) => rect(24 + i * 52, 184, 46, 62, 12, i === 2 ? c.lime : c.panel) + text(47 + i * 52, 210, d, 12, i === 2 ? "#0f1112" : c.muted, { weight: 700, anchor: "middle" }) + text(47 + i * 52, 232, String(17 + i), 16, i === 2 ? "#0f1112" : c.text, { weight: 800, anchor: "middle" })).join("")}
    ${[["07:00", "Funcional", "4 vagas"], ["12:00", "Pilates", "2 vagas"], ["18:00", "Funcional", "Lotada"]].map(([h, n, v], i) => rect(24, 268 + i * 82, 258, 70, 14, c.panel, `stroke="${i === 0 ? c.lime : c.line}" stroke-width="${i === 0 ? 2 : 1}"`) + text(44, 300 + i * 82, h, 18, c.text, { weight: 800 }) + text(114, 300 + i * 82, n, 15, c.text, { weight: 600 }) + text(44, 322 + i * 82, v, 12, i === 2 ? "#6c736d" : c.lime, { weight: 700 })).join("")}
    ${button(24, 574, 258, 54, "Agendar aula experimental", c.lime, "#0f1112", 16, 27)}
  `;
  const decor = `<g opacity="0.5" fill="none" stroke="#c6f432" stroke-width="3"><path d="M0 820 L220 820 L260 740 L300 900 L340 780 L370 820 L1600 820" opacity="0.4"/></g>${circle(1500, 120, 240, "#c6f432", 'opacity="0.08"')}`;
  return svgDoc({
    bg: ["#050607", "#1d2124"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#1b1e20", bar: "#15181a", dots: ["#34393d", "#34393d", "#34393d"], url: "#202427", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#000000", screen: c.bg, content: mobile },
  });
}

// ---------- 11. Produtos naturais ----------
function produtosNaturais() {
  const c = { bg: "#fffdf6", olive: "#5c6b2e", terra: "#b86b3c", ink: "#2f3320", muted: "#6c705b", line: "#e8e6d4", soft: "#f2f1e2" };
  const jar = (x, y, fill, lid) =>
    rect(x + 14, y, 52, 14, 4, lid) + rect(x + 6, y + 12, 68, 84, 14, "#f6f3e6", `stroke="#e1dcc6" stroke-width="2"`) + rect(x + 10, y + 40, 60, 52, 10, fill) + rect(x + 16, y + 48, 48, 16, 3, "#fffdf6", 'opacity="0.85"');
  const products = [
    ["Canela em pó", "a partir de R$ 4,90", "#a8663a", "100 g"],
    ["Mix de castanhas", "a partir de R$ 12,90", "#c79a5b", "250 g"],
    ["Chá de camomila", "a partir de R$ 6,50", "#d9c46a", "50 g"],
    ["Aveia em flocos", "a partir de R$ 5,90", "#e3d3a8", "500 g"],
    ["Granola da casa", "a partir de R$ 9,90", "#b98a4d", "250 g"],
    ["Quinoa em grãos", "a partir de R$ 11,90", "#efe2c3", "250 g"],
  ];
  const cards = products
    .map(([n, p, fill], i) => {
      const x = 300 + (i % 3) * 206;
      const y = 200 + Math.floor(i / 3) * 250;
      return rect(x, y, 190, 234, 14, "#fff", `stroke="${c.line}"`) + rect(x, y, 190, 120, 14, c.soft) + jar(x + 55, y + 14, fill, c.olive) + text(x + 16, y + 150, n, 15, c.ink, { weight: 700 }) + text(x + 16, y + 172, p, 13, c.muted) + button(x + 16, y + 186, 158, 34, "Escolher", i === 0 ? c.olive : c.soft, i === 0 ? "#fff" : c.olive, 13, 17);
    })
    .join("");
  const cats = ["Chás e ervas", "Grãos e cereais", "Castanhas", "Mais procurados", "Temperos", "Farinhas", "Sem glúten", "Kits"];
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${`<path d="M68 76 q10 -34 32 -40 q-4 30 -32 40z" fill="${c.olive}"/><path d="M68 76 q-6 -22 -24 -26 q2 22 24 26z" fill="${c.terra}"/>`}
    ${text(110, 72, "Raiz & Grão", 26, c.ink, { weight: 800, family: SERIF })}
    ${rect(360, 44, 470, 40, 20, c.soft)}${text(384, 70, "Buscar produtos", 15, "#9a9c86")}
    ${text(1100, 70, "Kits   Promoções   Carrinho (3)", 15, c.muted, { anchor: "end" })}
    ${text(60, 170, "Categorias", 16, c.ink, { weight: 800 })}
    ${cats.map((t, i) => rect(60, 190 + i * 52, 210, 42, 10, i === 3 ? c.olive : "transparent") + text(76, 217 + i * 52, t, 15, i === 3 ? "#fff" : c.ink, { weight: i === 3 ? 700 : 500 })).join("")}
    ${text(300, 170, "Mais procurados · a granel e embalados", 20, c.ink, { weight: 800 })}
    ${cards}
    ${rect(930, 200, 190, 484, 14, c.soft)}
    ${text(948, 236, "Canela em pó", 16, c.ink, { weight: 800 })}
    ${text(948, 260, "Vendido por peso", 13, c.muted)}
    ${["100 g", "250 g", "500 g", "1 kg"].map((w, i) => rect(948, 278 + i * 50, 154, 42, 10, i === 1 ? "#fff" : "transparent", `stroke="${i === 1 ? c.olive : c.line}" stroke-width="${i === 1 ? 2 : 1}"`) + text(964, 305 + i * 50, w, 14, c.ink, { weight: 600 }) + text(1090, 305 + i * 50, ["4,90", "11,90", "22,90", "43,90"][i], 13, c.muted, { anchor: "end" })).join("")}
    ${text(948, 510, "Quantidade", 13, c.muted, { weight: 700 })}
    ${rect(948, 522, 154, 42, 10, "#fff", `stroke="${c.line}"`)}${text(968, 549, "–", 18, c.olive, { weight: 700 })}${text(1025, 549, "2", 16, c.ink, { weight: 700, anchor: "middle" })}${text(1080, 549, "+", 18, c.olive, { weight: 700, anchor: "middle" })}
    ${text(948, 600, "R$ 23,80", 20, c.ink, { weight: 800 })}
    ${button(948, 618, 154, 44, "Adicionar", c.terra, "#fff", 14, 22)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 84, "Raiz & Grão", 20, c.ink, { weight: 800, family: SERIF })}
    ${text(24, 132, "Seu carrinho", 21, c.ink, { weight: 800 })}
    ${[["Canela em pó", "2 × 250 g", "23,80"], ["Mix de castanhas", "1 × 500 g", "24,90"], ["Chá de camomila", "3 × 50 g", "19,50"]].map(([n, q, p], i) => rect(24, 152 + i * 84, 258, 72, 12, "#fff", `stroke="${c.line}"`) + rect(36, 164 + i * 84, 48, 48, 10, c.soft) + circle(60, 188 + i * 84, 13, ["#a8663a", "#c79a5b", "#d9c46a"][i]) + text(96, 184 + i * 84, n, 14, c.ink, { weight: 700 }) + text(96, 204 + i * 84, q, 12, c.muted) + text(268, 196 + i * 84, p, 14, c.ink, { weight: 700, anchor: "end" })).join("")}
    ${rect(24, 418, 258, 40, 20, c.soft)}${rect(28, 422, 126, 32, 16, c.olive)}${text(91, 443, "Retirada", 13, "#fff", { weight: 700, anchor: "middle" })}${text(218, 443, "Entrega", 13, c.muted, { weight: 600, anchor: "middle" })}
    ${text(24, 510, "Total", 15, c.muted)}${text(282, 510, "R$ 68,20", 22, c.ink, { weight: 800, anchor: "end" })}
    ${button(24, 574, 258, 54, "Revisar pedido", c.terra, "#fff", 16, 27)}
  `;
  const decor = `<g opacity="0.2">${[[140, 140, 0], [1480, 860, 40], [1440, 120, -30], [220, 880, 60]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 q60 -120 170 -140 q-20 110 -170 140z" fill="#5c6b2e"/><path d="M0 0 L150 -126" stroke="#fffdf6" stroke-width="3"/></g>`).join("")}</g>`;
  return svgDoc({
    bg: ["#eceedd", "#d3dbb8"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#f3f2e4", dots: ["#dcdac3", "#dcdac3", "#dcdac3"], url: "#fffdf6", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#2f3320", screen: c.bg, content: mobile },
  });
}

// ---------- 12. Floricultura ----------
function floricultura() {
  const c = { bg: "#fffafa", rose: "#b4546d", sage: "#7d9a7e", ink: "#3d2530", muted: "#7f6670", line: "#f1dfe3", blush: "#fbecef" };
  const flower = (x, y, r, petal, center) =>
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - r * 0.55}" rx="${r * 0.42}" ry="${r * 0.6}" fill="${petal}" transform="rotate(${a} ${x} ${y})"/>`).join("") + circle(x, y, r * 0.3, center);
  const bouquet = (x, y, s) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-40 60 L0 190 L40 60 Z" fill="${c.sage}"/>
      <path d="M-46 70 L0 200 L46 70 L20 60 L0 90 L-20 60 Z" fill="#e9d7c4"/>
      ${`<path d="M-60 40 q-30 -40 -10 -80 M60 40 q30 -40 10 -80" stroke="${c.sage}" stroke-width="6" fill="none"/>`}
      ${flower(-34, 10, 36, "#e58ea2", "#f7d774")}${flower(34, 6, 34, "#f2b8c6", "#f7d774")}${flower(0, -34, 40, c.rose, "#f7d774")}${flower(-12, 40, 26, "#fbd0da", "#f7d774")}${flower(26, 42, 22, "#e58ea2", "#f7d774")}
    </g>`;
  const occasions = ["Aniversário", "Romance", "Maternidade", "Agradecimento", "Condolências"];
  const desktop = `
    ${rect(0, 0, 1160, 756, 0, c.bg)}
    ${text(60, 72, "Flor & Afeto", 30, c.rose, { weight: 400, family: SERIF })}
    ${text(1100, 68, "Ocasiões   Buquês   Presentes   Entrega", 15, c.muted, { anchor: "end" })}
    ${occasions.map((t, i) => pill(60 + [0, 132, 244, 376, 530][i], 110, t, { bg: i === 0 ? c.rose : c.blush, fg: i === 0 ? "#fff" : c.ink, size: 14 })).join("")}
    ${rect(60, 180, 500, 510, 24, c.blush)}
    ${bouquet(310, 400, 1.55)}
    ${pill(84, 204, "Mais pedido", { bg: "#fff", fg: c.rose, size: 12, h: 28 })}
    ${text(600, 214, "Buquê Primavera", 36, c.ink, { weight: 400, family: SERIF })}
    ${text(600, 250, "Rosas, lisianthus e folhagens da estação", 16, c.muted)}
    ${text(600, 300, "Tamanho", 14, c.ink, { weight: 700 })}
    ${["P", "M", "G"].map((s, i) => rect(600 + i * 96, 314, 84, 64, 14, i === 1 ? "#fff" : c.bg, `stroke="${i === 1 ? c.rose : c.line}" stroke-width="${i === 1 ? 2 : 1}"`) + text(642 + i * 96, 342, s, 17, c.ink, { weight: 700, anchor: "middle" }) + text(642 + i * 96, 364, ["R$ 129", "R$ 179", "R$ 239"][i], 12, c.muted, { anchor: "middle" })).join("")}
    ${text(600, 420, "Adicionais", 14, c.ink, { weight: 700 })}
    ${["Chocolates", "Cartão especial", "Vaso de vidro"].map((t, i) => pill(600 + [0, 130, 290][i], 434, t, { bg: i === 0 ? c.sage : "#fff", fg: i === 0 ? "#fff" : c.ink, size: 13, h: 32, stroke: i === 0 ? undefined : c.line })).join("")}
    ${text(600, 504, "Mensagem do cartão", 14, c.ink, { weight: 700 })}
    ${rect(600, 518, 500, 96, 14, "#fff", `stroke="${c.line}"`)}
    ${text(620, 552, "Feliz aniversário! Que o seu ano seja", 16, c.ink, { family: SERIF })}
    ${text(620, 578, "tão bonito quanto estas flores.", 16, c.ink, { family: SERIF })}
    ${text(1084, 602, "68/200", 12, c.muted, { anchor: "end" })}
    ${button(600, 636, 300, 52, "Escolher data de entrega", c.rose, "#fff", 16, 26)}
  `;
  const mobile = `
    ${rect(0, 0, 306, 656, 0, c.bg)}
    ${text(24, 86, "Flor & Afeto", 22, c.rose, { family: SERIF })}
    ${text(24, 132, "Quando entregar?", 21, c.ink, { weight: 700 })}
    ${rect(24, 150, 258, 40, 20, c.blush)}${rect(28, 154, 126, 32, 16, c.rose)}${text(91, 175, "Entrega", 13, "#fff", { weight: 700, anchor: "middle" })}${text(218, 175, "Retirada", 13, c.muted, { weight: 600, anchor: "middle" })}
    ${["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => text(44 + i * 36, 222, d, 12, c.muted, { weight: 700, anchor: "middle" })).join("")}
    ${Array.from({ length: 21 }, (_, i) => { const x = 44 + (i % 7) * 36; const y = 252 + Math.floor(i / 7) * 40; const sel = i === 10; const past = i < 4; return (sel ? circle(x, y - 5, 16, c.rose) : "") + text(x, y, String(i + 9), 14, sel ? "#fff" : past ? "#d6c3c9" : c.ink, { weight: sel ? 700 : 500, anchor: "middle" }); }).join("")}
    ${text(24, 400, "Período", 14, c.ink, { weight: 700 })}
    ${["Manhã", "Tarde"].map((t, i) => rect(24 + i * 132, 414, 126, 46, 12, i === 0 ? "#fff" : c.bg, `stroke="${i === 0 ? c.rose : c.line}" stroke-width="${i === 0 ? 2 : 1}"`) + text(87 + i * 132, 443, t, 14, c.ink, { weight: 600, anchor: "middle" })).join("")}
    ${rect(24, 480, 258, 56, 12, c.blush)}${text(40, 504, "Qua, 19/09 · Manhã", 14, c.ink, { weight: 700 })}${text(40, 524, "Buquê Primavera M + chocolates", 12, c.muted)}
    ${button(24, 574, 258, 54, "Dados de quem recebe", c.rose, "#fff", 15, 27)}
  `;
  const decor = `<g opacity="0.35">${[[130, 130, 60], [1500, 110, 70], [1460, 900, 50], [240, 900, 44], [760, 960, 36]].map(([x, y, r]) => flower(x, y, r, "#ffffff", "#f7d774")).join("")}</g>`;
  return svgDoc({
    bg: ["#f6dfe3", "#e8bcc7"],
    decor,
    browserBox: BROWSER,
    phoneBox: PHONE,
    desktop: { frame: "#ffffff", bar: "#fbeff1", dots: ["#efd3da", "#efd3da", "#efd3da"], url: "#fffafa", urlFg: c.muted, body: c.bg, content: desktop },
    mobile: { frame: "#3d2530", screen: c.bg, content: mobile },
  });
}

const covers = {
  clinica,
  restaurante,
  oficina,
  servicos,
  autonomo,
  advocacia,
  imobiliaria,
  petshop,
  academia,
  "produtos-naturais": produtosNaturais,
  floricultura,
};

// Demos implementadas usam capturas reais: suas capas conceituais não são mais geradas.
const withRealScreenshots = new Set(["clinica", "restaurante", "oficina", "servicos", "autonomo", "advocacia", "imobiliaria", "petshop"]);

for (const [slug, draw] of Object.entries(covers)) {
  if (withRealScreenshots.has(slug)) continue;
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  const svg = draw().replace(/\n\s+/g, "\n").trim() + "\n";
  writeFileSync(join(dir, "cover.svg"), svg, "utf8");
  console.log(`✓ ${slug}/cover.svg (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
}
