import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function mockFetchSequence(runsOverride?: Array<Record<string, unknown>>) {
  const runs = [
    {
      id: 1,
      input_text: "Wohnungsnot",
      analysis_json: {
        beobachtungen: { zusammenfassung: "A", punkte: ["A"] },
        erklaerungen: { zusammenfassung: "B", punkte: ["B"] },
        emotionen: { zusammenfassung: "C", punkte: ["C"] },
        zuschreibungen: { zusammenfassung: "D", punkte: ["D"] },
        schlussfolgerungen: { zusammenfassung: "E", punkte: ["E"] },
        massnahmen: { zusammenfassung: "F", punkte: ["F"] },
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
    },
  ];
  const selectedRuns = runsOverride ?? runs;

  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(selectedRuns[0]), { status: 201 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(selectedRuns), { status: 200 }));
}

test("renders a filter machine with language metadata and six visible modules", async () => {
  mockFetchSequence();
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => expect(screen.getByText("Keine Runs geladen.")).toBeInTheDocument());

  await user.type(screen.getByLabelText("Problemtext"), "Wohnungsnot");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  await waitFor(() => {
    expect(screen.getByText("Wohnungsnot")).toBeInTheDocument();
  });

  expect(screen.getByRole("heading", { name: "Filtermaschine" })).toBeInTheDocument();
  expect(screen.getByText("Sprache · DE")).toBeInTheDocument();
  expect(screen.getByText("Sprachcheck")).toBeInTheDocument();
  expect(screen.getByText("Analyse")).toBeInTheDocument();
  expect(screen.getByText("Validierung")).toBeInTheDocument();
  expect(screen.getByText("Beobachtungen")).toBeInTheDocument();
  expect(screen.getByText("Erklaerungen")).toBeInTheDocument();
  expect(screen.getByText("Emotionen")).toBeInTheDocument();
  expect(screen.getByText("Zuschreibungen")).toBeInTheDocument();
  expect(screen.getByText("Schlussfolgerungen")).toBeInTheDocument();
  expect(screen.getByText("Massnahmen")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "JSON exportieren" })).toBeInTheDocument();
});

test("shows a visible machine stop when language detection fails", async () => {
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
    expect(screen.getByRole("heading", { name: "Sprachcheck blockiert" })).toBeInTheDocument();
  });

  expect(screen.getByText("LANGUAGE_CONFIDENCE_TOO_LOW")).toBeInTheDocument();
  expect(screen.getByText("Sprache · FR")).toBeInTheDocument();
  expect(screen.getByText("Confidence · 0.41")).toBeInTheDocument();
});
