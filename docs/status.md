# Status do projeto

Atualizado em 27/09/2026.

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

- Testar em Firefox e Safari/iOS, em aparelhos reais e com leitor de tela.
- Considerar CSP completa após escolher o host.
- LCP simulado do portfólio de 2,6–3,1 s em 4G lento (ver `validation.md`).
- CI (`.github/workflows/ci.yml`) criado, mas não executado: o repositório não tem remoto no GitHub.
- Flor & Afeto faz um pedido por produto (sem carrinho com vários buquês); ver `decisions.md`.

## Próximo passo

Resolver as pendências do proprietário e publicar: primeiro o portfólio em preview, depois cada demo, conferindo na URL real (HTTPS, links de ida e volta, `noindex` das demos, 404).
