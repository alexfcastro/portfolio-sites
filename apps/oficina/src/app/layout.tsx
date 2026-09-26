import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": títulos grandes não mudam de largura quando a fonte chega (sem salto de layout).
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Torque Auto Center — demonstração", template: "%s | Torque Auto Center (demonstração)" },
  description: "Demonstração de site para oficina com triagem de orçamento, fotos com prévia local e acompanhamento. Oficina fictícia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#1b1e23", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-orange px-5 py-3 font-bold text-graphite focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
