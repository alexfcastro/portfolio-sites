# Alex Castro — portfólio e demonstrações (monorepo)

Monorepo do portfólio profissional de **Alex Castro (AX)** — sites e soluções digitais para pequenos e médios negócios — e das 12 aplicações demonstrativas de cada segmento.

**Estado atual:** Fases 1 a 5 implementadas e validadas localmente: portfólio + 12 demos. Nada publicado. Veja [`docs/status.md`](docs/status.md).

## Arquitetura

```text
apps/
  barbearia/            Demo Bravus Barbearia (porta 3101): agendamento simulado + painel /admin
  clinica/              Demo Vita Clínica (3102): especialidades + solicitação de horário
  restaurante/          Demo Sabor & Brasa (3103): cardápio, adicionais, carrinho, entrega
  oficina/              Demo Torque Auto Center (3104): triagem de orçamento, fotos locais, acompanhamento
  servicos/             Demo Resolve Serviços (3105): região, perguntas guiadas, disponibilidade
  autonomo/             Demo Lia Torres · Linha Direta Profissional (3106): portfólio filtrável, pedido de proposta
  advocacia/            Demo Almeida & Prado (3107): áreas, equipe, artigos, conversa inicial sem dados pessoais
  imobiliaria/          Demo Horizonte Imóveis (3108): busca com filtros, imóvel, favoritos, interesse
  petshop/              Demo PetVille (3109): pet → serviço → data → resumo, lembrete preparado
  academia/             Demo Pulse Studio (3110): grade filtrável, aula experimental com vagas, planos, painel
  produtos-naturais/    Demo Raiz & Grão (3111): catálogo, venda por peso, carrinho, retirada ou entrega
  floricultura/         Demo Flor & Afeto (3112): ocasião, personalização, cartão, data e período, carrinho
  portfolio/            Portfólio (Next.js, porta 3000)
    src/app/            Rotas: /, /projetos, /projetos/[slug], /sobre, /contato, /privacidade, 404
    src/components/     ui/ · layout/ · sections/ · projects/ · contact/
    src/config/         site.ts (configuração pública central) · demos.ts (URLs das demos)
    src/data/           Conteúdo: projects.ts (12 cases), home.ts, categories.ts, contact.ts, navigation.ts
    src/lib/            Regras testadas: URLs, estado das demos, contato, metadata, geometria da marca
    public/brand/       Marca AX em SVG
    public/projects/    Capturas reais das demos (scripts/capture-screenshots.mjs)
docs/                   assets.md · decisions.md · validation.md · status.md
scripts/                new-demo.mjs · local-preview.mjs · capture-screenshots.mjs + screenshots/<slug>.json
                        check-reflow.mjs + reflow/pages.json · check-contrast.mjs · firefox-check.mjs + firefox/flows.mjs
```

- Cada app em `apps/<slug>` tem suas próprias dependências, dados, estilos e build. Nenhum app importa código de outro.
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

## Testar tudo localmente

**Jeito mais fácil (Windows):** clique duas vezes em `iniciar-previa.cmd`, na raiz do projeto. Ele encontra o Node e o pnpm (mesmo que o terminal não os reconheça), instala as dependências e gera os builds se for a primeira vez, sobe tudo e abre o navegador em http://localhost:3100. Para encerrar, feche a janela.

Pelo terminal:

```bash
pnpm install
pnpm preview:local
```

Se o terminal disser que `pnpm` não é reconhecido, feche e abra o terminal de novo (ele foi aberto antes de o pnpm entrar no PATH) ou use o `iniciar-previa.cmd`.

Gera os builds de produção já interligados e sobe o portfólio em http://localhost:3100 e as 12 demos em http://localhost:3101 a 3112 (lista completa no terminal). O primeiro build leva alguns minutos; depois, `pnpm preview:local --skip-build` sobe os servidores direto. Ctrl+C encerra tudo.

Nessa prévia, cada case mostra "Abrir demonstração", e cada demo tem "Voltar ao portfólio", "Ver case" e "Solicitar um site como este". Tudo continua `noindex`, e nenhuma demo envia mensagens ou pedidos. O contato do portfólio aparece como "Contato em configuração" até você informar WhatsApp ou e-mail (veja a seção de variáveis). Os dados que você cria nas demos (agendamentos, carrinhos, favoritos) ficam só no navegador; cada demo tem um botão para limpar.

## Comandos (todos verificados)

```bash
pnpm install            # instala com o lockfile
pnpm dev:portfolio      # desenvolvimento em http://localhost:3000
pnpm lint               # ESLint (config do Next)
pnpm typecheck          # next typegen + tsc --noEmit
pnpm test               # Vitest: dados, estado das demos, URLs, link do WhatsApp, formulário
pnpm build:portfolio    # build de produção do portfólio
pnpm dev:<slug>         # demo em desenvolvimento (ex.: pnpm dev:clinica → porta 3102)
pnpm build:<slug>       # build de produção de uma demo, independente do portfólio
pnpm build              # build de todos os apps existentes
pnpm preview:local      # builds interligados + portfólio (3100) e demos (3101–3112)
pnpm check:reflow       # reflow em 8 larguras, 49 páginas (com a prévia local no ar)
pnpm check:contrast     # contraste AA de todos os textos visíveis, 390 e 1280 px
pnpm check:firefox      # reflow, fluxos, teclado e console no Firefox (WebDriver BiDi)
```

`lint`, `typecheck` e `test` rodam em todos os apps.

Porta ocupada? Rode em outra porta:

```bash
pnpm --filter @ax/portfolio exec next dev --port 3100
```

Build de produção local: `pnpm build:portfolio` e depois `pnpm --filter @ax/portfolio exec next start --port 3100`.

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

### Variáveis das demos (`apps/<slug>/.env.local`)

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_DEPLOY_ENV` | Como no portfólio. A demo é **sempre** `noindex`. |
| `NEXT_PUBLIC_PORTFOLIO_URL` | URL do portfólio para "Voltar ao portfólio", "Ver case" e "Solicitar um site como este". Em `next dev`, sem valor, usa `http://localhost:3000`; em build, sem valor, esses links somem. |

Para testar ida e volta localmente com builds de produção:

```bash
set NEXT_PUBLIC_DEMO_URL_BARBEARIA=http://localhost:3101&& pnpm build:portfolio
```

```bash
set NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000&& pnpm build:barbearia
```

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
2. Coloque uma prévia conceitual em `public/projects/<slug>/` (mídia com `kind: "concept"`, rotulada como "Prévia conceitual").
3. Acrescente a entrada `NEXT_PUBLIC_DEMO_URL_<SLUG>` em `src/config/demos.ts` e no `.env.example`.
4. Rode `pnpm test`: os testes conferem slugs, categorias, imagens e estados. (Se o total mudar de 12, ajuste o teste de propósito; o teste de estado hoje espera as 12 demos implementadas.)

Nenhuma página nova é necessária: `/projetos/[slug]` é gerada a partir dos dados.

## Como iniciar uma nova demo (Fase 2 em diante)

1. Gere a base: `node scripts/new-demo.mjs <slug> "<Nome>" <porta>` e rode `pnpm install`. O gerador cria configs, barra de demonstração, URL do portfólio, `noindex`, 404/erro, prévia de mensagem, `createLocalStore` e os scripts `dev:<slug>`/`build:<slug>`.
2. Escreva a identidade (`globals.css`, definindo `.wrap`, `.kicker`, `.btn`, `.btn-primary`, `.btn-secondary` e a cor `muted`), o layout, os dados e as regras do segmento com testes. Não importe nada de outro app.
3. Ao começar, mude o `demoStatus` do projeto para `in_progress` (o card mostra "Em desenvolvimento", sem link).
4. Depois de validar o fluxo, gere capturas reais (desktop e mobile) com o script, a partir de um JSON como [`scripts/screenshots/barbearia.json`](scripts/screenshots/barbearia.json):

   ```bash
   node scripts/capture-screenshots.mjs scripts/screenshots/barbearia.json http://localhost:3101
   ```

   Depois, nos dados: use `media` com `kind: "screenshot"`, marque os recursos implementados, defina `technologies` e mude para `demoStatus: "available"`. Acrescente o slug em `IMPLEMENTED_DEMOS` no teste do portfólio. (Usa o Chrome instalado; outro caminho via `CHROME_PATH`.)
5. Sem URL válida no ambiente, o portfólio exibe "Publicação em breve". O botão "Abrir demonstração" só aparece com `available` **e** URL válida (em produção: HTTPS, sem `localhost`).

Referência completa: `apps/barbearia` (fuso `America/Sao_Paulo`, estado em `localStorage` com chave própria, versão e reset, barra de demonstração, `noindex`).

## Publicação

Nenhuma hospedagem foi contratada nem configurada. Opção compatível documentada: **Vercel** (tem plano gratuito e suporta monorepos pnpm).

Para o portfólio:

- **Root Directory:** `apps/portfolio` · **Install:** `pnpm install` (o host detecta o workspace pelo lockfile da raiz) · **Build:** `pnpm build`.
- Variáveis: `NEXT_PUBLIC_DEPLOY_ENV=production`, `NEXT_PUBLIC_SITE_URL=<URL real>` e os contatos reais.
- Em previews do host, use `NEXT_PUBLIC_DEPLOY_ENV=preview` (continua `noindex`).
- Cada demo é outro projeto no host, apontando para `apps/<slug>` (ex.: `apps/barbearia`, com `NEXT_PUBLIC_DEPLOY_ENV=production` e `NEXT_PUBLIC_PORTFOLIO_URL`). Depois de publicada, configure `NEXT_PUBLIC_DEMO_URL_<SLUG>` no portfólio e republique-o.
- Alterações só em uma demo não exigem republicar o portfólio, exceto quando mudam as capturas ou os dados do case.

Depois de publicar, verifique na URL real: HTTPS, assets, refresh direto em `/projetos/<slug>`, 404, contato, metadata e indexação. Build local bem-sucedido não comprova o deploy.

## Documentação

- [`docs/status.md`](docs/status.md): fase concluída, pendências e próximo passo.
- [`docs/validation.md`](docs/validation.md): o que foi verificado e como.
- [`docs/decisions.md`](docs/decisions.md): decisões e justificativas.
- [`docs/assets.md`](docs/assets.md): origem e licença dos assets.
