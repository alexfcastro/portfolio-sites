import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { AX_PATH_A, AX_PATH_X } from "@/lib/brand";
import { OG_IMAGE } from "@/lib/metadata";

/*
 * Imagem de compartilhamento (Open Graph), gerada no build como arquivo estático.
 * É uma rota comum, e não a convenção opengraph-image, para que só seja
 * anunciada nos metadados quando existir uma URL pública válida.
 */
export const dynamic = "force-static";

/* Cores repetidas dos tokens: o gerador de imagens não lê o CSS do site. */
const INK = "#14161A";
const CANVAS = "#F6F5F1";
const ACCENT = "#8FA6FF";
const MUTED = "#A9ADB6";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: INK,
          backgroundImage: "radial-gradient(circle at 92% 0%, rgba(47,84,235,0.6), rgba(20,22,26,0) 55%)",
          color: CANVAS,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <path d={AX_PATH_A} fill={CANVAS} />
            <path d={AX_PATH_X} fill={ACCENT} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{siteConfig.name}</div>
            <div style={{ fontSize: 26, color: MUTED }}>{siteConfig.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Sites que trabalham pelo seu negócio.
          </div>
          <div style={{ fontSize: 28, color: MUTED }}>
            Presença digital, agendamentos, orçamentos e contato pelo WhatsApp.
          </div>
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
