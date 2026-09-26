"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { mainNavigation, quoteHref } from "@/data/navigation";

function isCurrent(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Fecha o menu quando a rota muda (ajuste de estado durante a renderização).
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((value) => !value);
  };

  return (
    <>
      <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
        <ul className="flex items-center gap-1">
          {mainNavigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.9375rem] font-medium text-muted transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={quoteHref} className="btn btn-primary ml-3 whitespace-nowrap">
          Solicitar orçamento
        </Link>
      </nav>

      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink lg:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-raised lg:hidden"
      >
        <nav aria-label="Principal (celular)" className="container-page py-4">
          <ul className="flex flex-col">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => close(false)}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center border-b border-line/70 text-lg font-medium aria-[current=page]:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={quoteHref} onClick={() => close(false)} className="btn btn-primary mt-5 w-full">
            Solicitar orçamento
          </Link>
        </nav>
      </div>
    </>
  );
}
