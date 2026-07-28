import { stat } from "node:fs/promises";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/sobre/",
  "/reflexoes/",
  "/videos/",
  "/contato/",
  "/404.html",
];

async function expectNoOverflow(page: Page) {
  const result = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((element) => element.getBoundingClientRect().right > innerWidth)
      .slice(0, 5)
      .map((element) => ({
        className: element.className,
        right: element.getBoundingClientRect().right,
        tag: element.tagName,
      })),
  }));
  expect(
    result,
    `Overflow em ${page.url()}: ${JSON.stringify(result)}`,
  ).toMatchObject({
    scrollWidth: result.clientWidth,
  });
}

async function expectNoAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
}

test("valida a reconstrução visual e editorial", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Padre Claudiano Avelino" }),
  ).toBeVisible();
  await expect(page.locator(".home-hero__portrait picture")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Ler as reflexões" }),
  ).toHaveAttribute("href", "/reflexoes/");
  await expect(
    page.getByRole("link", { name: "Assistir à Homilia de 1 minuto" }),
  ).toHaveAttribute("href", "/videos/");
  await expect(
    page.getByRole("heading", { name: "Palavra, reflexão e encontro" }),
  ).toBeVisible();
  await expect(page.locator("#inicio-temas li")).toHaveCount(5);
  await expect(page.getByText(/serão publicadas em breve/i)).toHaveCount(0);
  await expect(page.getByText(/serão reunidas em breve/i)).toHaveCount(0);

  await page.goto("/sobre/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#sobre-biografia picture")).toHaveCount(1);

  await page.goto("/videos/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#videos-abertura picture")).toHaveCount(1);
  await expect(page.locator("iframe, .video-card")).toHaveCount(0);

  await page.goto("/reflexoes/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".reflection-card")).toHaveCount(0);
  await expect(
    page.getByText("Novos textos a cada duas semanas."),
  ).toBeVisible();

  for (const route of ["/contato/", "/404.html"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main img")).toHaveCount(0);
  }
});

test("preserva acessibilidade, reflow e rodapé em todas as larguras", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const route of routes) {
      await page.goto(route);
      await expectNoOverflow(page);
      await expect(page.locator("h1")).toHaveCount(1);
      const footer = page.locator("footer");
      const footerBox = await footer.boundingBox();
      expect(footerBox).not.toBeNull();
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    await expectNoAxeViolations(page);
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .getByRole("link", { name: "Ler as reflexões" })
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");
});

test("confirma as capturas obrigatórias", async () => {
  const baselineFiles = [
    "inicio-390.png",
    "inicio-1440.png",
    "sobre-390.png",
    "sobre-1440.png",
    "reflexoes-390.png",
    "reflexoes-1440.png",
    "videos-390.png",
    "videos-1440.png",
    "contato-390.png",
    "contato-1440.png",
  ];
  const finalFiles = [
    "inicio-320.png",
    "inicio-390.png",
    "inicio-768.png",
    "inicio-1024.png",
    "inicio-1440.png",
    "inicio-1920.png",
    "sobre-320.png",
    "sobre-390.png",
    "sobre-768.png",
    "sobre-1024.png",
    "sobre-1440.png",
    "sobre-1920.png",
    "reflexoes-390.png",
    "reflexoes-1440.png",
    "videos-390.png",
    "videos-1440.png",
    "contato-390.png",
    "contato-1440.png",
    "404-390.png",
    "404-1440.png",
    "menu-aberto-390.png",
    "menu-sem-javascript-390.png",
  ];

  for (const filename of baselineFiles) {
    const file = await stat(
      `tests/visual/artifacts/etapa-5-7-b/baseline/${filename}`,
    );
    expect(file.isFile()).toBe(true);
    expect(file.size).toBeGreaterThan(1_000);
  }

  for (const filename of finalFiles) {
    const file = await stat(
      `tests/visual/artifacts/etapa-5-7-b/final/${filename}`,
    );
    expect(file.isFile()).toBe(true);
    expect(file.size).toBeGreaterThan(1_000);
  }
});
