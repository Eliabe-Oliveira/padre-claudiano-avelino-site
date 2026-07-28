import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

test("não apresenta violações críticas ou sérias nas três páginas", async ({
  page,
}) => {
  for (const route of ["/", "/sobre/", "/contato/"]) {
    await page.goto(route);
    await expectNoBlockingAxeViolations(page);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sobre/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expectNoBlockingAxeViolations(page);
});
