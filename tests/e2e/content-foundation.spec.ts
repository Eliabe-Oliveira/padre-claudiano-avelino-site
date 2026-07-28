import { expect, test } from "@playwright/test";

const sectionIds = async (page: import("@playwright/test").Page) =>
  page
    .locator("main section[id]")
    .evaluateAll((sections) => sections.map((section) => section.id));

test("Início apresenta a nova ordem editorial sem estados vazios repetidos", async ({
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
    "inicio-declaracao",
    "inicio-palavra-encontro",
    "inicio-temas",
    "inicio-encerramento",
  ]);
  await expect(
    page.getByText(
      /Um espaço pessoal de espiritualidade católica, reflexão e encontro/,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Palavra, reflexão e encontro" }),
  ).toBeVisible();
  await expect(page.locator("#inicio-temas li")).toHaveCount(5);
  await expect(page.getByText(/serão publicadas em breve/i)).toHaveCount(0);
  await expect(page.getByText(/serão reunidas aqui em breve/i)).toHaveCount(0);
  await expect(page.getByText(/acervo.*iniciado em breve/i)).toHaveCount(0);
  await expect(page.getByText(/Fixture técnica/i)).toHaveCount(0);
  await expect(page.getByText(/Sistema visual/i)).toHaveCount(0);
  await expect(page.getByText(/Provincial/i)).toHaveCount(0);
  await expect(page.locator(".home-hero__portrait img")).toHaveCount(0);
  await expect(page.locator("#inicio-abertura img")).toHaveCount(2);
  await expect(page.locator("[data-sacred-encounter] picture")).toHaveCount(2);
  await expect(
    page
      .locator("#inicio-abertura")
      .getByText("Palavra, reflexão e encontro com Deus.", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator("#inicio-abertura")
      .getByRole("link", { name: "Conhecer as reflexões" }),
  ).toHaveCount(1);
  await expect(page.locator("#inicio-abertura .button-link")).toHaveCount(1);
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
    "sobre-posicionamento",
    "sobre-temas",
  ]);
  await expect(page.getByText(/Valente, na Bahia/)).toBeVisible();
  await expect(page.getByText(/PUC-SP/)).toBeVisible();
  await expect(page.getByText(/UNIFESP/)).toBeVisible();
  await expect(page.locator("#sobre-temas li")).toHaveCount(5);
  await expect(
    page.getByText(
      "Fé, experiência pastoral e pensamento próximos da vida cotidiana.",
    ),
  ).toBeVisible();
  await expect(page.getByText(/Provincial/i)).toHaveCount(0);
  await expect(page.locator("#sobre-biografia img")).toHaveCount(1);
  await expect(page.locator(".about-sacred-study img")).toHaveCount(1);
  await expect(page.locator(".about-sacred-study img")).toHaveAttribute(
    "alt",
    "",
  );
  await expect(page.locator("iframe, form")).toHaveCount(0);
});

test("Contato mantém o estado seguro sem e-mail configurado", async ({
  page,
}) => {
  expect((await page.goto("/contato/"))?.ok()).toBe(true);
  await expect(page).toHaveTitle("Contato | Padre Claudiano Avelino");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await sectionIds(page)).toEqual(["contato-abertura", "contato-canal"]);
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
