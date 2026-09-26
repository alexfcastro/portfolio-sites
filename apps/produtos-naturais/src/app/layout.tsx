import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": sem salto de layout quando a fonte chega.
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "optional" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Raiz & Grão — demonstração", template: "%s | Raiz & Grão (demonstração)" },
  description: "Demonstração de catálogo para loja de produtos naturais com venda por peso, carrinho e retirada ou entrega. Loja fictícia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f7f2e7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-olive px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
