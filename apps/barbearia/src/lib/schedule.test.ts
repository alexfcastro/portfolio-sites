import { describe, expect, it } from "vitest";
import { business, getService, professionals, services } from "@/data/business";
import { formatBRL, sumCents } from "@/lib/money";
import {
  generateSeedBookings,
  getBookableDates,
  getOpeningWindow,
  hasFreeWindow,
  listAvailableStarts,
  overlaps,
  validateNewBooking,
} from "@/lib/schedule";
import { addDays, formatTime, getBusinessNow, getWeekday } from "@/lib/time";
import type { Booking, BusinessNow } from "@/types/booking";

// Quarta-feira, 10:00 em São Paulo.
const WEDNESDAY = "2026-09-30";
const now: BusinessNow = { date: WEDNESDAY, minutes: 10 * 60 };
const corte = getService("corte")!;
const combo = getService("combo")!;

function booking(partial: Partial<Booking>): Booking {
  return {
    id: "T-1",
    serviceId: "corte",
    professionalId: "rafa",
    date: WEDNESDAY,
    startMin: 14 * 60,
    endMin: 14 * 60 + 40,
    priceCents: 4500,
    customerName: "Teste",
    status: "confirmado",
    origin: "seed",
    ...partial,
  };
}

describe("tempo no fuso do negócio", () => {
  it("converte o instante para America/Sao_Paulo independentemente do fuso da máquina", () => {
    // 02:30 UTC = 23:30 do dia anterior em São Paulo (UTC-3).
    expect(getBusinessNow(new Date("2026-10-01T02:30:00Z"))).toEqual({ date: "2026-09-30", minutes: 23 * 60 + 30 });
  });

  it("faz aritmética de datas atravessando meses e anos", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(getWeekday(WEDNESDAY)).toBe(3);
    expect(formatTime(9 * 60 + 5)).toBe("09:05");
  });

  it("oferece 14 dias a partir de hoje", () => {
    const dates = getBookableDates(WEDNESDAY);
    expect(dates).toHaveLength(business.bookingWindowDays);
    expect(dates[0]).toBe(WEDNESDAY);
  });
});

describe("dados do negócio", () => {
  it("usa preços inteiros em centavos e profissionais existentes", () => {
    const ids = new Set(professionals.map((p) => p.id));
    for (const service of services) {
      expect(Number.isInteger(service.priceCents)).toBe(true);
      expect(service.durationMin % 5).toBe(0);
      expect(service.professionalIds.every((id) => ids.has(id))).toBe(true);
    }
  });

  it("formata e soma valores sem erro de arredondamento", () => {
    expect(formatBRL(7000)).toMatch(/^R\$\s70,00$/);
    expect(sumCents([10, 20])).toBe(30);
    expect(formatBRL(sumCents([1990, 1010]))).toMatch(/^R\$\s30,00$/);
    expect(() => formatBRL(10.5)).toThrow();
  });
});

describe("disponibilidade", () => {
  it("detecta sobreposição sem considerar horários encostados", () => {
    expect(overlaps(600, 640, 620, 660)).toBe(true);
    expect(overlaps(600, 640, 640, 680)).toBe(false);
  });

  it("não abre aos domingos e respeita o horário de sábado", () => {
    expect(getOpeningWindow("2026-10-04")).toBeNull();
    const saturday = listAvailableStarts({ date: "2026-10-03", service: corte, professionalId: "rafa", bookings: [], now });
    expect(Math.max(...saturday) + corte.durationMin).toBeLessThanOrEqual(16 * 60);
  });

  it("bloqueia horários passados e respeita a antecedência mínima", () => {
    const starts = listAvailableStarts({ date: WEDNESDAY, service: corte, professionalId: "rafa", bookings: [], now });
    expect(Math.min(...starts)).toBeGreaterThanOrEqual(now.minutes + business.minLeadMin);
    expect(listAvailableStarts({ date: addDays(WEDNESDAY, -1), service: corte, professionalId: "rafa", bookings: [], now })).toEqual([]);
  });

  it("não atravessa a pausa de almoço nem o fechamento", () => {
    const starts = listAvailableStarts({ date: addDays(WEDNESDAY, 1), service: combo, professionalId: "rafa", bookings: [], now });
    for (const start of starts) {
      expect(overlaps(start, start + combo.durationMin, business.lunch.startMin, business.lunch.endMin)).toBe(false);
      expect(start + combo.durationMin).toBeLessThanOrEqual(19 * 60);
      expect((start - 9 * 60) % business.slotStepMin).toBe(0);
    }
  });

  it("impede sobreposição para o mesmo profissional, mas não entre profissionais", () => {
    const bookings = [booking({})];
    const rafa = listAvailableStarts({ date: WEDNESDAY, service: corte, professionalId: "rafa", bookings, now });
    expect(rafa.some((s) => overlaps(s, s + 40, 14 * 60, 14 * 60 + 40))).toBe(false);
    const leo = listAvailableStarts({ date: WEDNESDAY, service: corte, professionalId: "leo", bookings, now });
    expect(leo).toContain(14 * 60);
  });

  it("libera o horário de um agendamento cancelado", () => {
    const bookings = [booking({ status: "cancelado" })];
    expect(listAvailableStarts({ date: WEDNESDAY, service: corte, professionalId: "rafa", bookings, now })).toContain(14 * 60);
  });

  it("não oferece profissional incompatível com o serviço", () => {
    expect(listAvailableStarts({ date: WEDNESDAY, service: getService("sobrancelha")!, professionalId: "rafa", bookings: [], now })).toEqual([]);
  });
});

describe("validação ao confirmar", () => {
  const base = { serviceId: "corte", professionalId: "rafa", date: WEDNESDAY, startMin: 15 * 60 };

  it("aceita um horário livre e futuro", () => {
    expect(validateNewBooking(base, [], now)).toBeNull();
  });

  it("rejeita combinações inválidas", () => {
    expect(validateNewBooking({ ...base, serviceId: "x" }, [], now)).toMatch(/Serviço/);
    expect(validateNewBooking({ ...base, serviceId: "sobrancelha" }, [], now)).toMatch(/profissional/);
    expect(validateNewBooking({ ...base, startMin: 9 * 60 }, [], now)).toMatch(/passou/);
    expect(validateNewBooking({ ...base, startMin: 12 * 60 }, [], now)).toMatch(/funcionamento/);
    expect(validateNewBooking({ ...base, startMin: 15 * 60 + 10 }, [], now)).toMatch(/funcionamento/);
    expect(validateNewBooking({ ...base, date: addDays(WEDNESDAY, 20) }, [], now)).toMatch(/fora/);
    expect(validateNewBooking(base, [booking({ startMin: 14 * 60 + 40, endMin: 15 * 60 + 20 })], now)).toMatch(/ocupado/);
  });
});

describe("agenda de exemplo", () => {
  const seed = generateSeedBookings(now);

  it("é relativa a hoje, cobre 7 dias e é determinística", () => {
    expect(seed.length).toBeGreaterThan(20);
    expect(seed.every((b) => b.date >= WEDNESDAY && b.date <= addDays(WEDNESDAY, 6))).toBe(true);
    expect(generateSeedBookings(now)).toEqual(seed);
  });

  it("respeita funcionamento, almoço, serviços compatíveis e não se sobrepõe", () => {
    for (const b of seed) {
      const service = getService(b.serviceId)!;
      expect(service.professionalIds).toContain(b.professionalId);
      expect(b.endMin - b.startMin).toBe(service.durationMin);
      expect(overlaps(b.startMin, b.endMin, business.lunch.startMin, business.lunch.endMin)).toBe(false);
      const clash = seed.some(
        (o) => o !== b && o.status !== "cancelado" && b.status !== "cancelado" && o.professionalId === b.professionalId && o.date === b.date && overlaps(b.startMin, b.endMin, o.startMin, o.endMin),
      );
      expect(clash).toBe(false);
    }
  });

  it("deixa, em todo dia futuro aberto, vaga para o serviço mais longo de cada profissional", () => {
    // Vários "hojes" diferentes, para não depender de uma data com sorte.
    for (let shift = 0; shift < 60; shift += 1) {
      const today = { date: addDays(WEDNESDAY, shift), minutes: 8 * 60 };
      const bookings = generateSeedBookings(today);
      for (let offset = 1; offset < 7; offset += 1) {
        const date = addDays(today.date, offset);
        if (!getOpeningWindow(date)) continue;
        for (const professional of professionals) {
          const longest = Math.max(...services.filter((s) => s.professionalIds.includes(professional.id)).map((s) => s.durationMin));
          expect(hasFreeWindow(date, professional.id, longest, bookings), `${date} ${professional.id}`).toBe(true);
        }
      }
    }
  });

  it("marca como concluídos apenas horários de hoje que já terminaram", () => {
    for (const b of seed.filter((item) => item.status === "concluido")) {
      expect(b.date).toBe(WEDNESDAY);
      expect(b.endMin).toBeLessThanOrEqual(now.minutes);
    }
  });
});
