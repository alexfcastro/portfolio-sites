"use client";

import { ArrowRight, CalendarCheck, FileText, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { quoteHref } from "@/data/navigation";
import { sampleContactHref } from "@/data/personalizer";

/*
 * Amostra interativa de personalização: a pessoa escolhe o tipo de negócio, a cor, o estilo e o
 * recurso principal, e a prévia muda na hora. É uma ilustração do processo (o site real é definido
 * em conversa), por isso nada daqui é enviado ou salvo.
 */

const segments = [
  { id: "barbearia", label: "Barbearia", brand: "Sua Barbearia", headline: "Seu horário, sem espera.", items: ["Corte", "Barba", "Combo"] },
  { id: "clinica", label: "Clínica", brand: "Sua Clínica", headline: "Cuidado com hora marcada.", items: ["Consulta", "Retorno", "Exames"] },
  { id: "restaurante", label: "Restaurante", brand: "Seu Restaurante", headline: "Do fogão para a sua mesa.", items: ["Pratos", "Bebidas", "Sobremesas"] },
  { id: "loja", label: "Loja", brand: "Sua Loja", headline: "Novidades toda semana.", items: ["Destaques", "Promoções", "Kits"] },
  { id: "outro", label: "Outro negócio", brand: "Seu Negócio", headline: "Do jeito que o seu negócio funciona.", items: ["Serviços", "Como funciona", "Contato"] },
] as const;

const palettes = [
  { id: "azul", label: "Azul", background: "#f2f6fc", foreground: "#10233f", accent: "#1f5fbf", onAccent: "#ffffff", card: "#ffffff" },
  { id: "verde", label: "Verde", background: "#f4f9f8", foreground: "#16323a", accent: "#1c7266", onAccent: "#ffffff", card: "#ffffff" },
  { id: "terracota", label: "Terracota", background: "#fff8ef", foreground: "#2a130c", accent: "#b3361a", onAccent: "#ffffff", card: "#ffffff" },
  { id: "rosa", label: "Rosa", background: "#fbf5f2", foreground: "#3d2b2e", accent: "#a4525f", onAccent: "#ffffff", card: "#ffffff" },
  { id: "escuro", label: "Escuro e dourado", background: "#15120f", foreground: "#f3ece0", accent: "#c9a45c", onAccent: "#15120f", card: "#262019" },
] as const;

const styles = [
  { id: "moderno", label: "Moderno", fontFamily: "var(--font-manrope), system-ui, sans-serif", fontWeight: 800, textTransform: "none", letterSpacing: "-0.02em" },
  { id: "classico", label: "Clássico", fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 500, textTransform: "none", letterSpacing: "0" },
  { id: "marcante", label: "Marcante", fontFamily: "var(--font-manrope), system-ui, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.01em" },
] as const;

const features = [
  { id: "agendar", label: "Agendamento", button: "Agendar horário", icon: CalendarCheck },
  { id: "pedir", label: "Pedidos", button: "Fazer pedido", icon: ShoppingBag },
  { id: "orcamento", label: "Orçamento", button: "Pedir orçamento", icon: FileText },
  { id: "whatsapp", label: "WhatsApp", button: "Chamar no WhatsApp", icon: MessageCircle },
] as const;

const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-canvas transition-colors hover:border-white/50 aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-ink";

function Group<T extends { id: string; label: string }>({
  legend,
  options,
  value,
  onChange,
  swatch,
}: {
  legend: string;
  options: readonly T[];
  value: string;
  onChange: (id: string) => void;
  swatch?: (option: T) => string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-muted-on-dark">{legend}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={option.id === value} onClick={() => onChange(option.id)} className={chip}>
            {swatch && <span aria-hidden className="size-3.5 rounded-full ring-1 ring-black/20" style={{ background: swatch(option) }} />}
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Personalizer() {
  const [segmentId, setSegmentId] = useState<string>("barbearia");
  const [paletteId, setPaletteId] = useState<string>("escuro");
  const [styleId, setStyleId] = useState<string>("marcante");
  const [featureId, setFeatureId] = useState<string>("agendar");

  const segment = segments.find((item) => item.id === segmentId) ?? segments[0];
  const palette = palettes.find((item) => item.id === paletteId) ?? palettes[0];
  const style = styles.find((item) => item.id === styleId) ?? styles[0];
  const feature = features.find((item) => item.id === featureId) ?? features[0];
  const FeatureIcon = feature.icon;
  const heading = {
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    textTransform: style.textTransform,
    letterSpacing: style.letterSpacing,
  } as const;

  return (
    <section aria-labelledby="sob-medida-title" className="on-dark relative overflow-hidden bg-ink py-20 text-canvas sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(46rem_24rem_at_0%_0%,color-mix(in_srgb,var(--color-accent)_38%,transparent),transparent_70%),radial-gradient(36rem_22rem_at_100%_100%,rgb(122_92_255_/_0.28),transparent_70%)]"
      />
      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="eyebrow">Sob medida</p>
          <h2 id="sob-medida-title" className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Estrutura, conteúdo e recursos <span className="text-gradient">definidos para o seu negócio.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-on-dark sm:text-xl">
            Os projetos do portfólio são pontos de partida. Cada negócio é analisado individualmente: cores, textos,
            fotos e recursos são definidos com você, e o que não existe aqui pode ser criado. Experimente mudar a
            amostra abaixo.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div className="space-y-6">
            <Group legend="1. Que tipo de negócio?" options={segments} value={segmentId} onChange={setSegmentId} />
            <Group legend="2. Qual a cor da marca?" options={palettes} value={paletteId} onChange={setPaletteId} swatch={(option) => option.accent} />
            <Group legend="3. Qual o estilo?" options={styles} value={styleId} onChange={setStyleId} />
            <Group legend="4. O que o cliente mais faz no site?" options={features} value={featureId} onChange={setFeatureId} />
            <p role="status" aria-live="polite" className="sr-only">
              Amostra: {segment.label}, cor {palette.label}, estilo {style.label}, botão principal “{feature.button}”.
            </p>
          </div>

          <div>
            <div aria-hidden className="browser-frame shadow-raised">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span className="ml-2 truncate text-xs font-medium text-muted-on-dark">{segment.brand}</span>
              </div>
              <div
                style={{ background: palette.background, color: palette.foreground }}
                className="p-5 transition-colors duration-500 sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span style={heading} className="text-base">
                    {segment.brand}
                  </span>
                  <span
                    style={{ background: palette.accent, color: palette.onAccent }}
                    className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-500"
                  >
                    {feature.button}
                  </span>
                </div>
                <p style={{ color: palette.accent }} className="mt-8 text-xs font-bold tracking-[0.14em] uppercase transition-colors duration-500">
                  {segment.label === "Outro negócio" ? "O seu segmento" : segment.label}
                </p>
                <p key={`${segment.id}-${style.id}`} style={heading} className="rise-in mt-2 text-3xl leading-[1.05] sm:text-5xl">
                  {segment.headline}
                </p>
                <span
                  style={{ background: palette.accent, color: palette.onAccent }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors duration-500"
                >
                  <FeatureIcon className="size-4" />
                  {feature.button}
                </span>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {segment.items.map((item) => (
                    <div
                      key={item}
                      style={{ background: palette.card, borderColor: `color-mix(in srgb, ${palette.foreground} 14%, transparent)` }}
                      className="rounded-xl border p-3 transition-colors duration-500"
                    >
                      <span style={{ background: palette.accent }} className="block h-1.5 w-8 rounded-full transition-colors duration-500" />
                      <span className="mt-3 block text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-on-dark">
              Isto é só uma amostra. No projeto real, a identidade, as fotos, os textos e as funcionalidades saem de uma
              conversa sobre como o seu negócio atende hoje.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Análise individual", text: "Começo entendendo como você atende, vende e o que hoje toma mais tempo." },
            { title: "Ponto de partida, não molde", text: "Gostou de um projeto? Ele vira referência e é adaptado ao seu jeito." },
            { title: "Seu segmento não está aqui?", text: "Não tem problema: os 12 projetos são exemplos, não a lista do que é possível." },
            { title: "Ajustes até ficar com a sua cara", text: "Cores, fotos, textos e fluxos são revisados com você antes de publicar." },
          ].map((item) => (
            <li key={item.title} className="reveal rounded-card border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-on-dark">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link
            href={sampleContactHref(quoteHref, { segmento: segment.id, cor: palette.id, estilo: style.id, recurso: feature.id })}
            className="btn btn-primary btn-lg"
          >
            Pedir proposta com essas escolhas
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <p className="mt-3 text-sm text-muted-on-dark">
            As escolhas vão para o formulário como ponto de partida; lá você pode mudar tudo.
          </p>
        </div>
      </div>
    </section>
  );
}
