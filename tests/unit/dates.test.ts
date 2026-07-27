import { describe, expect, it } from "vitest";
import { formatPublicationDate, isFutureDate } from "../../src/lib/dates";

describe("datas editoriais", () => {
  const now = new Date("2026-07-24T12:00:00.000Z");

  it("formata em pt-BR usando UTC", () => {
    expect(formatPublicationDate(new Date("2026-07-24T23:30:00-03:00"))).toBe(
      "25 de julho de 2026",
    );
  });

  it("mantém o dia UTC estável", () => {
    expect(formatPublicationDate(new Date("2026-07-24T00:00:00.000Z"))).toBe(
      "24 de julho de 2026",
    );
  });

  it("detecta data futura", () => {
    expect(isFutureDate(new Date("2026-07-25T00:00:00.000Z"), now)).toBe(true);
  });

  it("não considera a data atual futura", () => {
    expect(isFutureDate(now, now)).toBe(false);
  });

  it("não considera data passada futura", () => {
    expect(isFutureDate(new Date("2026-07-23T00:00:00.000Z"), now)).toBe(false);
  });
});
