"use client";

import { Gift, Mail, Printer } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import { CartaoVale } from "./cartao-vale";
import { codigoVale, formatBRL, taxaEntrega, totalVale, validade, validarVale, valeVazio, valorDoVale, type ErrosVale, type Vale, type ValeConfig } from "./vale";

/*
 * Montador de vale-presente reaproveitável. Recebe a configuração do negócio e devolve, no fim, o vale montado.
 * Não depende de nada do site: cores por variáveis CSS (--vale-*) e a ação final (ex.: prévia de WhatsApp)
 * por `acaoFinal`. Veja o README.md desta pasta.
 */

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function dataLonga(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`));
}

function semente(): number {
  return Date.now();
}

const campo =
  "mt-1.5 block w-full rounded-xl border border-[var(--vale-linha)] bg-[var(--vale-campo)] px-3.5 py-3 outline-none focus:border-[var(--vale-acento)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--vale-acento)] aria-[invalid=true]:border-[var(--vale-erro)]";
const opcao =
  "flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-[var(--vale-linha)] bg-[var(--vale-campo)] px-4 py-3 transition-colors has-checked:border-[var(--vale-acento)] has-checked:ring-1 has-checked:ring-[var(--vale-acento)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[var(--vale-acento)]";

export function MontadorVale({
  config,
  onFinalizar,
  acaoFinal,
}: {
  config: ValeConfig;
  /** Chamado ao finalizar, com o vale, o código e a data de validade (YYYY-MM-DD). */
  onFinalizar?: (vale: Vale, codigo: string, validoAte: string) => void;
  /** Ação extra no fim (ex.: botão de prévia da mensagem de WhatsApp), recebendo a mensagem pronta. */
  acaoFinal?: (vale: Vale) => ReactNode;
}) {
  const id = useId();
  const [vale, setVale] = useState<Vale>(() => valeVazio(config));
  const [erros, setErros] = useState<ErrosVale>({});
  const [pronto, setPronto] = useState<{ codigo: string; validoAte: string } | null>(null);
  const errosRef = useRef<HTMLDivElement>(null);
  const prontoRef = useRef<HTMLHeadingElement>(null);
  const mudar = (parcial: Partial<Vale>) => setVale((v) => ({ ...v, ...parcial }));

  const finalizar = (event: React.FormEvent) => {
    event.preventDefault();
    const e = validarVale(vale, config);
    setErros(e);
    if (Object.keys(e).length > 0) {
      requestAnimationFrame(() => errosRef.current?.focus());
      return;
    }
    const codigo = codigoVale(semente());
    const validoAte = validade(hojeISO(), config.validadeMeses);
    setPronto({ codigo, validoAte });
    onFinalizar?.(vale, codigo, validoAte);
    requestAnimationFrame(() => prontoRef.current?.focus());
  };

  if (pronto) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <CartaoVale vale={vale} config={config} codigo={pronto.codigo} validadeTexto={`Válido até ${dataLonga(pronto.validoAte)}`} />
        <div>
          <h3 ref={prontoRef} tabIndex={-1} className="text-3xl outline-none" style={{ fontFamily: "var(--vale-fonte-titulo)" }}>
            Vale-presente pronto
          </h3>
          <p className="mt-3 leading-relaxed opacity-85">
            Código <strong className="font-mono">{pronto.codigo}</strong>, válido até {dataLonga(pronto.validoAte)}.{" "}
            {vale.entrega === "email"
              ? `Num site real, o cartão seria enviado para ${vale.emailPara.trim()} na data escolhida.`
              : "Num site real, o cartão impresso ficaria pronto para retirar ou ser entregue."}{" "}
            Nesta demonstração, nada é cobrado nem enviado.
          </p>
          <p className="mt-4 text-lg">
            Total: <strong>{formatBRL(totalVale(vale, config))}</strong>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {acaoFinal?.(vale)}
            <button type="button" onClick={() => setPronto(null)} className="vale-btn-secundario">
              Montar outro vale
            </button>
          </div>
        </div>
      </div>
    );
  }

  const listaErros = (Object.keys(erros) as (keyof ErrosVale)[]).filter((k) => erros[k]);

  return (
    <form onSubmit={finalizar} noValidate className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="min-w-0 space-y-8">
        {listaErros.length > 0 && (
          <div ref={errosRef} tabIndex={-1} role="alert" className="rounded-xl border border-[var(--vale-erro)] p-4">
            <p className="font-semibold text-[var(--vale-erro)]">Falta pouco. Confira:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {listaErros.map((k) => (
                <li key={k}>
                  <a href={`#${id}-${k}`} className="underline underline-offset-4">
                    {erros[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset id={`${id}-presente`} className="min-w-0 scroll-mt-28">
          <legend className="flex items-center gap-2 text-lg font-semibold">
            <Gift aria-hidden className="size-5 text-[var(--vale-acento)]" />
            1. O presente
          </legend>
          <div className="mt-3 grid gap-2">
            {config.experiencias.map((e) => (
              <label key={e.id} className={opcao}>
                <input
                  type="radio"
                  name={`${id}-presente`}
                  checked={vale.tipo === "experiencia" && vale.experienciaId === e.id}
                  onChange={() => mudar({ tipo: "experiencia", experienciaId: e.id })}
                  className="mt-1 size-4 shrink-0 accent-[var(--vale-acento)] focus:outline-none"
                />
                <span className="flex-1">
                  <span className="flex justify-between gap-3 font-medium">
                    {e.nome}
                    <span>{formatBRL(e.valor)}</span>
                  </span>
                  <span className="mt-0.5 block text-sm opacity-75">{e.descricao}</span>
                </span>
              </label>
            ))}
            <label className={opcao}>
              <input
                type="radio"
                name={`${id}-presente`}
                checked={vale.tipo === "valor"}
                onChange={() => mudar({ tipo: "valor" })}
                className="mt-1 size-4 shrink-0 accent-[var(--vale-acento)] focus:outline-none"
              />
              <span className="flex-1">
                <span className="block font-medium">Valor livre</span>
                <span className="mt-0.5 block text-sm opacity-75">Quem recebe escolhe a experiência depois.</span>
              </span>
            </label>
          </div>
          {vale.tipo === "valor" && (
            <div id={`${id}-valor`} className="mt-4 scroll-mt-28">
              <div className="flex flex-wrap gap-2">
                {config.sugestoes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={vale.valor === s}
                    onClick={() => mudar({ valor: s })}
                    className="min-h-11 rounded-full border border-[var(--vale-linha)] px-4 text-sm font-medium aria-pressed:border-[var(--vale-acento)] aria-pressed:bg-[var(--vale-acento)] aria-pressed:text-[var(--vale-acento-texto)]"
                  >
                    {formatBRL(s)}
                  </button>
                ))}
              </div>
              <label htmlFor={`${id}-valor-input`} className="mt-4 block text-sm font-medium">
                Ou digite o valor (de {formatBRL(config.valorMin)} a {formatBRL(config.valorMax)})
              </label>
              <div className="relative mt-1.5 max-w-48">
                <span aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 opacity-70">
                  R$
                </span>
                <input
                  id={`${id}-valor-input`}
                  inputMode="numeric"
                  value={String(Math.round(vale.valor / 100))}
                  onChange={(e) => mudar({ valor: Math.min(Number(e.target.value.replace(/\D/g, "").slice(0, 5) || 0), 99999) * 100 })}
                  aria-invalid={Boolean(erros.valor)}
                  className={`${campo} !mt-0 pl-10`}
                />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold">2. A mensagem</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div id={`${id}-para`} className="scroll-mt-28">
              <label htmlFor={`${id}-para-input`} className="font-medium">
                Para
              </label>
              <input id={`${id}-para-input`} value={vale.para} onChange={(e) => mudar({ para: e.target.value.slice(0, 40) })} aria-invalid={Boolean(erros.para)} className={campo} placeholder="Ex.: Mãe" />
            </div>
            <div id={`${id}-de`} className="scroll-mt-28">
              <label htmlFor={`${id}-de-input`} className="font-medium">
                De
              </label>
              <input id={`${id}-de-input`} value={vale.de} onChange={(e) => mudar({ de: e.target.value.slice(0, 40) })} aria-invalid={Boolean(erros.de)} className={campo} placeholder="Ex.: Ana e Pedro" />
            </div>
          </div>
          <div id={`${id}-mensagem`} className="scroll-mt-28">
            <label htmlFor={`${id}-mensagem-input`} className="font-medium">
              Mensagem no cartão (opcional)
            </label>
            <textarea
              id={`${id}-mensagem-input`}
              value={vale.mensagem}
              onChange={(e) => mudar({ mensagem: e.target.value })}
              rows={3}
              aria-invalid={Boolean(erros.mensagem)}
              aria-describedby={`${id}-contador`}
              className={campo}
              placeholder="Ex.: Uma tarde só sua. Você merece."
            />
            <p id={`${id}-contador`} className="mt-1 text-right text-xs opacity-70" aria-live="polite">
              {vale.mensagem.length} de {config.maxMensagem} caracteres
            </p>
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="text-lg font-semibold">3. Como entregar</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(["email", "impresso"] as const).map((tipo) => {
              const e = config.entrega[tipo];
              const Icone = tipo === "email" ? Mail : Printer;
              return (
                <label key={tipo} className={opcao}>
                  <input type="radio" name={`${id}-entrega`} checked={vale.entrega === tipo} onChange={() => mudar({ entrega: tipo })} className="mt-1 size-4 shrink-0 accent-[var(--vale-acento)] focus:outline-none" />
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      <Icone aria-hidden className="size-4" />
                      {e.rotulo}
                    </span>
                    <span className="mt-0.5 block text-sm opacity-75">
                      {e.detalhe}
                      {e.taxa > 0 ? ` (+ ${formatBRL(e.taxa)})` : " (sem custo)"}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {vale.entrega === "email" && (
            <div id={`${id}-emailPara`} className="mt-4 scroll-mt-28">
              <label htmlFor={`${id}-email-input`} className="font-medium">
                E-mail de quem vai receber
              </label>
              <input
                id={`${id}-email-input`}
                type="email"
                autoComplete="off"
                value={vale.emailPara}
                onChange={(e) => mudar({ emailPara: e.target.value })}
                aria-invalid={Boolean(erros.emailPara)}
                className={campo}
                placeholder="nome@exemplo.com.br"
              />
            </div>
          )}
        </fieldset>
      </div>

      <div className="space-y-5 lg:sticky lg:top-24">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase opacity-75">Prévia do cartão</p>
        <CartaoVale vale={vale} config={config} validadeTexto={`Válido por ${config.validadeMeses} meses`} />
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="opacity-75">Presente</dt>
            <dd>{formatBRL(valorDoVale(vale, config))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="opacity-75">Entrega</dt>
            <dd>{taxaEntrega(vale, config) ? formatBRL(taxaEntrega(vale, config)) : "sem custo"}</dd>
          </div>
          <div className="flex justify-between border-t border-[var(--vale-linha)] pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatBRL(totalVale(vale, config))}</dd>
          </div>
        </dl>
        <button type="submit" className="vale-btn-primario w-full">
          Finalizar vale-presente
        </button>
        <p className="text-xs opacity-70">Demonstração: nada é cobrado e nenhum cartão é enviado.</p>
      </div>
    </form>
  );
}
