import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const artifactDirectory = "tests/visual/artifacts/etapa-5-6";

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

test("Vídeos apresenta o estado vazio e a ordem editorial aprovada", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (!["127.0.0.1", "localhost"].includes(hostname)) {
      externalRequests.push(request.url());
    }
  });
  expect((await page.goto("/videos/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Vídeos | Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map(({ id }) => id)),
  ).toEqual(["videos-abertura", "videos-listagem", "videos-encerramento"]);
  await expect(
    page.getByRole("heading", {
      name: "As primeiras homilias serão reunidas em breve.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Cada homilia nasce de uma passagem do Evangelho e propõe um pequeno espaço de escuta durante o dia.",
    ),
  ).toBeVisible();
  await expect(page.locator("img, iframe, form, .video-card")).toHaveCount(0);
  await expect(
    page.getByText(/Fixture|youtubeId|coleção vazia|vídeo fictício/i),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Vídeos" }),
  ).toHaveAttribute("aria-current", "page");
  expect(externalRequests).toEqual([]);
});

test("Início preserva o estado vazio sem requisições ao YouTube", async ({
  page,
}) => {
  const youtubeRequests: string[] = [];
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (
      hostname === "www.youtube.com" ||
      hostname === "www.youtube-nocookie.com" ||
      hostname === "i.ytimg.com"
    ) {
      youtubeRequests.push(request.url());
    }
  });
  await page.goto("/");
  await expect(
    page.getByText("Breves reflexões em vídeo serão reunidas aqui em breve."),
  ).toBeVisible();
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map(({ id }) => id)),
  ).toEqual([
    "inicio-abertura",
    "inicio-apresentacao",
    "inicio-reflexao-destaque",
    "inicio-homilia",
    "inicio-reflexoes-recentes",
    "inicio-encerramento",
  ]);
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(youtubeRequests).toEqual([]);
});

test("não cria rota individual de vídeo", async ({ page }) => {
  const response = await page.goto("/videos/video-inexistente/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Página não encontrada" }),
  ).toBeVisible();
});

test("menu móvel funciona em Vídeos", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/videos/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("axe aprova Vídeos, menu aberto e integração da Início", async ({
  page,
}) => {
  await page.goto("/videos/");
  await expectNoBlockingAxeViolations(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu" }).click();
  await expectNoBlockingAxeViolations(page);
  await page.goto("/");
  await expectNoBlockingAxeViolations(page);
});

test("gera capturas sem overflow", async ({ page }) => {
  const captures = [
    ["/videos/", 390, 844, "videos-390.png"],
    ["/videos/", 768, 1024, "videos-768.png"],
    ["/videos/", 1440, 900, "videos-1440.png"],
    ["/", 390, 844, "inicio-video-vazio-390.png"],
    ["/", 1440, 900, "inicio-video-vazio-1440.png"],
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
  await page.goto("/videos/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({
    path: `${artifactDirectory}/menu-videos-390.png`,
    fullPage: true,
  });
});
