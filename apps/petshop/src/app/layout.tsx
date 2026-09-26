import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": sem salto de layout quando a fonte chega.
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "optional" });

export const metadata: Metadata = {
  title: { default: "PetVille — demonstração", template: "%s | PetVille (demonstração)" },
  description: "Demonstração de site para pet shop com agendamento por pet, porte, serviço e horário. Pet shop fictício.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#fff6ec", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-coral px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
