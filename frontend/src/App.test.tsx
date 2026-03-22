import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function mockFetchSequence() {
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

  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(runs[0]), { status: 201 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(runs), { status: 200 }));
}

test("renders and creates an analysis run", async () => {
  mockFetchSequence();
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => expect(screen.getByText("Keine Runs geladen.")).toBeInTheDocument());

  await user.type(screen.getByLabelText("Problemtext"), "Wohnungsnot");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  await waitFor(() => {
    expect(screen.getByText("Wohnungsnot")).toBeInTheDocument();
  });

  expect(screen.getByText("Beobachtungen")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "JSON exportieren" })).toBeInTheDocument();
});
