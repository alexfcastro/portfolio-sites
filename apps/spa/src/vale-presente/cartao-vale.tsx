import { tituloDoPresente, type Vale, type ValeConfig } from "./vale";

/**
 * Prévia do cartão do vale-presente. As cores vêm de variáveis CSS que o site define em volta:
 * --vale-fundo, --vale-texto, --vale-destaque e --vale-fonte-titulo.
 */
export function CartaoVale({
  vale,
  config,
  codigo,
  validadeTexto,
}: {
  vale: Vale;
  config: ValeConfig;
  codigo?: string;
  validadeTexto?: string;
}) {
  return (
    <figure
      aria-label="Prévia do cartão do vale-presente"
      className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl p-6 shadow-xl sm:p-8"
      style={{ background: "var(--vale-fundo)", color: "var(--vale-texto)" }}
    >
      <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full opacity-15" style={{ background: "var(--vale-destaque)" }} />
      <span aria-hidden className="absolute -bottom-20 -left-10 size-40 rounded-full opacity-10" style={{ background: "var(--vale-destaque)" }} />
      <div className="relative flex h-full flex-col">
        <p className="text-[0.6875rem] tracking-[0.3em] uppercase opacity-80">Vale-presente · {config.negocio}</p>
        <p className="mt-3 text-2xl leading-tight sm:text-3xl" style={{ fontFamily: "var(--vale-fonte-titulo)" }}>
          {tituloDoPresente(vale, config) || "Escolha o presente"}
        </p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed italic opacity-90 sm:text-[0.9375rem]">
          {vale.mensagem.trim() ? `“${vale.mensagem.trim()}”` : "Sua mensagem aparece aqui."}
        </p>
        <div className="mt-3 flex items-end justify-between gap-4 text-xs sm:text-sm">
          <p>
            <span className="opacity-70">Para </span>
            <strong>{vale.para.trim() || "—"}</strong>
            <span className="opacity-70"> · de </span>
            <strong>{vale.de.trim() || "—"}</strong>
          </p>
          <p className="shrink-0 text-right opacity-80">
            {codigo ? <span className="block font-mono tracking-wider">{codigo}</span> : null}
            {validadeTexto ? <span className="block">{validadeTexto}</span> : null}
          </p>
        </div>
      </div>
    </figure>
  );
}
