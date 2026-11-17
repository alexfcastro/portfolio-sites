import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Outfit, Playfair_Display, Sora, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import "./globals.css";

// Cada landing page usa um par próprio de fontes. Só a fonte de texto é pré-carregada; as de título
// (preload: false) são baixadas apenas pela página que as usa.
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", preload: false });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });

export const metadata: Metadata = {
  title: { default: "Landing pages — demonstração", template: "%s | Landing page de demonstração" },
  description:
    "Seis landing pages de demonstração, cada uma com um objetivo de conversão diferente. Negócios e ofertas fictícios.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#14161a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const fonts = [dmSans, playfair, sora, spaceGrotesk, outfit, fraunces].map((font) => font.variable).join(" ");
  return (
    <html lang="pt-BR" className={fonts}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        <DemoBar />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
