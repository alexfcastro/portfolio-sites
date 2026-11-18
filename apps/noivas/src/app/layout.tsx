import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
// "optional": sem salto de layout quando a fonte dos títulos chega.
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Ateliê Véu — dia da noiva (demonstração)", template: "%s | Ateliê Véu (demonstração)" },
  description:
    "Demonstração de site para salão de dia da noiva: orçamento em grupo com horário de início e valor estimado, disponibilidade por mês e pedido de orçamento. Negócio fictício.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#fbf8f3", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${bodoni.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-dourado-escuro px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        <DemoBar />
        <SiteHeader />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
