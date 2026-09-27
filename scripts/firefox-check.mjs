// Verificação no Firefox (motor Gecko) via WebDriver BiDi, sem dependências extras (WebSocket nativo do Node ≥ 22).
//
// Uso (com `pnpm preview:local` no ar):
//   node scripts/firefox-check.mjs            # reflow + fluxos + capturas
//   node scripts/firefox-check.mjs --flows    # só os fluxos
//
// - Reflow: as mesmas páginas e larguras de scripts/reflow/pages.json.
// - Fluxos: scripts/firefox/flows.mjs (passos no DOM com verificação do resultado).
// - Erros de JavaScript no console são coletados e fazem a verificação falhar.
// - Capturas para revisão visual em scripts/firefox/out/ (ignorado pelo Git).
// Variável opcional: FIREFOX_PATH (padrão: Firefox em Program Files).

import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { flows, shots } from "./firefox/flows.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const onlyFlows = process.argv.includes("--flows");
const firefoxPath = process.env.FIREFOX_PATH ?? "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
const profile = mkdtempSync(join(tmpdir(), "ax-ff-"));
const port = 9300 + Math.floor(Math.random() * 500);
const firefox = spawn(firefoxPath, ["--headless", "--no-remote", "--profile", profile, "--remote-debugging-port", String(port)]);

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

await new Promise((ok, reject) => {
  const timer = setTimeout(() => reject(new Error("Firefox não iniciou.")), 30000);
  const onData = (chunk) => {
    if (/WebDriver BiDi listening/.test(String(chunk))) {
      clearTimeout(timer);
      ok();
    }
  };
  firefox.stderr.on("data", onData);
  firefox.stdout.on("data", onData);
});

const socket = new WebSocket(`ws://127.0.0.1:${port}/session`);
await new Promise((ok, reject) => {
  socket.addEventListener("open", ok, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const consoleErrors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id !== undefined && pending.has(message.id)) {
    const { ok, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.type === "error") reject(new Error(`${message.error}: ${message.message}`));
    else ok(message.result);
  } else if (message.method === "log.entryAdded" && message.params.level === "error") {
    consoleErrors.push(`${message.params.source?.realm ?? ""} ${message.params.text}`.trim());
  }
});
const send = (method, params = {}) =>
  new Promise((ok, reject) => {
    const id = ++nextId;
    pending.set(id, { ok, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

const session = await send("session.new", { capabilities: {} });
await send("session.subscribe", { events: ["log.entryAdded"] });
// Aba própria para os testes (os contextos existentes podem ser janelas internas do navegador).
const { context } = await send("browsingContext.create", { type: "tab" });

const navigate = (url) => send("browsingContext.navigate", { context, url, wait: "complete" });
const setWidth = (width, height = 800) => send("browsingContext.setViewport", { context, viewport: { width, height } });
async function evaluate(expression) {
  const { result, exceptionDetails, type } = await send("script.evaluate", {
    expression: `(async () => JSON.stringify(await (async () => { ${expression} })()))()`,
    target: { context },
    awaitPromise: true,
  });
  if (type === "exception") throw new Error(exceptionDetails?.text ?? "exceção no script");
  return result.type === "string" ? JSON.parse(result.value) : undefined;
}
async function seed(base, storage) {
  await navigate(new URL("/robots.txt", base).toString());
  await evaluate(`localStorage.clear(); for (const [k, v] of ${JSON.stringify(Object.entries(storage ?? {}).map(([k, v]) => [k, JSON.stringify(v)]))}) localStorage.setItem(k, v); return true;`);
}

let failures = 0;
console.log(`${session.capabilities.browserName} ${session.capabilities.browserVersion} via WebDriver BiDi`);

try {
  if (!onlyFlows) {
    const config = JSON.parse(readFileSync(join(here, "reflow", "pages.json"), "utf8"));
    const probe = `
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
        return r.width > 0 && r.right > document.documentElement.clientWidth + 1 && !clipped(el);
      });
      return { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        wide: wide.slice(0, 3).map((el) => el.tagName.toLowerCase() + "." + String(el.className).slice(0, 50)) };`;
    let checked = 0;
    for (const width of config.widths) {
      await setWidth(width);
      for (const app of config.apps) {
        await seed(app.base, app.storage);
        for (const path of app.paths) {
          await navigate(new URL(path, app.base).toString());
          await sleep(300);
          const r = await evaluate(probe);
          checked += 1;
          if (r.scrollWidth > r.clientWidth || r.wide.length > 0) {
            failures += 1;
            console.log(`✗ reflow ${width}px ${app.base}${path} scrollWidth=${r.scrollWidth} clientWidth=${r.clientWidth} ${r.wide.join(" | ")}`);
          }
        }
      }
    }
    console.log(`reflow: ${checked} verificações`);
  }

  for (const flow of flows) {
    await setWidth(flow.width ?? 1280, 900);
    await seed(flow.base, flow.storage);
    await navigate(new URL(flow.path, flow.base).toString());
    await sleep(700);
    try {
      for (const step of flow.steps) {
        // "KEY:<tecla>" pressiona uma tecla de verdade (ações de entrada do WebDriver BiDi).
        if (step.startsWith("KEY:")) {
          const value = { Escape: "", Tab: "", Enter: "" }[step.slice(4)] ?? step.slice(4);
          await send("input.performActions", {
            context,
            actions: [{ type: "key", id: "teclado", actions: [{ type: "keyDown", value }, { type: "keyUp", value }] }],
          });
        } else await evaluate(step);
        await sleep(250);
      }
      const result = await evaluate(flow.check);
      const problems = Object.entries(result).filter(([, v]) => v !== true);
      if (problems.length) {
        failures += 1;
        console.log(`✗ fluxo ${flow.name}: ${problems.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ")}`);
      } else console.log(`✓ fluxo ${flow.name}`);
    } catch (error) {
      failures += 1;
      console.log(`✗ fluxo ${flow.name}: ${error.message}`);
    }
  }

  if (!onlyFlows) {
    const out = join(here, "firefox", "out");
    mkdirSync(out, { recursive: true });
    for (const shot of shots) {
      await setWidth(shot.width, shot.height ?? 900);
      await seed(shot.base, shot.storage);
      await navigate(new URL(shot.path, shot.base).toString());
      await sleep(900);
      for (const step of shot.steps ?? []) {
        await evaluate(step);
        await sleep(250);
      }
      const { data } = await send("browsingContext.captureScreenshot", { context });
      writeFileSync(join(out, `${shot.name}.png`), Buffer.from(data, "base64"));
    }
    console.log(`capturas: ${shots.length} em scripts/firefox/out/`);
  }
} finally {
  if (consoleErrors.length) {
    failures += consoleErrors.length;
    console.log(`✗ erros no console (${consoleErrors.length}):\n  ${[...new Set(consoleErrors)].slice(0, 15).join("\n  ")}`);
  }
  try {
    await send("session.end", {});
  } catch {
    // o Firefox pode fechar a conexão antes de responder
  }
  socket.close();
  firefox.kill();
  await sleep(800);
  rmSync(profile, { recursive: true, force: true });
}

console.log(failures === 0 ? "✓ Firefox: nenhum problema encontrado" : `${failures} problema(s) no Firefox`);
process.exit(failures === 0 ? 0 : 1);
