/*
 * Ilustração de reserva (enquanto não há foto): olho e sobrancelha em traço fino.
 * "antes" tem poucos fios e falhas; "depois", fios contínuos no mesmo desenho.
 */

function fios(quantidade: number, falhas: (t: number) => boolean) {
  const lista: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < quantidade; i += 1) {
    const t = i / (quantidade - 1);
    if (falhas(t)) continue;
    // Arco da sobrancelha: sobe até 60% do comprimento e desce no rabo.
    const x = 70 + t * 260;
    const y = 132 - Math.sin(Math.min(t / 0.62, 1) * (Math.PI / 2)) * 34 + (t > 0.62 ? (t - 0.62) * 70 : 0);
    const inclinacao = t < 0.3 ? -14 : t < 0.62 ? -9 : 6;
    const altura = 16 - t * 7 + (i % 3) * 1.5;
    lista.push({ x1: x, y1: y + altura / 2, x2: x + inclinacao, y2: y - altura / 2 });
  }
  return lista;
}

export function SobrancelhaArte({ fase, className = "" }: { fase: "antes" | "depois"; className?: string }) {
  const tracos =
    fase === "depois"
      ? fios(64, () => false)
      : fios(64, (t) => (t > 0.18 && t < 0.38) || t > 0.78 || Math.round(t * 63) % 3 === 0);

  return (
    <svg viewBox="0 0 400 300" aria-hidden className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`pele-${fase}`} cx="55%" cy="40%" r="80%">
          <stop offset="0" stopColor="#f3e3d6" />
          <stop offset="1" stopColor="#dcc0ab" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#pele-${fase})`} />
      {/* Olho fechado em linha fina, para dar escala */}
      <path d="M120 205 Q200 240 290 200" fill="none" stroke="#6b4a3c" strokeWidth="3" strokeLinecap="round" />
      <path d="M140 214 l-6 10 M175 224 l-3 11 M210 226 l0 11 M245 220 l4 10 M275 208 l6 9" stroke="#6b4a3c" strokeWidth="2" strokeLinecap="round" />
      <g stroke={fase === "depois" ? "#4a3128" : "#6a4b3e"} strokeWidth={fase === "depois" ? 2.2 : 2} strokeLinecap="round" opacity={fase === "depois" ? 0.92 : 0.7}>
        {tracos.map((f, i) => (
          <line key={i} {...f} />
        ))}
      </g>
    </svg>
  );
}
