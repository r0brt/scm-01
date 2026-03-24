import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

function getCurrentStageCard() {
  return document.querySelector(".stage-card-processing") as HTMLElement | null;
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

test("renders a focused idle input view before submission", async () => {
  globalThis.fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));

  render(<App />);

  const textarea = await screen.findByLabelText("Problemtext");
  const composerForm = textarea.closest("form");

  expect(composerForm).not.toBeNull();
  expect(within(composerForm as HTMLFormElement).getAllByRole("button")).toHaveLength(1);
  expect(screen.queryByText("0/5000")).not.toBeInTheDocument();
  expect(queryStageCard("Symptome")).not.toBeInTheDocument();
  expect(queryStageCard("Essenz")).not.toBeInTheDocument();
  expect(screen.queryByText(/^Analyse laeuft/)).not.toBeInTheDocument();
  expect(screen.queryByRole("complementary", { name: "Run-Verlauf" })).not.toBeInTheDocument();
});

test("defines a light analytical stylesheet contract for the process-machine layout", () => {
  const stylesheet = readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "styles.css"),
    "utf8",
  );

  expect(stylesheet).toContain("--background:");
  expect(stylesheet).toContain("--text:");
  expect(stylesheet).toContain("--muted-text:");
  expect(stylesheet).toContain("--line-color:");
  expect(stylesheet).toContain("--processing-accent:");
  expect(stylesheet).toContain("--completed-accent:");
  expect(stylesheet).toContain("--essence-highlight:");
  expect(stylesheet).toContain("--error-color:");
  expect(stylesheet).toContain("max-width: 960px;");
  expect(stylesheet).toContain("margin: 0 auto;");
  expect(stylesheet).toContain(".pipeline-timeline::before");
  expect(stylesheet).toContain("@media (max-width: 720px)");
  expect(stylesheet).not.toContain("color-scheme: dark;");
});

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
  expect(screen.queryByRole("button", { name: "Pipeline" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("article", { name: /Stage / })).toHaveLength(6);
  });

  const processingCards = screen.getAllByRole("article", { name: /Stage / });
  const activeProcessingCards = document.querySelectorAll(".stage-card-processing");

  expect(activeProcessingCards).toHaveLength(1);
  expect(within(activeProcessingCards[0] as HTMLElement).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(within(activeProcessingCards[0] as HTMLElement).queryAllByRole("listitem").length).toBeLessThanOrEqual(2);
  expect(screen.queryByRole("button", { name: /details anzeigen/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /details ausblenden/i })).not.toBeInTheDocument();

  const inactiveCards = processingCards.filter((card) => !card.classList.contains("stage-card-processing"));
  expect(inactiveCards).toHaveLength(5);
  inactiveCards.forEach((card) => {
    expect(card).toHaveAttribute("data-stage-density", "reduced");
    expect(within(card).queryByRole("list")).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(getStageCard("Essenz")).toBeInTheDocument();
  }, { timeout: revealTimeout });

  expect(scrollIntoViewMock).toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Pipeline" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();
  expect(within(getStageCard("Essenz")).queryByText(/Status:/)).not.toBeInTheDocument();
}, 10_000);

test("renders completed runs as one compact full pipeline with a distinct essenz stage", async () => {
  const completedRun = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([completedRun]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(completedRun), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => {
    expect(screen.getByLabelText("Problemtext")).toBeInTheDocument();
  });

  expect(screen.queryByRole("button", { name: /Wohnungsnot/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Verlauf anzeigen" }));
  expect(screen.getByRole("complementary", { name: "Run-Verlauf" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));

  await waitFor(() => {
    expect(screen.getAllByRole("article", { name: /Stage / })).toHaveLength(6);
  });

  const stageCards = screen.getAllByRole("article", { name: /Stage / });
  expect(stageCards).toHaveLength(6);
  expect(screen.queryByRole("button", { name: /details anzeigen/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /details ausblenden/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pipeline" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();
  expect(screen.queryByText("0/5000")).not.toBeInTheDocument();
  expect(screen.queryByText(/^Runs$/i)).not.toBeInTheDocument();

  const symptomeStage = getStageCard("Symptome");
  expect(symptomeStage).toHaveAttribute("data-stage-density", "compact");
  expect(within(symptomeStage).getByText("Oberflaechliche Signale")).toBeInTheDocument();
  expect(within(symptomeStage).getAllByRole("listitem")).toHaveLength(2);
  expect(within(symptomeStage).queryByText("A3")).not.toBeInTheDocument();
  expect(within(symptomeStage).queryByText("A4")).not.toBeInTheDocument();

  const essenzStage = getStageCard("Essenz");
  expect(essenzStage).toHaveAttribute("data-stage-emphasis", "essenz");
  expect(essenzStage).toHaveAttribute("data-stage-density", "compact");
  expect(within(essenzStage).getAllByRole("listitem")).toHaveLength(2);
});

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
    expect(screen.getByLabelText("Problemtext")).toBeInTheDocument();
  });

  expect(screen.queryByRole("button", { name: "Pipeline" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /bonjour hello hallo/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Verlauf anzeigen" }));
  await user.click(screen.getByRole("button", { name: /bonjour hello hallo/i }));

  await waitFor(() => {
    expect(screen.getByText("Analyse blockiert")).toBeInTheDocument();
  });

  expect(screen.getByText("LANGUAGE_CONFIDENCE_TOO_LOW")).toBeInTheDocument();
  expect(screen.getByText("Sprache · FR")).toBeInTheDocument();
  expect(screen.getAllByRole("article", { name: /Stage / })).toHaveLength(6);
  expect(screen.queryByRole("button", { name: /details anzeigen/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /details ausblenden/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pipeline" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Archiv" })).not.toBeInTheDocument();
  expect(screen.queryByText("0/5000")).not.toBeInTheDocument();
  expect(screen.queryByText(/^Runs$/i)).not.toBeInTheDocument();

  const symptomeStage = getStageCard("Symptome");
  expect(symptomeStage).toHaveAttribute("data-stage-density", "failed");
  expect(within(symptomeStage).queryByText(/Status:/)).not.toBeInTheDocument();
  expect(within(symptomeStage).getByText("Keine validen Analyseinhalte vorhanden.")).toBeInTheDocument();
  expect(within(symptomeStage).queryByRole("list")).not.toBeInTheDocument();

  const essenzStage = getStageCard("Essenz");
  expect(essenzStage).toHaveAttribute("data-stage-emphasis", "essenz");
  expect(essenzStage).toHaveAttribute("data-stage-density", "failed");
  expect(within(essenzStage).queryByRole("list")).not.toBeInTheDocument();
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
    expect(screen.getByLabelText("Problemtext")).toBeInTheDocument();
  });

  await user.click(screen.getByRole("button", { name: "Verlauf anzeigen" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));

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

test("keeps run history outside the default flow until the secondary trigger is used", async () => {
  const completedRun = buildSuccessfulRun();
  globalThis.fetch = vi.fn().mockResolvedValueOnce(
    new Response(JSON.stringify([completedRun]), { status: 200 }),
  );
  const user = userEvent.setup();

  render(<App />);

  await waitFor(() => {
    expect(screen.getByLabelText("Problemtext")).toBeInTheDocument();
  });

  expect(screen.queryByRole("complementary", { name: "Run-Verlauf" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Wohnungsnot/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Verlauf anzeigen" }));

  expect(screen.getByRole("complementary", { name: "Run-Verlauf" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Wohnungsnot/i })).toBeInTheDocument();
});
