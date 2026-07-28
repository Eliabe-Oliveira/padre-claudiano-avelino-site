import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createStaticHeadersServer } from "../security/static-headers-server.mjs";

const servers: ReturnType<typeof createStaticHeadersServer>[] = [];
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0)
      .map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve())),
      ),
  );
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("servidor de cabeçalhos estáticos", () => {
  it("aplica segurança e cache sem tornar HTML imutável", async () => {
    const root = await mkdtemp(join(tmpdir(), "static-headers-test-"));
    temporaryDirectories.push(root);
    await mkdir(join(root, "_astro"));
    await writeFile(
      join(root, "index.html"),
      '<link rel="stylesheet" href="/_astro/site.css">',
    );
    await writeFile(join(root, "_astro/site.css"), "body { color: black; }");

    const server = createStaticHeadersServer({ root });
    servers.push(server);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Sem porta.");
    const origin = `http://127.0.0.1:${address.port}`;

    const page = await fetch(`${origin}/`);
    expect(page.status).toBe(200);
    expect(page.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
    expect(page.headers.get("x-frame-options")).toBe("DENY");
    expect(page.headers.get("cache-control")).toBeNull();

    const html = await page.text();
    const assetPath = html.match(/href="(\/_astro\/[^"]+\.css)"/)?.[1];
    expect(assetPath).toBeTruthy();
    const asset = await fetch(`${origin}${assetPath}`);
    expect(asset.status).toBe(200);
    expect(asset.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
  });

  it("impede traversal de caminho", async () => {
    const server = createStaticHeadersServer();
    servers.push(server);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Sem porta.");
    const response = await fetch(
      `http://127.0.0.1:${address.port}/%2e%2e/package.json`,
    );
    expect([403, 404]).toContain(response.status);
  });
});
