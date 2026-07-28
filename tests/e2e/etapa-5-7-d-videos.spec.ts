import { mkdir } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const captureName = process.env.VIDEOS_CAPTURE_NAME;

test("reproduz Vídeos sem inventar conteúdo audiovisual", async ({ page }) => {
  await page.goto("/videos/");

  await expect(page.locator("#videos-abertura h1")).toHaveText("Vídeos");
  await expect(page.locator("#videos-abertura picture")).toHaveCount(1);
  await expect(page.locator(".videos-empty-feature")).toBeVisible();
  await expect(page.locator(".videos-empty-series")).toBeVisible();
  await expect(page.locator(".videos-empty-lower")).toBeVisible();
  await expect(page.locator(".videos-empty-closing")).toBeVisible();
  await expect(
    page.locator("iframe, .youtube-facade, .video-card, video"),
  ).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(0);

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBe(viewport.clientWidth);
});

test("registra a comparação visual de Vídeos", async ({ page }) => {
  test.skip(!captureName, "Captura executada apenas no fluxo visual.");
  test.setTimeout(120_000);

  const width = captureName?.endsWith("-390.png") ? 390 : 1440;
  const height = width === 390 ? 844 : 900;
  const directory = "tests/visual/artifacts/etapa-5-7-d/videos";

  await mkdir(directory, { recursive: true });
  await page.setViewportSize({ width, height });
  await page.goto("/videos/");
  await page.screenshot({
    path: `${directory}/${captureName}`,
    fullPage: true,
  });
});
