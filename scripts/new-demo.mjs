// Cria a base de uma nova demo em apps/<slug>, a partir da referência apps/barbearia.
// Copia apenas o que é comum a todas as demos (configs, barra de demonstração, URL do
// portfólio, noindex, headers, 404/erro) e registra os scripts na raiz.
// A identidade visual, os dados e os fluxos do segmento são escritos depois, à mão.
//
// Uso: node scripts/new-demo.mjs <slug> "<Nome do negócio>" <porta>
// Ex.:  node scripts/new-demo.mjs clinica "Vita Clínica" 3102

import fs, { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [slug, name, port] = process.argv.slice(2);
if (!slug || !name || !port || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !/^\d{4}$/.test(port)) {
  console.error('Uso: node scripts/new-demo.mjs <slug> "<Nome do negócio>" <porta>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reference = join(root, "apps", "barbearia");
const target = join(root, "apps", slug);
if (existsSync(target)) {
  console.error(`apps/${slug} já existe.`);
  process.exit(1);
}

function copy(file, transform = (text) => text) {
  const destination = join(target, file);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, transform(readFileSync(join(reference, file), "utf8")), "utf8");
}

const sameFiles = [
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "vitest.config.mts",
  "next.config.ts",
  "src/components/demo-bar.tsx",
  "src/config/site.test.ts",
  "src/app/robots.ts",
];
for (const file of sameFiles) copy(file);

/*
 * 404 e erro usam classes semânticas que TODA demo define no seu globals.css:
 * .wrap, .kicker, .btn, .btn-primary, .btn-secondary e a cor "muted".
 */
function write(file, text) {
  const destination = join(target, file);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, text, "utf8");
}

write(
  "src/app/not-found.tsx",
  `import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="kicker">Erro 404</p>
      <h1 className="mt-3 text-4xl font-bold">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-muted">Este endereço não existe nesta demonstração.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Voltar ao início
      </Link>
    </section>
  );
}
`,
);

write(
  "src/app/error.tsx",
  `"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="kicker">Erro inesperado</p>
      <h1 className="mt-3 text-4xl font-bold">Algo não saiu como esperado</h1>
      <p className="mt-3 max-w-md text-muted">Não foi possível exibir esta página agora.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-secondary">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
`,
);

copy("package.json", (text) => text.replace("@ax/barbearia", `@ax/${slug}`).replaceAll("3101", port));
copy(".env.example", (text) => text.replace("Bravus Barbearia", name));
copy("src/config/site.ts", (text) =>
  text
    .replace('name: "Bravus Barbearia"', `name: ${JSON.stringify(name)}`)
    .replace('slug: "barbearia"', `slug: ${JSON.stringify(slug)}`)
    .replaceAll("/projetos/barbearia", `/projetos/${slug}`)
    .replaceAll("projeto=barbearia", `projeto=${slug}`),
);

copy("src/lib/money.ts");

// Utilitário genérico de estado local (chave, versão, validação); referência em apps/oficina.
fs.copyFileSync(join(root, "apps", "oficina", "src", "lib", "local-store.ts"), join(target, "src", "lib", "local-store.ts"));
copy("src/lib/time.ts", (text) =>
  text
    .replace('import { business } from "@/data/business";', 'export const TIME_ZONE = "America/Sao_Paulo";')
    .replace("timeZone: business.timeZone", "timeZone: TIME_ZONE")
    .replace(
      'import type { BusinessNow } from "@/types/booking";',
      "/** Momento atual no fuso do negócio. */\nexport interface BusinessNow {\n  date: string;\n  minutes: number;\n}",
    ),
);

write(
  "src/components/message-preview.tsx",
  `"use client";

import { MessageCircle, X } from "lucide-react";
import { useRef } from "react";

interface MessagePreviewProps {
  businessName: string;
  message: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

/**
 * Prévia LOCAL de mensagem (estilo de mensageiro). Não há destinatário real e nada é enviado.
 * <dialog> nativo: foco preso, Escape fecha e o foco volta ao botão.
 */
export function MessagePreview({
  businessName,
  message,
  triggerLabel = "Prévia da mensagem",
  triggerClassName = "btn btn-secondary",
}: MessagePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => dialogRef.current?.showModal()}>
        <MessageCircle aria-hidden className="size-4" />
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="preview-title"
        className="m-auto w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-demo-bg p-0 text-demo-ink shadow-2xl backdrop:bg-black/60"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-3 bg-wa-head px-5 py-3 text-white">
          <div>
            <h2 id="preview-title" className="text-base font-semibold">
              {businessName}
            </h2>
            <p className="text-xs text-wa-subtle">Prévia local · contato fictício</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Fechar prévia</span>
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto bg-wa-chat px-5 py-6">
          <p className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-wa-bubble px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-white">
            {message}
          </p>
        </div>
        <p className="px-5 py-4 text-sm leading-relaxed text-demo-muted">
          <strong className="text-demo-ink">Nenhuma mensagem foi enviada.</strong> Esta é só uma prévia de como a
          mensagem chegaria em um site real. {businessName} é um negócio fictício e não tem número.
        </p>
      </dialog>
    </>
  );
}
`,
);

// Tokens obrigatórios (faixa de demonstração e prévia de mensagem); a identidade vem depois.
write(
  "src/app/globals.css",
  `@import "tailwindcss";

@theme {
  /* Faixa de demonstração e prévia de mensagem: neutras, separadas da identidade do negócio */
  --color-demo-bg: #f6f5f1;
  --color-demo-ink: #14161a;
  --color-demo-muted: #555962;
  --color-wa-head: #1f3b33;
  --color-wa-subtle: #cfe3dc;
  --color-wa-chat: #0f1a17;
  --color-wa-bubble: #1e5c4b;
}

/* Títulos focados por script e o próprio <dialog> não são controles: sem anel visual. */
[tabindex="-1"]:focus,
[tabindex="-1"]:focus-visible,
dialog:focus,
dialog:focus-visible {
  outline: none;
}
`,
);

const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.scripts[`dev:${slug}`] = `pnpm --filter @ax/${slug} dev`;
pkg.scripts[`build:${slug}`] = `pnpm --filter @ax/${slug} build`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`✓ apps/${slug} criado (porta ${port}). Próximos passos:`);
console.log("  1. pnpm install");
console.log("  2. Escreva globals.css (identidade), layout.tsx, páginas, dados e testes do segmento.");
console.log(`  3. Mude demoStatus de "${slug}" para "in_progress" em apps/portfolio/src/data/projects.ts.`);
