import console from "node:console";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

export function parseHeadersFile(source) {
  const globalHeaders = {};
  const assetHeaders = {};
  let target = globalHeaders;
  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    if (!rawLine.startsWith(" ")) {
      target = rawLine.trim() === "/_astro/*" ? assetHeaders : globalHeaders;
      continue;
    }
    const separator = rawLine.indexOf(":");
    target[rawLine.slice(0, separator).trim()] = rawLine
      .slice(separator + 1)
      .trim();
  }
  return { globalHeaders, assetHeaders };
}

export function createStaticHeadersServer({
  root = resolve("dist"),
  headersFile = resolve("public/_headers"),
  basePath = "/",
} = {}) {
  const absoluteRoot = resolve(root);
  const normalizedBasePath =
    basePath === "/" ? "/" : `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  const { globalHeaders, assetHeaders } = parseHeadersFile(
    readFileSync(headersFile, "utf8"),
  );

  return createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://local").pathname,
      );
    } catch {
      response.writeHead(400).end("Bad Request");
      return;
    }

    if (
      normalizedBasePath !== "/" &&
      pathname !== normalizedBasePath &&
      !pathname.startsWith(`${normalizedBasePath}/`)
    ) {
      response.writeHead(404, globalHeaders).end("Not Found");
      return;
    }
    const publicPath =
      normalizedBasePath === "/"
        ? pathname
        : pathname.slice(normalizedBasePath.length) || "/";
    const candidate = resolve(
      absoluteRoot,
      `.${publicPath.endsWith("/") ? `${publicPath}index.html` : publicPath}`,
    );
    if (
      candidate !== absoluteRoot &&
      !candidate.startsWith(`${absoluteRoot}${sep}`)
    ) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    let file = candidate;
    if (existsSync(file) && statSync(file).isDirectory()) {
      file = resolve(file, "index.html");
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      response.writeHead(404, globalHeaders).end("Not Found");
      return;
    }

    const headers = {
      ...globalHeaders,
      ...(publicPath.startsWith("/_astro/") ? assetHeaders : {}),
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
    };
    response.writeHead(200, headers);
    createReadStream(file).pipe(response);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4323);
  const server = createStaticHeadersServer({
    basePath: process.env.BASE_PATH ?? "/",
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Servidor de cabeçalhos em http://127.0.0.1:${port}`);
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}
