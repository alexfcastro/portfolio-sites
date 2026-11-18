import type { ReactNode } from "react";

/** Opção de escolha única com rótulo grande (área de toque confortável no celular). */
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
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-card border border-line bg-white px-4 py-3 transition-colors has-checked:border-agua has-checked:bg-agua-soft has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-agua">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 size-4 shrink-0 accent-agua focus:outline-none" />
      <span>
        <span className="block font-medium">{children}</span>
        {detalhe && <span className="mt-0.5 block text-sm text-muted">{detalhe}</span>}
      </span>
    </label>
  );
}
