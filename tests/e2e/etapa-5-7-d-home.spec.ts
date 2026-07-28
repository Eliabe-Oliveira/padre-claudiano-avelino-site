import { mkdir } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const captureName = process.env.HOME_CAPTURE_NAME;
const directory = "tests/visual/artifacts/etapa-5-7-d/home";

test("reproduz a composição aprovada da Home", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".home-reference-stage")).toHaveCount(1);
  await expect(page.locator("[data-sacred-encounter] picture")).toHaveCount(2);
  await expect(page.locator("#inicio-palavra-encontro article")).toHaveCount(2);
  await expect(page.locator("#inicio-temas li")).toHaveCount(5);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".reflection-card, .video-card")).toHaveCount(0);

  const animations = await page
    .locator(".sacred-encounter__image")
    .evaluateAll((images) =>
      images.map((image) => {
        const style = getComputedStyle(image);
        return {
          duration: Number.parseFloat(style.animationDuration),
          iteration: style.animationIterationCount,
        };
      }),
    );
  expect(animations).toHaveLength(2);
  for (const animation of animations) {
    expect(animation.duration).toBeGreaterThanOrEqual(8);
    expect(animation.duration).toBeLessThanOrEqual(12);
    expect(animation.iteration).toBe("infinite");
  }
});

test("mantém as mãos estáticas com movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const image of await page.locator(".sacred-encounter__image").all()) {
    await expect(image).toHaveCSS("animation-name", "none");
  }
});

test("gera a captura solicitada da rodada", async ({ page }) => {
  test.skip(!captureName, "Captura executada somente nas rodadas visuais.");
  await mkdir(directory, { recursive: true });
  const mobile = captureName?.endsWith("-390.png");
  await page.setViewportSize(
    mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  );
  await page.goto("/");
  await page.addStyleTag({
    content:
      ".site-header { position: relative !important; } .skip-link { display: none !important; }",
  });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
  await page.screenshot({
    path: `${directory}/${captureName}`,
    fullPage: true,
  });
});
