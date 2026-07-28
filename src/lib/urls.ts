const EXTERNAL_SCHEME = /^[a-z][a-z\d+.-]*:/i;

export function normalizeBasePath(basePath = "/"): string {
  const pathname = `/${basePath.trim().replace(/^\/+|\/+$/g, "")}`;
  return pathname === "/" ? "/" : `${pathname}/`;
}

export function isExternalUrl(value: string): boolean {
  return value.startsWith("//") || EXTERNAL_SCHEME.test(value);
}

function splitSuffix(value: string): [string, string] {
  const index = value.search(/[?#]/);
  return index === -1
    ? [value, ""]
    : [value.slice(0, index), value.slice(index)];
}

function isPagePath(pathname: string): boolean {
  const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return pathname === "/" || !lastSegment.includes(".");
}

export function stripBasePath(
  pathname: string,
  basePath = import.meta.env.BASE_URL,
): string {
  const normalizedBase = normalizeBasePath(basePath);
  const [path, suffix] = splitSuffix(pathname);
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;

  if (normalizedBase === "/") return `${normalizedPath}${suffix}`;
  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);
  if (normalizedPath === baseWithoutTrailingSlash) return `/${suffix}`;
  if (normalizedPath.startsWith(normalizedBase)) {
    return `/${normalizedPath.slice(normalizedBase.length)}${suffix}`;
  }
  return `${normalizedPath}${suffix}`;
}

export function buildInternalUrl(
  value: string,
  basePath = import.meta.env.BASE_URL,
): string {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("?") ||
    isExternalUrl(value)
  ) {
    return value;
  }

  const normalizedBase = normalizeBasePath(basePath);
  const [rawPath, suffix] = splitSuffix(value);
  let pathname = stripBasePath(rawPath || "/", normalizedBase);
  if (isPagePath(pathname) && !pathname.endsWith("/")) pathname += "/";
  const relativePath = pathname.replace(/^\/+/, "");
  return `${normalizedBase}${relativePath}${suffix}`.replace(/\/{2,}/g, "/");
}

export function buildAbsoluteUrl(path: string, siteUrl: string | URL): string {
  if (isExternalUrl(path)) {
    const url = new URL(path);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("A URL absoluta deve usar http: ou https:.");
    }
    return url.href;
  }
  return new URL(path, siteUrl).href;
}
