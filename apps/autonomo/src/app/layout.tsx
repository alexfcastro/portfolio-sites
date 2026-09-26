import type { Metadata, Viewport } from "next";
import { Karla, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const karla = Karla({ subsets: ["latin"], variable: "--font-karla", display: "swap" });
// "optional": sem salto de layout quando a fonte dos títulos chega.
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Lia Torres · Fotografia de produto — demonstração", template: "%s | Linha Direta Profissional (demonstração)" },
  description:
    "Demonstração de site para profissional autônomo: apresentação, serviços, portfólio e pedido de proposta. Profissional fictícia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f6f0e6", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${karla.variable} ${newsreader.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-terra px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
