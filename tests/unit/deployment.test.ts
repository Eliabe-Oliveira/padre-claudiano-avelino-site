import { describe, expect, it } from "vitest";
import { resolveDeploymentConfig } from "../../config/deployment.mjs";

describe("resolveDeploymentConfig", () => {
  it("aceita SITE_URL na raiz", () => {
    expect(
      resolveDeploymentConfig({ SITE_URL: "https://example.com/" }),
    ).toMatchObject({
      publicRootUrl: "https://example.com/",
      siteOrigin: "https://example.com",
      basePath: "/",
      isLocal: false,
      isPublicProduction: true,
    });
  });

  it("aceita e normaliza SITE_URL em subdiretório", () => {
    expect(
      resolveDeploymentConfig({ SITE_URL: "https://example.com/site" }),
    ).toMatchObject({
      publicRootUrl: "https://example.com/site/",
      basePath: "/site",
    });
  });

  it("rejeita URL e protocolo inválidos", () => {
    expect(() => resolveDeploymentConfig({ SITE_URL: "inválida" })).toThrow(
      /URL absoluta/,
    );
    expect(() =>
      resolveDeploymentConfig({ SITE_URL: "ftp://example.com/" }),
    ).toThrow(/http/);
  });

  it("dá precedência a SITE_URL", () => {
    expect(
      resolveDeploymentConfig({
        SITE_URL: "https://example.com/custom/",
        GITHUB_PAGES: "true",
      }),
    ).toMatchObject({
      publicRootUrl: "https://example.com/custom/",
      isGitHubPages: false,
    });
  });

  it("resolve o fallback do GitHub Pages", () => {
    expect(resolveDeploymentConfig({ GITHUB_PAGES: "true" })).toMatchObject({
      publicRootUrl:
        "https://eliabe-oliveira.github.io/padre-claudiano-avelino-site/",
      siteOrigin: "https://eliabe-oliveira.github.io",
      basePath: "/padre-claudiano-avelino-site",
      isGitHubPages: true,
    });
  });

  it("resolve o fallback local", () => {
    expect(resolveDeploymentConfig({})).toMatchObject({
      publicRootUrl: "http://localhost:4321/",
      basePath: "/",
      isLocal: true,
      isPublicProduction: false,
    });
  });
});
