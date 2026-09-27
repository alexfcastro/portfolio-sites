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

const run = (args, env) =>
  new Promise((ok, fail) => {
    // Comando único (argumentos fixos, sem entrada externa): o pnpm no Windows precisa de shell.
    const child = spawn(`pnpm ${args.join(" ")}`, { env, stdio: ["ignore", "ignore", "inherit"], shell: true });
    child.on("exit", (code) => (code === 0 ? ok() : fail(new Error(`pnpm ${args.join(" ")} saiu com código ${code}`))));
  });

const apps = ["portfolio", ...DEMOS];

if (!skipBuild) {
  for (const app of apps) {
    process.stdout.write(`build ${app}… `);
    await run(["--filter", `@ax/${app}`, "build"], envFor(app));
    console.log("ok");
  }
}

const servers = apps.map((app) => {
  const port = app === "portfolio" ? PORTFOLIO_PORT : demoPort(app);
  const child = spawn(`pnpm --filter @ax/${app} exec next start --port ${port}`, {
    env: envFor(app),
    stdio: ["ignore", "ignore", "inherit"],
    shell: true,
  });
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
