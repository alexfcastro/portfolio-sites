"use client";

import { BellRing } from "lucide-react";
import Link from "next/link";
import { MessagePreview } from "@/components/message-preview";
import { PetArt } from "@/components/pet-art";
import { getService, groomers, sizeLabels, speciesLabels } from "@/data/petshop";
import { buildReminderMessage } from "@/lib/booking";
import { petActions, petStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { formatDateLong, formatTime } from "@/lib/time";

export function AppointmentList() {
  const state = petStore.useStore();

  if (!state) {
    return (
      <p role="status" className="rounded-card border-2 border-line bg-paper p-6 text-muted">
        Carregando…
      </p>
    );
  }

  const items = [...state.appointments].sort((a, b) => (a.date + a.startMin).localeCompare(b.date + b.startMin) || a.id.localeCompare(b.id));

  if (items.length === 0) {
    return (
      <div className="rounded-card border-2 border-dashed border-line bg-paper p-8 text-center">
        <p className="text-lg font-extrabold">Nenhum agendamento ainda</p>
        <p className="mt-1 text-muted">Faça um agendamento de demonstração para vê-lo aqui.</p>
        <Link href="/agendar" className="btn btn-primary mt-5">
          Agendar agora
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const cancelled = item.status === "cancelado";
          return (
            <li key={item.id} className={`flex gap-4 rounded-card border-2 border-line bg-paper p-5 ${cancelled ? "opacity-70" : ""}`}>
              <PetArt kind={item.species} className="size-14 shrink-0 rounded-2xl sm:size-20" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-muted">
                  {item.id} · {cancelled ? "Cancelado" : "Agendado"}
                </p>
                <h2 className={`text-lg ${cancelled ? "line-through" : ""}`}>
                  {item.petName} · {getService(item.serviceId)?.name}
                </h2>
                <p className="text-sm text-muted">
                  {speciesLabels[item.species]}, porte {sizeLabels[item.size].toLowerCase()} · com{" "}
                  {groomers.find((g) => g.id === item.groomerId)?.name}
                </p>
                <p className="mt-1 text-sm font-bold">
                  {formatDateLong(item.date)}, {formatTime(item.startMin)} · {formatBRL(item.priceCents)}
                </p>
                {!cancelled && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.reminder && (
                      <MessagePreview
                        businessName="PetVille"
                        message={buildReminderMessage(item)}
                        triggerLabel="Lembrete"
                        triggerClassName="btn btn-secondary !min-h-11 !px-4 text-sm"
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary !min-h-11 !px-4 text-sm"
                      onClick={() => petActions.cancel(item.id)}
                      aria-label={`Cancelar agendamento ${item.id} de ${item.petName}`}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                {!cancelled && item.reminder && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                    <BellRing aria-hidden className="size-3.5" /> Lembrete preparado (não enviado)
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/agendar" className="btn btn-primary">
          Novo agendamento
        </Link>
        <button type="button" className="btn btn-secondary" onClick={() => petStore.reset()}>
          Limpar dados da demonstração
        </button>
      </div>
    </div>
  );
}
