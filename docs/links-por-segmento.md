# Links do portfólio por segmento (para as mensagens de abordagem)

Use na coluna da planilha o link do segmento de cada contato, em vez da página inicial. Troque `SEU-DOMINIO` pelo endereço do portfólio quando ele for publicado.

## Catálogo filtrado por segmento

`/projetos?segmento=<id>` abre o catálogo já filtrado e mantém os projetos desse segmento em primeiro lugar, mesmo se a pessoa limpar o filtro.

| Segmento na planilha | Link |
|---|---|
| Sobrancelhas, cílios, unhas, estética, noivas, cabelo, spa (beleza em geral) | `https://SEU-DOMINIO/projetos?segmento=beleza` |
| Clínicas, consultórios, academias, pet shops (saúde e bem-estar) | `https://SEU-DOMINIO/projetos?segmento=saude-bem-estar` |
| Restaurantes, lanchonetes, docerias | `https://SEU-DOMINIO/projetos?segmento=alimentacao` |
| Oficinas e serviços automotivos | `https://SEU-DOMINIO/projetos?segmento=automotivo` |
| Barbearias, prestadores de serviço | `https://SEU-DOMINIO/projetos?segmento=servicos` |
| Advogados, fotógrafos, consultores (profissionais) | `https://SEU-DOMINIO/projetos?segmento=profissionais` |
| Imobiliárias e corretores | `https://SEU-DOMINIO/projetos?segmento=imoveis` |
| Lojas, empórios, floriculturas (comércio) | `https://SEU-DOMINIO/projetos?segmento=comercio` |

## Link direto do projeto mais parecido (quando o segmento é bem específico)

| Segmento | Link |
|---|---|
| Sobrancelhas e micropigmentação | `https://SEU-DOMINIO/projetos/sobrancelhas` |
| Estética facial e corporal | `https://SEU-DOMINIO/projetos/estetica` |
| Cílios (atendimento e curso) | `https://SEU-DOMINIO/projetos/cilios` |
| Noivas e maquiagem | `https://SEU-DOMINIO/projetos/noivas` |
| Unhas e esmalteria | `https://SEU-DOMINIO/projetos/unhas` |
| Mega hair e terapia capilar | `https://SEU-DOMINIO/projetos/capilar` |
| Spa e massagem | `https://SEU-DOMINIO/projetos/spa` |

Na planilha, se o segmento estiver numa coluna (ex.: coluna C), uma fórmula como
`="https://SEU-DOMINIO/projetos?segmento="&PROCV(C2;Tabela_Segmentos;2;FALSO)` monta o link de cada linha a partir de uma tabelinha de segmento → id.
