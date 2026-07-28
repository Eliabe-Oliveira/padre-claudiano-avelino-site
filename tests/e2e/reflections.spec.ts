import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const artifactDirectory = "tests/visual/artifacts/etapa-5-5";

async function expectNoBlockingAxeViolations(
  page: import("@playwright/test").Page,
) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.filter(
      ({ impact }) => impact === "critical" || impact === "serious",
    ),
  ).toEqual([]);
}

test("Reflexões apresenta acervo vazio e ordem editorial aprovada", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (!["127.0.0.1", "localhost"].includes(hostname)) {
      externalRequests.push(request.url());
    }
  });

  expect((await page.goto("/reflexoes/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Reflexões | Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map(({ id }) => id)),
  ).toEqual(["reflexoes-abertura", "reflexoes-proposta"]);
  await expect(
    page.getByText("Novos textos a cada duas semanas."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Conhecer a trajetória" }),
  ).toBeVisible();
  await expect(page.locator("#reflexoes-proposta li")).toHaveCount(5);
  await expect(page.locator(".reflection-card")).toHaveCount(0);
  await expect(page.locator(".reflection-sacred-art img")).toHaveCount(1);
  await expect(page.locator(".reflection-sacred-art img")).toHaveAttribute(
    "alt",
    "",
  );
  await expect(page.locator("iframe, form")).toHaveCount(0);
  await expect(
    page.getByText(/Fixture|coleção vazia|schema|erro/i),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Reflexões" }),
  ).toHaveAttribute("aria-current", "page");
  expect(externalRequests).toEqual([]);
});

test("slug inexistente usa a página 404 e nenhum detalhe fictício é gerado", async ({
  page,
}) => {
  const response = await page.goto("/reflexoes/reflexao-inexistente/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Página não encontrada" }),
  ).toBeVisible();
});

test("404 apresenta conteúdo e ações aprovados", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page).toHaveTitle(
    "Página não encontrada | Padre Claudiano Avelino",
  );
  await expect(
    page.getByText(
      "O conteúdo que você procura não está disponível ou pode ter mudado de endereço.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voltar ao início" }),
  ).toBeVisible();
  await expect(page.locator("img, form")).toHaveCount(0);
  await expect(page.getByText(/stack|node_modules|src\//i)).toHaveCount(0);
});

test("menu móvel funciona em Reflexões", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/reflexoes/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("axe aprova Reflexões, 404 e menu aberto", async ({ page }) => {
  for (const route of ["/reflexoes/", "/404.html"]) {
    await page.goto(route);
    await expectNoBlockingAxeViolations(page);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/reflexoes/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expectNoBlockingAxeViolations(page);
});

test("gera capturas sem overflow", async ({ page }) => {
  const captures = [
    ["/reflexoes/", 390, 844, "reflexoes-390.png"],
    ["/reflexoes/", 768, 1024, "reflexoes-768.png"],
    ["/reflexoes/", 1440, 900, "reflexoes-1440.png"],
    ["/404.html", 390, 844, "404-390.png"],
    ["/404.html", 1440, 900, "404-1440.png"],
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
  await page.goto("/reflexoes/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({
    path: `${artifactDirectory}/menu-reflexoes-390.png`,
    fullPage: true,
  });
});
