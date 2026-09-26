"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { PlateArt } from "@/components/plate-art";
import { categories, getGroup, menu, type MenuItem } from "@/data/menu";
import { MAX_QUANTITY, unitPriceCents, validateAddons, type AddonSelection } from "@/lib/cart";
import { cartActions, useRestaurantState } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";

export function MenuBoard() {
  const state = useRestaurantState();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [addons, setAddons] = useState<AddonSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const open = (next: MenuItem) => {
    setItem(next);
    setAddons({});
    setQuantity(1);
    setNote("");
    setError("");
    dialogRef.current?.showModal();
  };

  const toggle = (groupId: string, optionId: string, single: boolean) => {
    setError("");
    setAddons((current) => {
      const chosen = current[groupId] ?? [];
      const next = single ? [optionId] : chosen.includes(optionId) ? chosen.filter((id) => id !== optionId) : [...chosen, optionId];
      return { ...current, [groupId]: next };
    });
  };

  const add = () => {
    if (!item) return;
    const clean = Object.fromEntries(Object.entries(addons).filter(([, ids]) => ids.length > 0));
    const result = cartActions.add(item.id, clean, quantity, note);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dialogRef.current?.close();
    setFeedback(`${quantity}× ${item.name} adicionado ao carrinho.`);
  };

  const count = state?.lines.reduce((total, line) => total + line.quantity, 0) ?? 0;
  const preview = item ? unitPriceCents(item, addons) * quantity : 0;
  const pendingError = item ? validateAddons(item, addons) : null;

  return (
    <>
      <nav aria-label="Categorias do cardápio" className="sticky top-16 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <ul className="wrap flex gap-2 overflow-x-auto py-3">
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${category.id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 font-medium hover:border-brick"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div role="status" aria-live="polite" className="wrap min-h-8 pt-4 text-sm font-semibold text-leaf">
        {feedback}
      </div>

      <div className="wrap pb-24">
        {categories.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="pt-8">
            <h2 id={`${category.id}-title`} className="text-3xl sm:text-4xl">
              {category.name}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {menu
                .filter((entry) => entry.categoryId === category.id)
                .map((entry) => (
                  <li key={entry.id} className="flex flex-col overflow-hidden rounded-card border border-line bg-paper">
                    <PlateArt art={entry.art} className="h-auto w-full" />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl">{entry.name}</h3>
                        {entry.highlight && (
                          <span className="shrink-0 rounded-full bg-crust px-2.5 py-0.5 text-xs font-semibold text-brick">
                            Mais pedido
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex-1 text-sm text-muted">{entry.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-lg font-semibold">{formatBRL(entry.priceCents)}</span>
                        <button type="button" onClick={() => open(entry)} className="btn btn-primary !min-h-11 !px-4">
                          <Plus aria-hidden className="size-4" />
                          Adicionar<span className="sr-only"> {entry.name}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
          <Link href="/carrinho" className="btn btn-primary w-full">
            <ShoppingBag aria-hidden className="size-4" />
            Ver carrinho ({count})
          </Link>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="item-title"
        className="m-auto max-h-[92dvh] w-[min(30rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl bg-cream p-0 text-ink shadow-2xl backdrop:bg-black/50"
      >
        {item && (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-line p-5">
              <div>
                <h2 id="item-title" className="text-2xl">
                  {item.name}
                </h2>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-crust"
              >
                <X aria-hidden className="size-5" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              {item.addonGroupIds.map((groupId) => {
                const group = getGroup(groupId);
                if (!group) return null;
                const single = group.max === 1;
                const chosen = addons[groupId] ?? [];
                return (
                  <fieldset key={groupId} className="min-w-0">
                    <legend className="font-semibold">
                      {group.name}{" "}
                      <span className="text-sm font-normal text-muted">
                        {group.min > 0 ? "(obrigatório)" : single ? "(opcional)" : `(até ${group.max}, opcional)`}
                      </span>
                    </legend>
                    <div className="mt-2 grid gap-2">
                      {group.options.map((option) => {
                        const checked = chosen.includes(option.id);
                        return (
                          <label key={option.id} className="option">
                            <input
                              type={single ? "radio" : "checkbox"}
                              name={`${item.id}-${groupId}`}
                              checked={checked}
                              disabled={!single && !checked && chosen.length >= group.max}
                              onChange={() => toggle(groupId, option.id, single)}
                              className="size-5 accent-brick"
                            />
                            <span className="flex-1">{option.name}</span>
                            {option.priceCents > 0 && <span className="text-sm text-muted">+ {formatBRL(option.priceCents)}</span>}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}

              <label className="block">
                <span className="font-semibold">Observação</span> <span className="text-sm text-muted">(opcional)</span>
                <input
                  type="text"
                  maxLength={140}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ex.: sem cebola"
                  className="mt-2 block w-full rounded-xl border border-line bg-paper px-3.5 py-3 focus:border-brick focus:outline-none"
                />
              </label>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Quantidade</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper disabled:opacity-40"
                  >
                    <Minus aria-hidden className="size-4" />
                    <span className="sr-only">Diminuir</span>
                  </button>
                  <span className="w-8 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper disabled:opacity-40"
                  >
                    <Plus aria-hidden className="size-4" />
                    <span className="sr-only">Aumentar</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-line p-5">
              <p role="alert" className="min-h-5 text-sm font-semibold text-brick">
                {error}
              </p>
              <button type="button" onClick={add} className="btn btn-primary mt-2 w-full" aria-describedby={pendingError ? "pending" : undefined}>
                Adicionar · {formatBRL(preview)}
              </button>
              {pendingError && (
                <p id="pending" className="mt-2 text-center text-xs text-muted">
                  {pendingError}
                </p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
