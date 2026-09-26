# Status do projeto

Atualizado em 26/09/2026.

## Fases concluídas

| Fase | Entrega | Situação |
|---|---|---|
| 1 | Portfólio (`apps/portfolio`) | Implementado e validado localmente (prévia) |
| 2 | Bravus Barbearia (`apps/barbearia`) | Implementada e validada localmente; **não publicada** |

**Nada está publicado.** O projeto não está pronto para publicação comercial: faltam os itens do proprietário abaixo.

## Demos

| Slug | App | Porta local | Estado nos dados | Exibido no portfólio sem URL |
|---|---|---|---|---|
| `barbearia` | `apps/barbearia` | 3101 | `available` | "Publicação em breve" (sem botão) |
| demais 11 | — | — | `planned` | "Em breve" |

O botão "Abrir demonstração" só aparece com `available` **e** `NEXT_PUBLIC_DEMO_URL_<SLUG>` válida no ambiente (em produção: HTTPS público).

## Pendências que dependem do proprietário (bloqueiam a publicação comercial)

1. **Contato real:** número de WhatsApp com código do país e/ou e-mail. Sem isso, o site mostra "Contato em configuração".
2. **URL pública do portfólio** e **hospedagem** (sugestão documentada: Vercel, um projeto por app). Nada foi contratado.
3. **Publicar a demo da Bravus** e configurar `NEXT_PUBLIC_DEMO_URL_BARBEARIA` no portfólio e `NEXT_PUBLIC_PORTFOLIO_URL` na demo.
4. **Revisão da política de privacidade** com os dados reais de contato e, se desejar, revisão jurídica.
5. **Opcional:** redes sociais, cidade e área de atendimento (somente se confirmadas).

## Pendências técnicas conhecidas

- Testar em Firefox e Safari/iOS, e em aparelhos reais.
- Considerar CSP completa após escolher o host.
- LCP simulado do portfólio de 2,6–3,1 s em 4G lento (ver `validation.md`).
- CI (`.github/workflows/ci.yml`) criado, mas não executado: o repositório não tem remoto no GitHub.

## Próximo passo

**Fase 3**, uma aplicação por vez, na ordem da matriz: Vita Clínica → Sabor & Brasa → Torque Auto Center → Resolve Serviços.
