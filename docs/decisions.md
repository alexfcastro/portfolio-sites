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

## Fase 2 — demos

- **Um app Next.js por demo** (`apps/<slug>`), com dependências próprias, identidade própria e nenhum import entre apps. A demo conhece o portfólio só por `NEXT_PUBLIC_PORTFOLIO_URL`.
- **Validação de URL duplicada, não compartilhada.** A barbearia tem sua própria função pequena de validação da URL do portfólio. Criar `packages/*` para ~20 linhas exigiria configurar transpilação e deixaria as publicações acopladas; será reavaliado quando houver mais código em comum.
- **Portas:** barbearia em **3101** (as portas 3000/3001 desta máquina estão ocupadas por outro projeto). Próximas demos: 3102, 3103…
- **Estado no `localStorage`** com chave própria (`ax-bravus-demo`), versão e reset: permite ver no painel, em outra aba do mesmo navegador, o agendamento feito. Só guarda dados fictícios. Em outro dia, a agenda de exemplo é recriada (e os agendamentos de teste somem), para nunca mostrar datas vencidas.
- **Datas como texto no fuso do negócio** (`America/Sao_Paulo`) e horários em minutos, calculados via `Intl`: o fuso do visitante não altera a agenda.
- **Agenda de exemplo determinística** (gerador pseudoaleatório com semente = data + profissional), mais cheia no início da semana e com vaga garantida para o serviço mais longo de cada profissional.
- **Identidade de cliente fixa** ("Cliente de demonstração"): a demo não pede nome, telefone nem e-mail.
- **WhatsApp na demo = prévia local** em `<dialog>`, sem link externo. O único contato real é "Solicitar um site como este", que leva ao portfólio.
- **Painel sem login falso**, com aviso explícito de que é público e sem segurança de produção.
- **Estado exibido "Publicação em breve"**: dado `available` + nenhuma URL válida no ambiente. O briefing define "disponível" como validado **e** com URL; a demo existe e foi testada, mas não pode ser chamada de disponível nem ganhar botão enquanto não estiver publicada.
- **Capturas reais via DevTools Protocol** (`scripts/capture-screenshots.mjs`), usando o WebSocket nativo do Node, sem Puppeteer/Playwright: emula celular de verdade e executa passos (cliques) antes de capturar.

## Fase 3

- **Gerador de demos** (`scripts/new-demo.mjs`): cria a base comum a partir da barbearia e escreve 404/erro com classes semânticas (`.wrap`, `.kicker`, `.btn`, `.btn-primary`, `.btn-secondary`, cor `muted`) que cada identidade define. Código gerado é copiado (não compartilhado), mantendo cada app independente para publicar.
- **`createLocalStore`**: utilitário único de estado local (chave, versão, validação, sincronização entre abas), copiado para cada demo nova. A barbearia mantém sua implementação original.
- **Demos só guardam o mínimo**: clínica e oficina salvam as solicitações de demonstração (sem dados de saúde nem fotos); a Resolve salva só o contador de protocolo; o restaurante salva o carrinho.
- **Clínica sem campo livre**: o fluxo não tem texto livre nem upload, para não induzir o envio de dados de saúde.
- **Estimativa da oficina é uma faixa** somada a partir dos serviços prováveis, sempre rotulada como demonstrativa.
- **Cabeçalhos com versão compacta abaixo de 380 px** e verificação de reflow por `innerWidth`, e não por `scrollWidth`, porque a emulação móvel alarga o layout.
- **Nomes de tokens de cor não podem coincidir com utilitários do Tailwind** (`base`, `sm`, `lg`, `xl`…), senão `text-base` vira cor.

## Fases 4 e 5

- **Conteúdo sensível verificado por teste.** Advocacia: varredura contra promessa de resultado, comparação e depoimentos, e contra números de registro profissional. Raiz & Grão: varredura contra alegações de saúde. Os testes leem todos os arquivos TS/TSX, não só os dados.
- **Nenhum dado pessoal nas demos.** A academia pede só um apelido; o PetVille, o nome do pet; a Flor & Afeto, um nome fictício de quem recebe ou retira. Endereço, telefone e documentos nunca são pedidos; a entrega usa bairros fictícios.
- **Lembrete do PetVille só como prévia.** O "lembrete preparado" mostra a mensagem e a data da véspera, sem agendar nem enviar nada.
- **Aula experimental: uma por pessoa, com reserva até 30 min antes.** A regra fica em `validateTrial` e é conferida de novo no clique de confirmar.
- **Venda por peso em inteiros.** Pesos em gramas e preços em centavos; o preço da opção é o preço do quilo × gramas ÷ 1000, arredondado para o centavo mais próximo (meio centavo para cima), e a promoção é aplicada depois, também arredondada. Por isso 2 × 250 g (R$ 29,96) pode diferir de 500 g (R$ 29,95): cada embalagem tem seu preço.
- **Carrinho da Flor & Afeto com itens completos.** Cada item é personalizado inteiro (tamanho, adicionais, cartão, entrega, data, período e destinatário), porque em floricultura cada presente costuma ter destino e cartão próprios. Itens com o mesmo bairro, dia, período e destinatário saem na mesma entrega e pagam uma taxa só; o botão "Usar a mesma entrega do item anterior" evita redigitar. Itens com data vencida ficam marcados e impedem a finalização. O estado antigo (versão 1, só a numeração) é migrado sem perder o número do próximo pedido.
- **Filtros iniciados pela URL são remontados quando a URL muda** (`key` com o parâmetro), para os links do menu funcionarem na mesma página.
- **Gerador de capas conceituais removido.** Com as 12 demos implementadas, nenhuma capa conceitual é usada. O tipo `kind: "concept"` continua no contrato de dados para cases futuros.
- **Selo e captura principal do case como links para a demo.** Com a demo disponível e URL válida, o selo "Demonstração disponível" (topo e quadro "Demonstração") e a captura principal do case abrem a demo em nova aba; a captura ganha o indicador "Abrir demonstração", visível também no celular. Sem URL válida (ex.: produção antes de publicar as demos), nada fica clicável e o estado continua "Publicação em breve".

