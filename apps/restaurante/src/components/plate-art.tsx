import type { PlateArt as Art } from "@/data/menu";

/*
 * Ilustrações originais e estilizadas dos pratos (SVG). Não são fotos:
 * servem para dar identidade ao cardápio sem usar imagens de terceiros.
 */

type Shape = { kind: "plate" | "glass" | "bowl"; colors: [string, string, string] };

const shapes: Record<Art, Shape> = {
  picanha: { kind: "plate", colors: ["#9b3b1f", "#c9602e", "#7aa33a"] },
  costela: { kind: "plate", colors: ["#8a3417", "#d8893b", "#e9c46a"] },
  frango: { kind: "plate", colors: ["#c7792c", "#e3a347", "#6f9a37"] },
  linguica: { kind: "plate", colors: ["#a4401f", "#7b2a14", "#e7c16b"] },
  arroz: { kind: "bowl", colors: ["#f3e6c8", "#e7b546", "#b8541f"] },
  farofa: { kind: "bowl", colors: ["#d9a55a", "#f2cf7a", "#8c5a2b"] },
  mandioca: { kind: "bowl", colors: ["#f0c46a", "#e0a946", "#fbe3a3"] },
  salada: { kind: "bowl", colors: ["#6f9a37", "#d9463b", "#a8c96b"] },
  refri: { kind: "glass", colors: ["#3b1a0f", "#6a2a14", "#ffffff"] },
  suco: { kind: "glass", colors: ["#f29f2b", "#f7c65a", "#ffffff"] },
  agua: { kind: "glass", colors: ["#bfe0ea", "#e7f4f8", "#ffffff"] },
  pudim: { kind: "plate", colors: ["#e8b25a", "#9a4f1c", "#f6d9a0"] },
  brownie: { kind: "plate", colors: ["#4a2412", "#6b3519", "#f2e4d1"] },
};

export function PlateArt({ art, className }: { art: Art; className?: string }) {
  const { kind, colors } = shapes[art];
  const [a, b, c] = colors;
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden focusable="false">
      <rect width="160" height="120" fill="#f7ead9" />
      {kind === "plate" && (
        <>
          <ellipse cx="80" cy="64" rx="56" ry="42" fill="#fff" stroke="#ecd9c3" strokeWidth="3" />
          <ellipse cx="80" cy="64" rx="40" ry="29" fill={a} />
          <ellipse cx="68" cy="56" rx="16" ry="11" fill={b} />
          <circle cx="98" cy="70" r="9" fill={c} />
        </>
      )}
      {kind === "bowl" && (
        <>
          <path d="M28 52h104c0 30-22 50-52 50S28 82 28 52z" fill="#fff" stroke="#ecd9c3" strokeWidth="3" />
          <ellipse cx="80" cy="52" rx="52" ry="14" fill={a} />
          <circle cx="66" cy="48" r="7" fill={b} />
          <circle cx="94" cy="50" r="6" fill={c} />
        </>
      )}
      {kind === "glass" && (
        <>
          <path d="M58 22h44l-6 82H64z" fill="#fff" stroke="#ecd9c3" strokeWidth="3" />
          <path d="M61 44h38l-4 58H65z" fill={a} />
          <path d="M62 44h36l-1 10H63z" fill={b} />
          <rect x="84" y="12" width="4" height="40" rx="2" fill={c} stroke="#ecd9c3" transform="rotate(12 86 32)" />
        </>
      )}
    </svg>
  );
}
