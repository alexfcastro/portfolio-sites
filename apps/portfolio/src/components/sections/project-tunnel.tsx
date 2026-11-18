"use client";

import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type { ShowcaseItem } from "@/components/sections/showcase-marquee";

/*
 * Abertura em profundidade, guiada pela rolagem.
 *
 * 1. No topo, as 12 janelas dos projetos formam um mosaico dentro de um monitor.
 * 2. Ao rolar, o texto de abertura sai, o monitor se desfaz e cada janela voa para o seu lugar
 *    em um corredor em 3D.
 * 3. Continuando, a câmera avança pelo corredor e cada projeto chega à frente com nome e link.
 *
 * Funciona no computador e no celular (com proporções próprias para tela estreita). Com "reduzir
 * movimento" ativo, mostra apenas o texto e a alternativa (`fallback`), sem nada em 3D.
 * As janelas são links de verdade: clicar na janela abre o site (a demonstração, em nova aba) quando
 * ele está disponível, e "Ver projeto" leva à página do case. Ao receberem foco pelo teclado, a
 * página rola até elas.
 */

const MEDIA = "(prefers-reduced-motion: no-preference)";
const DEPTH = 900; // distância entre uma janela e a próxima no corredor (px)
const FOCUS = -110; // profundidade em que a janela "da vez" fica (px)
const END_A = 0.12; // fim da saída do texto
const END_B = 0.28; // fim da "explosão" do mosaico

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function ProjectTunnel({
  items,
  children,
  fallback,
}: {
  items: ShowcaseItem[];
  /** Texto de abertura (título, subtítulo e botões). */
  children: ReactNode;
  /** O que aparece no lugar da cena em telas pequenas ou com "reduzir movimento". */
  fallback: ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  const count = items.length;

  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    let frame = 0;
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const reset = () => {
      for (const element of [
        textRef.current,
        worldRef.current,
        monitorRef.current,
        hintRef.current,
        counterRef.current,
        footerRef.current,
      ]) {
        element?.removeAttribute("style");
      }
      for (const card of cardRefs.current) card?.removeAttribute("style");
    };

    const render = () => {
      frame = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      const world = worldRef.current;
      if (!section || !stage || !world || !media.matches) return;

      const vw = stage.clientWidth / 100;
      const vh = stage.clientHeight / 100;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = clamp(-section.getBoundingClientRect().top / Math.max(1, travel));
      const a = ease(clamp(progress / END_A));
      const b = clamp((progress - END_A) / (END_B - END_A));
      const linear = clamp((progress - END_B) / (1 - END_B));
      // A câmera "estaciona" em cada janela: metade de cada trecho é parada, metade é o avanço.
      const steps = Math.max(1, count - 1);
      const position = linear * steps;
      const whole = Math.min(steps, Math.floor(position));
      const c = (whole + ease(clamp((position - whole - 0.3) / 0.4))) / steps;

      // Suaviza a inclinação que acompanha o mouse.
      tilt.x += (tilt.targetX - tilt.x) * 0.12;
      tilt.y += (tilt.targetY - tilt.y) * 0.12;

      if (textRef.current) {
        textRef.current.style.opacity = String(clamp(1 - a * 1.4));
        textRef.current.style.transform = `translate3d(0, ${-a * 70}px, 0) scale(${1 - a * 0.06})`;
        textRef.current.style.pointerEvents = a > 0.7 ? "none" : "";
        textRef.current.style.visibility = a >= 1 ? "hidden" : "";
      }
      // Em telas baixas o texto de abertura ocupa quase toda a altura. Nesse caso a dica não aparece e
      // os controles de baixo só surgem quando o texto começa a sair, para nunca cobrirem os botões.
      const footerHeight = footerRef.current?.offsetHeight ?? 0;
      const crowded = stage.clientHeight - (textRef.current?.offsetHeight ?? 0) < footerHeight + 24;
      if (hintRef.current) hintRef.current.style.opacity = String(crowded ? 0 : clamp(1 - a * 3));
      if (footerRef.current) {
        const shown = crowded ? clamp((a - 0.7) * 5) : 1; // o texto já sumiu (opacidade 1 − 1,4a)
        footerRef.current.style.opacity = String(shown);
        footerRef.current.style.pointerEvents = shown < 0.5 ? "none" : "";
      }

      world.style.transform = `translate3d(0, ${lerp((stage.clientWidth < 1024 ? 54 : 40) * vh, 0, a)}px, 0) scale(${lerp(0.6, 1, a)}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
      if (monitorRef.current) {
        monitorRef.current.style.opacity = String(clamp(1 - b * 1.8));
        monitorRef.current.style.transform = `translate(-50%, -50%) translate3d(0, 0, ${-40 - b * 500}px)`;
      }

      // Tela estreita: janelas largas e centralizadas, mosaico em 3 colunas.
      const small = stage.clientWidth < 1024;
      const columns = small ? 2 : 3;
      const rows = Math.ceil(count / columns);
      const cardWidth = (small ? 84 : 46) * vw;
      const tile = (small ? 40 : 16.5) * vw;
      const gap = (small ? 2 : 1.1) * vw;
      const tileScale = tile / cardWidth;
      const tileHeight = tile * 0.72;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const col = index % columns;
        const row = Math.floor(index / columns);
        const gridX = (col - (columns - 1) / 2) * (tile + gap);
        const gridY = (row - (rows - 1) / 2) * (tileHeight + gap) + (small ? 3 * vw : 0);
        const tunnelX = (index % 2 === 0 ? -1 : 1) * (small ? 5 : 21) * vw;
        const tunnelY = ((index % 3) - 1) * (small ? 11 : 9) * vh;
        const tunnelZ = -index * DEPTH + FOCUS;

        // Cada janela sai do mosaico um pouco depois da anterior.
        const out = ease(clamp(b * 1.45 - index * 0.036));
        const x = lerp(gridX, tunnelX, out);
        const y = lerp(gridY, tunnelY, out);
        const z = lerp(0, tunnelZ, out) + c * (count - 1) * DEPTH;
        const scale = lerp(tileScale, 1, out);

        // Longe: some na "neblina". Depois de passar pela câmera: desaparece.
        const ahead = -z;
        const fog = z > 60 ? clamp(1 - (z - 60) / 200) : clamp(1 - (ahead - 2.2 * DEPTH) / (2.6 * DEPTH), 0, 1);
        card.style.opacity = String(lerp(1, fog, out));
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
        const reachable = out < 0.2 || (z > -1.3 * DEPTH && z < 100);
        card.style.pointerEvents = reachable ? "" : "none";
        card.style.setProperty("--rotulo", String(out * clamp(1 - Math.abs(z - FOCUS) / 650)));
      });

      if (counterRef.current) {
        const active = Math.round(c * (count - 1));
        counterRef.current.style.opacity = String(clamp(b * 2 - 1));
        const label = `${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")} · ${items[active]?.name ?? ""}`;
        if (counterRef.current.textContent !== label) counterRef.current.textContent = label;
      }

      if (Math.abs(tilt.targetX - tilt.x) > 0.01 || Math.abs(tilt.targetY - tilt.y) > 0.01) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage || !media.matches) return;
      const box = stage.getBoundingClientRect();
      tilt.targetY = ((event.clientX - box.left) / box.width - 0.5) * 7;
      tilt.targetX = -((event.clientY - box.top) / box.height - 0.5) * 5;
      schedule();
    };

    const onChange = () => {
      if (media.matches) schedule();
      else reset();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    stageRef.current?.addEventListener("pointermove", onPointerMove);
    media.addEventListener("change", onChange);
    schedule();

    const stage = stageRef.current;
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      stage?.removeEventListener("pointermove", onPointerMove);
      media.removeEventListener("change", onChange);
    };
  }, [count, items]);

  // Foco pelo teclado: rola até o ponto em que a janela está na frente.
  const bringToFront = (index: number) => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia(MEDIA).matches) return;
    const travel = section.offsetHeight - window.innerHeight;
    const target = END_B + (1 - END_B) * (index / Math.max(1, count - 1));
    const top = section.getBoundingClientRect().top + window.scrollY + travel * target;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: "auto" });
  };

  return (
    <div ref={sectionRef} className="cena-rolagem" style={{ "--janelas": count } as React.CSSProperties}>
      <div ref={stageRef} className="cena-palco">
        <div ref={textRef} className="cena-texto">
          {children}
        </div>

        <div className="cena-3d">
          <div ref={worldRef} className="cena-mundo">
            <div ref={monitorRef} aria-hidden className="cena-monitor">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span className="ml-2 truncate text-xs font-medium text-muted-on-dark">
                  Projetos em destaque · cada um com a cara do negócio
                </span>
              </div>
            </div>

            <ul>
              {items.map((item, index) => (
                <li
                  key={item.slug}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className="cena-janela"
                >
                  <div className="browser-frame shadow-raised">
                    <a
                      href={item.demoHref ?? item.href}
                      target={item.demoHref ? "_blank" : undefined}
                      rel={item.demoHref ? "noopener noreferrer" : undefined}
                      onFocus={() => bringToFront(index)}
                      className="group relative block"
                    >
                      <span className="browser-bar">
                        <i />
                        <i />
                        <i />
                        <span className="ml-2 truncate text-xs font-medium text-muted-on-dark">{item.name}</span>
                      </span>
                      <span className="block aspect-[16/10] overflow-hidden">
                        <Image
                          src={item.src}
                          alt=""
                          width={item.width}
                          height={item.height}
                          sizes="(min-width: 1024px) 46vw, 84vw"
                          loading="eager"
                          className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </span>
                      <span className="cena-rotulo absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-raised transition-transform duration-300 group-hover:-translate-y-0.5">
                        {item.demoHref ? "Abrir o site" : "Ver projeto"}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </span>
                      <span className="sr-only">
                        {item.demoHref ? `Abrir a demonstração de ${item.name} (abre em nova aba)` : `Ver o projeto ${item.name}`}
                      </span>
                    </a>
                    <div className="cena-rotulo flex items-end justify-between gap-4 bg-ink-soft px-5 py-4">
                      <p>
                        <span className="block text-xs font-semibold tracking-[0.14em] text-accent-on-dark uppercase">
                          {String(index + 1).padStart(2, "0")} · {item.category}
                        </span>
                        <span className="mt-1 block font-display text-xl leading-tight font-extrabold text-canvas sm:text-2xl xl:text-3xl">
                          {item.name}
                        </span>
                      </p>
                      <Link
                        href={item.href}
                        onFocus={() => bringToFront(index)}
                        className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-canvas underline-offset-4 hover:underline"
                      >
                        Ver projeto<span className="sr-only"> {item.name}</span>
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p ref={hintRef} aria-hidden className="cena-dica">
            <ArrowDown className="size-4" />
            Role para <span className="max-lg:hidden">atravessar os projetos</span>
            <span className="lg:hidden">explorar</span>
          </p>
          <div ref={footerRef} className="cena-rodape">
            <p ref={counterRef} aria-hidden className="font-display text-sm font-bold tracking-wide text-canvas" />
            <a
              href="#destaques-title"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-ink/60 px-4 text-sm font-medium text-canvas backdrop-blur transition-colors hover:border-white/50"
            >
              Pular<span className="max-sm:sr-only"> a apresentação</span>
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>
        </div>

        <div className="cena-alternativa">{fallback}</div>
      </div>
    </div>
  );
}
