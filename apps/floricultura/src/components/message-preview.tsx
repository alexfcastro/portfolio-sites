"use client";

import { MessageCircle, X } from "lucide-react";
import { useId, useRef } from "react";

interface MessagePreviewProps {
  businessName: string;
  message: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

/**
 * Prévia LOCAL de mensagem (estilo de mensageiro). Não há destinatário real e nada é enviado.
 * <dialog> nativo: foco preso, Escape fecha e o foco volta ao botão.
 */
export function MessagePreview({
  businessName,
  message,
  triggerLabel = "Prévia da mensagem",
  triggerClassName = "btn btn-secondary",
}: MessagePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => dialogRef.current?.showModal()}>
        <MessageCircle aria-hidden className="size-4" />
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-demo-bg p-0 text-demo-ink shadow-2xl backdrop:bg-black/60"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-3 bg-wa-head px-5 py-3 text-white">
          <div>
            <h2 id={titleId} className="text-base font-semibold">
              {businessName}
            </h2>
            <p className="text-xs text-wa-subtle">Prévia local · contato fictício</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Fechar prévia</span>
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto bg-wa-chat px-5 py-6">
          <p className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-wa-bubble px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-white">
            {message}
          </p>
        </div>
        <p className="px-5 py-4 text-sm leading-relaxed text-demo-muted">
          <strong className="text-demo-ink">Nenhuma mensagem foi enviada.</strong> Esta é só uma prévia de como a
          mensagem chegaria em um site real. {businessName} é um negócio fictício e não tem número.
        </p>
      </dialog>
    </>
  );
}
