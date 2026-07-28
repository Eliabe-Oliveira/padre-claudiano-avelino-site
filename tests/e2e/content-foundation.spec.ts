import { expect, test } from "@playwright/test";

const sectionIds = async (page: import("@playwright/test").Page) =>
  page
    .locator("main > section")
    .evaluateAll((sections) => sections.map((section) => section.id));

test("Início apresenta a ordem editorial e os estados vazios", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      externalRequests.push(request.url());
    }
  });

  expect((await page.goto("/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await sectionIds(page)).toEqual([
    "inicio-abertura",
    "inicio-apresentacao",
    "inicio-reflexao-destaque",
    "inicio-homilia",
    "inicio-reflexoes-recentes",
    "inicio-encerramento",
  ]);
  await expect(
    page.getByText("Padre Claudiano Avelino é sacerdote"),
  ).toBeVisible();
  await expect(
    page.getByText("As primeiras reflexões serão publicadas em breve."),
  ).toBeVisible();
  await expect(
    page.getByText("Breves reflexões em vídeo serão reunidas aqui em breve."),
  ).toBeVisible();
  await expect(
    page.getByText("O acervo de reflexões será iniciado em breve."),
  ).toBeVisible();
  await expect(page.getByText(/Fixture técnica/i)).toHaveCount(0);
  await expect(page.getByText(/Sistema visual/i)).toHaveCount(0);
  await expect(page.getByText(/Provincial/i)).toHaveCount(0);
  await expect(page.locator("img")).toHaveCount(1);
  await expect(page.locator("iframe, form")).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

test("Sobre apresenta somente a biografia e os cinco temas autorizados", async ({
  page,
}) => {
  expect((await page.goto("/sobre/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Sobre | Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await sectionIds(page)).toEqual([
    "sobre-abertura",
    "sobre-biografia",
    "sobre-palavra-comunicacao",
    "sobre-temas",
    "sobre-homilia",
    "sobre-convite",
  ]);
  await expect(page.getByText(/Valente, na Bahia/)).toBeVisible();
  await expect(page.getByText(/PUC-SP/)).toBeVisible();
  await expect(page.getByText(/UNIFESP/)).toBeVisible();
  await expect(page.locator("#sobre-temas li")).toHaveCount(5);
  await expect(
    page.getByText("Homilia de 1 minuto", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText(/Provincial/i)).toHaveCount(0);
  await expect(page.locator("img")).toHaveCount(1);
  await expect(page.locator("iframe, form")).toHaveCount(0);
});

test("Contato mantém o estado seguro sem e-mail configurado", async ({
  page,
}) => {
  expect((await page.goto("/contato/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Contato | Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await sectionIds(page)).toEqual([
    "contato-abertura",
    "contato-canal",
    "contato-orientacao",
    "contato-privacidade",
  ]);
  await expect(page.locator("form, input, textarea")).toHaveCount(0);
  await expect(page.getByText(/telefone|WhatsApp/i)).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(
    page.getByText("O endereço de contato será disponibilizado em breve."),
  ).toBeVisible();
  await expect(page.getByText(/Questões institucionais/)).toBeVisible();
  await expect(page.getByText(/Nenhuma informação é coletada/)).toBeVisible();
});

test("disponibiliza a rota de Vídeos sem conteúdo fictício", async ({
  page,
}) => {
  expect((await page.request.get("/videos/")).status()).toBe(200);
});
