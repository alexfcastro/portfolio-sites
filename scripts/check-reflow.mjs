// Verifica reflow (sem rolagem horizontal nem elementos além da largura) em várias larguras de tela.
// Usa o Chrome instalado via DevTools Protocol, como o script de capturas.
//
// Uso:
//   node scripts/check-reflow.mjs scripts/reflow/pages.json
//
// O JSON lista { widths: number[], apps: [{ base, paths[], storage? }] }. `storage` ({ chave: valor }) é gravado no
// localStorage do app antes de abrir as páginas, para verificar telas com conteúdo (carrinho, agendamentos…). Larguras abaixo de 768 emulam celular;
// como a emulação alarga o layout em vez de rolar, a verificação compara `innerWidth` com a largura pedida.
// Sai com código 1 se encontrar problema.

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [configPath] = process.argv.slice(2);
if (!configPath) {
  console.error("Uso: node scripts/check-reflow.mjs <pages.json>");
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));

const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "ax-reflow-"));
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

// Elementos além da borda direita, ignorando os que estão dentro de contêineres com rolagem/corte próprio
// e o conteúdo interno de SVGs (cortado pelo próprio SVG).
const probe = `(() => {
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
    }
    return false;
  };
  const wide = [...document.body.querySelectorAll("*")].filter((el) => {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > innerWidth + 1 && !clipped(el);
  });
  return {
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    wide: wide.slice(0, 3).map((el) => el.tagName.toLowerCase() + "." + String(el.className).slice(0, 50)),
  };
})()`;

let problems = 0;
let checked = 0;
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  for (const width of config.widths) {
    const mobile = width < 768;
    await send("Emulation.setDeviceMetricsOverride", { width, height: 800, deviceScaleFactor: 1, mobile }, sessionId);
    await send("Emulation.setTouchEmulationEnabled", { enabled: mobile }, sessionId);
    for (const app of config.apps) {
      if (app.storage) {
        const loaded = waitFor("Page.loadEventFired", sessionId);
        await send("Page.navigate", { url: new URL("/robots.txt", app.base).toString() }, sessionId);
        await loaded;
        const entries = JSON.stringify(Object.entries(app.storage).map(([key, value]) => [key, JSON.stringify(value)]));
        await send("Runtime.evaluate", { expression: `for (const [k, v] of ${entries}) localStorage.setItem(k, v)` }, sessionId);
      }
      for (const path of app.paths) {
        const loaded = waitFor("Page.loadEventFired", sessionId);
        await send("Page.navigate", { url: new URL(path, app.base).toString() }, sessionId);
        await loaded;
        await sleep(500);
        const { result } = await send("Runtime.evaluate", { expression: probe, returnByValue: true }, sessionId);
        const r = result.value;
        checked += 1;
        if (r.innerWidth !== width || r.scrollWidth > r.innerWidth || r.wide.length > 0) {
          problems += 1;
          console.log(`✗ ${width}px ${app.base}${path}  innerWidth=${r.innerWidth} scrollWidth=${r.scrollWidth} ${r.wide.join(" | ")}`);
        }
      }
    }
    console.log(`… ${width}px verificado`);
  }
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
console.log(problems === 0 ? `✓ ${checked} páginas sem problemas de reflow` : `${problems} de ${checked} com problema`);
process.exit(problems === 0 ? 0 : 1);
