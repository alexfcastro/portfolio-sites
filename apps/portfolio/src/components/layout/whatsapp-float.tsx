"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface WhatsAppFloatProps {
  href: string;
}

/**
 * Atalho flutuante para o WhatsApp de Alex. Só é renderizado com número
 * configurado e fica oculto na página de contato, que já tem o fluxo completo.
 */
export function WhatsAppFloat({ href }: WhatsAppFloatProps) {
  const pathname = usePathname();
  if (pathname === "/contato") return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-raised transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <MessageCircle aria-hidden className="size-6" />
      <span className="sr-only">Conversar com Alex no WhatsApp (abre em nova aba)</span>
    </a>
  );
}
