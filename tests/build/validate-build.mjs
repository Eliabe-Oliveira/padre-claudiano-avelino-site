import console from "node:console";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import process from "node:process";
import { URL } from "node:url";

const dist = resolve("dist");
const expectedRoot = new URL(
  process.env.EXPECTED_PUBLIC_ROOT ?? "http://localhost:4321/",
);
const basePath =
  expectedRoot.pathname === "/"
    ? "/"
    : expectedRoot.pathname.replace(/\/$/, "");
const htmlFiles = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (extname(path) === ".html") htmlFiles.push(path);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function localDestination(pathname) {
  let path = pathname;
  if (basePath !== "/") {
    assert(
      path === basePath || path.startsWith(`${basePath}/`),
      `Link escapou do base path: ${pathname}`,
    );
    path = path.slice(basePath.length) || "/";
  }
  const relativePath = path.replace(/^\/+/, "");
  if (path.endsWith("/")) return join(dist, relativePath, "index.html");
  return join(dist, relativePath);
}

walk(dist);
assert(
  htmlFiles.length === 6,
  `Esperados 6 HTMLs; encontrados ${htmlFiles.length}.`,
);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const route = relative(dist, file);
  const is404 = route === "404.html";
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

  if (is404) {
    assert(!canonical, "404 não pode ter canonical.");
    assert(html.includes('content="noindex, follow"'), "404 sem noindex.");
    assert(!html.includes('type="application/ld+json"'), "404 contém JSON-LD.");
  } else {
    assert(Boolean(canonical), `${route}: canonical ausente.`);
    assert(
      canonical.startsWith(expectedRoot.href),
      `${route}: canonical incorreto.`,
    );
  }

  assert(
    !html.includes("localhost") || expectedRoot.hostname === "localhost",
    `${route}: localhost no build público.`,
  );
  if (basePath !== "/") {
    assert(
      !html.includes(`${basePath}${basePath}`),
      `${route}: base path duplicado.`,
    );
  }
  assert(
    !/<script type="module">/.test(html),
    `${route}: script executável inline encontrado.`,
  );

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (
      value.startsWith("#") ||
      value.startsWith("mailto:") ||
      /^https?:\/\//.test(value) ||
      value.startsWith("data:")
    ) {
      continue;
    }
    const url = new URL(value, expectedRoot);
    assert(
      existsSync(localDestination(url.pathname)),
      `${route}: destino ausente ${value}`,
    );
    if (!url.pathname.endsWith("/") && !extname(url.pathname)) {
      throw new Error(`${route}: página sem trailing slash ${value}`);
    }
  }
}

const robots = readFileSync(join(dist, "robots.txt"), "utf8");
assert(
  robots.includes(`Sitemap: ${expectedRoot.href}sitemap-index.xml`),
  "robots aponta para sitemap incorreto.",
);
const sitemapIndex = readFileSync(join(dist, "sitemap-index.xml"), "utf8");
const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
assert(
  sitemapIndex.includes(`${expectedRoot.href}sitemap-0.xml`),
  "Índice do sitemap incorreto.",
);
for (const path of ["", "sobre/", "contato/", "reflexoes/", "videos/"]) {
  assert(
    sitemap.includes(`<loc>${expectedRoot.href}${path}</loc>`),
    `Sitemap sem ${path || "raiz"}.`,
  );
}
assert(!sitemap.includes("404"), "404 presente no sitemap.");
assert(
  !sitemap.includes("/reflexoes/fixture"),
  "Reflexão fictícia no sitemap.",
);
assert(existsSync(join(dist, "favicon.svg")), "Favicon ausente.");
assert(existsSync(join(dist, "_headers")), "_headers ausente.");

console.log(
  `Build validado: ${expectedRoot.href} (${htmlFiles.length} HTMLs, links internos íntegros).`,
);
