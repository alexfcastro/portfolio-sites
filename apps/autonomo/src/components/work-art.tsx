/*
 * Composições originais (SVG) no estilo "foto de produto". Não são fotos reais:
 * servem para ilustrar o portfólio da profissional fictícia.
 */

const palettes = [
  ["#d9c6a5", "#6b3f25", "#23201c"],
  ["#c9d3c0", "#f3e9d8", "#5f7a5b"],
  ["#e6d0c4", "#23201c", "#a3472d"],
  ["#f2dccd", "#b86b3c", "#fffcf6"],
  ["#d2d6de", "#7a4b2a", "#23201c"],
  ["#dfe7ea", "#3d4a63", "#e0b66b"],
] as const;

export function WorkArt({ variant, className }: { variant: number; className?: string }) {
  const [bg, a, b] = palettes[variant % palettes.length]!;
  const shapes = [
    // café: pacote + xícara
    <g key="0">
      <rect x="70" y="40" width="60" height="90" rx="6" fill={a} />
      <rect x="80" y="70" width="40" height="22" fill={bg} opacity="0.8" />
      <ellipse cx="160" cy="118" rx="26" ry="8" fill={b} opacity="0.3" />
      <path d="M140 94h36v16a18 18 0 0 1-36 0z" fill={b} />
    </g>,
    // sabonetes empilhados
    <g key="1">
      <rect x="60" y="96" width="80" height="26" rx="10" fill={b} />
      <rect x="70" y="72" width="70" height="26" rx="10" fill={a} />
      <circle cx="160" cy="60" r="16" fill={b} opacity="0.5" />
    </g>,
    // tênis estilizado
    <g key="2">
      <path d="M40 110c30 0 40-30 70-30 20 0 30 16 60 20v14H40z" fill={a} />
      <rect x="40" y="114" width="130" height="8" rx="3" fill={b} />
    </g>,
    // doces
    <g key="3">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={70 + i * 34} cy="96" r="16" fill={a} />
          <circle cx={70 + i * 34} cy="90" r="6" fill={b} />
        </g>
      ))}
    </g>,
    // bolsa
    <g key="4">
      <path d="M80 70a20 20 0 0 1 40 0" fill="none" stroke={b} strokeWidth="6" />
      <rect x="60" y="70" width="80" height="60" rx="8" fill={a} />
    </g>,
    // frasco de sérum
    <g key="5">
      <rect x="88" y="54" width="24" height="16" rx="3" fill={b} />
      <rect x="80" y="68" width="40" height="64" rx="10" fill={a} />
      <path d="M40 132c40-10 80 10 120 0" stroke={b} strokeWidth="3" fill="none" opacity="0.5" />
    </g>,
  ];

  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden focusable="false">
      <rect width="200" height="160" fill={bg} />
      <rect y="120" width="200" height="40" fill="#000" opacity="0.06" />
      {shapes[variant % shapes.length]}
    </svg>
  );
}
