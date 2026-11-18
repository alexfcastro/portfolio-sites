// Verifica a abertura em 3D da página inicial em telas de celular e tablet: os botões de ação precisam caber
// na primeira tela e nada do rodapé da cena (dica de rolagem, contador, "Pular") pode ficar por cima deles,
// nem parado no topo nem no começo da rolagem.
// Usa o Chrome instalado via DevTools Protocol, como os outros scripts de verificação.
//
// Uso:
//   node scripts/check-abertura.mjs [url-base]   (padrão: http://localhost:3100)
// Sai com código 1 se encontrar problema.

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3100";
const sizes = [
  [320, 568],
  [320, 740],
  [360, 640],
  [375, 667],
  [390, 844],
  [412, 915],
  [768, 1024],
  [1024, 600],
  [1280, 720],
];
// Pontos da rolagem verificados, em pixels a partir do topo.
const scrolls = [0, 40, 120, 240];

const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "ax-abertura-"));
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

// Mede os botões da abertura e os controles do rodapé da cena. Um elemento conta como visível com opacidade
// acima de 0,05, somando a opacidade dos ancestrais (o texto some aos poucos ao rolar).
const probe = `(() => {
  const opacity = (el) => {
    let value = 1;
    for (let p = el; p; p = p.parentElement) value *= Number(getComputedStyle(p).opacity);
    return value;
  };
  const box = (el) => el.getBoundingClientRect();
  const buttons = [...document.querySelectorAll(".cena-texto .cena-acoes a")];
  const controls = [...document.querySelectorAll(".cena-dica, .cena-rodape")];
  if (buttons.length === 0) return { skip: true };
  const visibleButtons = buttons.filter((b) => opacity(b) > 0.05 && getComputedStyle(b.closest(".cena-texto")).visibility !== "hidden");
  const visibleControls = controls.filter((c) => opacity(c) > 0.05);
  const overlaps = [];
  for (const b of visibleButtons) {
    for (const c of visibleControls) {
      const rb = box(b), rc = box(c);
      if (rc.top < rb.bottom && rc.bottom > rb.top && rc.left < rb.right && rc.right > rb.left) {
        overlaps.push(b.textContent.trim().slice(0, 24) + " × " + c.className.split(" ")[0]);
      }
    }
  }
  const atTop = scrollY < 1;
  const cut = atTop ? buttons.filter((b) => box(b).bottom > innerHeight).map((b) => b.textContent.trim().slice(0, 24)) : [];
  return { overlaps, cut };
})()`;

let problems = 0;
let checked = 0;
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  for (const [width, height] of sizes) {
    const mobile = width < 768;
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile }, sessionId);
    await send("Emulation.setTouchEmulationEnabled", { enabled: mobile }, sessionId);
    const loaded = waitFor("Page.loadEventFired", sessionId);
    await send("Page.navigate", { url: new URL("/", base).toString() }, sessionId);
    await loaded;
    await sleep(1200);
    for (const y of scrolls) {
      await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${y})` }, sessionId);
      await sleep(350);
      const { result } = await send("Runtime.evaluate", { expression: probe, returnByValue: true }, sessionId);
      const r = result.value;
      if (r.skip) continue;
      checked += 1;
      if (r.overlaps.length > 0 || r.cut.length > 0) {
        problems += 1;
        const parts = [];
        if (r.cut.length) parts.push(`fora da tela: ${r.cut.join(", ")}`);
        if (r.overlaps.length) parts.push(`sobreposição: ${r.overlaps.join(" | ")}`);
        console.log(`✗ ${width}×${height} rolagem ${y}px  ${parts.join("; ")}`);
      }
    }
  }
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
console.log(problems === 0 ? `✓ abertura: ${checked} situações sem sobreposição` : `${problems} de ${checked} com problema`);
process.exit(problems === 0 ? 0 : 1);
