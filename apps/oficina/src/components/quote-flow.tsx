"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, Info, Send, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { getCategory, problemCategories, vehicleTypes } from "@/data/garage";
import { garageActions, garageStore, type QuoteRequest } from "@/lib/demo-store";
import { formatBRL } from "@/lib/money";
import {
  estimateRange,
  likelyServices,
  MAX_PHOTOS,
  PHOTO_TYPES,
  screenPhotos,
  validateProblem,
  validateVehicle,
  type VehicleErrors,
} from "@/lib/quote";
import { getBusinessNow } from "@/lib/time";

const STEPS = ["Veículo", "Problema", "Fotos", "Resumo"] as const;

interface LocalPhoto {
  id: string;
  name: string;
  url: string;
}

function requestMessage(request: QuoteRequest): string {
  const category = getCategory(request.categoryId);
  const symptoms = category?.symptoms.filter((s) => request.symptomIds.includes(s.id)).map((s) => s.label) ?? [];
  return [
    `Olá, Torque! Solicitação ${request.id}:`,
    "",
    `Veículo: ${request.vehicle.model} (${request.vehicle.year}, ${request.vehicle.km.toLocaleString("pt-BR")} km)`,
    `Problema: ${category?.name} — ${symptoms.join("; ")}`,
    `Fotos: ${request.photoCount} (ficaram no meu aparelho)`,
    `Estimativa inicial: ${formatBRL(request.estimate.minCents)} a ${formatBRL(request.estimate.maxCents)}`,
  ].join("\n");
}

export function QuoteFlow() {
  const state = garageStore.useStore();
  const currentYear = Number(getBusinessNow().date.slice(0, 4));
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState({ type: "", model: "", year: "", km: "" });
  const [vehicleErrors, setVehicleErrors] = useState<VehicleErrors>({});
  const [categoryId, setCategoryId] = useState("");
  const [symptomIds, setSymptomIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<QuoteRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<LocalPhoto[]>([]);
  const mounted = useRef(false);
  const uid = useId();

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Libera a memória das prévias ao sair da página.
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, sent]);

  if (!state) {
    return (
      <p role="status" className="text-muted">
        Carregando…
      </p>
    );
  }

  const parsedVehicle = {
    type: vehicle.type,
    model: vehicle.model,
    year: Number(vehicle.year),
    km: Number(vehicle.km.replace(/\D/g, "")),
  };
  const category = getCategory(categoryId);
  const likely = likelyServices(categoryId, symptomIds);
  const estimate = estimateRange(likely);

  const go = (next: number) => {
    setError("");
    setStep(next);
  };

  const next = () => {
    if (step === 0) {
      const errors = validateVehicle({ ...parsedVehicle, year: vehicle.year ? parsedVehicle.year : NaN, km: vehicle.km ? parsedVehicle.km : NaN }, currentYear);
      setVehicleErrors(errors);
      const first = Object.keys(errors)[0];
      if (first) {
        document.getElementById(`${uid}-${first}`)?.focus();
        return;
      }
    }
    if (step === 1) {
      const problem = validateProblem(categoryId, symptomIds, description);
      if (problem) return setError(problem);
    }
    go(step + 1);
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const list = [...files];
    const { accepted, rejected } = screenPhotos(photos.length, list.map((f) => ({ name: f.name, type: f.type, size: f.size })));
    const added = list
      .filter((file) => accepted.some((meta) => meta.name === file.name && meta.size === file.size))
      .map((file) => ({ id: `${file.name}-${file.size}-${Math.random()}`, name: file.name, url: URL.createObjectURL(file) }));
    setPhotos((current) => [...current, ...added]);
    setPhotoErrors(rejected);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const submit = () => {
    const request = garageActions.submit({
      vehicle: parsedVehicle,
      categoryId,
      symptomIds,
      description: description.trim(),
      photoCount: photos.length,
    });
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setSent(request);
  };

  if (sent) {
    return (
      <section aria-labelledby="ok" className="rounded-card border border-ok/30 bg-paper p-6 sm:p-10">
        <CheckCircle2 aria-hidden className="size-10 text-ok" />
        <h2 id="ok" ref={headingRef} tabIndex={-1} className="mt-4 text-3xl uppercase outline-none">
          Solicitação de demonstração registrada
        </h2>
        <p className="mt-2 text-muted">
          Código <strong className="text-ink">{sent.id}</strong>. Estimativa inicial:{" "}
          <strong className="text-ink">
            {formatBRL(sent.estimate.minCents)} a {formatBRL(sent.estimate.maxCents)}
          </strong>
          . Nada foi enviado e as fotos não saíram do seu navegador (já foram descartadas).
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/acompanhamento" className="btn btn-primary">
            Acompanhar solicitação
          </Link>
          <MessagePreview businessName="Torque Auto Center" message={requestMessage(sent)} triggerLabel="Prévia da mensagem no WhatsApp" />
        </div>
      </section>
    );
  }

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2" aria-label="Etapas do orçamento">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${index <= step ? "bg-orange" : "bg-line"}`} />
            <span className={`mt-2 hidden text-xs font-bold uppercase sm:block ${index === step ? "text-ink" : "text-muted"}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted sm:hidden">
        Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      <div className="mt-8">
        {step === 0 && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl uppercase outline-none">
              Seu veículo
            </h2>
            <fieldset className="mt-6 min-w-0">
              <legend className="font-bold">Tipo</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {vehicleTypes.map((type, index) => (
                  <label key={type.id} className="choice justify-center">
                    <input
                      id={index === 0 ? `${uid}-type` : undefined}
                      type="radio"
                      name="type"
                      className="sr-only"
                      checked={vehicle.type === type.id}
                      onChange={() => setVehicle((v) => ({ ...v, type: type.id }))}
                    />
                    <span className="font-semibold">{type.name}</span>
                  </label>
                ))}
              </div>
              {vehicleErrors.type && <p className="mt-1.5 text-sm font-semibold text-alert">{vehicleErrors.type}</p>}
            </fieldset>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {(
                [
                  ["model", "Marca e modelo", "text", "Ex.: hatch 1.0 flex"],
                  ["year", "Ano", "number", "Ex.: 2019"],
                  ["km", "Quilometragem aproximada", "text", "Ex.: 58000"],
                ] as const
              ).map(([key, label, type, placeholder]) => (
                <label key={key} className={`block ${key === "model" ? "sm:col-span-3" : ""}`}>
                  <span className="font-bold">{label}</span>
                  <input
                    id={`${uid}-${key}`}
                    type={type}
                    inputMode={key === "model" ? undefined : "numeric"}
                    maxLength={key === "model" ? 60 : 7}
                    placeholder={placeholder}
                    value={vehicle[key]}
                    aria-invalid={vehicleErrors[key] ? true : undefined}
                    aria-describedby={vehicleErrors[key] ? `${uid}-${key}-err` : undefined}
                    onChange={(event) => setVehicle((v) => ({ ...v, [key]: event.target.value }))}
                    className="field"
                  />
                  {vehicleErrors[key] && (
                    <span id={`${uid}-${key}-err`} className="mt-1.5 block text-sm font-semibold text-alert">
                      {vehicleErrors[key]}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl uppercase outline-none">
              Qual é o problema?
            </h2>
            <fieldset className="mt-6 min-w-0">
              <legend className="font-bold">Categoria</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {problemCategories.map((item) => (
                  <label key={item.id} className="choice">
                    <input
                      type="radio"
                      name="category"
                      className="sr-only"
                      checked={categoryId === item.id}
                      onChange={() => {
                        setError("");
                        setCategoryId(item.id);
                        setSymptomIds([]);
                      }}
                    />
                    <span className="font-semibold">{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {category && (
              <fieldset className="mt-6 min-w-0">
                <legend className="font-bold">O que você percebe?</legend>
                <div className="mt-2 grid gap-2">
                  {category.symptoms.map((symptom) => (
                    <label key={symptom.id} className="choice">
                      <input
                        type="checkbox"
                        className="size-5 accent-orange-dark"
                        checked={symptomIds.includes(symptom.id)}
                        onChange={(event) => {
                          setError("");
                          setSymptomIds((ids) => (event.target.checked ? [...ids, symptom.id] : ids.filter((id) => id !== symptom.id)));
                        }}
                      />
                      {symptom.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <label className="mt-6 block">
              <span className="font-bold">Descreva com suas palavras</span> <span className="text-sm text-muted">(opcional)</span>
              <textarea
                rows={4}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex.: o ruído aparece de manhã e some depois de alguns minutos."
                className="field resize-y"
              />
              <span className="mt-1 block text-right text-xs text-muted">{description.length} de 500</span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl uppercase outline-none">
              Fotos do problema
            </h2>
            <p className="mt-2 flex gap-2 text-muted">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-dark" />
              Opcional. Até {MAX_PHOTOS} fotos (JPG, PNG ou WebP, até 5 MB cada). As fotos aparecem só como prévia no seu
              navegador: nada é enviado.
            </p>
            <label className="btn btn-secondary mt-6 cursor-pointer">
              <ImagePlus aria-hidden className="size-4" />
              Escolher fotos
              <input
                ref={fileRef}
                type="file"
                accept={PHOTO_TYPES.join(",")}
                multiple
                className="sr-only"
                disabled={photos.length >= MAX_PHOTOS}
                onChange={(event) => addPhotos(event.target.files)}
              />
            </label>
            <p role="status" className="mt-3 text-sm text-muted">
              {photos.length} de {MAX_PHOTOS} fotos
            </p>
            {photoErrors.length > 0 && (
              <ul role="alert" className="mt-2 space-y-1 text-sm font-semibold text-alert">
                {photoErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
            {photos.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo) => (
                  <li key={photo.id} className="relative overflow-hidden rounded-card border border-line bg-paper">
                    <Image src={photo.url} alt={`Prévia: ${photo.name}`} width={300} height={220} unoptimized className="aspect-[4/3] w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full bg-graphite/85 text-white"
                    >
                      <X aria-hidden className="size-4" />
                      <span className="sr-only">Remover {photo.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 3 && category && (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl uppercase outline-none">
              Resumo e estimativa
            </h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <dl className="space-y-3 rounded-card border border-line bg-paper p-5">
                <Row term="Veículo" value={`${vehicleTypes.find((t) => t.id === vehicle.type)?.name} · ${parsedVehicle.model} · ${parsedVehicle.year}`} />
                <Row term="Quilometragem" value={`${parsedVehicle.km.toLocaleString("pt-BR")} km`} />
                <Row term="Problema" value={category.name} />
                <Row
                  term="Sintomas"
                  value={category.symptoms.filter((s) => symptomIds.includes(s.id)).map((s) => s.label).join("; ")}
                />
                {description.trim() && <Row term="Descrição" value={description.trim()} />}
                <Row term="Fotos" value={`${photos.length} (só no seu navegador)`} />
              </dl>
              <div className="rounded-card bg-graphite p-5 text-white">
                <p className="text-sm font-bold tracking-wider text-orange uppercase">Estimativa inicial (demonstrativa)</p>
                <p className="mt-2 text-3xl font-extrabold">
                  {formatBRL(estimate.minCents)} a {formatBRL(estimate.maxCents)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {likely.map((service) => (
                    <li key={service.id} className="flex justify-between gap-4">
                      <span>{service.name}</span>
                      <span className="shrink-0">
                        {formatBRL(service.minCents)}–{formatBRL(service.maxCents)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-white/60">
                  Faixa ilustrativa. Em uma oficina real, o valor final depende da avaliação do veículo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div role="alert" className="mt-6 min-h-6 text-sm font-semibold text-alert">
        {error}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} className="btn btn-secondary">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn btn-primary">
            {step === 2 && photos.length === 0 ? "Continuar sem fotos" : "Continuar"}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn btn-primary">
            <Send aria-hidden className="size-4" />
            Enviar solicitação de demonstração
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wider text-muted uppercase">{term}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
