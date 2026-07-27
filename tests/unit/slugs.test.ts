import { describe, expect, it } from "vitest";
import { isValidSlug, normalizeSlugSuggestion } from "../../src/lib/slugs";

describe("slugs", () => {
  it("aceita o formato canônico", () => {
    expect(isValidSlug("fixture-reflexao-valida")).toBe(true);
  });

  it.each(["oração", "com espaço", "-inicio", "fim-", "hifen--duplicado"])(
    "rejeita o valor inválido %s",
    (value) => {
      expect(isValidSlug(value)).toBe(false);
    },
  );

  it("normaliza somente como sugestão", () => {
    expect(normalizeSlugSuggestion("  Oração, Escuta & Vida!  ")).toBe(
      "oracao-escuta-vida",
    );
  });
});
