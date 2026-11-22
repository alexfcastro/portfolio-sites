"use client";

import { CalendarDays, ChartColumn, LayoutDashboard, RotateCcw, ShoppingBag, Smartphone, Users, UsersRound } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { AgendaTab } from "@/components/admin/agenda-tab";
import { ClientsTab } from "@/components/admin/clients-tab";
import { FinanceTab } from "@/components/admin/finance-tab";
import { StoreTab } from "@/components/admin/store-tab";
import { TeamTab } from "@/components/admin/team-tab";
import { TodayTab } from "@/components/admin/today-tab";
import { demoActions, useDemoState } from "@/lib/demo-store";
import { getBusinessNow } from "@/lib/time";

const TABS = [
  { id: "hoje", label: "Hoje", icon: LayoutDashboard },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "faturamento", label: "Faturamento", icon: ChartColumn },
  { id: "loja", label: "Loja", icon: ShoppingBag },
  { id: "equipe", label: "Equipe", icon: UsersRound },
  { id: "clientes", label: "Clientes", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

function initialTab(): TabId {
  if (typeof window === "undefined") return "hoje";
  const hash = window.location.hash.slice(1);
  return TABS.some((tab) => tab.id === hash) ? (hash as TabId) : "hoje";
}

export function AdminPanel() {
  const demo = useDemoState();
  const [now] = useState(getBusinessNow);
  const [tab, setTab] = useState<TabId>(initialTab);
  const [resetDone, setResetDone] = useState(false);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!demo) {
    return (
      <p role="status" className="rounded-card border border-edge bg-coal-2 p-6 text-smoke">
        Carregando a agenda de demonstração…
      </p>
    );
  }

  const choose = (id: TabId) => {
    setTab(id);
    setResetDone(false);
    history.replaceState(null, "", `#${id}`);
  };

  // Setas trocam de aba, como no padrão de abas acessíveis.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : (index + delta + TABS.length) % TABS.length;
    choose(TABS[next]!.id);
    tabRefs.current[next]?.focus();
  };

  const mine = demo.bookings.filter((b) => b.origin === "visitor").length;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Seções do painel"
        className="grid grid-cols-3 border-b border-edge sm:flex sm:gap-1"
      >
        {TABS.map((item, index) => {
          const Icon = item.icon;
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              id={`aba-${item.id}`}
              aria-selected={selected}
              aria-controls={`painel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px inline-flex min-h-12 items-center justify-center gap-2 border-b-2 px-0.5 font-display text-[0.9375rem] tracking-wide uppercase sm:px-4 sm:text-lg sm:tracking-wider ${
                selected ? "border-gold text-cream" : "border-transparent text-smoke hover:text-cream"
              }`}
            >
              <Icon aria-hidden className="hidden size-4 sm:block" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`painel-${tab}`} aria-labelledby={`aba-${tab}`} tabIndex={0} className="mt-8 outline-none">
        {tab === "hoje" && <TodayTab demo={demo} now={now} />}
        {tab === "agenda" && <AgendaTab demo={demo} now={now} />}
        {tab === "faturamento" && <FinanceTab demo={demo} now={now} />}
        {tab === "loja" && <StoreTab demo={demo} now={now} />}
        {tab === "equipe" && <TeamTab demo={demo} now={now} />}
        {tab === "clientes" && <ClientsTab demo={demo} now={now} />}
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="rounded-card border border-edge p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Smartphone aria-hidden className="size-5 text-gold" /> Vira aplicativo no celular
          </h2>
          <p className="mt-1 text-sm text-smoke">
            Este painel pode ser instalado na tela inicial, como um aplicativo: no celular, abra o menu do navegador e
            toque em “Adicionar à tela inicial”. Na versão real, ele também avisa a cada novo agendamento.
          </p>
        </div>
        <div className="rounded-card border border-edge p-5">
          <h2 className="text-xl font-semibold">Restaurar dados iniciais</h2>
          <p className="mt-1 text-sm text-smoke">
            Apaga o que foi criado neste navegador (agendamentos, bloqueios, plano) e recria a agenda de exemplo.
          </p>
          <button type="button" onClick={() => resetDialog.current?.showModal()} className="btn btn-line mt-4">
            <RotateCcw aria-hidden className="size-4" />
            Restaurar dados iniciais
          </button>
          <p role="status" className="mt-2 min-h-5 text-sm font-semibold text-ok">
            {resetDone ? "Dados iniciais restaurados." : ""}
          </p>
        </div>
      </div>

      <dialog
        ref={resetDialog}
        aria-labelledby="reset-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-edge bg-coal-2 p-6 text-cream backdrop:bg-black/70"
      >
        <h2 id="reset-title" className="text-2xl font-semibold">
          Restaurar a agenda de exemplo?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-smoke">
          Os {mine} agendamento(s) criados por você neste navegador, os bloqueios e o plano de teste serão apagados. Isso não
          afeta outros visitantes.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" autoFocus onClick={() => resetDialog.current?.close()} className="btn btn-line">
            Manter como está
          </button>
          <button
            type="button"
            onClick={() => {
              demoActions.reset();
              resetDialog.current?.close();
              setResetDone(true);
            }}
            className="btn btn-gold"
          >
            Restaurar
          </button>
        </div>
      </dialog>
    </div>
  );
}
