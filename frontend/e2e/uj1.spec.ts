import { expect, test } from "@playwright/test";

test("UJ1: create analysis and show pipeline", async ({ page }) => {
  await page.addInitScript(() => {
    (window as typeof window & { __SCM_TEST_MODE__?: boolean }).__SCM_TEST_MODE__ = true;
  });

  const createdRun = {
    id: 1,
    input_text: "Wohnungsnot in der Stadt",
    analysis_json: {
      symptome: {
        beschreibung: "Wohnungsnot in der Stadt",
        eintraege: [{ text: "Mieten steigen schneller als Einkommen." }],
      },
      ursachen: {
        beschreibung: "Neubau bleibt hinter dem Bedarf zurueck.",
        eintraege: [{ text: "Zu wenig bezahlbarer Wohnraum." }],
      },
      emotionen: {
        beschreibung: "Der Druck erzeugt Unsicherheit.",
        eintraege: [{ text: "Existenzangst bei Mieterinnen und Mietern." }],
      },
      narrative: {
        beschreibung: "Der Markt wird als alternativlos dargestellt.",
        eintraege: [{ text: "Wohnraumknappheit gilt als Normalzustand." }],
      },
      mythen: {
        beschreibung: "Individuelle Schuld verdeckt strukturelle Ursachen.",
        eintraege: [{ text: "Wer keine Wohnung findet, sucht nicht genug." }],
      },
      essenz: {
        beschreibung: "Die Stadt verteilt knappen Wohnraum ungleich.",
        eintraege: [{ text: "Die Knappheit trifft verletzliche Gruppen zuerst." }],
      },
    },
    validation_report: { checks: [{ stage: "schema", status: "passed" }] },
    detected_language: "de",
    language_confidence: 0.99,
    model_id: "fake-e2e-model",
    prompt_version: "v-test",
    run_status: "completed",
    validation_status: "valid",
    error_code: null,
    error_reason: null,
    created_at: "2026-03-24T12:00:00Z",
  };

  let listRequestCount = 0;

  await page.route("**/api/v1/analyses", async (route) => {
    if (route.request().method() === "GET") {
      listRequestCount += 1;
      await route.fulfill({ json: listRequestCount === 1 ? [] : [createdRun] });
      return;
    }

    await route.fulfill({ json: createdRun, status: 201 });
  });

  await page.goto("/");

  await expect(page.getByRole("tab", { name: "Analyse" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: "Archiv" })).toBeVisible();
  await expect(page.getByText("Noch keine Analyse gestartet")).toBeVisible();
  await expect(page.getByLabel("Problemtext")).toBeVisible();
  await expect(page.getByRole("button", { name: "Analyse starten" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Analyse starten" })).toBeDisabled();

  await page.getByLabel("Problemtext").fill("Wohnungsnot in der Stadt");
  await expect(page.getByRole("button", { name: "Analyse starten" })).toBeEnabled();
  await page.getByRole("button", { name: "Analyse starten" }).click();

  await expect(page.getByRole("article", { name: "Stage Symptome" })).toBeVisible();
  await expect(page.getByRole("article", { name: "Stage Essenz" })).toBeVisible();

  await expect(page.getByRole("article", { name: "Stage Symptome" })).toContainText(
    "Mieten steigen schneller als Einkommen.",
  );
  await expect(page.getByRole("article", { name: "Stage Essenz" })).toContainText(
    "Die Knappheit trifft verletzliche Gruppen zuerst.",
  );
  await expect(page.getByRole("tab", { name: "Archiv" })).toBeVisible();
});
