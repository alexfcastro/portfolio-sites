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