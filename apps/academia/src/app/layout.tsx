import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": sem salto de layout quando a fonte chega.
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Pulse Studio — demonstração", template: "%s | Pulse Studio (demonstração)" },
  description: "Demonstração de site para academia com grade de aulas filtrável, aula experimental com vagas, planos e painel. Academia fictícia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0b0c0a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={grotesk.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-lg bg-lime px-5 py-3 font-bold text-night focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
