import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-barlow", display: "swap" });
// "optional" evita que os títulos mudem de largura na troca de fonte (salto de layout).
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "optional",
});

export const metadata: Metadata = {
  title: {
    default: "Bravus Barbearia — demonstração",
    template: "%s | Bravus Barbearia (demonstração)",
  },
  description:
    "Demonstração de site com agendamento on-line para barbearia. Negócio fictício, dados de exemplo e nenhum agendamento real.",
  // Negócio fictício: nunca indexar, em nenhum ambiente.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#15120f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-gold px-5 py-3 font-semibold text-coal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
