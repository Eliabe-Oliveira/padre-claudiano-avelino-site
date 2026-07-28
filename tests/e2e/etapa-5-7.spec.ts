import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/sobre/",
  "/contato/",
  "/reflexoes/",
  "/videos/",
  "/404.html",
];
const artifacts = "tests/visual/artifacts/etapa-5-7";

async function expectNoAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
}

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
}

test("imagens locais têm fontes responsivas, dimensões e carregamento coerente", async ({
  page,
}) => {
  await page.goto("/");
  const hands = page.locator("[data-sacred-encounter] picture");
  await expect(hands).toHaveCount(2);
  await expect(hands.first().locator("source")).toHaveCount(2);
  await expect(hands.first().locator("img")).toHaveAttribute("alt", "");
  await expect(hands.first().locator("img")).toHaveAttribute("width", /\d+/);
  await expect(hands.first().locator("img")).toHaveAttribute("height", /\d+/);
  await expect(hands.first().locator("img")).toHaveAttribute(
    "loading",
    "eager",
  );
  const handsSrc = await hands.first().locator("img").getAttribute("src");
  expect(handsSrc).toMatch(/^\/(?:_image\?|.*\.(?:png|webp|avif))/);

  await page.goto("/sobre/");
  const about = page.locator("#sobre-biografia picture");
  await expect(about).toHaveCount(1);
  await expect(about.locator("source")).toHaveCount(2);
  await expect(about.locator("img")).toHaveAttribute("alt", /Padre Claudiano/);
  await expect(about.locator("img")).toHaveAttribute("loading", "lazy");
  const aboutSrc = await about.locator("img").getAttribute("src");
  expect(aboutSrc).toMatch(/^\/(?:_image\?|.*\.(?:jpeg|jpg|webp|avif))/);
  expect(aboutSrc).not.toBe(handsSrc);

  await page.goto("/videos/");
  const celebration = page.locator("#videos-abertura picture");
  await expect(celebration).toHaveCount(1);
  await expect(celebration.locator("source")).toHaveCount(2);
  await expect(celebration.locator("img")).toHaveAttribute(
    "alt",
    "Padre Claudiano Avelino durante uma celebração.",
  );
  await expect(celebration.locator("img")).toHaveAttribute("loading", "lazy");

  for (const route of ["/contato/", "/404.html"]) {
    await page.goto(route);
    await expect(page.locator("main picture, main img")).toHaveCount(0);
  }

  await page.goto("/reflexoes/");
  await expect(page.locator(".reflection-sacred-art picture")).toHaveCount(1);
  await expect(page.locator(".reflection-sacred-art img")).toHaveAttribute(
    "alt",
    "",
  );
});

test("as seis rotas funcionam em 390 px sem JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    await expectNoOverflow(page);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Navegação principal móvel" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal móvel" })
      .getByRole("link"),
  ).toHaveCount(5);
  await page.screenshot({
    path: `${artifacts}/menu-sem-javascript-390.png`,
    fullPage: true,
  });
  await context.close();
});

test("menu mantém teclado, Escape, foco e captura com JavaScript", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Navegação principal móvel" }),
  ).toBeVisible();
  await page.screenshot({
    path: `${artifacts}/menu-com-javascript-390.png`,
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  const skip = page.getByRole("link", { name: "Ir para o conteúdo" });
  await skip.focus();
  await skip.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("reflow e capturas obrigatórias permanecem sem overflow", async ({
  page,
}) => {
  const captures = [
    ["/", 320, 800, "inicio-foto-320.png"],
    ["/", 390, 844, "inicio-foto-390.png"],
    ["/", 768, 1024, "inicio-foto-768.png"],
    ["/", 1440, 900, "inicio-foto-1440.png"],
    ["/", 1920, 1080, "inicio-foto-1920.png"],
    ["/sobre/", 320, 800, "sobre-foto-320.png"],
    ["/sobre/", 390, 844, "sobre-foto-390.png"],
    ["/sobre/", 768, 1024, "sobre-foto-768.png"],
    ["/sobre/", 1440, 900, "sobre-foto-1440.png"],
    ["/sobre/", 1920, 1080, "sobre-foto-1920.png"],
    ["/contato/", 320, 800, "contato-320.png"],
    ["/reflexoes/", 320, 800, "reflexoes-320.png"],
    ["/videos/", 320, 800, "videos-320.png"],
    ["/404.html", 320, 800, "404-320.png"],
  ] as const;
  for (const [route, width, height, filename] of captures) {
    await page.setViewportSize({ width, height });
    await page.goto(route);
    await expectNoOverflow(page);
    await page.screenshot({ path: `${artifacts}/${filename}`, fullPage: true });
  }
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expectNoOverflow(page);
    }
  }
});

test("axe aprova rotas, menus, 320 px e movimento reduzido", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route);
    await expectNoAxeViolations(page);
  }
  for (const route of ["/", "/sobre/"]) {
    await page.goto(route);
    await page.getByRole("button", { name: "Menu" }).click();
    await expectNoAxeViolations(page);
  }
});

test("nenhuma rota atual solicita recursos externos", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (!["127.0.0.1", "localhost"].includes(hostname))
      external.push(request.url());
  });
  for (const route of routes) await page.goto(route);
  expect(external).toEqual([]);
});

test("ampliação equivalente a 200% não perde conteúdo", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expect(page.locator("main")).toBeVisible();
    await expectNoOverflow(page);
  }
});
