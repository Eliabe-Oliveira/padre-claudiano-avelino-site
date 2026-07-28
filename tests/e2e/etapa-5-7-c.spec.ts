import { mkdir, stat } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const requestedStage = process.env.CAPTURE_STAGE;
const stage =
  requestedStage === "final" || requestedStage === "baseline"
    ? requestedStage
    : undefined;
const directory = `tests/visual/artifacts/etapa-5-7-c/${stage}`;

const baselineCaptures = [
  ["/", 390, 844, "inicio-390.png"],
  ["/", 1440, 900, "inicio-1440.png"],
  ["/sobre/", 390, 844, "sobre-390.png"],
  ["/sobre/", 1440, 900, "sobre-1440.png"],
  ["/reflexoes/", 390, 844, "reflexoes-390.png"],
  ["/reflexoes/", 1440, 900, "reflexoes-1440.png"],
  ["/videos/", 390, 844, "videos-390.png"],
  ["/videos/", 1440, 900, "videos-1440.png"],
] as const;

const finalCaptures = [
  ["/", 320, 800, "inicio-320.png"],
  ["/", 390, 844, "inicio-390.png"],
  ["/", 768, 1024, "inicio-768.png"],
  ["/", 1440, 900, "inicio-1440.png"],
  ["/sobre/", 390, 844, "sobre-390.png"],
  ["/sobre/", 1440, 900, "sobre-1440.png"],
  ["/reflexoes/", 390, 844, "reflexoes-390.png"],
  ["/reflexoes/", 1440, 900, "reflexoes-1440.png"],
  ["/videos/", 390, 844, "videos-390.png"],
  ["/videos/", 1440, 900, "videos-1440.png"],
  ["/contato/", 390, 844, "contato-390.png"],
  ["/contato/", 1440, 900, "contato-1440.png"],
  ["/404.html", 390, 844, "404-390.png"],
  ["/404.html", 1440, 900, "404-1440.png"],
] as const;

test("preserva a reorientação católica renascentista", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-sacred-encounter]")).toHaveCount(0);
  await expect(page.locator("#inicio-abertura img")).toHaveCount(0);
  await expect(page.locator(".home-hero__portrait picture")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);

  const animation = await page
    .locator("#inicio-abertura")
    .first()
    .evaluate((element) => {
      const style = getComputedStyle(element, "::before");
      return {
        backgroundImage: style.backgroundImage,
        duration: style.animationDuration,
        iterationCount: style.animationIterationCount,
        name: style.animationName,
      };
    });
  expect(animation).toEqual({
    backgroundImage: expect.stringContaining("michelangelo-creation-adam-hero"),
    duration: "18s",
    iterationCount: "infinite",
    name: "sacred-fresco-breath",
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedAnimation = await page
    .locator("#inicio-abertura")
    .first()
    .evaluate((element) => getComputedStyle(element, "::before").animationName);
  expect(reducedAnimation).toBe("none");

  await page.goto("/sobre/");
  await expect(page.locator(".about-sacred-study picture")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);

  await page.goto("/reflexoes/");
  await expect(page.locator(".reflection-sacred-art picture")).toHaveCount(1);
  await expect(page.locator(".reflection-card")).toHaveCount(0);

  await page.goto("/videos/");
  await expect(page.locator("iframe, .video-card")).toHaveCount(0);
});

test("mantém o reflow da composição simbólica", async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("mantém as evidências visuais da Etapa 5.7-C", async ({
  page,
  browser,
}) => {
  if (!stage) {
    for (const filename of baselineCaptures.map((capture) => capture[3])) {
      expect(
        (await stat(`tests/visual/artifacts/etapa-5-7-c/baseline/${filename}`))
          .size,
      ).toBeGreaterThan(1_000);
    }
    for (const filename of [
      ...finalCaptures.map((capture) => capture[3]),
      "menu-390.png",
      "menu-sem-javascript-390.png",
    ]) {
      expect(
        (await stat(`tests/visual/artifacts/etapa-5-7-c/final/${filename}`))
          .size,
      ).toBeGreaterThan(1_000);
    }
    return;
  }

  test.setTimeout(180_000);
  await mkdir(directory, { recursive: true });
  const captures = stage === "final" ? finalCaptures : baselineCaptures;

  for (const [route, width, height, filename] of captures) {
    await page.setViewportSize({ width, height });
    await page.goto(route);
    await page.addStyleTag({
      content:
        ".site-header { position: relative !important; } .skip-link { display: none !important; }",
    });
    await page.evaluate(async () => {
      const images = [
        ...document.querySelectorAll<HTMLImageElement>("main img"),
      ];
      for (const image of images) {
        image.scrollIntoView({ block: "center" });
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });
        }
      }
      window.scrollTo(0, 0);
    });
    await expect(page.locator("h1")).toHaveCount(1);
    await page.screenshot({ path: `${directory}/${filename}`, fullPage: true });
  }

  if (stage === "baseline") return;

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({
    content: ".site-header { position: relative !important; }",
  });
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({
    path: `${directory}/menu-390.png`,
    fullPage: true,
  });

  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScriptPage = await context.newPage();
  await noScriptPage.goto("/");
  await noScriptPage.getByRole("button", { name: "Menu" }).click();
  await noScriptPage.screenshot({
    path: `${directory}/menu-sem-javascript-390.png`,
    fullPage: true,
  });
  await context.close();
});
