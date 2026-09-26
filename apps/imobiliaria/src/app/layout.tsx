import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": sem salto de layout quando a fonte chega.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Horizonte Imóveis — demonstração", template: "%s | Horizonte Imóveis (demonstração)" },
  description: "Demonstração de site para imobiliária com busca, filtros, página do imóvel e interesse. Imobiliária fictícia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-lg bg-blue px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
