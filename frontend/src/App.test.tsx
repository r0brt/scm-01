import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function buildSuccessfulRun() {
  return {
    id: 1,
    correlation_id: "corr-ui-test",
    input_text: "Wohnungsnot",
    analysis_json: {
      symptome: {
        beschreibung: "Oberflaechliche Signale",
        eintraege: [
          { text: "Sie hat staendig Angst vor der naechsten Mieterhoehung." },
          { text: "Zweitbelastung steigt." },
          { text: "Wartelisten wachsen." },
          { text: "Verdrangung nimmt zu." },
        ],
      },
      ursachen: { beschreibung: "Strukturelle Gruende", eintraege: [{ text: "B1" }, { text: "B2" }, { text: "B3" }] },
      emotionen: { beschreibung: "Affektive Ladung", eintraege: [{ text: "C1" }, { text: "C2" }, { text: "C3" }] },
      narrative: { beschreibung: "Storylines", eintraege: [{ text: "D1" }, { text: "D2" }] },
      mythen: { beschreibung: "Fehlannahmen", eintraege: [{ text: "E1" }, { text: "E2" }] },
      essenz: { beschreibung: "Kernaussage", eintraege: [{ text: "F1" }, { text: "F2" }, { text: "F3" }] },
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

test("renders two top-level tabs and keeps archive accessible without runs", async () => {
  globalThis.fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  expect(await screen.findByRole("tab", { name: "Analyse" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  expect(screen.getByText("Social Cleanup Machine")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Analysiert komplexe gesellschaftliche Themen in sechs Ebenen: Symptome, Ursachen, Emotionen, Narrative, Mythen und Essenz.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Problem" })).toBeInTheDocument();
  expect(screen.getByText("Noch keine Analyse gestartet")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Beschreibe das Problem kurz...")).toBeInTheDocument();
  const transparencyNotice = screen.getByRole("note", { name: "Transparenzhinweis" });
  expect(within(transparencyNotice).getByText("ⓘ Hinweis zur KI-Analyse")).toBeInTheDocument();
  expect(
    within(transparencyNotice).getByText(
      "Die Analyse strukturiert den eingegebenen Text, bewertet ihn aber nicht.",
    ),
  ).toBeInTheDocument();
  expect(
    within(transparencyNotice).getByText(
      "Sie ersetzt keine Fakten-, Wahrheits- oder Rechtsprüfung.",
    ),
  ).toBeInTheDocument();
  expect(
    within(transparencyNotice).getByText(
      "Bitte keine sensiblen oder personenbezogenen Daten eingeben.",
    ),
  ).toBeInTheDocument();
  expect(
    within(transparencyNotice).getByText(
      "Eingaben und Resultate können im Archiv gespeichert werden.",
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText("Problem eingeben")).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText("Problemtext eingeben")).not.toBeInTheDocument();
  expect(screen.queryByText("Maschine einspeisen")).not.toBeInTheDocument();
  expect(screen.queryByRole("complementary", { name: "Run-Verlauf" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Archiv" }));

  expect(screen.getByRole("complementary", { name: "Archiv" })).toBeInTheDocument();
  expect(screen.getByText("Noch keine Analysen gespeichert")).toBeInTheDocument();
});

test("loads a selected archived run into Analyse and copies its problem text", async () => {
  const run = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(run), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  expect(await screen.findByRole("tab", { name: "Archiv" })).toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));

  await waitFor(() => {
    expect(screen.getByRole("tab", { name: "Archiv" })).toHaveAttribute("aria-selected", "true");
  });

  expect(screen.getByRole("region", { name: "Archiv-Details" })).toBeInTheDocument();
  expect(screen.getByText("corr-ui-test")).toBeInTheDocument();
  expect(screen.getByText("fake-api-model")).toBeInTheDocument();
  expect(screen.getByText("v-fake")).toBeInTheDocument();
  const details = screen.getByRole("region", { name: "Archiv-Details" });
  expect(within(details).getByText("completed · valid")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "JSON exportieren" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "In Analyse öffnen" }));

  expect(screen.getByRole("tab", { name: "Analyse" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByLabelText("Problemtext")).toHaveValue("Wohnungsnot");
  expect(screen.getByText("Sie hat staendig Angst vor der naechsten Mieterhoehung.")).toBeInTheDocument();
});

test("does not open an archived run when switching to Analyse manually", async () => {
  const run = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(run), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  await user.click(await screen.findByRole("tab", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));
  await user.click(screen.getByRole("tab", { name: "Analyse" }));

  expect(screen.getByLabelText("Problemtext")).toHaveValue("");
  expect(screen.getByText("Noch keine Analyse gestartet")).toBeInTheDocument();
  expect(screen.queryByText("Sie hat staendig Angst vor der naechsten Mieterhoehung.")).not.toBeInTheDocument();
});

test("exports the selected archive run as JSON", async () => {
  const run = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(run), { status: 200 }));
  const createObjectURL = vi.fn().mockReturnValue("blob:scm-run");
  const revokeObjectURL = vi.fn();
  const click = vi.fn();
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalCreateElement = document.createElement.bind(document);
  const originalSetTimeout = window.setTimeout.bind(window);
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
  vi.spyOn(document, "createElement").mockImplementation((tagName) => {
    const element = originalCreateElement(tagName);
    if (tagName === "a") {
      element.click = click;
    }
    return element;
  });
  const setTimeoutSpy = vi.spyOn(window, "setTimeout").mockImplementation((handler: TimerHandler, timeout?: number) => {
    return originalSetTimeout(handler, timeout);
  });
  const user = userEvent.setup();

  try {
    render(<App />);

    await user.click(await screen.findByRole("tab", { name: "Archiv" }));
    await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));
    const appendChild = vi.spyOn(document.body, "appendChild");
    const removeChild = vi.spyOn(document.body, "removeChild");
    await user.click(await screen.findByRole("button", { name: "JSON exportieren" }));

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(appendChild).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalled();
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
    await waitFor(() => {
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:scm-run");
    });
  } finally {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  }
});

test("keeps Archiv active and shows an error if loading a run from the archive fails", async () => {
  const run = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ error: "kaputt" }), { status: 500 }));
  const user = userEvent.setup();

  render(<App />);

  expect(await screen.findByRole("tab", { name: "Archiv" })).toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));

  await waitFor(() => {
    expect(screen.getByText("Run konnte nicht geladen werden.")).toBeInTheDocument();
  });

  expect(screen.getByRole("tab", { name: "Archiv" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("complementary", { name: "Archiv" })).toBeInTheDocument();
});

test("renders a reduced processing pipeline with one active stage", async () => {
  (globalThis as typeof globalThis & { __SCM_TEST_MODE__?: boolean }).__SCM_TEST_MODE__ = true;
  mockCreateFlow();
  const user = userEvent.setup();
  Element.prototype.scrollIntoView = vi.fn();

  render(<App />);

  await waitFor(() => expect(screen.getByLabelText("Problemtext")).toBeInTheDocument());
  await user.type(screen.getByLabelText("Problemtext"), "Wohnungsnot");
  await user.click(screen.getByRole("button", { name: "Analyse starten" }));

  await waitFor(() => {
    expect(screen.getAllByRole("article", { name: /Stage / })).toHaveLength(6);
  });

  const activeStages = document.querySelectorAll(".stage-card-processing");
  expect(activeStages).toHaveLength(1);
  expect(screen.queryByText(/^Analyse laeuft/)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /json/i })).not.toBeInTheDocument();
  expect(screen.queryByText("Filterstrecke")).not.toBeInTheDocument();

  const inactiveCards = screen
    .getAllByRole("article", { name: /Stage / })
    .filter((card) => !card.classList.contains("stage-card-processing"));
  inactiveCards.forEach((card) => {
    expect(card).toHaveAttribute("data-stage-density", "reduced");
    expect(within(card).queryByRole("list")).not.toBeInTheDocument();
  });
});

test("renders completed runs as a compact pipeline and emphasizes Essenz", async () => {
  const completedRun = buildSuccessfulRun();
  globalThis.fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([completedRun]), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(completedRun), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  expect(await screen.findByRole("tab", { name: "Archiv" })).toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Archiv" }));
  await user.click(screen.getByRole("button", { name: /Wohnungsnot/i }));
  await user.click(await screen.findByRole("button", { name: "In Analyse öffnen" }));

  await waitFor(() => {
    expect(screen.getAllByRole("article", { name: /Stage / })).toHaveLength(6);
  });

  const symptomeStage = getStageCard("Symptome");
  expect(symptomeStage).toHaveAttribute("data-stage-density", "compact");
  expect(within(symptomeStage).getByText("Stage 01")).toHaveClass("stage-index");
  expect(within(symptomeStage).getAllByRole("listitem")).toHaveLength(2);
  expect(within(symptomeStage).queryByText("Wartelisten wachsen.")).not.toBeInTheDocument();

  const essenzStage = getStageCard("Essenz");
  expect(essenzStage).toHaveAttribute("data-stage-emphasis", "essenz");
  expect(essenzStage).toHaveClass("stage-card-essenz");
  expect(within(essenzStage).getAllByRole("listitem")).toHaveLength(3);
  expect(screen.queryByText("Filterstrecke")).not.toBeInTheDocument();
});

test("compresses archive entries to id, one-line title, and subtle status", async () => {
  const run = {
    ...buildSuccessfulRun(),
    id: 59,
    input_text: "Ein sehr langer Archivtitel fuer eine Analyse, der visuell gekuerzt werden soll",
  };
  globalThis.fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify([run]), { status: 200 }));
  const user = userEvent.setup();

  render(<App />);

  await user.click(await screen.findByRole("tab", { name: "Archiv" }));

  const entry = screen.getByRole("button", {
    name: /Ein sehr langer Archivtitel fuer eine Analyse/i,
  });

  expect(within(entry).getByText("#59")).toHaveClass("run-item-id");
  expect(within(entry).getByText(/Ein sehr langer Archivtitel/)).toHaveClass("run-item-title");
  expect(within(entry).getByText("completed · valid")).toHaveClass("run-item-status");
});

test("defines the simplified stylesheet contract for tabs, archive, and analysis hierarchy", () => {
  const stylesheet = readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "styles.css"),
    "utf8",
  );

  expect(stylesheet).toContain(".top-level-tabs");
  expect(stylesheet).toContain(".tab-button");
  expect(stylesheet).toContain(".analysis-layout");
  expect(stylesheet).toContain(".archive-layout");
  expect(stylesheet).toContain(".archive-workspace");
  expect(stylesheet).toContain(".archive-detail-panel");
  expect(stylesheet).toContain(".archive-metadata-grid");
  expect(stylesheet).toContain(".analysis-context");
  expect(stylesheet).toContain(".pipeline-empty-state");
  expect(stylesheet).toContain(".composer-transparency");
  expect(stylesheet).toContain(".stage-card-essenz");
  expect(stylesheet).toContain(".run-item-title");
  expect(stylesheet).toContain("text-overflow: ellipsis;");
  expect(stylesheet).not.toContain(".history-access-trigger");
  expect(stylesheet).not.toContain(".machine-status");
  expect(stylesheet).not.toContain("Maschine einspeisen");
  expect(stylesheet).not.toContain("Problemtext eingeben");
});
