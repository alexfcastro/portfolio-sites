# Status do projeto

Atualizado em 26/09/2026.

## Fase concluída

**Fase 1: portfólio implementado e validado localmente (prévia).**

Funciona: Home, `/projetos` com filtros, 12 cases conceituais, Sobre, Contato (formulário que prepara a mensagem), Privacidade, 404, identidade AX, SEO por ambiente e documentação.

**Não está pronto para publicação comercial**: faltam os itens do proprietário abaixo.

## Demos existentes

Nenhuma. As 12 demos estão com estado `planned` ("Em breve") e nenhum case mostra "Abrir demonstração".

## Pendências que dependem do proprietário (bloqueiam a publicação comercial)

1. **Contato real:** número de WhatsApp com código do país e/ou e-mail. Sem isso, o site mostra "Contato em configuração".
2. **URL pública:** hospedagem escolhida e/ou domínio. Sem ela não há canonical, sitemap nem imagem de compartilhamento, e o site fica `noindex`.
3. **Hospedagem:** escolher e criar a conta (sugestão documentada: Vercel). Nada foi contratado.
4. **Revisão da política de privacidade** com os dados reais de contato e, se desejar, revisão jurídica.
5. **Opcional:** redes sociais, cidade e área de atendimento (somente se confirmadas).

## Pendências técnicas conhecidas

- Testar em Firefox e Safari/iOS, e em aparelhos reais.
- Considerar CSP completa após escolher o host.
- LCP simulado de 2,6–3,1 s em 4G lento: aceitável, mas pode melhorar (ver `validation.md`).
- CI (`.github/workflows/ci.yml`) criado, mas não executado: o repositório não tem remoto no GitHub.

## Próximo passo

**Fase 2 — Bravus Barbearia** (`apps/barbearia`): agendamento simulado (serviço → profissional → horário → resumo → confirmação de demonstração), painel `/admin` demonstrativo com reset, datas relativas ao dia atual em `America/Sao_Paulo`, `noindex`, barra "Projeto demonstrativo". Depois de validar: screenshots reais no case e `demoStatus: "available"`.
