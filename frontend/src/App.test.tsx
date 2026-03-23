import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function buildSuccessfulRun() {
  return {
    id: 1,
    input_text: "Wohnungsnot",
    analysis_json: {
      symptome: { beschreibung: "Oberflaechliche Signale", eintraege: [{ text: "A" }] },
      ursachen: { beschreibung: "Strukturelle Gruende", eintraege: [{ text: "B" }] },
      emotionen: { beschreibung: "Affektive Ladung", eintraege: [{ text: "C" }] },
      narrative: { beschreibung: "Storylines", eintraege: [{ text: "D" }] },
      mythen: { beschreibung: "Fehlannahmen", eintraege: [{ text: "E" }] },
      essenz: { beschreibung: "Kernaussage", eintraege: [{ text: "F" }] },
    },
    validation_report: { checks: [{ stage: "schema", status: "passed" }] },
    detected_language: "de",
    language_confidence: 1,
    model_id: "fake-api-model",
    prompt_version: "v-fake",
    run_status: "completed",
    validation_status: "valid",
    error_code: null,
    error_reason: null,
    created_at: "2026-03-22T10:00:00Z",
  };
}

function mockCreateFlow(run = buildSuccessfulRun()) {
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(run), { status: 201 }))
    .mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }));
}

function getStageCard(name: string) {
  return screen.getByRole("article", { name: `Stage ${name}` });
}

test("reveals the six pipeline stages sequentially after a successful analysis", async () => {
  mockCreateFlow();
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => expect(screen.getByText("Keine Runs geladen.")).toBeInTheDocument());

  await user.type(screen.getByLabelText("Problemtext"), "Wohnungsnot");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  expect(await screen.findByRole("heading", { name: "Analyse empfangen" })).toBeInTheDocument();

  expect(within(getStageCard("Symptome")).getByText("Status: processing")).toBeInTheDocument();
  expect(within(getStageCard("Ursachen")).getByText("Status: idle")).toBeInTheDocument();
  expect(screen.getByText("Sprache · DE")).toBeInTheDocument();

  await waitFor(() => {
    expect(within(getStageCard("Symptome")).getByText("Status: completed")).toBeInTheDocument();
    expect(within(getStageCard("Ursachen")).getByText("Status: processing")).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Pipeline abgeschlossen" })).toBeInTheDocument();
  });

  expect(within(getStageCard("Essenz")).getByText("Status: completed")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "JSON exportieren" })).toBeInTheDocument();
});

test("shows a global stop state and keeps all stages idle when the run failed", async () => {
  globalThis.fetch = vi.fn().mockResolvedValueOnce(
    new Response(
      JSON.stringify([
        {
          id: 2,
          input_text: "bonjour hello hallo",
          analysis_json: null,
          validation_report: { checks: [{ stage: "language", status: "failed" }] },
          detected_language: "fr",
          language_confidence: 0.41,
          model_id: "not-run",
          prompt_version: "not-run",
          run_status: "failed",
          validation_status: "invalid",
          error_code: "LANGUAGE_CONFIDENCE_TOO_LOW",
          error_reason: "Language detection failed",
          created_at: "2026-03-23T09:00:00Z",
        },
      ]),
      { status: 200 },
    ),
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Maschine blockiert" })).toBeInTheDocument();
  });

  expect(screen.getByText("LANGUAGE_CONFIDENCE_TOO_LOW")).toBeInTheDocument();
  expect(screen.getByText("Sprache · FR")).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).getByText("Status: idle")).toBeInTheDocument();
  expect(within(getStageCard("Essenz")).getByText("Status: idle")).toBeInTheDocument();
});
