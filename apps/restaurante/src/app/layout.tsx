import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Work_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });
// "optional" evita salto de layout quando a fonte dos títulos chega.
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Sabor & Brasa — demonstração", template: "%s | Sabor & Brasa (demonstração)" },
  description: "Demonstração de cardápio digital com adicionais, carrinho e resumo do pedido. Restaurante fictício.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#fff8ef", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${workSans.variable} ${dmSerif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-brick px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
