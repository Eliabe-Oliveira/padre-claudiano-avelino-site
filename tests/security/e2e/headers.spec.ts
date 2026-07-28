import { expect, test } from "@playwright/test";

test("cabeçalhos protegem o site sem bloquear a interface", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain(
    "script-src 'self'",
  );
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response?.headers()["cross-origin-opener-policy"]).toBe(
    "same-origin-allow-popups",
  );
  expect(response?.headers()["cross-origin-resource-policy"]).toBe(
    "same-origin",
  );
  expect(response?.headers()["permissions-policy"]).toContain("camera=()");
  expect(response?.headers()["cache-control"]).toBeUndefined();

  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#inicio-abertura img")).toBeVisible();

  const stylesheet = await page
    .locator('link[rel="stylesheet"]')
    .first()
    .getAttribute("href");
  const asset = await page.request.get(stylesheet!);
  expect(asset.headers()["cache-control"]).toBe(
    "public, max-age=31536000, immutable",
  );
});
