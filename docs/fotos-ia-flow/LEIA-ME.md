# Prompts para o agente do Google Flow (um por site)

Cada arquivo é **um prompt**: copie o conteúdo inteiro e cole no agente do Flow com o Nano Banana. Nenhum passa de 20 imagens. Sites com mais de 20 fotos foram divididos em duas partes, mantendo juntas as vistas do mesmo produto ou imóvel.

| Arquivo | Site | Imagens | Salvar em |
|---|---|---|---|
| `01-restaurante.txt` | Sabor & Brasa (restaurante) | 13 | `fotos-ia/restaurante/` |
| `02-produtos-naturais-1.txt` | Raiz & Grão (produtos naturais) — parte 1 de 2 | 12 | `fotos-ia/produtos-naturais/` |
| `03-produtos-naturais-2.txt` | Raiz & Grão (produtos naturais) — parte 2 de 2 | 11 | `fotos-ia/produtos-naturais/` |
| `04-floricultura-1.txt` | Flor & Afeto (floricultura) — parte 1 de 2 | 9 | `fotos-ia/floricultura/` |
| `05-floricultura-2.txt` | Flor & Afeto (floricultura) — parte 2 de 2 | 12 | `fotos-ia/floricultura/` |
| `06-imobiliaria-1.txt` | Horizonte Imóveis (imobiliária) — parte 1 de 2 | 17 | `fotos-ia/imobiliaria/` |
| `07-imobiliaria-2.txt` | Horizonte Imóveis (imobiliária) — parte 2 de 2 | 17 | `fotos-ia/imobiliaria/` |
| `08-autonomo.txt` | Lia Torres (fotógrafa de produto) | 6 | `fotos-ia/autonomo/` |
| `09-petshop.txt` | PetVille (pet shop) | 4 | `fotos-ia/petshop/` |
| `10-servicos.txt` | Resolve Serviços | 6 | `fotos-ia/servicos/` |
| `11-barbearia.txt` | Bravus Barbearia | 6 | `fotos-ia/barbearia/` |
| `12-clinica.txt` | Vita Clínica | 1 | `fotos-ia/clinica/` |

**Total da primeira leva:** 114 imagens em 12 prompts (todas já geradas e publicadas).

## Segunda leva: fotos que ainda faltam

Para todas as demos terem fotos realistas, faltam estas 45 imagens (oficina, advocacia e academia ainda não têm nenhuma; as outras ganham retratos da equipe). As páginas já estão preparadas: enquanto a foto não existe, continua aparecendo a inicial ou o fundo liso.

| Arquivo | Site | Imagens | Salvar em |
|---|---|---|---|
| `13-oficina.txt` | Torque Auto Center (oficina) | 7 | `fotos-ia/oficina/` |
| `14-advocacia.txt` | Almeida & Prado Advocacia | 7 | `fotos-ia/advocacia/` |
| `15-academia.txt` | Pulse Studio (academia) | 11 | `fotos-ia/academia/` |
| `16-clinica-2.txt` | Vita Clínica: especialidades e equipe | 13 | `fotos-ia/clinica/` |
| `17-equipes.txt` | Retratos de equipe: barbearia, pet shop e imobiliária | 7 | `fotos-ia/barbearia/`, `fotos-ia/petshop/` e `fotos-ia/imobiliaria/` (o começo do nome diz o site) |

Os retratos são de pessoas que não existem, geradas por IA. Os prompts pedem que não se pareçam com ninguém conhecido, e as demos já avisam que a equipe é fictícia e que as fotos são geradas por IA.

## Nomes dos arquivos

Os prompts pedem ao agente que use **só** o nome indicado (ex.: `picanha.png`), sem números, datas ou palavras extras. Se mesmo assim o Flow baixar com outro nome, renomeie antes de colocar na pasta, ou me avise que eu renomeio pela lista que o agente devolve no fim de cada prompt.

## Depois de gerar

Salve cada imagem em `fotos-ia/<site>/` (coluna "Salvar em") e me avise. Eu otimizo, coloco nas páginas, registro como imagens geradas por IA e refaço as capturas do portfólio.
