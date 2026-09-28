# Fotos geradas por IA — lista e prompts (Nano Banana no Google Flow)

Lista das fotos que substituem as ilustrações das demos, com um prompt pronto para cada uma. Os negócios são fictícios, então **todas as fotos serão identificadas como geradas por IA** em `docs/assets.md`, como o briefing exige.

- **Prioridade A** (71 fotos): onde a foto muda mais a percepção da demo. Comece por aqui.
- **Prioridade B** (36 fotos): galerias da imobiliária e da floricultura (2ª e 3ª imagens).
- **Prioridade C** (7 fotos): opcionais (barbearia e clínica).

Pode entregar aos poucos: onde ainda não houver foto, a demo continua usando a ilustração atual.

Para gerar com o agente do Flow (até 20 imagens por pedido), use os prompts prontos de `docs/fotos-ia-flow/`, um por site (veja o `LEIA-ME.md` de lá).

## O que fica como está (de propósito)

- **Mapas** (barbearia, clínica): continuam ilustrativos; uma foto de mapa sugeriria um endereço real.
- **Equipes** (médicos, barbeiros, advogados, professores, corretores): continuam com iniciais. Rostos gerados de profissionais que não existem podem parecer pessoas reais.
- **Sua foto no portfólio**: só com uma foto real sua (o briefing proíbe inventar).
- **Academia, advocacia e oficina**: não usam ilustrações; ficam como estão.

## Como gerar e salvar

1. No Flow, use o gerador de imagens com o **Nano Banana**.
2. Escolha a **proporção** indicada no bloco da demo. Se o Flow não tiver essa proporção, gere na mais próxima; eu recorto.
3. Copie o **prompt** do item (cada prompt já tem o estilo da demo e as regras) e gere. Se quiser, gere 2 ou 3 variações e fique com a melhor.
4. **Confira antes de salvar**: sem texto, letras ou números inventados; sem logotipos ou marcas; sem pessoas (exceto a nuca ou perfil em sombra na barbearia); sem mãos ou objetos deformados. Se aparecer, gere de novo ou peça no próprio Flow: "remova todo o texto e os logotipos".
5. **Baixe** em PNG ou JPG, no maior tamanho disponível.
6. **Salve com o nome exato** indicado, na pasta `fotos-ia/<demo>/` dentro do projeto. Exemplo: `Documentos\alex-castro-portfolio\fotos-ia\restaurante\picanha.png`. Nome em minúsculas, sem acentos e sem espaços; a extensão pode ser `.png` ou `.jpg`.
7. Quando terminar uma demo (ou todas), me avise. Eu converto para formato leve (WebP), recorto na proporção certa, coloco nas páginas com texto alternativo, registro a origem em `docs/assets.md`, refaço as capturas do portfólio e rodo os testes.

A pasta `fotos-ia/` já existe e fica fora do Git (os originais são grandes). Só as versões otimizadas entram no projeto.

### Dica para manter as fotos de uma demo parecidas entre si

Gere a primeira foto da demo, escolha a melhor e, nas seguintes, anexe essa foto como referência no Flow com a frase "mantenha o mesmo estilo de luz, fundo e cores desta imagem". Assim o catálogo fica coerente.

## A · Sabor & Brasa (restaurante)

- **Pasta:** `fotos-ia/restaurante/`
- **Proporção:** 4:3 (paisagem)
- **Onde aparece:** Cardápio, janela de adicionais e carrinho
- **Quantidade:** 13

### [ ] `picanha.png` — Picanha na brasa

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: picanha fatiada ao ponto, suculenta, sobre tábua de madeira, com sal grosso por cima. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `costela.png` — Costela assada

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: costela bovina assada lentamente, desmanchando, com casquinha dourada, numa travessa de barro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `frango.png` — Frango na brasa

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: meio frango assado na brasa, pele dourada e crocante, com ramos de ervas frescas. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `linguica.png` — Linguiça artesanal

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: três gomos de linguiça artesanal grelhada com cebola dourada na chapa de ferro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arroz.png` — Arroz biro-biro

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: arroz biro-biro com ovo mexido, pedaços de bacon e batata palha, numa travessa branca. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `farofa.png` — Farofa da casa

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: farofa dourada com banana e cebola douradas, numa cumbuca de cerâmica. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `mandioca.png` — Mandioca frita

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: porção de mandioca frita crocante em palitos grossos, numa cesta de metal forrada com papel manteiga. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `salada.png` — Salada da estação

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: salada de folhas verdes, tomate e cebola roxa em rodelas, numa saladeira de vidro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `refri.png` — Refrigerante lata

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: lata de refrigerante genérica toda lisa, sem nenhuma estampa, com gotas de condensação, ao lado de um copo com gelo. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `suco.png` — Suco natural

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: copo alto de suco natural de laranja com gelo, com meia laranja ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `agua.png` — Água mineral

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: garrafa de água mineral de vidro transparente sem rótulo e um copo com água. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `pudim.png` — Pudim de leite

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: fatia de pudim de leite com calda de caramelo brilhante escorrendo, num prato de sobremesa. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `brownie.png` — Brownie

```text
Fotografia gastronômica de churrascaria brasileira. Prato servido sobre mesa de madeira escura, luz quente e suave vinda da lateral, fundo desfocado em tons de marrom e brasa, câmera em ângulo de 45 graus, prato centralizado com espaço livre ao redor, cores naturais e apetitosas, profundidade de campo rasa. Prato: brownie de chocolate com calda de chocolate por cima, num prato pequeno. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · Raiz & Grão (produtos naturais)

- **Pasta:** `fotos-ia/produtos-naturais/`
- **Proporção:** 1:1 (quadrada)
- **Onde aparece:** Cards do catálogo, página do produto e carrinho
- **Quantidade:** 23

### [ ] `canela-em-po.png` — Canela em pó

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: canela em pó marrom-avermelhada, com dois paus de canela ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `curcuma.png` — Cúrcuma em pó

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: cúrcuma em pó amarelo-ouro intenso, com uma raiz de cúrcuma fresca cortada ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `paprica-defumada.png` — Páprica defumada

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: páprica defumada em pó vermelho-escuro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `camomila.png` — Camomila (flores secas)

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: flores secas de camomila, pequenas e amareladas, e uma xícara de chá claro ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hortela.png` — Hortelã (folhas secas)

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: folhas secas de hortelã verde e alguns raminhos frescos ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `quinoa.png` — Quinoa em grãos

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: grãos de quinoa clara crua. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `lentilha.png` — Lentilha

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: lentilhas marrons cruas. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `aveia-flocos.png` — Aveia em flocos

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: aveia em flocos. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `castanha-caju.png` — Castanha de caju

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: castanhas de caju torradas inteiras. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `castanha-para.png` — Castanha-do-pará

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: castanhas-do-pará sem casca. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `amendoas.png` — Amêndoas

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: amêndoas inteiras com pele. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `damasco.png` — Damasco seco

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: damascos secos alaranjados. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `uva-passa.png` — Uva-passa escura

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: uvas-passas escuras. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `farinha-amendoas.png` — Farinha de amêndoas

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: farinha de amêndoas fina e clara, com algumas amêndoas inteiras ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `farinha-integral.png` — Farinha de trigo integral

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: farinha de trigo integral em tom caramelo claro, com alguns grãos de trigo ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `chia.png` — Semente de chia

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: sementes de chia pequenas, pretas e cinzas. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `girassol.png` — Semente de girassol

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: sementes de girassol descascadas. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `granola-tradicional.png` — Granola tradicional

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: granola dourada em cachos, com uva-passa e castanha de caju. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `granola-sem-acucar.png` — Granola sem açúcar

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: granola rústica com coco em flocos e sementes de girassol. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `mel-silvestre.png` — Mel silvestre (pote de 500 g)

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: um pote de vidro fechado cheio de mel dourado, sem rótulo, com um pegador de mel de madeira ao lado e um fio de mel escorrendo. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `pasta-amendoim.png` — Pasta de amendoim integral (pote de 450 g)

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: um pote de vidro aberto com pasta de amendoim cremosa, sem rótulo, com amendoins torrados ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `kit-cafe-da-manha.png` — Kit café da manhã

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: uma caixa de papel kraft aberta com quatro potes de vidro sem rótulo: granola, aveia, uva-passa e pasta de amendoim, arrumados lado a lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `kit-chas.png` — Kit chás da tarde

```text
Fotografia de produto para empório de produtos naturais. Vista de cima levemente inclinada (cerca de 30 graus). O produto está num pote de vidro aberto ou numa tigela de cerâmica clara, com uma colher de madeira e um pouco do produto espalhado sobre um pano de linho bege. Luz natural suave de janela, fundo em tons de bege e verde-oliva, visual acolhedor e fresco. Pote e embalagens sem rótulo. Produto: uma caixa de papel kraft aberta com três pequenos potes de vidro sem rótulo: flores de camomila, folhas de hortelã e canela em pó, com uma xícara de chá ao lado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · Flor & Afeto (floricultura)

- **Pasta:** `fotos-ia/floricultura/`
- **Proporção:** 1:1 (quadrada)
- **Onde aparece:** Home, catálogo, página do produto (foto principal) e carrinho
- **Quantidade:** 7

### [ ] `buque-rosas-vermelhas.png` — Buquê de rosas vermelhas — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de rosas vermelhas com folhagens verdes, envolto em papel kraft com laço de fita de cetim. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-campo.png` — Buquê do campo — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê do campo com margaridas brancas, lisianthus lilás e flores miúdas claras, envolto em papel lilás claro. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-girassois.png` — Buquê de girassóis — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de girassóis com folhagens verdes, envolto em papel creme. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-rosa-antigo.png` — Arranjo rosa-antigo — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo de rosas e cravos em tons de rosa-antigo dentro de uma caixa rígida redonda de papelão claro. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-branco-sereno.png` — Arranjo branco sereno (condolências) — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo sóbrio e sereno de lírios e rosas brancas com folhagens verdes, em recipiente baixo claro, clima respeitoso e calmo. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `cesta-cafe.png` — Cesta café com flores — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: cesta de vime com um mini buquê de flores rosa, um pote de geleia sem rótulo, biscoitos e uma caixinha de chá lisa. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `orquidea.png` — Orquídea em vaso — principal

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: orquídea phalaenopsis lilás com hastes floridas num cachepô de cerâmica branca. Fundo liso rosa-antigo bem claro, produto sozinho, visto de frente. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · Horizonte Imóveis (imobiliária)

- **Pasta:** `fotos-ia/imobiliaria/`
- **Proporção:** 16:9 (paisagem)
- **Onde aparece:** Cards da busca e primeira imagem da galeria do imóvel
- **Quantidade:** 12

### [ ] `hz-0142-fachada.png` — Casa com quintal — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: casa térrea simples e bem cuidada, com quintal gramado na frente e churrasqueira ao fundo. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0157-fachada.png` — Apartamento perto do metrô — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: prédio residencial de médio porte com varandas, numa rua arborizada do centro. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0163-fachada.png` — Casa em condomínio — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: casa moderna de dois andares em condomínio fechado com muito verde ao redor. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0171-fachada.png` — Studio mobiliado — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: prédio residencial moderno e estreito, de muitos andares. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0178-fachada.png` — Sala comercial com recepção — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: prédio comercial moderno com fachada de vidro. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0184-fachada.png` — Apartamento com vista — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: torre residencial alta com varandas de vidro. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0190-fachada.png` — Casa térrea reformada — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: casa térrea reformada com garagem coberta, numa rua tranquila de bairro. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0203-fachada.png` — Casa com piscina — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: casa ampla com piscina, área gourmet coberta e jardim. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0211-fachada.png` — Apartamento familiar — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: condomínio residencial com área de lazer e piscina, prédios de altura média. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0219-fachada.png` — Apartamento compacto — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: prédio residencial pequeno e simples, de quatro andares. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0226-fachada.png` — Sala em centro empresarial — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: centro empresarial moderno com várias torres de vidro. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0232-fachada.png` — Sobrado com três suítes — fachada

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Vista externa: sobrado elegante de dois andares com varanda gourmet e jardim. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · Lia Torres (profissional autônoma)

- **Pasta:** `fotos-ia/autonomo/`
- **Proporção:** 4:3 (paisagem)
- **Onde aparece:** Portfólio filtrável da página inicial
- **Quantidade:** 6

### [ ] `cafe.png` — Café especial

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: três pacotes de café especial em papel kraft sem rótulo, com grãos de café torrados espalhados, fundo claro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `sabonetes.png` — Sabonetes artesanais

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: sabonetes artesanais em barra empilhados, com ramos de lavanda e uma toalha de linho, foto ambientada num banheiro claro. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `tenis.png` — Tênis de corrida

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: um tênis de corrida moderno sem nenhuma marca ou logotipo, visto de lado, fundo cinza-claro liso. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `doces.png` — Doceria de bairro

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: doces de confeitaria (brigadeiros, bem-casados e uma fatia de bolo) arrumados num prato de cerâmica, vista de cima. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `bolsas.png` — Bolsas de couro

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: bolsa de couro caramelo sem marca, fundo neutro bege, com destaque para a costura. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `serum.png` — Linha de sérum

```text
Fotografia de produto profissional de estúdio, do portfólio de uma fotógrafa de produto. Composição cuidadosa, luz suave controlada, fundo limpo. Cena: frasco de sérum de vidro âmbar com conta-gotas e sem rótulo, sobre uma pedra, com água e reflexos de luz lateral. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · PetVille (pet shop)

- **Pasta:** `fotos-ia/petshop/`
- **Proporção:** 4:3 (paisagem)
- **Onde aparece:** Destaque da página inicial, galeria, escolha da espécie no agendamento e "Meus agendamentos"
- **Quantidade:** 4

### [ ] `cao-caramelo.png` — Cachorro caramelo (banho e tosa higiênica)

```text
Fotografia realista e alegre de pet shop. Pet limpo e penteado logo depois do banho, sentado e olhando para a câmera, fundo liso em tom pêssego claro, luz suave de estúdio, retrato com espaço livre ao redor. Pet: cachorro vira-lata caramelo de porte médio, com uma bandana vermelha no pescoço. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `gato-cinza.png` — Gato cinza (banho com hidratação)

```text
Fotografia realista e alegre de pet shop. Pet limpo e penteado logo depois do banho, sentado e olhando para a câmera, fundo liso em tom pêssego claro, luz suave de estúdio, retrato com espaço livre ao redor. Pet: gato cinza de pelo macio e brilhante, com um lacinho vermelho. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `cao-creme.png` — Cachorro creme (tosa na tesoura)

```text
Fotografia realista e alegre de pet shop. Pet limpo e penteado logo depois do banho, sentado e olhando para a câmera, fundo liso em tom pêssego claro, luz suave de estúdio, retrato com espaço livre ao redor. Pet: cachorro pequeno de pelo creme cacheado recém-tosado na tesoura, com um lacinho vermelho na cabeça. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `gato-preto.png` — Gato preto (banho tranquilo)

```text
Fotografia realista e alegre de pet shop. Pet limpo e penteado logo depois do banho, sentado e olhando para a câmera, fundo liso em tom pêssego claro, luz suave de estúdio, retrato com espaço livre ao redor. Pet: gato preto calmo e relaxado, deitado sobre uma toalha macia. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## A · Resolve Serviços

- **Pasta:** `fotos-ia/servicos/`
- **Proporção:** 4:3 (paisagem)
- **Onde aparece:** Trabalhos realizados da página inicial
- **Quantidade:** 6

### [ ] `quadro.png` — Quadro de disjuntores reorganizado

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: quadro de disjuntores residencial aberto, fiação organizada e disjuntores alinhados, sem etiquetas legíveis e sem marcas. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `sala.png` — Sala com parede de destaque

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: sala de estar com uma parede de destaque recém-pintada em verde-escuro, acabamento liso, móveis simples. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `painel.png` — Painel de TV instalado

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: painel de madeira para TV fixado na parede da sala, com TV desligada de tela preta e sem fios aparentes. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `split.png` — Split instalado

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: ar-condicionado split branco sem marca instalado no alto da parede de um quarto, acabamento limpo. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `banheiro.png` — Vazamento sob a pia corrigido

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: vista do encanamento sob a pia do banheiro com sifão novo e registro, tudo seco e limpo. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `fachada.png` — Fachada renovada

```text
Fotografia realista de um serviço residencial concluído, mostrando o resultado final, ambiente limpo e organizado, luz natural. Resultado: fachada de casa térrea recém-pintada em tom claro, sem fissuras, com portão simples. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## B · Horizonte Imóveis — sala e quarto de cada imóvel

- **Pasta:** `fotos-ia/imobiliaria/`
- **Proporção:** 16:9 (paisagem)
- **Onde aparece:** Galeria da página do imóvel (2ª e 3ª imagens)
- **Quantidade:** 22

### [ ] `hz-0142-sala.png` — Casa com quintal — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala integrada à cozinha, sofá claro, piso de porcelanato, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0142-quarto.png` — Casa com quintal — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto de casal simples e aconchegante, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0157-sala.png` — Apartamento perto do metrô — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala pequena reformada com varanda, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0157-quarto.png` — Apartamento perto do metrô — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto compacto e reformado, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0163-sala.png` — Casa em condomínio — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala ampla com pé-direito alto e porta de vidro para o jardim, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0163-quarto.png` — Casa em condomínio — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: suíte master espaçosa, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0171-sala.png` — Studio mobiliado — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: studio mobiliado com sofá-cama, bancada e pequena cozinha no mesmo ambiente, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0171-quarto.png` — Studio mobiliado — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: cama de casal no studio mobiliado, vista para a janela, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0178-sala.png` — Sala comercial com recepção — interior

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: sala comercial com recepção e balcão, divisória de vidro para uma segunda sala, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0184-sala.png` — Apartamento com vista — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala para dois ambientes com janela ampla e vista aberta da cidade, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0184-quarto.png` — Apartamento com vista — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: suíte com janela ampla e vista da cidade, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0190-sala.png` — Casa térrea reformada — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala pequena reformada, clara e simples, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0190-quarto.png` — Casa térrea reformada — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto simples e claro, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0203-sala.png` — Casa com piscina — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala ampla integrada à área gourmet, com vista para a piscina, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0203-quarto.png` — Casa com piscina — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto amplo com porta para o jardim, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0211-sala.png` — Apartamento familiar — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala de estar e jantar familiar, confortável, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0211-quarto.png` — Apartamento familiar — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto infantil claro e organizado, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0219-sala.png` — Apartamento compacto — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala compacta e bem iluminada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0219-quarto.png` — Apartamento compacto — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: quarto compacto e bem iluminado, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0226-sala.png` — Sala em centro empresarial — interior

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: sala comercial vazia e moderna com janela grande e piso vinílico, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0232-sala.png` — Sobrado com três suítes — sala

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno, sala: sala de estar sofisticada com jardim de inverno ao lado, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `hz-0232-quarto.png` — Sobrado com três suítes — quarto

```text
Fotografia imobiliária realista de um imóvel no Brasil, luz do dia, céu claro, lente grande-angular sem distorção exagerada, ambiente limpo e organizado. Ambiente interno: suíte ampla e elegante, cama arrumada, decoração neutra. Sem placas, sem número da casa, sem carros com placa visível. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## B · Flor & Afeto — outras vistas de cada produto

- **Pasta:** `fotos-ia/floricultura/`
- **Proporção:** 1:1 (quadrada)
- **Onde aparece:** Galeria da página do produto (2ª e 3ª imagens)
- **Quantidade:** 14

### [ ] `buque-rosas-vermelhas-mesa.png` — Buquê de rosas vermelhas — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de rosas vermelhas com folhagens verdes, envolto em papel kraft com laço de fita de cetim. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-rosas-vermelhas-detalhe.png` — Buquê de rosas vermelhas — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de rosas vermelhas com folhagens verdes, envolto em papel kraft com laço de fita de cetim. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-campo-mesa.png` — Buquê do campo — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê do campo com margaridas brancas, lisianthus lilás e flores miúdas claras, envolto em papel lilás claro. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-campo-detalhe.png` — Buquê do campo — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê do campo com margaridas brancas, lisianthus lilás e flores miúdas claras, envolto em papel lilás claro. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-girassois-mesa.png` — Buquê de girassóis — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de girassóis com folhagens verdes, envolto em papel creme. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `buque-girassois-detalhe.png` — Buquê de girassóis — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: buquê de girassóis com folhagens verdes, envolto em papel creme. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-rosa-antigo-mesa.png` — Arranjo rosa-antigo — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo de rosas e cravos em tons de rosa-antigo dentro de uma caixa rígida redonda de papelão claro. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-rosa-antigo-detalhe.png` — Arranjo rosa-antigo — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo de rosas e cravos em tons de rosa-antigo dentro de uma caixa rígida redonda de papelão claro. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-branco-sereno-mesa.png` — Arranjo branco sereno (condolências) — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo sóbrio e sereno de lírios e rosas brancas com folhagens verdes, em recipiente baixo claro, clima respeitoso e calmo. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `arranjo-branco-sereno-detalhe.png` — Arranjo branco sereno (condolências) — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: arranjo sóbrio e sereno de lírios e rosas brancas com folhagens verdes, em recipiente baixo claro, clima respeitoso e calmo. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `cesta-cafe-mesa.png` — Cesta café com flores — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: cesta de vime com um mini buquê de flores rosa, um pote de geleia sem rótulo, biscoitos e uma caixinha de chá lisa. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `cesta-cafe-detalhe.png` — Cesta café com flores — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: cesta de vime com um mini buquê de flores rosa, um pote de geleia sem rótulo, biscoitos e uma caixinha de chá lisa. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `orquidea-mesa.png` — Orquídea em vaso — sobre a mesa

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: orquídea phalaenopsis lilás com hastes floridas num cachepô de cerâmica branca. O mesmo produto sobre uma mesa de madeira clara, numa sala iluminada perto de uma janela, fundo desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

### [ ] `orquidea-detalhe.png` — Orquídea em vaso — detalhe

```text
Fotografia de floricultura delicada e elegante, visual emocional. Tons de rosa-antigo e verde-sálvia, luz suave e difusa, composição centralizada com espaço livre ao redor. Produto: orquídea phalaenopsis lilás com hastes floridas num cachepô de cerâmica branca. Close-up das flores do produto, mostrando pétalas e textura, fundo bem desfocado. Fotografia realista, nítida e bem iluminada. Sem nenhum texto, letra, número, rótulo, logotipo, marca ou marca d'água na imagem. Sem pessoas e sem mãos. Não recortar o objeto principal nas bordas.
```

## C · Bravus Barbearia — estilos de corte

- **Pasta:** `fotos-ia/barbearia/`
- **Proporção:** 1:1 (quadrada)
- **Onde aparece:** Galeria de estilos da página inicial
- **Quantidade:** 6

### [ ] `classico.png` — Corte clássico

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: corte clássico social curto, penteado de lado, laterais baixas. Sem texto, letras, logotipos ou marcas d'água.
```

### [ ] `degrade.png` — Degradê

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: corte degradê bem marcado nas laterais, topo mais volumoso. Sem texto, letras, logotipos ou marcas d'água.
```

### [ ] `barba.png` — Barba desenhada

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: barba cheia desenhada com contornos bem definidos, vista de perfil. Sem texto, letras, logotipos ou marcas d'água.
```

### [ ] `texturizado.png` — Texturizado

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: corte texturizado com fios bagunçados de propósito no topo. Sem texto, letras, logotipos ou marcas d'água.
```

### [ ] `raspado.png` — Raspado com barba

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: cabeça raspada com barba curta bem aparada. Sem texto, letras, logotipos ou marcas d'água.
```

### [ ] `topete.png` — Topete

```text
Fotografia de barbearia com clima clássico e masculino, luz dourada quente, fundo escuro desfocado. Mostrar só o corte de cabelo e a barba: pessoa de costas ou de perfil em sombra, rosto não identificável. Estilo: topete alto penteado para trás, laterais curtas. Sem texto, letras, logotipos ou marcas d'água.
```

## C · Vita Clínica — destaque da página inicial

- **Pasta:** `fotos-ia/clinica/`
- **Proporção:** 1:1 (quadrada)
- **Onde aparece:** Imagem ao lado do título da página inicial
- **Quantidade:** 1

### [ ] `recepcao.png` — Recepção da clínica

```text
Fotografia realista da recepção vazia de uma clínica moderna e acolhedora, tons de verde-água e branco, plantas, poltronas claras, balcão de recepção, luz natural suave. Sem pessoas, sem texto, letras, números, logotipos, marcas ou marcas d'água.
```

## Resumo dos arquivos

| Prioridade | Pasta | Arquivos |
|---|---|---|
| A | `fotos-ia/restaurante/` | picanha, costela, frango, linguica, arroz, farofa, mandioca, salada, refri, suco, agua, pudim, brownie |
| A | `fotos-ia/produtos-naturais/` | canela-em-po, curcuma, paprica-defumada, camomila, hortela, quinoa, lentilha, aveia-flocos, castanha-caju, castanha-para, amendoas, damasco, uva-passa, farinha-amendoas, farinha-integral, chia, girassol, granola-tradicional, granola-sem-acucar, mel-silvestre, pasta-amendoim, kit-cafe-da-manha, kit-chas |
| A | `fotos-ia/floricultura/` | buque-rosas-vermelhas, buque-campo, buque-girassois, arranjo-rosa-antigo, arranjo-branco-sereno, cesta-cafe, orquidea |
| A | `fotos-ia/imobiliaria/` | hz-0142-fachada, hz-0157-fachada, hz-0163-fachada, hz-0171-fachada, hz-0178-fachada, hz-0184-fachada, hz-0190-fachada, hz-0203-fachada, hz-0211-fachada, hz-0219-fachada, hz-0226-fachada, hz-0232-fachada |
| A | `fotos-ia/autonomo/` | cafe, sabonetes, tenis, doces, bolsas, serum |
| A | `fotos-ia/petshop/` | cao-caramelo, gato-cinza, cao-creme, gato-preto |
| A | `fotos-ia/servicos/` | quadro, sala, painel, split, banheiro, fachada |
| B | `fotos-ia/imobiliaria/` | hz-0142-sala, hz-0142-quarto, hz-0157-sala, hz-0157-quarto, hz-0163-sala, hz-0163-quarto, hz-0171-sala, hz-0171-quarto, hz-0178-sala, hz-0184-sala, hz-0184-quarto, hz-0190-sala, hz-0190-quarto, hz-0203-sala, hz-0203-quarto, hz-0211-sala, hz-0211-quarto, hz-0219-sala, hz-0219-quarto, hz-0226-sala, hz-0232-sala, hz-0232-quarto |
| B | `fotos-ia/floricultura/` | buque-rosas-vermelhas-mesa, buque-rosas-vermelhas-detalhe, buque-campo-mesa, buque-campo-detalhe, buque-girassois-mesa, buque-girassois-detalhe, arranjo-rosa-antigo-mesa, arranjo-rosa-antigo-detalhe, arranjo-branco-sereno-mesa, arranjo-branco-sereno-detalhe, cesta-cafe-mesa, cesta-cafe-detalhe, orquidea-mesa, orquidea-detalhe |
| C | `fotos-ia/barbearia/` | classico, degrade, barba, texturizado, raspado, topete |
| C | `fotos-ia/clinica/` | recepcao |

**Total:** 114 fotos (A: 71 · B: 36 · C: 7).
