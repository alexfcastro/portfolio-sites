"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/money";
import { comprimentosMega, gramasMega, precoMega, tecnicasMega } from "@/lib/questionario";

/**
 * Tabela de mega hair por comprimento e quantidade. A pessoa escolhe os dois e vê o valor; a tabela inteira
 * fica visível embaixo, para comparar sem precisar perguntar.
 */
export function TabelaMega() {
  const [cm, setCm] = useState<(typeof comprimentosMega)[number]>(50);
  const [g, setG] = useState<(typeof gramasMega)[number]>(100);

  const chip =
    "inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 text-sm font-medium transition-colors has-checked:border-ambar-escuro has-checked:bg-ambar-escuro has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ambar-escuro";

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <fieldset>
          <legend className="font-semibold">Comprimento</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {comprimentosMega.map((x) => (
              <label key={x} className={chip}>
                <input type="radio" name="mega-cm" className="sr-only" checked={cm === x} onChange={() => setCm(x)} />
                {x} cm
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-semibold">Quantidade de cabelo</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {gramasMega.map((x) => (
              <label key={x} className={chip}>
                <input type="radio" name="mega-g" className="sr-only" checked={g === x} onChange={() => setG(x)} />
                {x} g
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">100 g dá volume discreto; 200 g, volume bem visível. A quantidade certa é medida na avaliação.</p>
        </fieldset>
        <div className="rounded-card bg-ink p-6 text-creme" aria-live="polite">
          <p className="text-sm text-creme/75">
            Mega hair de {cm} cm com {g} g, com aplicação
          </p>
          <p className="mt-1 text-4xl font-semibold">{formatBRL(precoMega(cm, g))}</p>
          <p className="mt-2 text-sm text-creme/75">Cabelo humano, com a cor ajustada ao seu. Valores de demonstração.</p>
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[26rem] text-left text-sm">
            <caption className="px-4 pt-4 text-left font-semibold">Valor com aplicação, por comprimento e quantidade</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  Comprimento
                </th>
                {gramasMega.map((x) => (
                  <th key={x} scope="col" className="px-4 py-3 font-medium text-muted">
                    {x} g
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comprimentosMega.map((c) => (
                <tr key={c} className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {c} cm
                  </th>
                  {gramasMega.map((x) => (
                    <td key={x} className={`px-4 py-3 tabular-nums ${c === cm && x === g ? "bg-creme-escuro font-semibold" : ""}`}>
                      {formatBRL(precoMega(c, x))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[26rem] text-left text-sm">
            <caption className="px-4 pt-4 text-left font-semibold">Técnica e manutenção</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  Técnica
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  Manutenção
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  Indicada para
                </th>
              </tr>
            </thead>
            <tbody>
              {tecnicasMega.map((t) => (
                <tr key={t.nome} className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {t.nome}
                  </th>
                  <td className="px-4 py-3">{t.manutencao}</td>
                  <td className="px-4 py-3 text-muted">{t.indicada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
