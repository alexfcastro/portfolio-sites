// Prévia local completa: gera os builds de produção já interligados e sobe o portfólio e as 12 demos.
//
// Uso:
//   pnpm preview:local               # build de tudo + servidores
//   pnpm preview:local --skip-build  # só sobe os servidores (usa os builds existentes)
//
// Portfólio em http://localhost:3100 e demos em 3101–3112 (as portas 3000/3001 ficam livres para outros projetos).
// Os builds usam NEXT_PUBLIC_DEPLOY_ENV=development, única forma de aceitar URLs `localhost`: o portfólio mostra
// "Abrir demonstração" e as demos apontam de volta para o portfólio. Tudo continua `noindex`.
// Ctrl+C encerra todos os servidores.

import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PORTFOLIO_PORT = 3100;
const DEMOS = [
  "barbearia",
  "clinica",
  "restaurante",
  "oficina",
  "servicos",
  "autonomo",
  "advocacia",
  "imobiliaria",
  "petshop",
  "academia",
  "produtos-naturais",
  "floricultura",
];
const portfolioUrl = `http://localhost:${PORTFOLIO_PORT}`;
const demoPort = (slug) => PORTFOLIO_PORT + 1 + DEMOS.indexOf(slug);
const skipBuild = process.argv.includes("--skip-build");

const envFor = (app) => {
  const env = { ...process.env, NEXT_PUBLIC_DEPLOY_ENV: "development" };
  if (app === "portfolio") {
    for (const slug of DEMOS) env[`NEXT_PUBLIC_DEMO_URL_${slug.toUpperCase().replace(/-/g, "_")}`] = `http://localhost:${demoPort(slug)}`;
  } else {
    env.NEXT_PUBLIC_PORTFOLIO_URL = portfolioUrl;
  }
  return env;
};

// Chama o Next de cada app direto pelo Node (sem pnpm): funciona mesmo se o executável do pnpm estiver bloqueado.
const nextBin = (app) => join(root, "apps", app, "node_modules", "next", "dist", "bin", "next");
const next = (app, args, env, stdio = ["ignore", "ignore", "inherit"]) =>
  spawn(process.execPath, [nextBin(app), ...args], { cwd: join(root, "apps", app), env, stdio });

const build = (app) =>
  new Promise((ok, fail) => {
    const child = next(app, ["build"], envFor(app));
    child.on("exit", (code) => (code === 0 ? ok() : fail(new Error(`build de ${app} saiu com código ${code}`))));
  });

const apps = ["portfolio", ...DEMOS];

if (!skipBuild) {
  for (const app of apps) {
    process.stdout.write(`build ${app}… `);
    try {
      await build(app);
    } catch {
      // Um cache de build corrompido (ex.: build interrompido) às vezes faz o Turbopack falhar ao processar as
      // fontes do Google. Apaga o cache do app e tenta de novo uma vez.
      process.stdout.write("falhou; limpando o cache e tentando de novo… ");
      rmSync(join(root, "apps", app, ".next"), { recursive: true, force: true });
      await build(app);
    }
    console.log("ok");
  }
}

const servers = apps.map((app) => {
  const port = app === "portfolio" ? PORTFOLIO_PORT : demoPort(app);
  const child = next(app, ["start", "--port", String(port)], envFor(app));
  console.log(`${app.padEnd(18)} http://localhost:${port}`);
  return child;
});

console.log("\nServidores no ar. Ctrl+C para encerrar.");
const stop = () => {
  for (const child of servers) child.kill();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
