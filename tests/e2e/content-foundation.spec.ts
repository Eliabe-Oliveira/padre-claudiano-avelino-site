import { expect, test } from "@playwright/test";

test("mantém a página técnica sem conteúdo ou rotas editoriais", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      externalRequests.push(request.url());
    }
  });

  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Sistema visual/);
  await expect(page.getByText(/Fixture técnica/i)).toHaveCount(0);
  expect(externalRequests).toEqual([]);

  for (const route of ["/sobre/", "/reflexoes/", "/videos/", "/contato/"]) {
    const routeResponse = await page.request.get(route);
    expect(routeResponse.status()).toBe(404);
  }
});
