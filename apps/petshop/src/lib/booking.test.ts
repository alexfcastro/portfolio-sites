import { describe, expect, it } from "vitest";
import { getService, groomers, services } from "@/data/petshop";
import {
  availableStarts,
  buildBookingMessage,
  buildReminderMessage,
  createAppointment,
  durationFor,
  priceFor,
  reminderDate,
  seedAppointments,
  servicesFor,
  validateBooking,
  validatePet,
  type Appointment,
} from "@/lib/booking";
import { addDays } from "@/lib/time";

const TODAY = "2026-09-30"; // quarta
const now = { date: TODAY, minutes: 8 * 60 };
const THURSDAY = addDays(TODAY, 1);
const MONDAY = "2026-10-05";

describe("dados", () => {
  it("preços em centavos crescem com o porte", () => {
    for (const service of services) {
      const { pequeno, medio, grande } = service.priceCents;
      expect(Number.isInteger(pequeno) && Number.isInteger(medio) && Number.isInteger(grande)).toBe(true);
      expect(pequeno < medio && medio < grande).toBe(true);
    }
  });
});

describe("pet e serviços", () => {
  it("valida nome, espécie e porte", () => {
    expect(validatePet({ name: "Tobias", species: "cao", size: "medio" })).toEqual({});
    expect(Object.keys(validatePet({ name: " ", species: "peixe", size: "gigante" })).sort()).toEqual(["name", "size", "species"]);
    expect(validatePet({ name: "x".repeat(31), species: "gato", size: "pequeno" }).name).toBeDefined();
  });

  it("gatos não recebem serviços de tosa", () => {
    const ids = servicesFor("gato").map((s) => s.id);
    expect(ids).toEqual(["banho", "hidratacao"]);
    expect(servicesFor("cao")).toHaveLength(services.length);
  });

  it("duração cresce com o porte, em blocos de 15 minutos", () => {
    const tosa = getService("banho-tosa")!;
    expect(durationFor(tosa, "pequeno")).toBe(90);
    expect(durationFor(tosa, "medio")).toBe(120); // 112,5 → 120
    expect(durationFor(tosa, "grande")).toBe(135);
    expect(priceFor(tosa, "grande")).toBe(14500);
  });
});

describe("agenda", () => {
  const seed = seedAppointments(TODAY);

  it("gera ocupação só em dias de funcionamento, sem sobreposição por profissional", () => {
    expect(seed.length).toBeGreaterThan(5);
    expect(seed.some((a) => a.date === MONDAY)).toBe(false);
    for (const a of seed) {
      const clash = seed.some((b) => b !== a && b.groomerId === a.groomerId && b.date === a.date && a.startMin < b.endMin && b.startMin < a.endMin);
      expect(clash).toBe(false);
    }
  });

  it("oferece só horários livres que comportam a duração", () => {
    const starts = availableStarts(THURSDAY, "bia", 135, seed, now);
    const busy = seed.filter((a) => a.date === THURSDAY && a.groomerId === "bia");
    for (const start of starts) {
      expect(start + 135).toBeLessThanOrEqual(18 * 60);
      expect(busy.some((a) => start < a.endMin && a.startMin < start + 135)).toBe(false);
    }
    expect(availableStarts(MONDAY, "bia", 45, seed, now)).toEqual([]);
  });

  it("todo dia aberto tem horário para o serviço mais longo, com os dois profissionais", () => {
    const longest = Math.max(...services.map((s) => durationFor(s, "grande")));
    for (let offset = 1; offset < 14; offset += 1) {
      const date = addDays(TODAY, offset);
      if (seed.every((a) => a.date !== date) && availableStarts(date, "bia", 45, seed, now).length === 0) continue; // fechado
      for (const groomer of groomers) {
        expect(availableStarts(date, groomer.id, longest, seed, now).length, `${date} ${groomer.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("não oferece horário a menos de 1 hora no próprio dia", () => {
    const starts = availableStarts(TODAY, "tom", 45, [], { date: TODAY, minutes: 14 * 60 });
    expect(Math.min(...starts)).toBeGreaterThanOrEqual(15 * 60);
  });
});

describe("agendamento", () => {
  const pet = { name: "Tobias", species: "cao" as const, size: "medio" as const };

  it("valida combinação e disponibilidade, e cria com preço e duração do porte", () => {
    const start = availableStarts(THURSDAY, "tom", 75, [], now)[0]!;
    const input = { pet, serviceId: "banho-higienica", groomerId: "tom", date: THURSDAY, startMin: start, reminder: true };
    expect(validateBooking(input, [], now)).toBeNull();
    const appointment = createAppointment(input, 1001);
    expect(appointment).toMatchObject({ id: "PV-1001", priceCents: 8000, endMin: start + 75, reminder: true });
    expect(validateBooking(input, [appointment as Appointment], now)).toMatch(/não está mais disponível/);
    expect(validateBooking({ ...input, pet: { ...pet, species: "gato" } }, [], now)).toMatch(/espécie/);
    expect(validateBooking({ ...input, groomerId: "x" }, [], now)).toMatch(/profissional/);
    expect(groomers).toHaveLength(2);
  });
});

describe("mensagens", () => {
  it("resumo e lembrete trazem código, pet, serviço, horário e valor", () => {
    const appointment = createAppointment(
      { pet: { name: " Mel ", species: "gato", size: "pequeno" }, serviceId: "banho", groomerId: "tom", date: THURSDAY, startMin: 600, reminder: true },
      1002,
    );
    const message = buildBookingMessage(appointment);
    expect(message).toContain("PV-1002");
    expect(message).toContain("Mel (gato, porte pequeno)");
    expect(message).toContain("quinta-feira, 1 de outubro, às 10:00, com Tom");
    expect(message).toMatch(/R\$\s50,00/);
    expect(buildReminderMessage(appointment)).toContain("amanhã, quinta-feira, 1 de outubro, às 10:00, Mel tem banho");
    expect(reminderDate(appointment)).toBe(TODAY);
  });
});
