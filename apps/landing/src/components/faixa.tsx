/*
 * Faixa decorativa de palavras: desliza conforme a página rola (regra em globals.css).
 * É repetição do que já está na página, então fica fora da leitura de tela.
 */
export function Faixa({ itens, className = "" }: { itens: readonly string[]; className?: string }) {
  const linha = [...itens, ...itens, ...itens, ...itens];
  return (
    <div aria-hidden className={`faixa ${className}`}>
      <div className="faixa-linha">
        {linha.map((texto, index) => (
          <span key={index} className="faixa-item">
            {texto}
          </span>
        ))}
      </div>
    </div>
  );
}
