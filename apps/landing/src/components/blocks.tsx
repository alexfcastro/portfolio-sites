import type { ReactNode } from "react";
import { Foto, temFoto } from "@/components/foto";

/** Foto da página ou, enquanto ela não existe, um fundo em degradê com as cores da landing page. */
export function Cena({
  id,
  sizes,
  className = "",
  preload = false,
}: {
  id: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  if (temFoto(id)) return <Foto id={id} sizes={sizes} preload={preload} className={className} />;
  return (
    <span
      aria-hidden
      className={`foto ${className}`}
      style={{
        background:
          "radial-gradient(120% 90% at 80% 10%, color-mix(in srgb, var(--lp-accent) 55%, transparent), transparent 60%), var(--lp-card)",
      }}
    />
  );
}

/**
 * Abertura em tela cheia: foto ao fundo e um véu na cor da página, mais forte do lado do texto,
 * para garantir a leitura.
 */
export function Hero({
  fotoId,
  kicker,
  title,
  text,
  children,
  aside,
}: {
  fotoId: string;
  kicker: string;
  title: ReactNode;
  text: string;
  /** Botões de ação. */
  children: ReactNode;
  /** Conteúdo opcional ao lado do texto em telas largas (formulário, cartão, mockup). */
  aside?: ReactNode;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <Cena id={fotoId} preload sizes="100vw" className="fundo absolute inset-0 -z-20 size-full" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 max-md:hidden"
        style={{
          background:
            "linear-gradient(to right, var(--lp-bg) 0%, color-mix(in srgb, var(--lp-bg) 88%, transparent) 42%, color-mix(in srgb, var(--lp-bg) 18%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{ background: "color-mix(in srgb, var(--lp-bg) 84%, transparent)" }}
      />
      <div className={`wrap grid min-h-[82svh] items-center gap-10 py-16 sm:py-20 ${aside ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          <p className="lp-kicker">{kicker}</p>
          <h1 id="hero-title" className="mt-4 text-5xl leading-[1.02] font-bold sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>
        </div>
        {aside}
      </div>
    </section>
  );
}

/** Título de seção com o rótulo pequeno em cima. */
export function Heading({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="lp-kicker">{kicker}</p>
      <h2 id={id} className="mt-3 text-4xl leading-[1.08] font-bold sm:text-5xl">
        {title}
      </h2>
      {children && <div className="lp-muted mt-4 text-lg leading-relaxed">{children}</div>}
    </div>
  );
}

/** Rodapé comum: deixa claro que a oferta é fictícia e leva de volta ao portfólio. */
export function Rodape({ nome, quoteUrl }: { nome: string; quoteUrl: string | null }) {
  return (
    <footer className="lp-band">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="lp-display text-2xl font-bold">{nome}</p>
          <p className="lp-muted mt-3 max-w-xl text-sm leading-relaxed">
            {nome} é uma oferta fictícia. Esta landing page é uma demonstração criada pelo Estúdio X, de Alex Castro: preços, datas,
            números e depoimentos são exemplos, e nenhum cadastro, reserva ou pagamento é feito. As fotos são
            ilustrativas, geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="lp-card p-6">
            <p className="font-bold">Gostou desta landing page?</p>
            <p className="lp-muted mt-1 text-sm">Uma página como esta pode ser feita para a sua oferta.</p>
            <a href={quoteUrl} className="btn lp-btn mt-4">
              Solicitar uma página como esta
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
