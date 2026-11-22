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
- **Redesenho do portfólio.** Primeira dobra escura com a faixa das 12 capturas em movimento; a segunda cópia da faixa (laço visual) fica fora da leitura e do teclado. Cards sem a lista de recursos (ela continua no case) e com a captura em moldura de navegador. Entrada ao rolar feita só em CSS (`animation-timeline: view()`), sem JavaScript: onde não há suporte, o conteúdo aparece pronto.
- **Retratos de equipe gerados por IA.** Para as demos parecerem sites reais, a equipe fictícia ganha retratos gerados por IA de pessoas que não existem (prompts pedem que não lembrem ninguém conhecido). As seções continuam dizendo que a equipe é fictícia e o rodapé avisa que as fotos são geradas por IA. Isso substitui o critério anterior de "sem pessoas identificáveis".
- **Movimento sempre iniciado pela pessoa.** Efeitos de hover, entradas ao rolar e faixa ligada à rolagem, em vez de animações contínuas, para o site parecer vivo sem exigir botão de pausa (WCAG 2.2.2). O kit de movimento fica no fim do `globals.css` de cada demo, com um bloco próprio por negócio.
- **Toda foto dentro de uma moldura (`.foto`).** O componente `Foto` passou a renderizar a imagem dentro de um contêiner que recorta o zoom; classes de tamanho, proporção e cantos vão na moldura.
- **Painéis de destaque com a paleta de cada demo** (`apps/portfolio/src/data/project-themes.ts`), para o portfólio mostrar que cada negócio tem identidade própria.
- **Marca "Estúdio X, por Alex Castro" (13/11/2026).** O portfólio passou a se apresentar como estúdio, mantendo visível que é um profissional só: o nome do proprietário aparece junto da marca no cabeçalho, no rodapé e em "Sobre", e os textos continuam em primeira pessoa. `siteConfig.name` é a marca e `siteConfig.owner` é a pessoa. O símbolo é um X de dois traços, o segundo interrompido no cruzamento, em vetor (criação própria); os arquivos em `public/brand/` mantiveram os nomes antigos (`ax-*`) para não quebrar referências. Pendente do proprietário: conferir disponibilidade do nome (domínio, redes sociais e INPI) antes de publicar.

## Rodada de acabamento a partir do relatório de 17/11/2026

- Cabeçalho do Sabor & Brasa: no celular o carrinho mostra só ícone e contagem (o botão passava da margem com barra de rolagem). "1 item" no singular. Reflow passou a testar também 375 px.
- Página inicial sem repetição: a abertura em 3D mostra seis projetos diferentes dos três destaques; o índice dos 12 saiu da home (fica em /projetos) e virou um convite para o catálogo. Abertura ~30% mais curta.
- Landing pages em carrossel horizontal no celular; filtros do catálogo recolhidos atrás de "Filtrar projetos" em telas pequenas.
- Assinatura "por Alex Castro" maior (13 px) e foto do Alex nas páginas Sobre e inicial.
- O formulário de contato pré-seleciona tipo de negócio e de projeto quando vem do personalizador e a relação é clara.
- Não aplicado: novos textos de FAQ e da página Sobre com fatos da trajetória — dependem de informações reais do proprietário.

## Segunda rodada (reanálise de 17/11/2026)

- Abertura em celular baixo (320 × 740 e 320 × 568): o texto ficou mais compacto e não sai da tela; quando não há espaço, a dica de rolagem não aparece e o rodapé da cena (contador e "Pular") só surge depois que o texto saiu. Com foco pelo teclado, "Pular" aparece sempre. Verificado por `scripts/check-abertura.mjs`.
- Página do case: botão "Testar demonstração" (quando a demo está publicada) e "Quero um site como este" logo abaixo do resumo; o selo de status continua só informativo.
- Celular: destaques com espaçamento menor e, no personalizador, a prévia vem antes das escolhas (sem a grade de três itens), para a mudança aparecer sem rolar.
- Pendente com o proprietário: textos mais específicos na página Sobre e no FAQ.

## Demos de beleza (a partir de 17/11/2026)

- Novo segmento "Beleza e estética" no catálogo; `/projetos?segmento=beleza` abre o catálogo filtrado e mantém esses projetos primeiro (link para usar nas abordagens).
- Campos novos no catálogo: `tryIt` ("Experimente: …") e `considerations` ("O que foi considerado" na página do projeto).
- Estado das demos no navegador (localStorage), como nas 12 anteriores; depoimentos são exemplos com aviso visível.
- Studio Linha Fina: comparador de antes e depois feito com `<input type="range">` invisível sobre a foto (teclado e leitor de tela funcionam; no celular, arrastar na vertical rola a página).
- `<fieldset>` tem largura mínima igual ao conteúdo por padrão: listas que rolam na horizontal dentro dele precisam de `min-w-0`, senão a página alarga no celular.
- `scripts/importar-fotos.mjs` agora limpa o cache do otimizador de imagens do app (`.next/cache/images`), que servia a versão antiga de uma foto substituída por até 4 horas.

## Beleza visível na página inicial e landing pages no filtro (18/11/2026)

- Seção "Beleza e estética" (`/#beleza`) na página inicial, logo depois dos destaques: os sete sites do segmento e a landing page do curso, com botão para `/projetos?segmento=beleza` (o link único das abordagens). No celular, os cartões deslizam na horizontal.
- Cada landing page ganhou um segmento (`categoryId` em `data/landing-pages.ts`). No catálogo, com um segmento filtrado e sem tipo de solução, as landing pages daquele segmento aparecem junto dos sites, com a etiqueta "Landing page" e o contador "X projetos e Y landing pages". Sem filtro, continuam só na seção própria, para não repetir.
- O cartão de landing page virou um componente único (`components/projects/landing-card.tsx`), usado na seção, no catálogo e na página inicial.

## Bravus Barbearia: Pix, área do cliente e painel do dono (21/11/2026)

Pensado a partir de um possível cliente real, que hoje marca tudo pelo WhatsApp e acompanha a agenda num aplicativo de terceiros.

- **Pix antecipado ilustrativo** (`lib/pix.ts`, `components/pix-checkout.tsx`): sinal de R$ 10,00 (padrão), valor total, plano, fidelidade ou pagar no balcão. O QR Code é só um desenho com cara de QR (não é lido por bancos) e o copia e cola diz "NAO-E-UM-PAGAMENTO-REAL", para ninguém pagar por engano. O Pix segura o horário por 10 minutos; vencido, o horário volta sozinho para a agenda.
- **Meus horários** (`/meus-horarios`): remarcar e cancelar só até 2 horas antes (depois disso, "fale com a barbearia"); cancelar no prazo devolve o Pix. O lembrete automático aparece como prévia, com "Confirmo" e "Preciso remarcar".
- **Repetir o último corte**: o cliente de demonstração tem duas visitas fictícias no histórico, então o atalho aparece logo na primeira visita.
- **Lista de espera**: o cliente escolhe dia e período (manhã, tarde, fim de tarde). A vaga é calculada na hora: quando alguém cancela ou um bloqueio sai, o painel mostra quem cabe e encaixa com um toque.
- **Painel em abas** (Hoje, Agenda, Equipe, Clientes): resumo do dia (previsto, recebido por Pix, a receber no balcão), bloqueio de horários (recusa horário passado ou com agendamento), comissão de 40% por barbeiro, assinantes e clientes sumidos há mais de 30 dias com mensagem pronta.
- **Histórico fictício** (`lib/history.ts`) calculado a partir da data de hoje e não salvo: clientes frequentes, sumidos, assinantes e atendimentos avulsos, para o mês ter números de uma barbearia de verdade.
- **Plano mensal** (`/planos`) e **cartão fidelidade** (10 cortes = uma barba). Os selos entram quando o dono conclui o atendimento no painel.
- **Painel instalável**: só `/admin` aponta para `public/painel.webmanifest`, então o atalho na tela inicial abre direto no painel.
- O estado da demo passou para a versão 2 (`ax-bravus-demo`); estados salvos da versão anterior são descartados e a agenda de exemplo é recriada.

## Loja da Bravus com retirada na barbearia (21/11/2026)

- Loja dentro da própria demo (`/loja`, `/loja/[id]`, `/loja/sacola`), com 13 produtos de uma linha própria fictícia: pomadas, gel, pó texturizador, shampoo, condicionador, cuidados com a barba, pente e dois kits. Preços, estoque e modos de uso são exemplos (`data/loja.ts`).
- Sem frete: o cliente retira **no próprio horário** (o barbeiro deixa separado na bancada) ou **no balcão**, num dia aberto escolhido. Se o horário for cancelado, a compra passa para o balcão no mesmo dia, em vez de sumir.
- Pagamento por Pix ilustrativo com 5% de desconto ou na retirada. Pix não pago em 10 minutos cancela o pedido e devolve o estoque.
- Depois de agendar, o bloco "Leve junto" sugere os mais vendidos que combinam com o serviço e leva à sacola já com a retirada marcada naquele horário (`?horario=`).
- Painel: aba Loja (para separar → pronto → entregue, vendido, Pix recebido e estoque com alerta de 3 unidades ou menos); na agenda, o horário mostra "Leva N produtos"; na aba Hoje, quantos pedidos entregar.
- Estoque calculado (inicial menos pedidos não cancelados), não guardado. Estado da demo na versão 3.
- Fotos dos produtos geradas no Flow (`docs/fotos-ia-flow/26-loja-barbearia.txt`), sem rótulo escrito; enquanto uma foto não existe, aparece um desenho da embalagem.
- No cabeçalho, "Equipe" saiu do menu (continua na página inicial) para caber "Loja" e o ícone da sacola; abaixo de 360px o botão Agendar mostra só o ícone.

## Painel visual: horários reservados e faturamento (21/11/2026)

- **Horários reservados** (topo da aba Agenda): grade do dia com uma coluna por barbeiro, blocos na altura da duração de cada atendimento (azul = confirmado, dourado = concluído), almoço e bloqueios em listras, linha do horário atual e ocupação de cada barbeiro em %. Mostra também atendimentos, valor do dia, já atendido e o que falta atender.
- **Aba Faturamento**: estimativa do mês em destaque, com o "garantido até agora" (sem projeção); já faturado, agendado e projeção; gráfico de barras empilhadas por dia (atendido, agendado e projeção em listras), com dica ao passar o mouse e versão em tabela; composição da estimativa (serviços, loja e assinaturas) e divisão por barbeiro.
- **Como a projeção é calculada** (`lib/finance.ts`): para cada dia que falta no mês, a média do mesmo dia da semana nas últimas 4 semanas, por barbeiro, menos o que já está agendado (nunca negativa). Hoje conta só a parte do expediente que falta. Atendimentos de plano e de fidelidade não entram como serviço: o plano entra uma vez, nas assinaturas.
- Cores dos gráficos validadas para o fundo escuro (dourado `#b38a35` e azul `#4a8fd6`); a projeção usa listras, além da cor.
- A agenda de exemplo ficou mais cheia (chance de horário ocupado de 55% hoje, caindo até 20%), para os dias da agenda ficarem parecidos com os do histórico.
- No celular, as seis abas do painel ficam em duas linhas de três.

## Menu da Bravus em telas menores (21/11/2026)

- Abaixo de 1024px os links do topo (Serviços, Planos, Loja, Visite, Meus horários, Painel) não cabiam e simplesmente sumiam, sem botão para abrir: a Loja e os Planos ficavam inalcançáveis pelo topo. Agora há um botão Menu (`components/mobile-menu.tsx`) que abre a lista; fecha ao escolher um link, com Esc ou clicando fora, e marca a página atual.
- Abaixo de 420px, o botão Agendar do topo mostra só o ícone, para caber junto com a sacola e o menu sem invadir a margem.

## Estimativa de faturamento estável (21/11/2026)

- Bug: a projeção de hoje era proporcional à "parte do expediente que ainda falta", calculada com o relógio. Durante o horário de funcionamento, a projeção e a estimativa do mês mudavam a cada minuto, a cada vez que o painel era aberto, sem ninguém mexer na agenda.
- Correção: a projeção de cada dia (hoje incluído) é a média do mesmo dia da semana menos o que já foi atendido e agendado, sem relógio. Os números só mudam quando a agenda muda ou quando o dia vira. Teste em `finance.test.ts` garante a mesma estimativa às 9:00 e às 18:45.
- Mudança esperada, agora explicada na aba Hoje: reserva ou pedido com Pix não pago em 10 minutos é liberado sozinho, e o valor sai dos totais.

## Revisão da Bravus e três funcionalidades simples (21/11/2026)

- Auditoria com axe-core em todas as páginas e abas do painel (desktop e celular): sem erros no console.
  - Estrelas das avaliações ganharam `role="img"` (o `aria-label` num `<p>` era ignorado).
  - A faixa "Projeto demonstrativo" virou `<aside>` com nome, para não ficar fora das regiões da página.
  - O alerta de contraste nos cartões da loja é falso positivo: o axe mede no meio da animação de entrada; visível, a etiqueta tem contraste de cerca de 8:1.
- **Recado para o barbeiro**: campo opcional (até 140 caracteres) na revisão do agendamento; aparece na confirmação, na mensagem, na agenda do painel e na grade.
- **Salvar na agenda do celular**: botão na confirmação e em Meus horários que baixa um `.ics` com lembrete 1 hora antes (`lib/calendar.ts`; horário de Brasília convertido para UTC−3 fixo).
- **Busca na agenda do painel**: por nome do cliente ou código, sem diferenciar maiúsculas nem acentos.

## Agenda do dia em destaque no painel (21/11/2026)

- A aba Hoje (a primeira do painel) abre com a agenda do dia: uma faixa com atendimentos, previsto, recebido, a receber e o próximo cliente; avisos curtos (sem confirmar presença, pedidos da loja, Pix pendente) e a grade de horários de cada barbeiro. Num dia fechado, mostra o próximo dia aberto.
- Clicar num horário da grade leva à linha daquele atendimento na "Lista do dia", com as ações (concluir, cancelar, reativar).
- Lembretes e lista de espera ficaram abaixo da agenda. O cabeçalho do painel ficou mais baixo (título e aviso de "área pública" numa linha), para a agenda aparecer sem rolar.
- Grades dentro de grid CSS precisam de `min-w-0` nos filhos; sem isso, a rolagem horizontal da grade alargava a página no celular.
