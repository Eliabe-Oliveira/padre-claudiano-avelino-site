import { describe, expect, it } from "vitest";
import {
  buildMailto,
  isValidContactEmail,
  normalizeContactEmail,
  resolveContactEmail,
} from "../../src/lib/contact";

describe("contato por e-mail", () => {
  it("aceita e normaliza um endereço válido", () => {
    expect(resolveContactEmail("  teste@example.com  ")).toBe(
      "teste@example.com",
    );
  });

  it("trata e-mail ausente como ausência", () => {
    expect(normalizeContactEmail(undefined)).toBeUndefined();
    expect(resolveContactEmail(undefined)).toBeUndefined();
  });

  it("trata e-mail vazio como ausência", () => {
    expect(normalizeContactEmail("   ")).toBeUndefined();
    expect(resolveContactEmail("   ")).toBeUndefined();
  });

  it.each([
    "teste @example.com",
    "teste@",
    "@example.com",
    "teste@@example.com",
  ])("rejeita o endereço inválido %s", (email) => {
    expect(isValidContactEmail(email)).toBe(false);
    expect(() => resolveContactEmail(email)).toThrow(/CONTACT_EMAIL/);
  });

  it("constrói mailto sem corpo padrão", () => {
    expect(buildMailto("teste@example.com", "Contato pelo site")).toBe(
      "mailto:teste@example.com?subject=Contato%20pelo%20site",
    );
  });

  it("codifica corretamente o assunto", () => {
    const mailto = buildMailto(
      "teste@example.com",
      "Contato pelo site Padre Claudiano Avelino",
    );
    expect(mailto).toContain(
      "subject=Contato%20pelo%20site%20Padre%20Claudiano%20Avelino",
    );
    expect(mailto).not.toContain("body=");
  });
});
