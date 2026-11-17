# Status do projeto

Atualizado em 17/11/2026.

## Fases concluídas

| Fase | Entrega | Situação |
|---|---|---|
| 1 | Portfólio (`apps/portfolio`) | Implementado e validado localmente (prévia) |
| 2 | Bravus Barbearia (`apps/barbearia`) | Implementada e validada localmente; **não publicada** |
| 3 | Vita Clínica, Sabor & Brasa, Torque Auto Center, Resolve Serviços | Implementadas e validadas localmente; **não publicadas** |
| 4 | Linha Direta Profissional, Almeida & Prado Advocacia, Horizonte Imóveis, PetVille, Pulse Studio | Implementadas e validadas localmente; **não publicadas** |
| 5 | Raiz & Grão, Flor & Afeto | Implementadas e validadas localmente; **não publicadas** |

As 12 demos previstas no briefing existem. **Nada está publicado.** O projeto não está pronto para publicação comercial: faltam os itens do proprietário abaixo.

## Demos

| Slug | Negócio fictício | App | Porta local | Exibido no portfólio sem URL |
|---|---|---|---|---|
| `barbearia` | Bravus Barbearia | `apps/barbearia` | 3101 | "Publicação em breve" (sem botão) |
| `clinica` | Vita Clínica | `apps/clinica` | 3102 | "Publicação em breve" |
| `restaurante` | Sabor & Brasa | `apps/restaurante` | 3103 | "Publicação em breve" |
| `oficina` | Torque Auto Center | `apps/oficina` | 3104 | "Publicação em breve" |
| `servicos` | Resolve Serviços | `apps/servicos` | 3105 | "Publicação em breve" |
| `autonomo` | Lia Torres (Linha Direta Profissional) | `apps/autonomo` | 3106 | "Publicação em breve" |
| `advocacia` | Almeida & Prado Advocacia | `apps/advocacia` | 3107 | "Publicação em breve" |
| `imobiliaria` | Horizonte Imóveis | `apps/imobiliaria` | 3108 | "Publicação em breve" |
| `petshop` | PetVille | `apps/petshop` | 3109 | "Publicação em breve" |
| `academia` | Pulse Studio | `apps/academia` | 3110 | "Publicação em breve" |
| `produtos-naturais` | Raiz & Grão | `apps/produtos-naturais` | 3111 | "Publicação em breve" |
| `floricultura` | Flor & Afeto | `apps/floricultura` | 3112 | "Publicação em breve" |

Todas estão com `demoStatus: "available"` nos dados. O botão "Abrir demonstração" só aparece com `available` **e** `NEXT_PUBLIC_DEMO_URL_<SLUG>` válida no ambiente (em produção: HTTPS público).

## Pendências que dependem do proprietário (bloqueiam a publicação comercial)

1. **Contato real:** número de WhatsApp com código do país e/ou e-mail. Sem isso, o site mostra "Contato em configuração".
2. **URL pública do portfólio** e **hospedagem** (sugestão documentada: Vercel, um projeto por app). Nada foi contratado.
3. **Publicar as 12 demos** (um projeto por app no host) e configurar `NEXT_PUBLIC_DEMO_URL_<SLUG>` no portfólio e `NEXT_PUBLIC_PORTFOLIO_URL` em cada demo.
4. **Revisão da política de privacidade** com os dados reais de contato e, se desejar, revisão jurídica.
5. **Opcional:** redes sociais, cidade e área de atendimento (somente se confirmadas).

## Pendências técnicas conhecidas

- Testar em Safari/iOS, em aparelhos reais e com leitor de tela (Chromium e Firefox foram testados).
- Considerar CSP completa após escolher o host.
- LCP de laboratório do portfólio de 2,6–3,0 s em 4G lento simulado (nota de desempenho 0,93–0,97; LCP = primeira pintura, sem imagem atrasada). Ver `validation.md`.
- CI (`.github/workflows/ci.yml`): o repositório está em github.com/alexfcastro/portfolio-sites; conferir no CI se `pnpm install --frozen-lockfile` aceita o app `apps/landing` (o lockfile foi ajustado à mão).

## Próximo passo

Resolver as pendências do proprietário e publicar: primeiro o portfólio em preview, depois cada demo, conferindo na URL real (HTTPS, links de ida e volta, `noindex` das demos, 404).

## Atualização de 11/11/2026

Redesenho visual do portfólio e da primeira dobra de 6 demos concluído e verificado (ver `validation.md`).

## Atualização de 17/11/2026

- **Marca:** o portfólio passou a se chamar **Estúdio X, por Alex Castro**, com símbolo novo (`lib/brand.ts`, `app/icon.svg`, `public/brand/`).
- **Página inicial:** abertura com corredor 3D de janelas (`project-tunnel.tsx`, também no celular; cada janela abre a demo), destaques temáticos, personalizador ligado ao formulário de contato e FAQ.
- **Fotos:** as 12 demos têm fotos realistas geradas por IA (182 publicadas; segunda leva importada; as fracas foram trocadas). Originais em `fotos-ia/` (fora do Git).
- **Landing pages:** app novo `apps/landing` (porta 3113) com 6 landing pages fictícias, listadas no portfólio em `/#landing-pages`. Precisa de `NEXT_PUBLIC_DEMO_URL_LANDING` no portfólio quando publicado.
- Pendências do proprietário acima continuam valendo (contato real, hospedagem, publicação, revisão da privacidade). Agora também: **revisar as respostas do FAQ** (prazos e formas de contratação) e publicar o app de landing pages.
