import { mkdir } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const captureName = process.env.REFLECTIONS_CAPTURE_NAME;

test("reproduz Reflexões sem inventar publicações", async ({ page }) => {
  await page.goto("/reflexoes/");

  await expect(page.locator("#reflexoes-abertura h1")).toHaveText("Reflexões");
  await expect(page.locator(".reflection-sacred-art picture")).toHaveCount(1);
  await expect(page.locator(".reflection-card")).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(0);
  await expect(page.locator("#reflexoes-proposta li")).toHaveCount(5);
  await expect(
    page.getByText("Novos textos a cada duas semanas."),
  ).toBeVisible();
  await expect(page.locator(".reflections-contemplative")).toBeVisible();

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBe(viewport.clientWidth);
});

test("registra a comparação visual de Reflexões", async ({ page }) => {
  test.skip(!captureName, "Captura executada apenas no fluxo visual.");
  test.setTimeout(120_000);

  const width = captureName?.endsWith("-390.png") ? 390 : 1440;
  const height = width === 390 ? 844 : 900;
  const directory = "tests/visual/artifacts/etapa-5-7-d/reflexoes";

  await mkdir(directory, { recursive: true });
  await page.setViewportSize({ width, height });
  await page.goto("/reflexoes/");
  await page.screenshot({
    path: `${directory}/${captureName}`,
    fullPage: true,
  });
});
