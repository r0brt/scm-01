import { expect, test } from "@playwright/test";

test("UJ1: create analysis and show pipeline", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Problemtext").fill("Wohnungsnot in der Stadt");
  await page.getByRole("button", { name: "Analyse starten" }).click();

  await expect(page.getByText("Symptome")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /#1 Wohnungsnot in der Stadt/ }),
  ).toBeVisible();
});
