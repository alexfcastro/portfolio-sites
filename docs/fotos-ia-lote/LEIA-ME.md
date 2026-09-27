# Lote de fotos para o agente do Google Flow

Mesmas 114 fotos de `docs/fotos-ia.md`, num formato para pedir ao agente do Flow que gere tudo em sequência. Numeração contínua de 001 a 114.

| Arquivo | Conteúdo | Quando usar |
|---|---|---|
| `parte-1.txt` | 001–020: restaurante e floricultura (foto principal) | Recomendado: uma parte por vez |
| `parte-2.txt` | 021–043: produtos naturais | |
| `parte-3.txt` | 044–071: imobiliária (fachadas), fotógrafa, pet shop, serviços | |
| `parte-4.txt` | 072–093: imobiliária (salas e quartos) | |
| `parte-5.txt` | 094–114: floricultura (outras vistas), barbearia, clínica | |
| `todas.txt` | 001–114 em uma mensagem só | Se o agente aceitar mensagens longas |
| `fotos-ia.csv` | Uma linha por foto, com o prompt completo | Ferramentas que importam planilha, ou para conferir |

## Como usar

1. Abra o agente do Flow com o Nano Banana selecionado.
2. Copie **todo** o conteúdo de `parte-1.txt` e cole como mensagem. Cada arquivo já traz as instruções: ordem, proporção, nome do arquivo e regras.
3. Ao final, o agente deve listar o número e o nome de cada imagem gerada. Confira se não faltou nenhuma e se nenhuma tem texto ou logotipo.
4. Baixe as imagens para `fotos-ia/<demo>/` com o nome indicado (a pasta de cada grupo aparece no arquivo, em `PASTA:`).
5. Repita com a parte seguinte.

## Se o agente não conseguir dar o nome aos arquivos

Baixe as imagens na ordem em que foram geradas, numa pasta por parte (por exemplo `fotos-ia/parte-1/`). Eu renomeio pela numeração do lote: a 1ª imagem da parte 1 é o item 001 (`picanha.png`), e assim por diante.

## Limites

Não há como garantir que o agente gere as 114 em sequência numa única conversa: isso depende dos limites do Flow no seu plano. Por isso as partes têm entre 20 e 28 imagens. Se o agente parar no meio, peça "continue a partir do item NNN".
