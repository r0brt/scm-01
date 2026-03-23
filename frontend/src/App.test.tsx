import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function buildSuccessfulRun() {
  return {
    id: 1,
    input_text: "Wohnungsnot",
    analysis_json: {
      symptome: {
        beschreibung: "Oberflaechliche Signale",
        eintraege: [
          { text: "Sie hat staendig Angst vor der naechsten Mieterhoehung." },
          { text: "A2" },
          { text: "A3" },
          { text: "A4" },
        ],
      },
      ursachen: { beschreibung: "Strukturelle Gruende", eintraege: [{ text: "B1" }, { text: "B2" }] },
      emotionen: { beschreibung: "Affektive Ladung", eintraege: [{ text: "C" }] },
      narrative: { beschreibung: "Storylines", eintraege: [{ text: "D" }] },
      mythen: { beschreibung: "Fehlannahmen", eintraege: [{ text: "E" }] },
      essenz: { beschreibung: "Kernaussage", eintraege: [{ text: "F1" }, { text: "F2" }] },
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

function queryStageCard(name: string) {
  return screen.queryByRole("article", { name: `Stage ${name}` });
}

function createDeferredResponse() {
  let resolveResponse: ((response: Response) => void) | null = null;
  const promise = new Promise<Response>((resolve) => {
    resolveResponse = resolve;
  });

  return {
    promise,
    resolve(body: unknown, status = 200) {
      resolveResponse?.(new Response(JSON.stringify(body), { status }));
    },
  };
}

test("reveals the six pipeline stages sequentially after a successful analysis", async () => {
  (globalThis as typeof globalThis & { __SCM_TEST_MODE__?: boolean }).__SCM_TEST_MODE__ = true;
  mockCreateFlow();
  const user = userEvent.setup();
  const scrollIntoViewMock = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoViewMock;
  const revealTimeout = 6_000;

  render(<App />);

  await waitFor(() => expect(screen.getByLabelText("Problemtext")).toBeInTheDocument());

  await user.type(screen.getByLabelText("Problemtext"), "Wohnungsnot");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  expect(await screen.findByText(/^Analyse laeuft/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();

  expect(within(getStageCard("Symptome")).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(
    within(getStageCard("Symptome")).getByText(
      "Sie hat staendig Angst vor der naechsten Mieterhoehung.",
    ),
  ).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).queryByText("Oberflaechliche Signale")).not.toBeInTheDocument();
  expect(queryStageCard("Ursachen")).not.toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Archiv" })).toBeInTheDocument();
  }, { timeout: revealTimeout });

  expect(scrollIntoViewMock).toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Archiv" })).toBeInTheDocument();
  expect(within(getStageCard("Essenz")).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(
    within(getStageCard("Symptome")).getByText(
      "Sie hat staendig Angst vor der naechsten Mieterhoehung.",
    ),
  ).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).getByText("A2")).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).queryByText("A3")).not.toBeInTheDocument();
  expect(within(getStageCard("Symptome")).queryByText("A4")).not.toBeInTheDocument();
  expect(within(getStageCard("Symptome")).getByRole("button", { name: "Details anzeigen" })).toBeInTheDocument();
  expect(within(getStageCard("Essenz")).queryByRole("button", { name: "Details anzeigen" })).not.toBeInTheDocument();
  expect(getStageCard("Essenz")).toHaveAttribute("aria-expanded", "false");
  expect(getStageCard("Symptome")).toHaveAttribute("aria-expanded", "false");

  await user.click(getStageCard("Symptome"));
  expect(getStageCard("Symptome")).toHaveAttribute("aria-expanded", "true");
  expect(getStageCard("Essenz")).toHaveAttribute("aria-expanded", "false");
  expect(within(getStageCard("Symptome")).getByText("A4")).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).getByRole("button", { name: "Details ausblenden" })).toBeInTheDocument();
  await user.click(getStageCard("Ursachen"));
  expect(getStageCard("Ursachen")).toHaveAttribute("aria-expanded", "true");
  expect(getStageCard("Symptome")).toHaveAttribute("aria-expanded", "true");
}, 10_000);

test("shows a global stop state and keeps all stages idle when the run failed", async () => {
  (globalThis as typeof globalThis & { __SCM_TEST_MODE__?: boolean }).__SCM_TEST_MODE__ = true;
  const failedRun = {
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
  };
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([failedRun]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(failedRun), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("Bereit zur Analyse")).toBeInTheDocument();
  });

  await user.click(screen.getByRole("button", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /bonjour hello hallo/i }));

  await waitFor(() => {
    expect(screen.getByText("Analyse blockiert")).toBeInTheDocument();
  });

  expect(screen.getByText("LANGUAGE_CONFIDENCE_TOO_LOW")).toBeInTheDocument();
  expect(screen.getByText("Sprache · FR")).toBeInTheDocument();
  expect(within(getStageCard("Symptome")).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(within(getStageCard("Essenz")).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(within(getStageCard("Symptome")).getByText("Bereit")).toBeInTheDocument();
});

test("clears the previously selected run content while a new analysis starts", async () => {
  (globalThis as typeof globalThis & { __SCM_TEST_MODE__?: boolean }).__SCM_TEST_MODE__ = true;
  const oldRun = buildSuccessfulRun();
  const newRun = {
    ...buildSuccessfulRun(),
    id: 3,
    input_text: "Neue Eingabe",
    analysis_json: {
      ...buildSuccessfulRun().analysis_json,
      symptome: {
        beschreibung: "Neue Symptome",
        eintraege: [{ text: "Neuer Eintrag" }],
      },
    },
  };
  const createRequest = createDeferredResponse();

  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([oldRun]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(oldRun), { status: 200 }))
    .mockImplementationOnce(() => createRequest.promise)
    .mockResolvedValueOnce(new Response(JSON.stringify([newRun, oldRun]), { status: 200 }));

  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("Bereit zur Analyse")).toBeInTheDocument();
  });

  await user.click(screen.getByRole("button", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));
  await user.click(screen.getByRole("button", { name: "Pipeline" }));

  await waitFor(() => {
    expect(getStageCard("Essenz")).toBeInTheDocument();
  });

  expect(screen.getByText("Sie hat staendig Angst vor der naechsten Mieterhoehung.")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Problemtext"), "Neue Eingabe");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  await waitFor(() => {
    expect(screen.getByText(/^Analyse laeuft/)).toBeInTheDocument();
  });

  expect(
    screen.queryByText("Sie hat staendig Angst vor der naechsten Mieterhoehung."),
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Neue Symptome")).not.toBeInTheDocument();

  createRequest.resolve(newRun, 201);

  await waitFor(() => {
    expect(screen.getByText("Neuer Eintrag")).toBeInTheDocument();
  });
});
