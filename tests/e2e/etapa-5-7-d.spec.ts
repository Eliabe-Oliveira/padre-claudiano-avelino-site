import { mkdir, readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const routes = ["/", "/sobre/", "/reflexoes/", "/videos/", "/contato/"];

test("aplica o sistema compartilhado da Etapa 5.7-D", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);

    const header = page.locator(".site-header");
    const footer = page.locator(".site-footer");
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(header.locator(".site-header__name strong")).toHaveText(
      "Claudiano Avelino",
    );
    await expect(footer.locator(".ornamental-divider")).toHaveCount(1);

    const surfaces = await page.evaluate(() => {
      const header = getComputedStyle(
        document.querySelector<HTMLElement>(".site-header")!,
      );
      const footer = getComputedStyle(
        document.querySelector<HTMLElement>(".site-footer")!,
      );
      return {
        headerBackground: header.backgroundImage,
        headerColor: header.backgroundColor,
        footerBackground: footer.backgroundImage,
        footerShadow: footer.boxShadow,
      };
    });

    expect(surfaces.headerBackground).toContain("painted-green");
    expect(surfaces.headerColor).toBe("rgb(6, 26, 19)");
    expect(surfaces.footerBackground).toContain("painted-green");
    expect(surfaces.footerShadow).toBe("none");
  }
});

test("preserva navegação progressiva e alvos móveis", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/sobre/");

  const toggle = page.getByRole("button", { name: "Menu" });
  const box = await toggle.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal móvel" })
      .getByRole("link", { name: "Sobre" }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();

  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const noScriptPage = await context.newPage();
  await noScriptPage.goto("/sobre/");
  await noScriptPage.getByRole("button", { name: "Menu" }).click();
  await expect(
    noScriptPage.getByRole("navigation", {
      name: "Navegação principal móvel",
    }),
  ).toBeVisible();
  await context.close();
});

test("mantém texturas locais e nenhum dado fictício da arte", async ({
  page,
}) => {
  const greenTexture = await readFile(
    "src/assets/art/renaissance/painted-green.svg",
    "utf8",
  );
  const ivoryTexture = await readFile(
    "src/assets/art/renaissance/aged-ivory.svg",
    "utf8",
  );
  expect(greenTexture).toContain("feTurbulence");
  expect(ivoryTexture).toContain("feTurbulence");

  await page.goto("/contato/");
  await expect(page.getByText("Segunda a sexta")).toHaveCount(0);
  await expect(page.getByText("48 horas úteis")).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator(".site-footer")).not.toContainText("©");
});

test("audita reflow e registra as superfícies compartilhadas", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const directory = "tests/visual/artifacts/etapa-5-7-d/fase-1";
  await mkdir(directory, { recursive: true });

  for (const [route, slug] of [
    ["/", "inicio"],
    ["/sobre/", "sobre"],
    ["/reflexoes/", "reflexoes"],
    ["/videos/", "videos"],
    ["/contato/", "contato"],
  ] as const) {
    for (const [width, height] of [
      [320, 800],
      [390, 844],
      [768, 1024],
      [1024, 768],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.goto(route);
      await page.addStyleTag({
        content: ".site-header { position: relative !important; }",
      });
      const viewport = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(viewport.scrollWidth).toBe(viewport.clientWidth);

      if (width === 320 || width === 1440) {
        await page.screenshot({
          path: `${directory}/${slug}-${width}.png`,
          fullPage: true,
        });
      }
    }
  }
});
