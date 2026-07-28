import { expect, test } from "@playwright/test";

const artifactDirectory = "tests/visual/artifacts/etapa-5-4";

test("preserva fontes locais, navegação, skip link e tokens fundamentais", async ({
  page,
}) => {
  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".woff2")) fontRequests.push(request.url());
  });
  await page.goto("/");

  const skipLink = page.getByRole("link", { name: "Ir para o conteúdo" });
  await skipLink.focus();
  await expect(skipLink).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Início" }),
  ).toHaveAttribute("aria-current", "page");

  await page.evaluate(() => document.fonts.ready);
  expect(fontRequests.length).toBeGreaterThan(0);
  expect(
    fontRequests.every((url) =>
      ["127.0.0.1", "localhost"].includes(new URL(url).hostname),
    ),
  ).toBe(true);

  const styles = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    headingFont: getComputedStyle(document.querySelector("h1")!).fontFamily,
  }));
  expect(styles.background).toBe("rgb(245, 241, 232)");
  expect(styles.headingFont).toContain("Source Serif 4 Variable");
});

test("marca a rota atual e mantém o menu móvel nas três páginas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, name] of [
    ["/", "Início"],
    ["/sobre/", "Sobre"],
    ["/contato/", "Contato"],
  ] as const) {
    await page.goto(route);
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const mobile = page.getByRole("navigation", {
      name: "Navegação principal móvel",
    });
    await expect(mobile.getByRole("link", { name })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await toggle.click();
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
  }
});

test("gera capturas e elimina overflow nas larguras-alvo", async ({ page }) => {
  const captures = [
    ["/", 390, 844, "inicio-390.png"],
    ["/", 768, 1024, "inicio-768.png"],
    ["/", 1440, 900, "inicio-1440.png"],
    ["/sobre/", 390, 844, "sobre-390.png"],
    ["/sobre/", 1440, 900, "sobre-1440.png"],
    ["/contato/", 390, 844, "contato-390.png"],
    ["/contato/", 1440, 900, "contato-1440.png"],
  ] as const;

  for (const [route, width, height, file] of captures) {
    await page.setViewportSize({ width, height });
    await page.goto(route);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
    await page.screenshot({
      path: `${artifactDirectory}/${file}`,
      fullPage: true,
    });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sobre/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({
    path: `${artifactDirectory}/menu-movel-sobre-390.png`,
    fullPage: true,
  });
});

test("respeita a redução de movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .getByRole("link", { name: "Ler as reflexões" })
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");
});
