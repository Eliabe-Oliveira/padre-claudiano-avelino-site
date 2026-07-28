import { URL } from "node:url";

const GITHUB_PAGES_ROOT =
  "https://eliabe-oliveira.github.io/padre-claudiano-avelino-site/";
const LOCAL_ROOT = "http://localhost:4321/";

function parsePublicRoot(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL deve ser uma URL absoluta válida.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("SITE_URL deve usar o protocolo http: ou https:.");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "SITE_URL não deve conter credenciais, query string ou fragmento.",
    );
  }

  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url;
}

export function resolveDeploymentConfig(env = {}) {
  const fromSiteUrl =
    typeof env.SITE_URL === "string" && env.SITE_URL.trim()
      ? env.SITE_URL.trim()
      : undefined;
  const usesGitHubFallback =
    fromSiteUrl === undefined && env.GITHUB_PAGES === "true";
  const publicRoot = parsePublicRoot(
    fromSiteUrl ?? (usesGitHubFallback ? GITHUB_PAGES_ROOT : LOCAL_ROOT),
  );
  const basePath =
    publicRoot.pathname === "/" ? "/" : publicRoot.pathname.replace(/\/+$/, "");
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(
    publicRoot.hostname,
  );

  return {
    publicRootUrl: publicRoot.href,
    siteOrigin: publicRoot.origin,
    basePath,
    isGitHubPages: usesGitHubFallback,
    isLocal,
    isPublicProduction: !isLocal,
  };
}
