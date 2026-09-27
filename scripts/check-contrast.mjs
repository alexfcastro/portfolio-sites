// Verifica o contraste de texto (WCAG 2.x, nível AA) nas páginas de scripts/reflow/pages.json.
// Usa o Chrome instalado via DevTools Protocol. Rode com `pnpm preview:local` no ar.
//
// Uso:
//   node scripts/check-contrast.mjs            # larguras 390 e 1280
//
// Para cada elemento com texto visível, calcula a cor do texto e a do fundo efetivo (somando camadas
// semitransparentes e a opacidade dos ancestrais) e exige 4,5:1 (texto normal) ou 3:1 (texto grande:
// ≥ 24 px, ou ≥ 18,66 px em negrito). Fundos com imagem ou gradiente não são calculáveis e são ignorados.
// Controles desativados são isentos pela WCAG e também são ignorados. Sai com código 1 se houver falhas.

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, "reflow", "pages.json"), "utf8"));
const widths = [390, 1280];

const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "ax-contrast-"));
const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"]);
const wsUrl = await new Promise((ok, reject) => {
  const timer = setTimeout(() => reject(new Error("Chrome não iniciou.")), 15000);
  chrome.stderr.on("data", (chunk) => {
    const match = /DevTools listening on (ws:\/\/\S+)/.exec(String(chunk));
    if (match) {
      clearTimeout(timer);
      ok(match[1]);
    }
  });
});
const socket = new WebSocket(wsUrl);
await new Promise((ok) => socket.addEventListener("open", ok, { once: true }));
let nextId = 0;
const pending = new Map();
const waiters = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { ok, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else ok(message.result);
  } else if (message.method) {
    for (const waiter of [...waiters]) {
      if (waiter.method === message.method && waiter.sessionId === message.sessionId) {
        waiters.splice(waiters.indexOf(waiter), 1);
        waiter.ok(message.params);
      }
    }
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((ok, reject) => {
    const id = ++nextId;
    pending.set(id, { ok, reject });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
const waitFor = (method, sessionId) =>
  new Promise((ok, reject) => {
    waiters.push({ method, sessionId, ok });
    setTimeout(() => reject(new Error(`Tempo esgotado esperando ${method}`)), 20000);
  });
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

const probe = `(() => {
  // Converte qualquer cor CSS (hex, rgb, oklab, color-mix…) em RGBA pelo canvas.
  const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  const rgba = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const over = (top, bottom) => {
    const a = top[3];
    return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1);
  };
  const lum = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  // Fundo efetivo: camadas de fundo dos ancestrais, da mais próxima à mais distante.
  const background = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") return null;
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let result = [255, 255, 255, 1];
    for (const layer of layers.reverse()) result = over(layer, result);
    return result;
  };
  const opacity = (el) => {
    let o = 1;
    for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };
  const problems = [];
  let checked = 0;
  for (const el of document.body.querySelectorAll("*")) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    if (el.closest("svg, [aria-hidden=true], :disabled, [aria-disabled=true], .sr-only, dialog:not([open])")) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.visibility !== "visible" || r.width < 2 || r.height < 2) continue;
    const bg = background(el);
    if (!bg) continue;
    let fg = rgba(cs.color);
    fg = over([fg[0], fg[1], fg[2], fg[3] * opacity(el)], bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const need = large ? 3 : 4.5;
    const value = ratio(fg, bg);
    checked += 1;
    if (value < need - 0.01) {
      problems.push({
        text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 50),
        ratio: Math.round(value * 100) / 100,
        need,
        cls: String(el.className).slice(0, 60),
      });
    }
  }
  return { checked, problems };
})()`;

let failures = 0;
let total = 0;
const seen = new Set();
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  for (const width of widths) {
    const mobile = width < 768;
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile }, sessionId);
    for (const app of config.apps) {
      if (app.storage) {
        const loaded = waitFor("Page.loadEventFired", sessionId);
        await send("Page.navigate", { url: new URL("/robots.txt", app.base).toString() }, sessionId);
        await loaded;
        const entries = JSON.stringify(Object.entries(app.storage).map(([k, v]) => [k, JSON.stringify(v)]));
        await send("Runtime.evaluate", { expression: `for (const [k, v] of ${entries}) localStorage.setItem(k, v)` }, sessionId);
      }
      for (const path of app.paths) {
        const loaded = waitFor("Page.loadEventFired", sessionId);
        await send("Page.navigate", { url: new URL(path, app.base).toString() }, sessionId);
        await loaded;
        await sleep(600);
        const { result } = await send("Runtime.evaluate", { expression: probe, returnByValue: true }, sessionId);
        total += result.value.checked;
        for (const p of result.value.problems) {
          const key = `${app.base}${path}|${p.text}|${p.ratio}`;
          if (seen.has(key)) continue;
          seen.add(key);
          failures += 1;
          console.log(`✗ ${width}px ${app.base}${path}  ${p.ratio}:1 (mín. ${p.need})  "${p.text}"  .${p.cls}`);
        }
      }
    }
  }
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
console.log(failures === 0 ? `✓ contraste AA em ${total} textos verificados` : `${failures} texto(s) abaixo do contraste AA (de ${total} verificados)`);
process.exit(failures === 0 ? 0 : 1);
