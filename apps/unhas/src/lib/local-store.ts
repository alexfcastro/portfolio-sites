"use client";

import { useSyncExternalStore } from "react";

/*
 * Estado de demonstração guardado só neste navegador, com chave própria e versão.
 * Se o valor salvo for de outra versão ou inválido, volta ao estado inicial.
 * Se o armazenamento estiver bloqueado, funciona só em memória.
 */
export function createLocalStore<T>(options: {
  key: string;
  initial: () => T;
  /** Retorna o estado se o valor salvo for válido para a versão atual; senão, `null`. */
  parse: (value: unknown) => T | null;
}) {
  let state: T | null = null;
  const listeners = new Set<() => void>();

  const load = (): T => {
    try {
      const raw = window.localStorage.getItem(options.key);
      return (raw ? options.parse(JSON.parse(raw)) : null) ?? options.initial();
    } catch {
      return options.initial();
    }
  };

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== options.key) return;
    state = load();
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  };

  const get = (): T => {
    if (state === null) state = load();
    return state;
  };

  const set = (next: T) => {
    state = next;
    try {
      window.localStorage.setItem(options.key, JSON.stringify(next));
    } catch {
      // Sem armazenamento: segue em memória.
    }
    emit();
  };

  /** No servidor não há estado (retorna `null` até hidratar). */
  const useStore = (): T | null => useSyncExternalStore(subscribe, get, () => null);

  return { get, set, useStore, reset: () => set(options.initial()) };
}
