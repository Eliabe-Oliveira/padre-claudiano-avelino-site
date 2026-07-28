import { once } from "node:events";
import { afterEach, describe, expect, it } from "vitest";
import { createStaticHeadersServer } from "../security/static-headers-server.mjs";

const servers: ReturnType<typeof createStaticHeadersServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0)
      .map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve())),
      ),
  );
});

describe("servidor de cabeçalhos estáticos", () => {
  it("aplica segurança e cache sem tornar HTML imutável", async () => {
    const server = createStaticHeadersServer();
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
