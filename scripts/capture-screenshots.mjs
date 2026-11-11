// Captura screenshots reais de uma demo (desktop e celular) para o case no portfólio.
// Usa o Chrome instalado via DevTools Protocol, sem dependências extras (WebSocket nativo do Node ≥ 22).
//
// Uso:
//   node scripts/capture-screenshots.mjs scripts/screenshots/barbearia.json http://localhost:3101
//
// O JSON define o diretório de saída e cada captura: { name, path, width, height, scale, mobile, steps[] }.
// `steps` são expressões JS executadas na página, em ordem (podem ser assíncronas).
// Variável opcional: CHROME_PATH (padrão: Chrome em Program Files).

import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const [configPath, baseUrl] = process.argv.slice(2);
if (!configPath || !baseUrl) {
  console.error("Uso: node scripts/capture-screenshots.mjs <config.json> <url-base>");
  process.exit(1);
}

// Datas fixas vencem: __PROXIMA_SEXTA__ vira a próxima sexta-feira a pelo menos 2 dias de hoje.
const proximaSexta = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();
const config = JSON.parse(readFileSync(configPath, "utf8").replaceAll("__PROXIMA_SEXTA__", proximaSexta));
const outDir = resolve(dirname(configPath), config.outDir);
mkdirSync(outDir, { recursive: true });

const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "ax-shot-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
]);

const wsUrl = await new Promise((resolveUrl, reject) => {
  const timer = setTimeout(() => reject(new Error("Chrome não iniciou.")), 15000);
  chrome.stderr.on("data", (chunk) => {
    const match = /DevTools listening on (ws:\/\/\S+)/.exec(String(chunk));
    if (match) {
      clearTimeout(timer);
      resolveUrl(match[1]);
    }
  });
});

const socket = new WebSocket(wsUrl);
await new Promise((ok) => socket.addEventListener("open", ok, { once: true }));

let nextId = 0;
const pending = new Map();
const eventWaiters = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve: done, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else done(message.result);
  } else if (message.method) {
    for (const waiter of [...eventWaiters]) {
      if (waiter.method === message.method && waiter.sessionId === message.sessionId) {
        eventWaiters.splice(eventWaiters.indexOf(waiter), 1);
        waiter.resolve(message.params);
      }
    }
  }
});

function send(method, params = {}, sessionId) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((ok, reject) => pending.set(id, { resolve: ok, reject }));
}

function waitFor(method, sessionId, timeout = 20000) {
  return new Promise((ok, reject) => {
    const waiter = { method, sessionId, resolve: ok };
    eventWaiters.push(waiter);
    setTimeout(() => reject(new Error(`Tempo esgotado esperando ${method}`)), timeout);
  });
}

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

try {
  for (const shot of config.shots) {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    await send("Page.enable", {}, sessionId);
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width: shot.width, height: shot.height, deviceScaleFactor: shot.scale ?? 1, mobile: Boolean(shot.mobile) },
      sessionId,
    );
    if (shot.mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true }, sessionId);

    const loaded = waitFor("Page.loadEventFired", sessionId);
    await send("Page.navigate", { url: new URL(shot.path, baseUrl).toString() }, sessionId);
    await loaded;
    await sleep(1200);
    // Rolagem suave (CSS) faria a captura sair no meio do caminho.
    await send(
      "Runtime.evaluate",
      { expression: "document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important')" },
      sessionId,
    );

    for (const step of shot.steps ?? []) {
      const result = await send(
        "Runtime.evaluate",
        { expression: `(async () => { ${step} })()`, awaitPromise: true, returnByValue: true },
        sessionId,
      );
      if (result.exceptionDetails) throw new Error(`${shot.name}: ${result.exceptionDetails.exception?.description}`);
      await sleep(400);
    }

    const { data } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
    const file = join(outDir, `${shot.name}.png`);
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log(`✓ ${shot.name}.png (${shot.width}×${shot.height} @${shot.scale ?? 1}x)`);
    await send("Target.closeTarget", { targetId });
  }
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
