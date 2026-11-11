/*
 * Paleta de cada demo, usada nos painéis de destaque da página inicial: cada projeto aparece
 * com as cores do próprio negócio (fundo, texto e cor de destaque), como no site dele.
 * Todas as combinações de texto sobre fundo atendem ao contraste AA.
 */
export interface ProjectTheme {
  background: string;
  foreground: string;
  /** Cor do rótulo de categoria e de detalhes. */
  accent: string;
  /** Texto secundário. */
  muted: string;
}

const fallback: ProjectTheme = { background: "#14161a", foreground: "#f6f5f1", accent: "#8fa6ff", muted: "#a9adb6" };

const themes: Record<string, ProjectTheme> = {
  barbearia: { background: "#15120f", foreground: "#f3ece0", accent: "#c9a45c", muted: "#b5a894" },
  restaurante: { background: "#1f120d", foreground: "#fff8ef", accent: "#ff8a5c", muted: "#d9c2b0" },
  imobiliaria: { background: "#10233f", foreground: "#ffffff", accent: "#8fb8ff", muted: "#b9c8de" },
  floricultura: { background: "#f6e4e4", foreground: "#3d2b2e", accent: "#86404c", muted: "#5f4a4d" },
  clinica: { background: "#e0f1ed", foreground: "#16323a", accent: "#135249", muted: "#3f565c" },
  petshop: { background: "#fde5dc", foreground: "#3a2420", accent: "#a8371f", muted: "#5f4640" },
};

export function getProjectTheme(slug: string): ProjectTheme {
  return themes[slug] ?? fallback;
}
