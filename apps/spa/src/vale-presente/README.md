# Vale-presente (módulo reaproveitável)

Montador de vale-presente com prévia do cartão, pensado para negócios de beleza e bem-estar em datas como Dia das Mães e Natal. Está separado do resto do site da Casa Serena para poder ser copiado para outro projeto.

## O que tem aqui

| Arquivo | O que faz |
|---|---|
| `vale.ts` | Lógica pura (sem React): tipos, valor, taxa de entrega, total, validação, validade, código do vale e mensagem do pedido. |
| `vale.test.ts` | Testes da lógica (Vitest). |
| `cartao-vale.tsx` | Prévia do cartão, só visual. |
| `montador-vale.tsx` | O montador completo: presente (experiência ou valor livre), mensagem, entrega e finalização. |

Dependências: React e `lucide-react` (ícones). Nada mais do site é importado.

## Como usar em outro projeto

1. Copie a pasta `vale-presente/` inteira.
2. Monte a configuração do negócio (`ValeConfig`): nome, experiências com valor, limites do valor livre, sugestões, validade, entrega por e-mail e cartão impresso (com taxa) e o limite da mensagem.
3. Defina as cores no elemento em volta do montador, com variáveis CSS:

```css
.vale-tema {
  --vale-fundo: #1f3d33;          /* fundo do cartão */
  --vale-texto: #f4ede1;          /* texto do cartão */
  --vale-destaque: #c9b48a;       /* círculos decorativos do cartão */
  --vale-fonte-titulo: Georgia, serif;
  --vale-acento: #1f3d33;         /* seleção, foco e botões */
  --vale-acento-texto: #ffffff;
  --vale-linha: #ddd3c2;          /* bordas dos campos */
  --vale-campo: #fffdf8;          /* fundo dos campos */
  --vale-erro: #a4262c;
}
```

E as duas classes de botão, `vale-btn-primario` e `vale-btn-secundario`, com o estilo de botão do site.

4. Use o componente:

```tsx
<div className="vale-tema">
  <MontadorVale
    config={meuConfig}
    onFinalizar={(vale, codigo, validoAte) => { /* guardar, enviar, etc. */ }}
    acaoFinal={(vale) => <MeuBotaoDeWhatsApp mensagem={mensagemPedido(vale, meuConfig)} />}
  />
</div>
```

## O que fica para o projeto real

- Pagamento (Pix ou cartão) e envio do e-mail com o cartão: aqui é só demonstração, nada é cobrado nem enviado.
- Guardar os vales emitidos e dar baixa quando forem usados (um painel simples resolve).
