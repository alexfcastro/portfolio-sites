import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito-sans", display: "swap" });
// Títulos em peso leve; "optional" evita salto de layout quando a fonte chega.
const fraunces = Fraunces({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-fraunces", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Casa Serena — spa e massagem (demonstração)", template: "%s | Casa Serena (demonstração)" },
  description:
    "Demonstração de site para spa: experiências com duração, montador de vale-presente com prévia do cartão, day spa para dois e reserva. Negócio fictício.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f5f0e6", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-verde px-5 py-3 font-semibold text-areia focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
