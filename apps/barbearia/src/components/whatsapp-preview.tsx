"use client";

import { MessageCircle, X } from "lucide-react";
import { useRef } from "react";

interface WhatsAppPreviewProps {
  message: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

/**
 * Prévia LOCAL de uma conversa de WhatsApp. Não há destinatário real e nada é enviado.
 * Usa <dialog> nativo: foco preso no diálogo, Escape fecha e o foco volta ao botão.
 */
export function WhatsAppPreview({
  message,
  triggerLabel = "Prévia da mensagem no WhatsApp",
  triggerClassName = "btn btn-line",
}: WhatsAppPreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => dialogRef.current?.showModal()}>
        <MessageCircle aria-hidden className="size-4" />
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="wa-preview-title"
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-edge bg-coal-2 p-0 text-cream backdrop:bg-black/70"
        onClick={(event) => {
          // Clique no fundo (fora do conteúdo) fecha.
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-edge bg-wa-head px-5 py-3">
          <div>
            <h2 id="wa-preview-title" className="font-sans text-base font-semibold tracking-normal normal-case">
              Bravus Barbearia
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

        <div className="bg-wa-chat px-5 py-6">
          <p className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-wa-bubble px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-white">
            {message}
          </p>
        </div>

        <p className="border-t border-edge px-5 py-4 text-sm leading-relaxed text-smoke">
          <strong className="text-cream">Nenhuma mensagem foi enviada.</strong> Esta é só uma prévia de como o
          cliente poderia confirmar o horário pelo WhatsApp em um site real. A Bravus é fictícia e não tem número.
        </p>
      </dialog>
    </>
  );
}
