"use client";

import { ArrowLeft, ArrowRight, BellRing, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { PetArt } from "@/components/pet-art";
import { groomers, getService, sizeHints, sizeLabels, speciesLabels, type Size, type Species } from "@/data/petshop";
import {
  availableStarts,
  buildBookingMessage,
  buildReminderMessage,
  durationFor,
  priceFor,
  reminderDate,
  seedAppointments,
  servicesFor,
  validatePet,
  WINDOW_DAYS,
  type Appointment,
  type BookingInput,
} from "@/lib/booking";
import { petActions, petStore } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import { addDays, formatDateLong, formatDateParts, formatTime, getBusinessNow, relativeDayLabel } from "@/lib/time";

const STEPS = ["Pet", "Serviço", "Data e horário", "Resumo"] as const;
const SPECIES: Species[] = ["cao", "gato"];
const SIZES: Size[] = ["pequeno", "medio", "grande"];

interface Draft {
  name: string;
  species: Species | "";
  size: Size | "";
  serviceId: string;
  groomerId: string;
  date: string;
  startMin: number | null;
  reminder: boolean;
}

const EMPTY: Draft = { name: "", species: "", size: "", serviceId: "", groomerId: "", date: "", startMin: null, reminder: true };

export function BookingFlow() {
  const state = petStore.useStore();
  const [now] = useState(getBusinessNow);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [petErrors, setPetErrors] = useState<Partial<Record<"name" | "species" | "size", string>>>({});
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Appointment | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Leva o foco ao título a cada troca de etapa (não no carregamento da página).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, created]);

  const seed = useMemo(() => seedAppointments(now.date), [now.date]);
  const taken = useMemo(() => [...seed, ...(state?.appointments ?? [])], [seed, state]);

  if (!state) {
    return (
      <p role="status" className="rounded-card border-2 border-line bg-paper p-6 text-muted">
        Carregando a agenda de demonstração…
      </p>
    );
  }

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));
  const service = getService(draft.serviceId);
  const species = draft.species || null;
  const size = draft.size || null;
  const duration = service && size ? durationFor(service, size) : 0;

  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(now.date, i)).map((date) => ({
    date,
    starts: duration && draft.groomerId ? availableStarts(date, draft.groomerId, duration, taken, now) : [],
  }));
  const selectedDate = draft.date || days.find((d) => d.starts.length > 0)?.date || "";
  const startsForDate = days.find((d) => d.date === selectedDate)?.starts ?? [];

  const goTo = (next: number) => {
    setError("");
    setStep(next);
  };

  const nextFromPet = () => {
    const errors = validatePet({ name: draft.name, species: draft.species, size: draft.size });
    setPetErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // Troca de espécie pode invalidar o serviço escolhido antes.
    if (service && species && !service.species.includes(species)) update({ serviceId: "", startMin: null });
    goTo(1);
  };

  const confirm = () => {
    if (!species || !size || draft.startMin === null) return;
    const input: BookingInput = {
      pet: { name: draft.name, species, size },
      serviceId: draft.serviceId,
      groomerId: draft.groomerId,
      date: selectedDate,
      startMin: draft.startMin,
      reminder: draft.reminder,
    };
    const result = petActions.book(input, taken, now);
    if (!result.ok) {
      setError(result.error);
      update({ startMin: null });
      setStep(2);
      return;
    }
    setCreated(result.appointment);
  };

  if (created) {
    const groomer = groomers.find((g) => g.id === created.groomerId);
    return (
      <section aria-labelledby="done-title" className="rounded-card border-2 border-line bg-paper p-6 sm:p-8">
        <CheckCircle2 aria-hidden className="size-10 text-leaf" />
        <h2 id="done-title" ref={headingRef} tabIndex={-1} className="mt-3 text-3xl">
          Agendamento de demonstração criado
        </h2>
        <p className="mt-2 text-muted">
          Código <strong className="text-ink">{created.id}</strong> · {created.petName} com {groomer?.name},{" "}
          {formatDateLong(created.date)} às {formatTime(created.startMin)}.
        </p>
        <p className="mt-2 text-sm text-muted">Ficou salvo só neste navegador. Nenhum pet shop recebeu este pedido.</p>

        {created.reminder && (
          <div className="mt-6 rounded-2xl bg-coral-soft p-5">
            <p className="flex items-center gap-2 font-extrabold">
              <BellRing aria-hidden className="size-5 text-coral" />
              Lembrete preparado para {formatDateLong(reminderDate(created))}
            </p>
            <p className="mt-1 text-sm text-muted">
              Em um site real, este lembrete sairia na véspera. Aqui ele só é mostrado, nada é agendado nem enviado.
            </p>
            <div className="mt-4">
              <MessagePreview
                businessName="PetVille"
                message={buildReminderMessage(created)}
                triggerLabel="Ver lembrete"
                triggerClassName="btn btn-secondary"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/agendamentos" className="btn btn-primary">
            Ver meus agendamentos
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCreated(null);
              setDraft(EMPTY);
              setStep(0);
            }}
          >
            Agendar outro pet
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0">
        <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Etapas do agendamento">
          {STEPS.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined}>
              <span className={`block h-2 rounded-full ${index <= step ? "bg-coral" : "bg-line"}`} />
              <span className={`mt-2 block text-xs font-bold sm:text-sm ${index === step ? "text-ink" : "text-muted"}`}>
                <span className="sr-only">Etapa {index + 1}: </span>
                {label}
              </span>
            </li>
          ))}
        </ol>

        {error && (
          <p role="alert" className="mb-4 flex items-start gap-2 rounded-2xl border-2 border-alert/40 bg-paper p-4 text-alert">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
            {error}
          </p>
        )}

        <section aria-labelledby="step-title" className="rounded-card border-2 border-line bg-paper p-5 sm:p-7">
          <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-2xl">
            {["Conte sobre o seu pet", "Escolha o serviço", "Escolha data e horário", "Confira o resumo"][step]}
          </h2>

          {step === 0 && (
            <form
              noValidate
              className="mt-6 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                nextFromPet();
              }}
            >
              <label className="block font-bold">
                Nome do pet
                <input
                  value={draft.name}
                  onChange={(event) => update({ name: event.target.value })}
                  maxLength={40}
                  autoComplete="off"
                  aria-invalid={petErrors.name ? true : undefined}
                  aria-describedby={petErrors.name ? "name-error" : "name-hint"}
                  className="field font-normal"
                />
                {petErrors.name ? (
                  <span id="name-error" className="mt-1 block text-sm font-normal text-alert">
                    {petErrors.name}
                  </span>
                ) : (
                  <span id="name-hint" className="mt-1 block text-sm font-normal text-muted">
                    Pode ser um nome inventado: esta é uma demonstração.
                  </span>
                )}
              </label>

              <fieldset className="min-w-0" aria-describedby={petErrors.species ? "species-error" : undefined}>
                <legend className="font-bold">Espécie</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {SPECIES.map((item) => (
                    <label key={item} className="choice flex items-center gap-3">
                      <input
                        type="radio"
                        name="species"
                        value={item}
                        checked={draft.species === item}
                        onChange={() => update({ species: item })}
                        className="sr-only"
                      />
                      <PetArt kind={item} sizes="48px" className="size-12 shrink-0 rounded-xl" />
                      <span className="font-bold">{speciesLabels[item]}</span>
                    </label>
                  ))}
                </div>
                {petErrors.species && (
                  <p id="species-error" className="mt-1 text-sm text-alert">
                    {petErrors.species}
                  </p>
                )}
              </fieldset>

              <fieldset className="min-w-0" aria-describedby={petErrors.size ? "size-error" : undefined}>
                <legend className="font-bold">Porte</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {SIZES.map((item) => (
                    <label key={item} className="choice">
                      <input
                        type="radio"
                        name="size"
                        value={item}
                        checked={draft.size === item}
                        onChange={() => update({ size: item, startMin: null })}
                        className="sr-only"
                      />
                      <span className="block font-bold">{sizeLabels[item]}</span>
                      <span className="text-sm text-muted">{sizeHints[item]}</span>
                    </label>
                  ))}
                </div>
                {petErrors.size && (
                  <p id="size-error" className="mt-1 text-sm text-alert">
                    {petErrors.size}
                  </p>
                )}
              </fieldset>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Continuar
                  <ArrowRight aria-hidden className="size-4" />
                </button>
              </div>
            </form>
          )}

          {step === 1 && species && size && (
            <div className="mt-6 space-y-6">
              <fieldset className="min-w-0">
                <legend className="font-bold">
                  Serviços para {speciesLabels[species].toLowerCase()} de porte {sizeLabels[size].toLowerCase()}
                </legend>
                <div className="mt-2 grid gap-3">
                  {servicesFor(species).map((item) => (
                    <label key={item.id} className="choice flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <input
                        type="radio"
                        name="service"
                        value={item.id}
                        checked={draft.serviceId === item.id}
                        onChange={() => update({ serviceId: item.id, startMin: null })}
                        className="sr-only"
                      />
                      <span className="min-w-0">
                        <span className="block font-bold">{item.name}</span>
                        <span className="text-sm text-muted">{item.description}</span>
                      </span>
                      <span className="text-right text-sm whitespace-nowrap">
                        <span className="block font-extrabold">{formatBRL(priceFor(item, size))}</span>
                        <span className="text-muted">{durationFor(item, size)} min</span>
                      </span>
                    </label>
                  ))}
                </div>
                {species === "gato" && (
                  <p className="mt-2 text-sm text-muted">Para gatos, oferecemos só banhos nesta demonstração, sem tosa.</p>
                )}
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="font-bold">Profissional</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {groomers.map((groomer) => (
                    <label key={groomer.id} className="choice">
                      <input
                        type="radio"
                        name="groomer"
                        value={groomer.id}
                        checked={draft.groomerId === groomer.id}
                        onChange={() => update({ groomerId: groomer.id, date: "", startMin: null })}
                        className="sr-only"
                      />
                      <span className="block font-bold">{groomer.name}</span>
                      <span className="text-sm text-muted">{groomer.specialty}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <StepNav
                onBack={() => goTo(0)}
                onNext={() => goTo(2)}
                nextDisabled={!service || !service.species.includes(species) || !draft.groomerId}
                hint="Escolha o serviço e o profissional para continuar."
              />
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-bold">Dia</h3>
                <p className="text-sm text-muted">Fechado aos domingos e segundas.</p>
                <div role="group" aria-label="Dias" className="mt-2 flex gap-2 overflow-x-auto pb-2">
                  {days.map(({ date, starts }) => {
                    const parts = formatDateParts(date);
                    const label = relativeDayLabel(date, now.date) ?? parts.weekday;
                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={starts.length === 0}
                        aria-pressed={selectedDate === date}
                        aria-label={`${formatDateLong(date)}${starts.length === 0 ? ", sem horários" : `, ${starts.length} horários`}`}
                        onClick={() => update({ date, startMin: null })}
                        className="flex min-w-16 shrink-0 flex-col items-center rounded-2xl border-2 border-line bg-paper px-3 py-2 disabled:opacity-40 aria-pressed:border-coral aria-pressed:bg-coral-soft"
                      >
                        <span className="text-xs font-bold text-muted capitalize">{label}</span>
                        <span className="font-extrabold">{parts.dayMonth}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-bold">Horário</h3>
                {selectedDate && startsForDate.length > 0 ? (
                  <>
                    <p className="text-sm text-muted">
                      {formatDateLong(selectedDate)} · o serviço leva cerca de {duration} min
                    </p>
                    <div role="group" aria-label="Horários livres" className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {startsForDate.map((start) => (
                        <button
                          key={start}
                          type="button"
                          aria-pressed={draft.startMin === start && draft.date === selectedDate}
                          onClick={() => update({ date: selectedDate, startMin: start })}
                          className="min-h-11 rounded-xl border-2 border-line bg-paper font-bold aria-pressed:border-coral aria-pressed:bg-coral aria-pressed:text-white"
                        >
                          {formatTime(start)}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-muted">Nenhum horário livre nos próximos dias para esta combinação.</p>
                )}
              </div>
              <StepNav
                onBack={() => goTo(1)}
                onNext={() => goTo(3)}
                nextDisabled={draft.startMin === null || draft.date !== selectedDate}
                hint="Escolha um horário para continuar."
              />
            </div>
          )}

          {step === 3 && species && size && service && draft.startMin !== null && (
            <div className="mt-6 space-y-6">
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
                <dt className="font-bold text-muted">Pet</dt>
                <dd>
                  {draft.name.trim()} · {speciesLabels[species]}, porte {sizeLabels[size].toLowerCase()}
                </dd>
                <dt className="font-bold text-muted">Serviço</dt>
                <dd>
                  {service.name} · cerca de {duration} min
                </dd>
                <dt className="font-bold text-muted">Quando</dt>
                <dd>
                  {formatDateLong(selectedDate)}, {formatTime(draft.startMin)} às {formatTime(draft.startMin + duration)}
                </dd>
                <dt className="font-bold text-muted">Profissional</dt>
                <dd>{groomers.find((g) => g.id === draft.groomerId)?.name}</dd>
                <dt className="font-bold text-muted">Valor</dt>
                <dd className="text-lg font-extrabold">{formatBRL(priceFor(service, size))}</dd>
              </dl>

              <label className="flex items-start gap-3 rounded-2xl bg-cream p-4">
                <input
                  type="checkbox"
                  checked={draft.reminder}
                  onChange={(event) => update({ reminder: event.target.checked })}
                  className="mt-1 size-5 accent-coral"
                />
                <span>
                  <span className="block font-bold">Preparar lembrete para a véspera</span>
                  <span className="text-sm text-muted">Na demonstração, o lembrete só é exibido, nunca enviado.</span>
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" className="btn btn-secondary" onClick={() => goTo(2)}>
                  <ArrowLeft aria-hidden className="size-4" />
                  Voltar
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <MessagePreview
                    businessName="PetVille"
                    message={buildBookingMessage({
                      id: `PV-${state.nextNumber}`,
                      petName: draft.name.trim(),
                      species,
                      size,
                      serviceId: service.id,
                      groomerId: draft.groomerId,
                      date: selectedDate,
                      startMin: draft.startMin,
                      endMin: draft.startMin + duration,
                      priceCents: priceFor(service, size),
                      reminder: draft.reminder,
                      status: "agendado",
                      origin: "visitor",
                    })}
                  />
                  <button type="button" className="btn btn-primary" onClick={confirm}>
                    Confirmar agendamento
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <aside aria-label="Seu pedido" className="h-fit rounded-card bg-coral-soft p-5 lg:sticky lg:top-24">
        {species ? (
          <PetArt kind={species} palette="caramelo" sizes="(min-width: 1024px) 280px, 90vw" className="h-auto w-full rounded-2xl" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <PetArt kind="cao" sizes="(min-width: 1024px) 140px, 45vw" className="h-auto w-full rounded-2xl" />
            <PetArt kind="gato" palette="cinza" sizes="(min-width: 1024px) 140px, 45vw" className="h-auto w-full rounded-2xl" />
          </div>
        )}
        <p className="mt-4 text-lg font-extrabold">{draft.name.trim() || "Seu pet"}</p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>{species && size ? `${speciesLabels[species]} · porte ${sizeLabels[size].toLowerCase()}` : "Espécie e porte a definir"}</li>
          <li>{service ? `${service.name}${size ? ` · ${formatBRL(priceFor(service, size))}` : ""}` : "Serviço a definir"}</li>
          <li>
            {draft.startMin !== null && draft.date
              ? `${formatDateParts(draft.date).dayMonth} às ${formatTime(draft.startMin)}`
              : "Horário a definir"}
          </li>
        </ul>
      </aside>
    </div>
  );
}

function StepNav({ onBack, onNext, nextDisabled, hint }: { onBack: () => void; onNext: () => void; nextDisabled: boolean; hint: string }) {
  return (
    <div>
      <div className="flex justify-between gap-3">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft aria-hidden className="size-4" />
          Voltar
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={nextDisabled} aria-describedby={nextDisabled ? "next-hint" : undefined}>
          Continuar
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
      {nextDisabled && (
        <p id="next-hint" className="mt-2 text-right text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
