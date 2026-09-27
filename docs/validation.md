# Validação

Registro por fase. As fases mais recentes ficam no fim.

## Fase 1 — Portfólio

Data: 26/09/2026 · Máquina: Windows 11, Node 24.19.0, pnpm 12.6.0 · Build de produção local (`next build` + `next start`).

### Automatizado

| Verificação | Comando | Resultado |
|---|---|---|
| Instalação com lockfile | `pnpm install` | OK, sem conflitos de peers (`pnpm peers check`) |
| Lint | `pnpm lint` | 0 erros |
| Tipos | `pnpm typecheck` | 0 erros |
| Testes | `pnpm test` | **34/34 passando** (3 arquivos) |
| Build | `pnpm build` | OK — 23 páginas estáticas, incluindo os 12 cases |

O que os testes cobrem (`src/**/*.test.ts`):

- **Dados:** exatamente os 12 slugs canônicos, únicos; categorias e tipos de solução existentes; textos essenciais preenchidos; problema e solução distintos entre segmentos; capas existentes em `public/`, com dimensões e `alt`; 4 a 6 destaques.
- **Estado das demos:** todas `planned`, recursos `planned`, mídias `concept`, `technologies` vazio; nenhum link de demo gerado; link só com `available` + URL válida; `localhost`, domínios de exemplo, HTTP e `javascript:` rejeitados em produção.
- **URLs:** ambiente padrão seguro, normalização, credenciais em URL rejeitadas, perfis só HTTPS.
- **Contato:** normalização do WhatsApp (com código do país; sem o 55 é rejeitado), codificação da mensagem (acentos, `&`, `?`, `%`, quebras de linha), nenhum link sem destinatário, `mailto` codificado, validação de obrigatórios, limites (100/150/2.000), e-mail/telefone só quando preenchidos, opções fora da lista, slug pré-selecionado só se reconhecido, mensagem sem campos vazios.

### Verificação HTTP (build de produção, sem variáveis configuradas)

- As 18 rotas públicas (Home, listagem, 12 cases, Sobre, Contato, Contato com `?projeto=`, Privacidade) retornam **200**.
- `/projetos/inexistente` e `/pagina-que-nao-existe` retornam **404 real**.
- Todas as páginas têm `noindex, nofollow`; nenhuma tem canonical; **nenhuma contém "localhost"**.
- `robots.txt`: permite rastreio, sem sitemap. `sitemap.xml`: vazio.
- Headers presentes: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, CSP mínima. `X-Powered-By` ausente.
- `/og-image.png`, `/icon.svg` e os SVGs da marca: 200.

### Navegador (navegador embutido do app, Chromium)

Fluxos executados por cliques e inspeção do DOM:

- **Filtros:** "Automotivo" + "Agendamento" leva a 0 resultados, com o estado vazio e "Limpar filtros"; `aria-pressed` correto; resumo anunciado em `role="status"`. Limpar volta a 12 e o foco vai para o resumo (corrigido: antes caía no `body`).
- **Contato sem canal configurado:** sem links `wa.me` ou `mailto`, sem `href` inválido.
- **Contato com canal de teste:** build separado com número e e-mail **de teste**, definidos só no terminal e ausentes do build final (conferido por busca no `.next`).
  - `?projeto=floricultura` pré-seleciona o projeto.
  - Envio vazio mostra 3 erros junto aos campos, `aria-invalid` + `aria-describedby`, status "Há 3 campos para corrigir" e foco no primeiro erro.
  - E-mail inválido dentro de "Mais detalhes" abre o grupo e foca o campo; o nome digitado é preservado.
  - Envio válido mostra a revisão (com foco); o texto do link `wa.me` decodificado é **idêntico** ao texto revisado; aviso "Conclua o envio por lá"; nenhuma mensagem de sucesso; nenhum dado na URL. O link **não** foi aberto.
  - Home no mesmo build: botão flutuante presente, contatos no rodapé, CTA "Conversar no WhatsApp".
- **Menu mobile (375 px):** `aria-expanded` alterna, Escape fecha e devolve o foco ao botão, links corretos (`/#solucoes`, `/#como-funciona`).
- **Reflow:** sem rolagem horizontal em Home, listagem, cases, Sobre, Contato, Privacidade e 404 a **320 px**; Home, case e Contato também a 768 e 1440 px; Home a 375/412/1024/1280 px. (360 e 390 px não foram medidos separadamente; ficam entre 320 e 412, ambos sem rolagem.)
- **Revisão visual:** Home (desktop e mobile), listagem, case, Sobre (768 px), Privacidade (1024 px), 404 (1440 px), as 12 capas e a imagem Open Graph. Nas capas foram corrigidas sobreposições de texto e incoerências internas (dia da semana, categoria, tipo de imóvel).

#### Achados corrigidos durante a validação

1. **Dados pessoais na URL:** um envio antes da hidratação fazia GET nativo com todos os campos. Corrigido desabilitando o envio até a hidratação.
2. **`localhost` na meta `og:image`** sem URL configurada. Corrigido: imagem OG só anunciada com URL pública.
3. **CLS 0,2 em /projetos** pela troca de fonte dos títulos. Corrigido com `display: "optional"` na Manrope.
4. **Número brasileiro sem 55 aceito como destinatário.** Corrigido (mínimo de 12 dígitos).
5. **Header quebrando em duas linhas a 768 px.** A navegação completa agora aparece a partir de 1024 px; abaixo disso, menu compacto.
6. **Capas secundárias do hero carregadas sob demanda** mesmo estando na primeira dobra. Agora carregam imediatamente.
7. **Foco perdido ao limpar filtros** pelo estado vazio. Agora vai para o resumo de resultados.

### Desempenho (Lighthouse 12, perfil mobile simulado)

Condições: `next start` local, Chrome headless, 4G lento simulado (150 ms RTT, ~1,6 Mbps) e CPU 4× mais lenta. **Os valores de LCP são simulados, não medidos em campo.**

| Página | FCP | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 1,1 s | 3,1 s | 110 ms | 0 |
| `/projetos` | 0,8 s | 3,0 s | 330 ms | 0 |
| `/projetos/barbearia` | 0,9 s | 2,7 s | 60 ms | 0 |
| `/contato` | 0,8 s | 2,6 s | 60 ms | 0 |

- A única auditoria binária reprovada é `is-crawlable`, **esperada**: a prévia usa `noindex` de propósito.
- O LCP simulado fica um pouco acima de 2,5 s. Na Home, o LCP é a capa principal do hero (SVG). Já foi removido o filtro de desfoque, que causava o maior atraso. Próximas otimizações possíveis, se necessárias: servir o hero em WebP/AVIF rasterizado ou exibir só uma capa no mobile.
- Core Web Vitals de campo exigem visitantes reais; não há dados de campo.
- **Nova medição (27/09/2026)**, com as capturas reais no lugar das capas SVG. Simulado (padrão do Lighthouse): `/` FCP 0,9 s · LCP 3,0 s · TBT 135 ms · nota 0,94; `/projetos` 0,9 · 2,9 s · 0,93; `/projetos/floricultura` 0,8 · 3,0 s · 0,94; `/contato` 0,8 · 2,6 s · 0,97; CLS 0 em todas. Com throttling aplicado de verdade (`--throttling-method=devtools`), LCP = FCP em todas (2,5–3,5 s), ou seja, o maior elemento já aparece na primeira pintura: não há imagem principal atrasada.
- Diagnóstico: sem throttling, a primeira pintura sai em ~0,1–0,2 s e estilo + layout somam ~70 ms. Nas medições lentas, o tempo vem da latência do 4G simulado (o HTML chega em ~0,7 s; o CSS de 9 KB divide a banda com as fontes) e da CPU 4× mais lenta. Foram testados e **descartados** por ganho dentro da variação entre execuções: tirar `text-wrap: pretty` dos parágrafos e não pré-carregar a fonte Inter.

### Não verificado (limitações)

- **Firefox e Safari/WebKit:** não estão instalados nesta máquina. Só foram usados navegadores Chromium (navegador embutido e Chrome). **Nenhum suporte a Safari/Firefox foi comprovado.**
- **Aparelhos reais:** não testados; mobile verificado por emulação de viewport.
- **Zoom de 200% e leitores de tela:** não testados com tecnologia assistiva real. Estrutura (headings, landmarks, labels, `aria-*`) verificada pelo DOM.
- **Abertura efetiva do WhatsApp/e-mail:** intencionalmente não executada.
- **Deploy:** nenhum. Não há URL pública, HTTPS nem verificação em host.
- **Captura de tela do navegador embutido:** instável com a janela do app em segundo plano; parte da revisão visual foi feita por inspeção do DOM.

## Fase 2 — Bravus Barbearia (`apps/barbearia`)

Data: 26/09/2026 · build de produção local (`next start`, porta 3101) · portfólio em 3100.

### Automatizado (`pnpm --filter @ax/barbearia test`: 28/28)

- **Fuso e datas:** instante convertido para `America/Sao_Paulo` independentemente do fuso da máquina; aritmética de datas atravessando meses e anos; janela de 14 dias.
- **Dados:** preços inteiros em centavos, profissionais existentes; formatação e soma sem erro de arredondamento.
- **Disponibilidade:** domingo fechado; sábado até 16:00; horários passados e antecedência mínima de 30 min bloqueados; sem atravessar almoço nem fechamento; grade de 20 min; sem sobreposição para o mesmo profissional (mas permitida entre profissionais); cancelado libera o horário; profissional incompatível sem horários.
- **Confirmação:** revalidação de serviço, profissional, data fora da janela, horário passado, fora do funcionamento, fora da grade e ocupado.
- **Agenda de exemplo:** relativa a hoje, 7 dias, determinística, sem sobreposição; "concluído" só para horários de hoje já terminados; **em 60 datas diferentes, todo dia futuro aberto mantém vaga para o serviço mais longo de cada profissional**.
- **Estado:** criação com identidade fictícia, recusa de horário duplicado, transições permitidas (concluir/cancelar/reativar), reativação recusada se o horário foi reocupado, estado salvo rejeitado se for de outro dia, outra versão, corrompido ou mal formado.
- **URL do portfólio:** HTTPS público aceito; `localhost` só em desenvolvimento; HTTP público, exemplo e `javascript:` rejeitados.

Portfólio (`pnpm --filter @ax/portfolio test`: 37/37): além dos testes da Fase 1, a Bravus tem recursos implementados, stack definida, só capturas reais e ao menos uma desktop e uma mobile; demo `available` sem URL válida aparece como "Publicação em breve", nunca "disponível".

### Build independente

- `pnpm build:barbearia` gera 7 rotas estáticas sem depender do portfólio.
- `pnpm build` gera os dois apps.

### Navegador (navegador embutido, Chromium)

- **Fluxo completo:** `?servico=combo` abre direto em "Profissional"; continuar sem escolher mostra erro; só aparecem Rafa e Leo; o foco vai para o título de cada etapa; datas fechadas/lotadas desabilitadas; revisão com valores corretos (16:40–17:50, R$ 70,00); confirmação "Agendamento de demonstração confirmado" com código `BRV-1001`; estado salvo em `localStorage` com chave `ax-bravus-demo`, versão 1.
- **Painel:** o agendamento feito em outra página aparece em "Só os meus"; cancelar → reativar funcionam com feedback anunciado; o diálogo de restauração abre com foco em "Manter como está"; restaurar apaga os agendamentos de teste.
- **Prévia de WhatsApp:** diálogo modal, foco interno, fecha e devolve o foco ao botão; nenhum link `wa.me` em toda a demo.
- **Ida e volta:** com `NEXT_PUBLIC_DEMO_URL_BARBEARIA=http://localhost:3101` (desenvolvimento), o case mostra "Abrir demonstração" (nova aba, `noopener`); a demo aponta "Voltar ao portfólio", "Ver case" e "Solicitar um site como este" (`/contato?projeto=barbearia`, que pré-seleciona o projeto).
- **Sem URL** (cenário de produção atual): o case mostra "Publicação em breve", sem botão e sem `localhost` no HTML.
- **Indexação:** `noindex, nofollow` na meta tag e no header `X-Robots-Tag`; sem sitemap nem dados estruturados.
- **Reflow:** sem rolagem horizontal a 320 px em início, agendamento (todas as etapas) e painel.

#### Achados corrigidos

1. **Agenda de exemplo cheia demais:** segunda a quinta ficavam "lotados" para o combo. Agora a ocupação cai ao longo da semana e há garantia de vaga (testada).
2. **Header estourando no celular:** "Painel" saiu do header abaixo de 640 px (continua no rodapé e na confirmação).
3. **`<fieldset>` da faixa de datas alargava a página** (1468 px numa tela de 1280): corrigido com `min-w-0`.
4. **Anel de foco em títulos focados por script** (portfólio e demo): removido só para `tabindex="-1"`.

### Capturas para o case

Geradas por `scripts/capture-screenshots.mjs` (Chrome via DevTools Protocol, emulação real de celular 390×844 @2x): início e agendamento no desktop, agendamento no celular e painel. O Chrome em linha de comando não serve para capturas de celular: ele impõe largura mínima de janela e corta a página.

### Não verificado

- Firefox, Safari e aparelhos reais; leitor de tela real.
- Publicação (não há URL pública).
- Tecla Escape física no diálogo (o fechamento foi verificado pela API; Escape é o comportamento nativo do `<dialog>` modal).
## Fase 3 — Vita Clínica, Sabor & Brasa, Torque Auto Center, Resolve Serviços

Data: 26/09/2026 · builds de produção locais (portas 3102–3105) · Chromium.

### Automatizado

| App | Testes | O que cobrem |
|---|---|---|
| `clinica` | 13 | Toda especialidade com profissional e agenda; sem domingos; dias/períodos só quando o profissional (ou algum da especialidade) atende; janela a partir de amanhã; validação da solicitação; confirmação simulada escolhe profissional disponível e horário dentro do período; cancelamento só de solicitações futuras e ativas; URL do portfólio. |
| `restaurante` | 13 | Preços em centavos; adicionais obrigatórios, opcionais, repetidos, inexistentes, de outro item e acima do máximo; soma dos adicionais; mesma configuração agrupada em uma linha; limites de quantidade e observação; retirada sem taxa, entrega com taxa do bairro, bairro obrigatório, pedido mínimo e carrinho vazio; horário de funcionamento por turno e dia. |
| `oficina` | 11 | Sintomas apontando para serviços existentes e faixas coerentes; validação do veículo (tipo, modelo, ano 1980…ano+1, km inteiro); problema e sintomas da própria categoria; serviços prováveis sem repetição e faixa somada; fotos só JPG/PNG/WebP até 5 MB e limite de 4; etapas do acompanhamento. |
| `servicos` | 10 | Perguntas e portfólio consistentes; região atendida com taxa e recusa das não atendidas; respostas guiadas obrigatórias e válidas; dias a partir de amanhã sem domingo, sábado só manhã; até 3 preferências; mensagem montada. |

Portfólio: 45 testes (inclui as 5 demos implementadas com recursos implementados, stack, só capturas reais e ao menos uma desktop e uma mobile).

### Navegador

- **Clínica:** `?especialidade=nutricao` abre em "Profissional"; erros por etapa; só a tarde disponível na segunda de Marina (agenda); protocolo `VTA-1001`; **nenhum campo de texto livre ou de arquivo** no fluxo; confirmação simulada (17:00 com Marina), cancelamento e restauração.
- **Restaurante:** ponto obrigatório; o 4º extra fica desabilitado; `(89,90 + 6 + 4) × 2 = 199,80`; carrinho com retirada (206,80) e entrega (+8,90 = 215,70); bairro obrigatório; pedido mínimo; pedido `SB-1001` esvazia o carrinho; remoção leva ao carrinho vazio.
- **Oficina:** erros de veículo nos campos, com foco no primeiro; fotos geradas no navegador viram prévias `blob:`, GIF recusado, remoção atualiza o contador; estimativa R$ 250–530 para os sintomas escolhidos; **o estado salvo guarda só a quantidade de fotos**; acompanhamento avança até "Pronto para retirada".
- **Resolve:** região não atendida recusada; perguntas obrigatórias; limite de 3 preferências (as demais ficam desabilitadas); o navegador guarda **só o contador de protocolo**.

#### Achados corrigidos

1. **Contorno de foco no próprio `<dialog>`** ao abrir (todas as demos): removido só no elemento `dialog`.
2. **Cabeçalhos mais largos que 320 px** (clínica, restaurante, oficina, Resolve). A emulação de celular *alarga o layout* em vez de mostrar rolagem, então a verificação passou a comparar `innerWidth` com 320. Botões principais ganharam versão compacta abaixo de 380 px. Todas as páginas principais das 5 demos ficam em 320 px.
3. **Token de cor `base` colidindo com `text-base`** (Resolve): o nome da marca ficava quase invisível. Token renomeado para `canvas`.
4. **Escrita em `ref` durante a renderização** (oficina), apontada pelo lint: movida para um efeito.

### Capturas

Geradas por `scripts/capture-screenshots.mjs` com os JSONs em `scripts/screenshots/` (4 por demo: desktop e celular 390×844 @2x), revisadas uma a uma.

### Não verificado

- Firefox, Safari, aparelhos reais e leitores de tela.
- Ida e volta com o portfólio foi verificada na Fase 2 (barbearia); nas demais, os links "Voltar ao portfólio", "Ver case" e "Solicitar um site como este" usam a mesma configuração, sem teste de clique individual.
- Publicação.

## Fase 4 — Linha Direta Profissional, Almeida & Prado, Horizonte Imóveis, PetVille, Pulse Studio

Data: 26–27/09/2026 · builds de produção locais (portas 3106–3110) · Chromium (navegador embutido).

### Automatizado

| App | Testes | O que cobrem |
|---|---|---|
| `autonomo` | 9 | URL do portfólio; trabalhos em categorias existentes e ofertas em centavos; nenhuma rede social inventada; pedido de proposta completo e campos inválidos; pacote sugerido por volume com desconto progressivo em centavos; mensagem com o pacote. |
| `advocacia` | 8 | URL do portfólio; slugs e referências consistentes; nenhum número de registro profissional inventado; varredura de todos os textos (TS/TSX) contra promessa de resultado, comparação, percentual de sucesso e depoimento; pedido de conversa sem dados pessoais. |
| `imobiliaria` | 12 | URL do portfólio; códigos únicos, bairros conhecidos e preços inteiros; filtros combinados (finalidade, tipo, bairro, quartos, faixa de preço), ordenação e busca sem acento ou por código; aluguel por mês; favoritos; mensagem com o código do imóvel; formulário de anúncio sem dados pessoais. |
| `petshop` | 13 | Preços por porte crescentes em centavos; validação do pet; gatos sem tosa; duração pelo porte em blocos de 15 min; agenda de exemplo só em dias abertos, sem sobreposição e com janela livre garantida para o serviço mais longo; horários só com a duração inteira livre e com 1 h de antecedência no dia; validação do agendamento; mensagens de resumo e de lembrete. |
| `academia` | 11 | Aulas com modalidade e professor que a ministra; grade da semana sem domingo; filtros combinados; vagas de exemplo dentro da capacidade, com aulas lotadas; chave de aula inválida recusada; reserva válida; uma experimental ativa por vez; recusa de aula lotada, já iniciada ou a menos de 30 min; apelido obrigatório. |

### Navegador

- **PetVille:** erros por campo na etapa do pet; só serviços compatíveis com a espécie; preço e duração pelo porte; dias fechados desativados; confirmação `PV-1001` com lembrete preparado para a véspera; prévia do lembrete; cancelamento em "Meus agendamentos".
- **Pulse Studio:** `?modalidade=bike` já filtra a grade; apelido obrigatório no diálogo; a reserva `PS-1001` fecha o diálogo, leva o foco ao destaque e bloqueia outras reservas; painel com ocupação por dia, presença e cancelamento.
- **Linha Direta, Almeida & Prado, Horizonte:** fluxo principal de cada uma (proposta; conversa inicial; busca → imóvel → interesse e favoritos) e capturas revisadas.
- **Reflow:** sem rolagem horizontal a 320 px nas páginas principais das cinco demos.

#### Achados corrigidos

1. **Agenda de exemplo do PetVille cheia demais** para serviços longos (terça a quinta sem horário para tosa de porte grande): agora cada profissional tem uma janela de 3 h livre por dia (testado).
2. **Títulos de dia com cada palavra em maiúscula** (`capitalize`) na grade da academia: agora só a primeira letra.
3. **Filtros que não acompanhavam a URL:** ir de `/aulas?modalidade=bike` para `/aulas` mantinha o filtro. O componente agora é remontado quando o parâmetro muda (mesma correção no catálogo do Raiz & Grão).
4. **Título do diálogo de prévia com `id` fixo:** com duas prévias na mesma página, o `id` se repetia. Agora usa `useId` em todas as demos e no gerador.

## Fase 5 — Raiz & Grão, Flor & Afeto

Data: 27/09/2026 · builds de produção locais (portas 3111–3112) · Chromium.

### Automatizado

| App | Testes | O que cobrem |
|---|---|---|
| `produtos-naturais` | 12 | Dados (ids, categorias, preços inteiros, pesos permitidos, promoções); arredondamento explícito (meio centavo para cima), por exemplo 250 g a R$ 59,90/kg = R$ 14,98; promoção aplicada sobre a opção e arredondada; peso ou unidade válidos, quantidade inteira de 1 a 20, esgotado recusado; mesma opção soma quantidade; subtotal, economia, peso total, frete por bairro e frete grátis; validação e mensagem do pedido; busca sem acento, filtros e ordenação; **nenhuma alegação de saúde** em todos os textos. |
| `floricultura` | 14 | Dados e preços crescentes por tamanho; adicionais incompatíveis por ocasião ou categoria (balão e pelúcia fora de condolências, vaso só em buquês), repetidos ou inexistentes; soma em centavos; cartão com até 200 caracteres e 6 linhas; sem domingo, e para hoje só à tarde e até as 11h; pedido completo e campos pendentes (bairro só na entrega); carrinho com uma entrega por bairro, dia, período e destinatário (nome sem diferença de caixa), limite de itens e datas vencidas apontadas por item; mensagem com todos os itens, entregas e total; filtros do catálogo. |

Portfólio: 59 testes (inclui as 12 demos implementadas, só com capturas reais e com ao menos uma captura de desktop e uma de celular cada).

### Navegador

- **Raiz & Grão:** opções de peso com preço (100 g R$ 5,99 · 250 g R$ 14,98 · 500 g R$ 29,95); total do item atualiza com a quantidade; produto esgotado com botão desativado; o carrinho pede retirada ou entrega e depois o bairro; resumo com frete, economia e quanto falta para a entrega grátis; o pedido `RG-1001` esvazia o carrinho e mostra a prévia com itens e total.
- **Flor & Afeto:** adicionais incompatíveis desativados no arranjo de condolências; erro no cartão acima de 200 caracteres e prévia do cartão; domingo ausente das datas; erros por etapa (entrega, data, nome); resumo do item com total de R$ 252,70 (igual ao teste); dois presentes para o mesmo destino e horário (o segundo com "Usar a mesma entrega do item anterior") cobram uma entrega só; pedido `FA-1005` com prévia de todos os itens; item com data vencida marcado e finalização bloqueada; estado da versão anterior migrado sem perder a numeração.
- **Reflow:** sem rolagem horizontal a 320 px nas páginas principais e em todas as etapas dos fluxos.
- **Larguras do briefing:** `pnpm check:reflow` (`scripts/check-reflow.mjs`) abre 49 páginas dos 13 apps em 320, 360, 390, 412, 768, 1024, 1280 e 1440 px (celular emulado abaixo de 768), incluindo carrinhos, agendamentos e reservas preenchidos: 392 verificações, nenhuma com rolagem horizontal ou elemento além da largura. O verificador foi conferido com uma página feita para falhar.

#### Achados corrigidos

1. **Botão do carrinho cortado entre 380 e 420 px** (Raiz & Grão): a captura de celular mostrou o que a checagem só em 320 px não pegava. "Produtos" sai do cabeçalho abaixo de 420 px e o texto "Carrinho" fica só para leitores de tela abaixo de 640 px. A partir daí, a checagem a 390 px passou a ser feita em todas as demos.
2. **Peso total exibido como "1500 g"**: agora "1,5 kg".
3. **"Economia" com sinal de menos logo abaixo do subtotal** parecia um desconto aplicado duas vezes: virou uma nota ("Você economizou…").
4. **Título quebrando entre número e unidade** ("100 / g"): espaços não separáveis.

### Não verificado

- Firefox, Safari, aparelhos reais e leitores de tela.
- Publicação.

### Teclado (27/09/2026)

- Teclas reais enviadas pelo navegador embutido: no diálogo de reserva da academia e na prévia de mensagem (componente usado por todas as demos), o foco entra no diálogo, **Tab** continua dentro dele, **Escape** fecha e o foco volta ao botão que o abriu.

### Prévia local interligada (27/09/2026)

- `pnpm preview:local` gerou os 13 builds e subiu os servidores (3100–3112). Na listagem do portfólio, os 12 cases mostram "Abrir demonstração" (nova aba, `noopener noreferrer`) com a porta certa de cada demo, e nenhum mostra "Publicação em breve".
- Nas 12 demos, a página inicial tem "Ver case" apontando para o case correto, "Solicitar um site como este" para `/contato?projeto=<slug>` e `noindex`.
