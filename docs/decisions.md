# Decisões relevantes

Registro curto das escolhas feitas na Fase 1 (26/09/2026) e o porquê.

## Stack e versões

- **Next.js 16.3.6 + React 19.3 + Tailwind 4.3**, versões estáveis mais recentes no início da implementação.
- **TypeScript 6.0.3, não 7.0.** O `typescript-eslint` (usado pela config de lint do Next) só aceita TypeScript `< 6.1`.
- **ESLint 9.39, não 10.** Os plugins `import`, `jsx-a11y` e `react`, usados pelo `eslint-config-next`, ainda não declaram suporte ao ESLint 10. O npm marca a 9.x como "deprecated", mas ela é a única combinação sem conflito de peers.
- **pnpm 12 com scripts de instalação bloqueados.** `unrs-resolver` ficou `false` em `allowBuilds` porque o binário chega pronto via dependência opcional.
- **Sem Turborepo e sem `packages/*`.** Existe só um app; não há o que compartilhar.
- **Vitest** para testes das regras puras (sem DOM). O fluxo em navegador foi verificado manualmente com o navegador embutido (ver `validation.md`); não foi instalado Playwright para evitar download de navegadores nesta fase.

## Identidade

- **Cor de destaque: azul cobalto `#2F54EB`** (versão clara `#8FA6FF` sobre fundo escuro). Transmite confiança sem o azul corporativo genérico, contrasta com grafite e off-white e atinge contraste AA como texto (~5,8:1 sobre branco).
- **Monograma:** a perna direita do "A" é também um traço do "X"; o segundo traço do X, na cor de destaque, cruza essa perna. As pontas são cortadas na horizontal. É desenhado como **polígonos** (não como traços recortados) para renderizar igual em navegadores, favicon e no gerador de imagens.
- **Tipografia:** Manrope (títulos) + Inter (texto), servidas pelo próprio site via `next/font`.
- **Manrope com `display: "optional"`.** Com `swap`, os títulos grandes mudavam de 2 para 3 linhas quando a fonte chegava, deslocando a listagem (CLS 0,2 no Lighthouse). Com `optional`, uma primeira visita em rede lenta pode ver o título na fonte de fallback, sem salto de layout.
- **Tema claro único**, com seções escuras para ritmo visual. Sem alternador claro/escuro, que o briefing não exige.

## Conteúdo e dados

- **Um único arquivo de dados** (`src/data/projects.ts`) com os 12 cases. `caseUrl` é derivado do slug.
- **Filtros por segmento e por tipo de solução.** Só com a categoria, nunca haveria "sem resultados"; a combinação dos dois torna o estado vazio real e útil.
- **Destaques na Home:** Bravus Barbearia, Sabor & Brasa, Horizonte Imóveis, Flor & Afeto e Vita Clínica (5), escolhidos pela variedade visual e de fluxo.
- **Capas conceituais em SVG gerado por script.** São leves (9–20 KB), nítidas em qualquer tela e não dependem de fotos licenciadas. Sombras feitas com camadas simples: o filtro de desfoque original atrasava a exibição da capa (LCP) em celulares.

## Contato

- **Revisão obrigatória antes de encaminhar.** O visitante vê o texto exato; o link `wa.me` só é gerado a partir desse texto.
- **Botão de envio desabilitado até a hidratação.** Durante os testes, um clique antes do JavaScript carregar fazia o envio nativo (GET) e colocava nome e mensagem na URL. Com o botão desabilitado, o envio implícito por Enter também fica bloqueado.
- **WhatsApp exige ≥ 12 dígitos.** Com 10–11 dígitos não há como distinguir um celular brasileiro sem o 55 (ex.: DDD 11) de um código de país. Consequência: números norte-americanos (+1, 11 dígitos) não são aceitos como destinatário.
- **Botão flutuante do WhatsApp** só existe com número configurado; fica oculto em `/contato`; o rodapé ganha espaço extra para não ser coberto.
- **Página de contato estática:** `?projeto=` é lido no cliente (`useSearchParams` com `Suspense`), e o fallback é o próprio formulário sem pré-seleção.

## SEO, segurança e privacidade

- **Uma URL canônica** (`NEXT_PUBLIC_SITE_URL`). Sem ela não há canonical, `og:url`, `og:image` nem sitemap, para nunca publicar `localhost`.
- **Imagem Open Graph como rota comum** (`/og-image.png`), não pela convenção `opengraph-image`: a convenção sempre gera meta tag absoluta, mesmo sem URL válida.
- **Indexação só em `production` + URL válida.** Fora disso: `<meta name="robots" content="noindex, nofollow">`, robots.txt permitindo rastreio (para a diretiva ser lida) e sitemap vazio.
- **Headers:** `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` e CSP mínima (`frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`). **CSP completa (script-src) não foi ativada:** exigiria nonce ou hashes para os scripts do Next e testes no host final. Se uma prévia de demo em iframe for adicionada, `frame-ancestors`/`X-Frame-Options` precisam ser revistos.
- **Sem analytics, pixels ou cookies.** A política de privacidade descreve isso e se adapta ao modo de contato configurado.

## Arquivos gerados pelo Next

- `apps/portfolio/AGENTS.md` e `CLAUDE.md` são criados pelo `next dev` 16.3 e apontam agentes de IA para a documentação da versão instalada (`node_modules/next/dist/docs`). Foram mantidos porque ajudam quem continuar o projeto com Codex ou Claude Code.
