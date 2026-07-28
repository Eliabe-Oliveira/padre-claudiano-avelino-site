import { describe, expect, it } from "vitest";
import {
  buildAbsoluteUrl,
  buildInternalUrl,
  isExternalUrl,
  normalizeBasePath,
  stripBasePath,
} from "../../src/lib/urls";

describe("helpers de URL", () => {
  it("normaliza raiz e subdiretório", () => {
    expect(normalizeBasePath("/")).toBe("/");
    expect(normalizeBasePath("site")).toBe("/site/");
    expect(normalizeBasePath("/site/")).toBe("/site/");
  });

  it("constrói páginas com raiz, base e trailing slash", () => {
    expect(buildInternalUrl("/", "/site")).toBe("/site/");
    expect(buildInternalUrl("/sobre", "/site")).toBe("/site/sobre/");
    expect(buildInternalUrl("/site/sobre/", "/site")).toBe("/site/sobre/");
  });

  it("preserva query e fragmento", () => {
    expect(buildInternalUrl("/sobre?origem=menu#bio", "/site")).toBe(
      "/site/sobre/?origem=menu#bio",
    );
  });

  it("preserva URL externa, mailto e fragmento isolado", () => {
    expect(buildInternalUrl("https://example.com/a", "/site")).toBe(
      "https://example.com/a",
    );
    expect(buildInternalUrl("mailto:test@example.com", "/site")).toBe(
      "mailto:test@example.com",
    );
    expect(buildInternalUrl("#conteudo", "/site")).toBe("#conteudo");
    expect(isExternalUrl("https://example.com")).toBe(true);
  });

  it("remove base path para comparação de currentPath", () => {
    expect(stripBasePath("/site/sobre/", "/site")).toBe("/sobre/");
    expect(stripBasePath("/sobre/", "/site")).toBe("/sobre/");
  });

  it("constrói URL absoluta e rejeita esquema não web", () => {
    expect(buildAbsoluteUrl("/site/sobre/", "https://example.com/")).toBe(
      "https://example.com/site/sobre/",
    );
    expect(() =>
      buildAbsoluteUrl("mailto:test@example.com", "https://example.com/"),
    ).toThrow(/http/);
  });
});
