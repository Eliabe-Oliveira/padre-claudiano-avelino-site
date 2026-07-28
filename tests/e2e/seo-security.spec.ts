import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  {
    path: "/",
    type: "website",
    structuredType: "WebSite",
  },
  {
    path: "/sobre/",
    type: "profile",
    structuredType: "ProfilePage",
  },
  {
    path: "/contato/",
    type: "website",
    structuredType: "ContactPage",
  },
  {
    path: "/reflexoes/",
    type: "website",
    structuredType: "CollectionPage",
  },
  {
    path: "/videos/",
    type: "website",
    structuredType: "CollectionPage",
  },
] as const;

test("metadados públicos são únicos, absolutos e completos", async ({
  page,
  request,
}) => {
  for (const item of pages) {
    await page.goto(item.path);
    await expect(page.locator("title")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(
      1,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      item.type,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "pt_BR",
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Padre Claudiano Avelino",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#F5F1E8",
    );
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);

    for (const selector of [
      'link[rel="canonical"]',
      'meta[property="og:url"]',
      'meta[property="og:image"]',
    ]) {
      const attribute = selector.startsWith("link") ? "href" : "content";
      const value = await page.locator(selector).getAttribute(attribute);
      expect(value).toMatch(/^https?:\/\//);
    }

    const socialImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect((await request.get(socialImage!)).ok()).toBe(true);
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      /Padre Claudiano/,
    );
    await expect(
      page.locator('meta[property="og:image:width"]'),
    ).toHaveAttribute("content", /^\d+$/);
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute("content", /^\d+$/);
  }
});

test("JSON-LD usa tipos e campos aprovados", async ({ page }) => {
  for (const item of pages) {
    await page.goto(item.path);
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);
    const source = await scripts.textContent();
    expect(source).not.toContain("</script>");
    const data = JSON.parse(source!);
    const serialized = JSON.stringify(data);
    expect(serialized).toContain(`"${item.structuredType}"`);
    expect(serialized).toMatch(/https?:\/\//);
    for (const forbidden of [
      "sameAs",
      "telephone",
      "address",
      "birthDate",
      "publisher",
      "worksFor",
    ]) {
      expect(serialized).not.toContain(`"${forbidden}"`);
    }
  }
});

test("404 mantém status, noindex e ausência de canonical e JSON-LD", async ({
  page,
}) => {
  const response = await page.goto("/pagina-inexistente/");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    /^https?:\/\//,
  );
});

test("robots, sitemap, favicon e axe permanecem válidos", async ({
  page,
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(robots.headers()["content-type"]).toContain(
    "text/plain; charset=utf-8",
  );
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("User-agent: *");
  expect(robotsBody).toContain("Allow: /");
  expect(robotsBody).toMatch(/Sitemap: https?:\/\/.+sitemap-index\.xml/);
  expect((await request.get("/favicon.svg")).ok()).toBe(true);

  for (const route of [...pages.map(({ path }) => path), "/404.html"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.filter(({ impact }) =>
        ["critical", "serious"].includes(impact ?? ""),
      ),
    ).toEqual([]);
  }
});
