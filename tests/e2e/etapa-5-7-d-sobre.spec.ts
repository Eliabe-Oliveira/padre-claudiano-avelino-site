import { mkdir } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const captureName = process.env.ABOUT_CAPTURE_NAME;

test("reproduz a estrutura editorial aprovada da página Sobre", async ({
  page,
}) => {
  await page.goto("/sobre/");

  await expect(page.locator("#sobre-abertura h1")).toHaveText("Sobre");
  await expect(page.locator(".about-opening__art picture")).toHaveCount(1);
  await expect(page.locator("#sobre-biografia picture")).toHaveCount(1);
  await expect(page.locator("#sobre-temas li")).toHaveCount(5);
  await expect(page.locator(".about-themes__closing")).toBeVisible();
  await expect(page.locator("main blockquote")).toHaveCount(0);
  await expect(page.locator("main svg")).toHaveCount(0);

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBe(viewport.clientWidth);
});

test("registra a comparação visual da página Sobre", async ({ page }) => {
  test.skip(!captureName, "Captura executada apenas no fluxo visual.");
  test.setTimeout(120_000);

  const width = captureName?.endsWith("-390.png") ? 390 : 1440;
  const height = width === 390 ? 844 : 900;
  const directory = "tests/visual/artifacts/etapa-5-7-d/sobre";

  await mkdir(directory, { recursive: true });
  await page.setViewportSize({ width, height });
  await page.goto("/sobre/");
  await page.locator(".about-biography__photo").scrollIntoViewIfNeeded();
  await expect(page.locator(".about-biography__photo")).toHaveJSProperty(
    "complete",
    true,
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `${directory}/${captureName}`,
    fullPage: true,
  });
});
