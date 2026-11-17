# Assets: origem, licença e uso

Os assets visuais do **portfólio** foram criados para este projeto (vetores desenhados em código e capturas das demos). As **demos** usam fotos geradas por IA, listadas mais abaixo. Não há imagens de bancos nem material de terceiros.

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Monograma AX (claro, escuro, mono) | `apps/portfolio/public/brand/ax-symbol*.svg` | Criação própria (polígonos; geometria em `src/lib/brand.ts`) | Arquivos da marca |
| Assinatura AX + Alex Castro (claro, escuro, mono) | `apps/portfolio/public/brand/ax-signature*.svg` | Criação própria | Arquivos da marca |
| Símbolo inline | `src/components/ui/ax-symbol.tsx` | Criação própria | Header, footer, Sobre, 404 |
| Favicon | `apps/portfolio/src/app/icon.svg` | Derivado do símbolo | Aba do navegador |
| Imagem Open Graph | `src/app/og-image.png/route.tsx` (gerada no build) | Criação própria | Compartilhamento (só anunciada com URL pública) |
| Capturas das 12 demos (4 PNG cada) | `apps/portfolio/public/projects/<slug>/` | Capturas reais das demos, geradas por `scripts/capture-screenshots.mjs` | Cards, cases, hero |
| Ícones de interface | pacote `lucide-react` | Lucide, licença ISC | Ícones de UI |
| Fontes Inter e Manrope | via `next/font/google`, servidas pelo próprio site | Google Fonts, SIL Open Font License 1.1 | Tipografia |

## Observações e limitações

- As capas conceituais em SVG usadas no início foram todas substituídas por capturas reais; o gerador foi removido. Um case novo sem demo volta a precisar de uma prévia conceitual, rotulada como tal.
- Os negócios, nomes de pessoas, preços e textos das demos são fictícios. Nenhum dado foi extraído de empresa real.
- As assinaturas em SVG usam **texto vivo** ("Alex Castro"), não contornos. Onde a fonte Manrope não estiver instalada, a assinatura aparece com a fonte de fallback. Para uso em gráfica, converta o texto em curvas num editor vetorial.
- A imagem Open Graph usa a fonte padrão do gerador de imagens do Next (sem negrito real). Se quiser a Manrope nela, é preciso incluir o arquivo da fonte na rota.

## Demos

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Capturas da Bravus Barbearia (4 PNG) | `apps/portfolio/public/projects/barbearia/` | Capturas reais da demo `apps/barbearia`, geradas por `scripts/capture-screenshots.mjs` | Card, case e hero do portfólio |
| Marca Bravus (navalha estilizada) e favicon | `apps/barbearia/src/components/brand.tsx`, `src/app/icon.svg` | Criação própria; marca de negócio fictício, sem relação com empresas reais | Demo |
| Ilustrações de estilos de corte e mapa ilustrativo | `apps/barbearia/src/components/illustrations.tsx` | Criação própria (SVG) | Galeria e "Visite" da demo |
| Fontes Barlow e Barlow Condensed | via `next/font/google` | Google Fonts, SIL OFL 1.1 | Tipografia da demo |

A capa conceitual da barbearia (`cover.svg`) foi removida quando a demo ganhou capturas reais.

### Fase 3

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Capturas (4 PNG por demo) | `apps/portfolio/public/projects/{clinica,restaurante,oficina,servicos}/` | Capturas reais das demos, geradas por `scripts/capture-screenshots.mjs` | Cards e cases |
| Marcas fictícias e favicons (folha, chama, "T", check) | `apps/*/src/components/*`, `apps/*/src/app/icon.svg` | Criação própria | Demos |
| Ilustrações de pratos, mapas e trabalhos | `apps/restaurante/src/components/plate-art.tsx`, `apps/clinica/src/components/illustrations.tsx`, `apps/servicos/src/components/work-art.tsx` | Criação própria (SVG) | Demos |
| Fontes Figtree, Fraunces, Work Sans, DM Serif Display, Archivo, Plus Jakarta Sans | via `next/font/google` | Google Fonts, SIL OFL 1.1 | Demos |

As capas conceituais de clínica, restaurante, oficina e serviços foram removidas ao ganharem capturas reais.

### Fases 4 e 5

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Capturas (4 PNG por demo) | `apps/portfolio/public/projects/{autonomo,advocacia,imobiliaria,petshop,academia,produtos-naturais,floricultura}/` | Capturas reais das demos, geradas por `scripts/capture-screenshots.mjs` | Cards e cases |
| Marcas fictícias e favicons | `apps/*/src/components/site-chrome.tsx`, `apps/*/src/app/icon.svg` | Criação própria | Demos |
| Ilustrações de trabalhos, imóveis, pets, embalagens e flores | `apps/autonomo/src/components/work-art.tsx`, `apps/imobiliaria/src/components/property-art.tsx`, `apps/petshop/src/components/pet-art.tsx`, `apps/produtos-naturais/src/components/product-art.tsx`, `apps/floricultura/src/components/flower-art.tsx` | Criação própria (SVG). Rotuladas nas demos como ilustração, não foto | Demos |
| Fontes Karla, Newsreader, Cormorant Garamond, Source Sans 3, Outfit, Nunito, Space Grotesk, DM Sans, Fraunces, Jost | via `next/font/google` | Google Fonts, SIL OFL 1.1 | Demos |

As capas conceituais dessas demos foram removidas ao ganharem capturas reais.

### Fotos geradas por IA

As ilustrações das demos estão sendo substituídas por fotos **geradas por IA** (Nano Banana, no Google Flow), a partir dos prompts de `docs/fotos-ia.md`. Não são fotos de negócios, pratos, imóveis ou pessoas reais, e cada demo avisa isso no rodapé. Os originais ficam em `fotos-ia/` (fora do Git); `node scripts/importar-fotos.mjs <site>` gera as versões WebP (até 1200 px) em `apps/<site>/public/fotos/` e a lista `src/data/fotos.ts`. Onde não houver foto, a ilustração continua.

| Demo | Fotos | Local | Gerador | Data |
|---|---|---|---|---|
| Sabor & Brasa (restaurante) | 13 pratos e bebidas | `apps/restaurante/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Raiz & Grão (produtos naturais) | 23 produtos e kits | `apps/produtos-naturais/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Flor & Afeto (floricultura) | 21 (7 produtos × principal, sobre a mesa, detalhe) | `apps/floricultura/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Horizonte Imóveis (imobiliária) | 34 (fachada, sala e quarto dos 12 imóveis) | `apps/imobiliaria/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Lia Torres (autônomo) | 6 trabalhos do portfólio | `apps/autonomo/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| PetVille (pet shop) | 4 pets | `apps/petshop/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Resolve Serviços | 6 trabalhos concluídos | `apps/servicos/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Bravus Barbearia | 6 estilos de corte | `apps/barbearia/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |
| Vita Clínica | 1 recepção (destaque da página inicial) | `apps/clinica/public/fotos/` | Nano Banana (Google Flow), gerado pelo proprietário | 28/09/2026 |

Critérios de revisão de cada foto: correspondência com o item, nenhum texto, logotipo ou marca d'água, sem pessoas identificáveis (vultos desfocados ao fundo são aceitos), proporção compatível com o card.

Observações da revisão (28/09/2026):

- O Flow não usou os nomes de arquivo pedidos; `scripts/importar-fotos.mjs` guarda a correspondência entre cada arquivo e o item, definida olhando as fotos.
- **Sobrado (HZ-0232):** a fachada gerada tinha o número "210"; a área foi desfocada na versão publicada (retoque registrado no importador). O original não foi alterado.
- **Barbearia:** duas fotos mostram o cliente de perfil com o rosto visível e uma mostra o barbeiro trabalhando; são pessoas geradas por IA, não reais. Se preferir, gere de novo com o rosto em sombra e rode o importador.
- Mapas e fotos de equipe continuam ilustrativos (sem foto), de propósito.

### Segunda leva de fotos (gerada em 12/11/2026)

Geradas e importadas as 45 imagens que faltavam para todas as demos terem fotos: oficina (7), advocacia (7), academia (11), clínica (13: especialidades e equipe) e retratos de equipe de barbearia, pet shop e imobiliária (7). Prompts em `docs/fotos-ia-flow/13` a `17`. As páginas já têm os espaços: sem a foto, aparece a inicial ou o fundo liso. Mapas continuam ilustrativos, porque os negócios não têm endereço.

### Segunda e terceira levas (12/11/2026)

Geradas no Google Flow com o Nano Banana 2.1, pelo agente do Flow, na conta do proprietário, e baixadas na resolução original. Total publicado agora: **163 fotos**.

| Demo | Novas | O quê |
|---|---|---|
| Torque Auto Center | 7 | Abertura e as 6 categorias de serviço |
| Almeida & Prado | 7 | Abertura, 3 retratos da equipe e 3 capas de artigo |
| Pulse Studio | 11 | Abertura, 6 modalidades e 4 professores |
| Vita Clínica | 13 | 6 especialidades e 7 profissionais |
| Bravus, PetVille e Horizonte | 7 | Retratos da equipe |
| Sabor & Brasa | 8 | 6 pratos e bebidas refeitos (água, refrigerante, brownie, pudim, salada, suco) e 2 de ambiente (brasa e salão) |
| PetVille | 1 | Banho (ambiente) |
| Resolve Serviços | 3 | Abertura com técnico em serviço; quadro e fachada refeitos no padrão brasileiro |

- **Por que refazer:** na churrascaria, água e refrigerante apareciam em garrafa e lata sem rótulo (pareciam falsas), e brownie, pudim e salada estavam distantes e sem vida; na Resolve, o quadro elétrico e a fachada eram de padrão estrangeiro. Os originais substituídos ficam em `fotos-ia/<site>/substituidas/`.
- **Retratos:** pessoas que não existem, geradas por IA; as seções dizem que a equipe é fictícia e o rodapé avisa que as fotos são geradas por IA.
- **Revisão:** todas as fotos novas foram conferidas em folha de contato (correspondência com o item, sem texto legível, logotipo ou marca d'água). No contrato de locação da advocacia, o papel tem um título desfocado e ilegível.
- **Marca:** o símbolo AX ganhou uma versão em quadrado arredondado com degradê (`public/brand/ax-symbol-tile.svg`), usada no cabeçalho, no rodapé e no ícone do site. Continua sendo vetor, criação própria.

### Landing pages (13/11/2026)

19 fotos geradas no Google Flow (Nano Banana 2.1), na conta do proprietário, em `apps/landing/public/fotos/`: Residencial Aurora (4), Fluente na Mala (3), Festival Sabores da Serra (4), Agenda Leve (1), Clube Serra Alta (4) e Solar Viva (3). A tela do aplicativo Agenda Leve é desenhada em HTML, não é imagem. Total publicado: **182 fotos**.
