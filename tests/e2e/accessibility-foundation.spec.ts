import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("não apresenta violações críticas ou sérias detectáveis pelo axe", async ({
  page,
}) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  const blockingViolations = results.violations.filter(
    (violation) =>
      violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blockingViolations).toEqual([]);
});
