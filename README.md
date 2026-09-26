# Alex Castro — portfólio e demonstrações (monorepo)

Monorepo do portfólio profissional de **Alex Castro (AX)** — sites e soluções digitais para pequenos e médios negócios — e, nas próximas fases, das aplicações demonstrativas de cada segmento.

**Estado atual:** Fase 1 implementada e validada localmente (prévia). Nenhuma demo completa existe ainda. Veja [`docs/status.md`](docs/status.md).

## Arquitetura

```text
apps/
  portfolio/            Portfólio (Next.js). Único app existente.
    src/app/            Rotas: /, /projetos, /projetos/[slug], /sobre, /contato, /privacidade, 404
    src/components/     ui/ · layout/ · sections/ · projects/ · contact/
    src/config/         site.ts (configuração pública central) · demos.ts (URLs das demos)
    src/data/           Conteúdo: projects.ts (12 cases), home.ts, categories.ts, contact.ts, navigation.ts
    src/lib/            Regras testadas: URLs, estado das demos, contato, metadata, geometria da marca
    public/brand/       Marca AX em SVG
    public/projects/    Capas conceituais (geradas por scripts/generate-covers.mjs)
docs/                   assets.md · decisions.md · validation.md · status.md
```

- Cada app em `apps/<slug>` terá suas próprias dependências, dados, estilos e build. Nenhum app importa código de outro.
- O portfólio conhece as demos apenas por metadata (`src/data/projects.ts`) e URL (`src/config/demos.ts`).
- Não há pacotes compartilhados: `packages/*` só será criado quando houver código efetivamente compartilhado.

## Pré-requisitos e versões

| Ferramenta | Versão usada |
|---|---|
| Node.js | 24.19.0 (mínimo exigido pelo Next: 20.9) |
| pnpm | 12.6.0 (fixado em `packageManager`) |
| Next.js | 16.3.6 · React 19.3.0 · TypeScript 6.0.3 · Tailwind CSS 4.3.3 |

Ative o pnpm pelo Corepack (sem administrador, instalando o atalho na pasta global do npm):

```bash
corepack enable --install-directory "%APPDATA%\npm" pnpm
```

## Comandos (todos verificados)

```bash
pnpm install            # instala com o lockfile
pnpm dev:portfolio      # desenvolvimento em http://localhost:3000
pnpm lint               # ESLint (config do Next)
pnpm typecheck          # next typegen + tsc --noEmit
pnpm test               # Vitest: dados, estado das demos, URLs, link do WhatsApp, formulário
pnpm build:portfolio    # build de produção do portfólio
pnpm build              # build de todos os apps existentes (hoje, só o portfólio)
```

Porta ocupada? Rode em outra porta:

```bash
pnpm --filter @ax/portfolio exec next dev --port 3100
```

Build de produção local: `pnpm build:portfolio` e depois `pnpm --filter @ax/portfolio exec next start --port 3100`.

Regenerar as capas conceituais depois de editar o script: `pnpm --filter @ax/portfolio covers`.

## Configuração (variáveis de ambiente)

Tudo é **opcional**: sem variáveis, o site roda em modo prévia, com `noindex`, sem links de contato e com "Contato em configuração". Copie `apps/portfolio/.env.example` para `apps/portfolio/.env.local` (o app **não** lê um `.env` da raiz).

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_DEPLOY_ENV` | `development` · `preview` · `production`. Só `production` + URL válida libera indexação e sitemap. |
| `NEXT_PUBLIC_SITE_URL` | **Única** URL pública canônica (canonical, Open Graph, sitemap). HTTPS; `localhost` e domínios de exemplo são rejeitados fora do desenvolvimento. |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | WhatsApp de Alex **com código do país** (ex.: `5511912345678`). Mínimo de 12 dígitos. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail de contato real. |
| `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY` | Opcional: como exibir o telefone. |
| `NEXT_PUBLIC_SOCIAL_*` | Perfis (HTTPS). Links só aparecem se preenchidos. |
| `NEXT_PUBLIC_CITY`, `NEXT_PUBLIC_SERVICE_AREA` | Somente com dados confirmados. |
| `NEXT_PUBLIC_DEMO_URL_<SLUG>` | URL de cada demo (ex.: `NEXT_PUBLIC_DEMO_URL_BARBEARIA`). |

- Todas são públicas (embutidas no JavaScript do navegador). **Nunca coloque segredos** nelas.
- Os valores são fixados **no build**: alterar qualquer um exige novo build/deploy.
- Valores ausentes ou inválidos viram `null` e os links correspondentes somem (nada de `mailto:null` ou `wa.me/undefined`).

## Contato: o que conta como envio

O formulário **não tem backend**. Ele valida os campos, monta a mensagem e mostra uma revisão. Depois disso:

- **Com WhatsApp configurado:** o botão "Continuar no WhatsApp" abre `wa.me` com o texto revisado. A mensagem só é enviada se o visitante confirmar no WhatsApp. O site nunca diz "enviado".
- **Só com e-mail:** abre o aplicativo de e-mail do visitante com o texto preenchido; mesma regra.
- **Sem canal:** aparece "Contato em configuração" e nada é encaminhado.

Nada é salvo no navegador nem enviado a servidores. Para um backend futuro, a validação (`src/lib/contact/form.ts`) e a montagem da mensagem já estão separadas da entrega (`src/lib/contact/channels.ts`).

## Como alterar conteúdo e marca

- **Textos da Home:** `src/data/home.ts`. **Navegação:** `src/data/navigation.ts`.
- **Cases:** `src/data/projects.ts` (problema, solução, fluxo, recursos, SEO, destaque na Home via `featuredOrder`).
- **Cores, fontes, raios e sombras:** tokens em `src/app/globals.css` (`@theme`).
- **Marca:** geometria em `src/lib/brand.ts`; arquivos em `public/brand/`; favicon em `src/app/icon.svg`; imagem de compartilhamento em `src/app/og-image.png/route.tsx`.
- **Domínio/URL:** apenas `NEXT_PUBLIC_SITE_URL`.

### Adicionar um case

1. Acrescente um item em `src/data/projects.ts` (slug em minúsculas com hífen, `demoStatus: "planned"`, recursos com `status: "planned"`, `technologies: []`).
2. Coloque a capa em `public/projects/<slug>/cover.svg` (ou crie a função no gerador de capas).
3. Acrescente a entrada `NEXT_PUBLIC_DEMO_URL_<SLUG>` em `src/config/demos.ts` e no `.env.example`.
4. Rode `pnpm test`: os testes conferem slugs, categorias, imagens e estados. (Se o total mudar de 12, ajuste o teste de propósito.)

Nenhuma página nova é necessária: `/projetos/[slug]` é gerada a partir dos dados.

## Como iniciar uma nova demo (Fase 2 em diante)

1. Crie `apps/<slug>` com seu próprio `package.json` (nome `@ax/<slug>`), dependências, dados e estilos. Não importe nada de `apps/portfolio`.
2. Adicione na raiz os scripts `dev:<slug>` e `build:<slug>` e escolha uma porta própria (ex.: 3001).
3. Ao começar, mude o `demoStatus` do projeto para `in_progress` (o card mostra "Em desenvolvimento", sem link).
4. Depois de validar o fluxo: capture telas reais (desktop e mobile) em `public/projects/<slug>/`, troque `media.kind` para `"screenshot"`, marque os recursos implementados, defina `technologies`, configure `NEXT_PUBLIC_DEMO_URL_<SLUG>` e só então use `demoStatus: "available"`.
5. O botão "Abrir demonstração" só aparece com `available` **e** URL válida para o ambiente (em produção: HTTPS, sem `localhost`).

## Publicação

Nenhuma hospedagem foi contratada nem configurada. Opção compatível documentada: **Vercel** (tem plano gratuito e suporta monorepos pnpm).

Para o portfólio:

- **Root Directory:** `apps/portfolio` · **Install:** `pnpm install` (o host detecta o workspace pelo lockfile da raiz) · **Build:** `pnpm build`.
- Variáveis: `NEXT_PUBLIC_DEPLOY_ENV=production`, `NEXT_PUBLIC_SITE_URL=<URL real>` e os contatos reais.
- Em previews do host, use `NEXT_PUBLIC_DEPLOY_ENV=preview` (continua `noindex`).
- Cada demo futura será outro projeto no host, apontando para `apps/<slug>`.

Depois de publicar, verifique na URL real: HTTPS, assets, refresh direto em `/projetos/<slug>`, 404, contato, metadata e indexação. Build local bem-sucedido não comprova o deploy.

## Documentação

- [`docs/status.md`](docs/status.md): fase concluída, pendências e próximo passo.
- [`docs/validation.md`](docs/validation.md): o que foi verificado e como.
- [`docs/decisions.md`](docs/decisions.md): decisões e justificativas.
- [`docs/assets.md`](docs/assets.md): origem e licença dos assets.
