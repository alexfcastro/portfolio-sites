import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// "optional": sem salto de layout quando a fonte chega.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "optional" });

export const metadata: Metadata = {
  title: { default: "Resolve Serviços — demonstração", template: "%s | Resolve Serviços (demonstração)" },
  description: "Demonstração de site para prestador de serviços com solicitação guiada, região atendida e disponibilidade. Negócio fictício.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0f4c55", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-sun px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
