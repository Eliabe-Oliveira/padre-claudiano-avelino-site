import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const headers = readFileSync("public/_headers", "utf8");
const csp =
  headers.match(/Content-Security-Policy: (.+)/)?.[1] ??
  (() => {
    throw new Error("CSP ausente.");
  })();

describe("configuração de segurança", () => {
  it("mantém CSP restrita", () => {
    expect(csp).not.toContain("*");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp.match(/script-src ([^;]+)/)?.[1]).not.toContain(
      "'unsafe-inline'",
    );
    expect(csp).toContain("frame-src https://www.youtube-nocookie.com");
    expect(csp).not.toContain("frame-src https://www.youtube.com");
    expect(csp).toContain("img-src 'self' data: https://i.ytimg.com");
  });

  it("define cabeçalhos e cache somente para ativos", () => {
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("X-Frame-Options: DENY");
    expect(headers).toContain("Permissions-Policy:");
    expect(headers).toContain("/_astro/*");
    expect(headers).toContain(
      "Cache-Control: public, max-age=31536000, immutable",
    );
    expect(headers.match(/Cache-Control:/g)).toHaveLength(1);
  });
});
