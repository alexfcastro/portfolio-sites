"use client";

import { Check, Copy, QrCode, Timer } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { formatBRL } from "@/lib/money";
import { demoPixCode, formatCountdown, illustrativeQr } from "@/lib/pix";

interface PixCheckoutProps {
  /** Código do agendamento ou da assinatura. */
  reference: string;
  cents: number;
  description: string;
  /** Até quando o Pix vale (ms). Sem prazo, não mostra contador. */
  expiresAt?: number;
  onPaid: () => void;
  onExpired?: () => void;
}

/**
 * Tela de pagamento por Pix, ILUSTRATIVA: o QR Code não é lido por bancos e
 * o botão só simula a confirmação que, num site real, viria do banco.
 */
export function PixCheckout({ reference, cents, description, expiresAt, onPaid, onExpired }: PixCheckoutProps) {
  const code = demoPixCode(reference, cents);
  const matrix = illustrativeQr(code);
  const [left, setLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = expiresAt - Date.now();
      setLeft(remaining);
      if (remaining <= 0) onExpired?.();
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, onExpired]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const expired = left !== null && left <= 0;

  return (
    <section aria-labelledby={titleId} className="rounded-card border border-gold/50 bg-coal-2 p-5 sm:p-8">
      <p className="kicker flex items-center gap-2">
        <QrCode aria-hidden className="size-4" /> Pagamento por Pix
      </p>
      <h2 id={titleId} className="mt-2 text-3xl font-bold sm:text-4xl">
        Pague {formatBRL(cents)} para garantir
      </h2>
      <p className="mt-1 text-smoke">{description}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[13rem_1fr] sm:items-start">
        <figure className="mx-auto w-52 sm:mx-0">
          <svg
            viewBox={`-2 -2 ${matrix.length + 4} ${matrix.length + 4}`}
            role="img"
            aria-label="QR Code ilustrativo, não pode ser pago"
            className="w-full rounded-xl bg-white p-1"
            shapeRendering="crispEdges"
          >
            {matrix.flatMap((row, y) =>
              row.map((dark, x) => (dark ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#15120f" /> : null)),
            )}
          </svg>
          <figcaption className="mt-2 text-center text-xs text-smoke">QR Code ilustrativo: não é lido por bancos.</figcaption>
        </figure>

        <div className="min-w-0">
          {left !== null && (
            <p
              role="timer"
              aria-live="off"
              className={`flex items-center gap-2 font-semibold ${expired ? "text-warn" : "text-cream"}`}
            >
              <Timer aria-hidden className="size-4" />
              {expired ? "Prazo encerrado: o horário foi liberado." : `O horário fica reservado por ${formatCountdown(left)}`}
            </p>
          )}
          <p className="mt-4 text-sm font-semibold">Pix copia e cola</p>
          <p className="mt-1 rounded-lg border border-edge bg-coal p-3 font-mono text-xs break-all text-smoke">{code}</p>
          <button type="button" onClick={copy} className="btn btn-line mt-3 !min-h-11 !text-sm">
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? "Código copiado" : "Copiar código"}
          </button>
          <div role="status" className="sr-only">
            {copied ? "Código copiado." : ""}
          </div>

          <ol className="mt-5 space-y-1 text-sm text-smoke">
            <li>1. Abra o aplicativo do seu banco e escolha Pix.</li>
            <li>2. Leia o QR Code ou cole o código.</li>
            <li>3. A confirmação chega aqui sozinha, em segundos.</li>
          </ol>

          <button type="button" onClick={onPaid} disabled={expired} className="btn btn-gold mt-6 w-full sm:w-auto">
            <Check aria-hidden className="size-4" />
            Simular pagamento aprovado
          </button>
          <p className="mt-2 text-xs text-smoke">
            Demonstração: nenhum valor é cobrado. Num site real, a confirmação vem do banco, sem esse botão.
          </p>
        </div>
      </div>
    </section>
  );
}
