"use client";

import { forwardRef, type ReactNode } from "react";

/** Opção de escolha única com área de toque grande. */
export function Opcao({
  name,
  checked,
  onChange,
  children,
  detalhe,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  detalhe?: ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-card border border-line bg-paper px-4 py-3 transition-colors has-checked:border-ink has-checked:bg-rosa-suave has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-rosa-escuro">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 size-4 shrink-0 accent-rosa-escuro focus:outline-none" />
      <span>
        <span className="block font-medium">{children}</span>
        {detalhe && <span className="mt-0.5 block text-sm text-muted">{detalhe}</span>}
      </span>
    </label>
  );
}

export function CampoTexto({
  id,
  rotulo,
  valor,
  onChange,
  erro,
  tipo = "text",
  autoComplete,
  placeholder,
}: {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  erro?: string;
  tipo?: "text" | "tel";
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div id={`campo-${id}`} className="scroll-mt-28">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        inputMode={tipo === "tel" ? "tel" : undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className="field"
      />
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-alert">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Lista de erros com links para cada campo; recebe o foco quando o envio falha. */
export const ResumoErros = forwardRef<HTMLDivElement, { erros: [string, string][] }>(function ResumoErros({ erros }, ref) {
  if (erros.length === 0) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-card border border-alert bg-paper p-5">
      <p className="font-medium text-alert">Falta pouco. Confira:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {erros.map(([campo, mensagem]) => (
          <li key={campo}>
            <a href={`#campo-${campo}`} className="underline underline-offset-4">
              {mensagem}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
