import { expect, test } from "@playwright/test";

const artifactDirectory = "tests/visual/artifacts/etapa-5-2";

test("expõe estrutura, navegação e estilos fundamentais", async ({ page }) => {
  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".woff2")) fontRequests.push(request.url());
  });

  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("h1")).toHaveCount(1);

  const skipLink = page.getByRole("link", { name: "Ir para o conteúdo" });
  await expect(skipLink).toHaveAttribute("href", "#conteudo-principal");
  await skipLink.focus();
  await expect(skipLink).toBeVisible();
  await expect
    .poll(async () => (await skipLink.boundingBox())?.y ?? -1)
    .toBeGreaterThanOrEqual(0);

  await expect(
    page.getByText("Padre Claudiano Avelino", { exact: true }).first(),
  ).toBeVisible();
  const desktopNavigation = page.getByRole("navigation", {
    name: "Navegação principal",
  });
  await expect(desktopNavigation.getByRole("link")).toHaveCount(5);
  await expect(
    desktopNavigation.getByRole("link", { name: "Início" }),
  ).toHaveAttribute("aria-current", "page");

  await page.evaluate(() => document.fonts.ready);
  expect(fontRequests.length).toBeGreaterThan(0);
  for (const url of fontRequests) {
    const hostname = new URL(url).hostname;
    expect(["127.0.0.1", "localhost"]).toContain(hostname);
  }

  const externalFontRequests = fontRequests.filter((url) =>
    /fonts\.googleapis\.com|fonts\.gstatic\.com|cdn/i.test(url),
  );
  expect(externalFontRequests).toEqual([]);

  const styles = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const heading = getComputedStyle(document.querySelector("h1")!);
    const navigation = getComputedStyle(
      document.querySelector('[aria-label="Navegação principal"]')!,
    );
    return {
      background: body.backgroundColor,
      color: body.color,
      headingFont: heading.fontFamily,
      navigationFont: navigation.fontFamily,
    };
  });

  expect(styles.background).toBe("rgb(245, 241, 232)");
  expect(styles.color).toBe("rgb(37, 40, 37)");
  expect(styles.headingFont).toContain("Source Serif 4 Variable");
  expect(styles.navigationFont).toContain("Inter Variable");
});

test("menu móvel abre, fecha e restaura o foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute(
    "aria-controls",
    "mobile-navigation-panel",
  );

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("navigation", { name: "Navegação principal móvel" }),
  ).toBeVisible();

  await page.screenshot({
    path: `${artifactDirectory}/menu-movel-aberto-390.png`,
    fullPage: true,
  });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("mantém dimensões de controle e elimina overflow nas larguras-alvo", async ({
  page,
}) => {
  const viewports = [
    { width: 390, height: 844, file: "sistema-visual-390.png" },
    { width: 768, height: 1024, file: "sistema-visual-768.png" },
    { width: 1440, height: 900, file: "sistema-visual-1440.png" },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);

    await page.screenshot({
      path: `${artifactDirectory}/${viewport.file}`,
      fullPage: true,
    });
  }

  const primaryButton = page.getByRole("link", { name: "Variação primária" });
  const buttonBox = await primaryButton.boundingBox();
  expect(buttonBox?.height).toBeGreaterThanOrEqual(48);
  expect(buttonBox?.width).toBeGreaterThanOrEqual(44);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuBox = await page
    .getByRole("button", { name: "Menu" })
    .boundingBox();
  expect(menuBox?.height).toBeGreaterThanOrEqual(44);
  expect(menuBox?.width).toBeGreaterThanOrEqual(44);
});

test("reduz transições quando o usuário prefere menos movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const transitionDuration = await page
    .getByRole("link", { name: "Variação primária" })
    .evaluate((element) => getComputedStyle(element).transitionDuration);

  expect(transitionDuration).toBe("0s");
});
