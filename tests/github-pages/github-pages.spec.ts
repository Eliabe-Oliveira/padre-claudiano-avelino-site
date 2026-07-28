import { expect, test } from "@playwright/test";

const basePath = "/padre-claudiano-avelino-site";
const routes = [
  "/",
  "/sobre/",
  "/contato/",
  "/reflexoes/",
  "/videos/",
  "/404.html",
] as const;

test("páginas, navegação e ativos funcionam no subdiretório", async ({
  page,
  request,
}) => {
  for (const route of routes) {
    const response = await page.goto(`${basePath}${route}`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("href")),
      );
    expect(
      links.every(
        (href) => href?.startsWith(`${basePath}/`) || href?.startsWith("#"),
      ),
    ).toBe(true);
    expect(links.some((href) => href?.includes(`${basePath}${basePath}`))).toBe(
      false,
    );
  }

  await page.goto(`${basePath}/sobre/`);
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Sobre" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator("main img")).toHaveCount(1);
  expect((await request.get(`${basePath}/favicon.svg`)).ok()).toBe(true);
});

test("SEO público respeita o endereço do GitHub Pages", async ({ page }) => {
  await page.goto(`${basePath}/`);
  const publicRoot =
    "https://eliabe-oliveira.github.io/padre-claudiano-avelino-site/";
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    publicRoot,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    publicRoot,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    new RegExp(
      "^https://eliabe-oliveira\\.github\\.io/padre-claudiano-avelino-site/_astro/",
    ),
  );
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    `${basePath}/favicon.svg`,
  );
});
