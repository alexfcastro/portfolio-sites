"use client";

import { useSyncExternalStore } from "react";
import { isOpen } from "@/lib/cart";
import { getBusinessNow } from "@/lib/time";

const noop = () => () => {};

/** "Aberto agora" / "Fechado agora" pelo horário de Brasília; só no navegador. */
export function OpenStatus() {
  const open = useSyncExternalStore(noop, () => isOpen(getBusinessNow()), () => null);
  if (open === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
        open ? "bg-leaf/25 text-leaf-light" : "bg-crust text-muted"
      }`}
    >
      <span aria-hidden className={`size-2 rounded-full ${open ? "bg-leaf-light" : "bg-muted"}`} />
      {open ? "Aberto agora" : "Fechado agora — pedidos de demonstração continuam liberados"}
    </span>
  );
}
