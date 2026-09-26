# Assets: origem, licença e uso

Todos os assets visuais do portfólio foram **criados para este projeto** (vetores desenhados em código). Não há fotos, imagens de bancos, imagens geradas por IA nem material de terceiros.

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Monograma AX (claro, escuro, mono) | `apps/portfolio/public/brand/ax-symbol*.svg` | Criação própria (polígonos; geometria em `src/lib/brand.ts`) | Arquivos da marca |
| Assinatura AX + Alex Castro (claro, escuro, mono) | `apps/portfolio/public/brand/ax-signature*.svg` | Criação própria | Arquivos da marca |
| Símbolo inline | `src/components/ui/ax-symbol.tsx` | Criação própria | Header, footer, Sobre, 404 |
| Favicon | `apps/portfolio/src/app/icon.svg` | Derivado do símbolo | Aba do navegador |
| Imagem Open Graph | `src/app/og-image.png/route.tsx` (gerada no build) | Criação própria | Compartilhamento (só anunciada com URL pública) |
| 12 capas conceituais | `apps/portfolio/public/projects/<slug>/cover.svg` | Geradas por `scripts/generate-covers.mjs`, composições próprias | Cards, cases, hero |
| Ícones de interface | pacote `lucide-react` | Lucide, licença ISC | Ícones de UI |
| Fontes Inter e Manrope | via `next/font/google`, servidas pelo próprio site | Google Fonts, SIL Open Font License 1.1 | Tipografia |

## Observações e limitações

- As capas são **prévias conceituais**: mostram como o site poderia ser, não capturas de software em funcionamento. O site as rotula assim ("Prévia conceitual") em todos os lugares onde aparecem.
- Os negócios, nomes de pessoas, preços e textos das capas são fictícios. Nenhum dado foi extraído de empresa real.
- As assinaturas em SVG usam **texto vivo** ("Alex Castro"), não contornos. Onde a fonte Manrope não estiver instalada, a assinatura aparece com a fonte de fallback. Para uso em gráfica, converta o texto em curvas num editor vetorial.
- A imagem Open Graph usa a fonte padrão do gerador de imagens do Next (sem negrito real). Se quiser a Manrope nela, é preciso incluir o arquivo da fonte na rota.
- Quando as demos existirem, as capas serão substituídas por capturas reais (`media.kind: "screenshot"`), registradas aqui.

## Demos

| Asset | Local | Origem | Uso |
|---|---|---|---|
| Capturas da Bravus Barbearia (4 PNG) | `apps/portfolio/public/projects/barbearia/` | Capturas reais da demo `apps/barbearia`, geradas por `scripts/capture-screenshots.mjs` | Card, case e hero do portfólio |
| Marca Bravus (navalha estilizada) e favicon | `apps/barbearia/src/components/brand.tsx`, `src/app/icon.svg` | Criação própria; marca de negócio fictício, sem relação com empresas reais | Demo |
| Ilustrações de estilos de corte e mapa ilustrativo | `apps/barbearia/src/components/illustrations.tsx` | Criação própria (SVG) | Galeria e "Visite" da demo |
| Fontes Barlow e Barlow Condensed | via `next/font/google` | Google Fonts, SIL OFL 1.1 | Tipografia da demo |

A capa conceitual da barbearia (`cover.svg`) foi removida quando a demo ganhou capturas reais.
