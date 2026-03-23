import { useEffect, useState } from "react";

import { createAnalysis, getAnalysis, listAnalyses } from "./api";
import "./styles.css";
import type { AnalysisRun } from "./types";

const LEVELS = [
  ["symptome", "Symptome", "Welche beobachtbaren Phaenomene treten im Problemfeld hervor?"],
  ["ursachen", "Ursachen", "Welche Erklaerungsansaetze werden fuer die Symptome genannt?"],
  ["emotionen", "Emotionen", "Welche Spannungen und Affekte werden aktiviert?"],
  ["narrative", "Narrative", "Welche Erzaehlmuster oder Frames strukturieren den Diskurs?"],
  ["mythen", "Mythen", "Welche Fehlannahmen oder vereinfachenden Zuschreibungen tauchen auf?"],
  ["essenz", "Essenz", "Welche wertfreie Kernaussage bleibt nach der Filterstrecke uebrig?"],
] as const;

const MACHINE_STAGES = [
  ["language", "Sprachcheck"],
  ["analysis", "Analyse"],
  ["validation", "Validierung"],
] as const;

function formatLanguage(language: string | null | undefined): string {
  return language ? language.toUpperCase() : "UNBEKANNT";
}

function formatConfidence(confidence: number | null | undefined): string {
  return typeof confidence === "number" ? confidence.toFixed(2) : "--";
}

function getMachineStatus(run: AnalysisRun | null): {
  headline: string;
  tone: "valid" | "repair" | "failed" | "idle";
} {
  if (!run) {
    return { headline: "Maschine bereit", tone: "idle" };
  }

  if (run.error_code === "LANGUAGE_CONFIDENCE_TOO_LOW" || run.error_code === "UNSUPPORTED_LANGUAGE") {
    return { headline: "Sprachcheck blockiert", tone: "failed" };
  }

  if (run.run_status === "failed") {
    return { headline: "Ausgabe blockiert", tone: "failed" };
  }

  const hasRepair = run.validation_report.checks.some((check) => check.status === "repaired");
  if (hasRepair) {
    return { headline: "Analyse repariert", tone: "repair" };
  }

  return { headline: "Filtermaschine", tone: "valid" };
}

export default function App() {
  const [text, setText] = useState("");
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AnalysisRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshRuns();
  }, []);

  async function refreshRuns() {
    try {
      const nextRuns = await listAnalyses();
      setRuns(nextRuns);
      if (!selectedRun && nextRuns[0]) {
        setSelectedRun(nextRuns[0]);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Runs konnten nicht geladen werden.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const run = await createAnalysis(text);
      setSelectedRun(run);
      setText("");
      await refreshRuns();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Analyse konnte nicht erstellt werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectRun(runId: number) {
    try {
      setSelectedRun(await getAnalysis(runId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Run konnte nicht geladen werden.");
    }
  }

  function handleExport() {
    if (!selectedRun) return;
    const blob = new Blob([JSON.stringify(selectedRun, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `scm-run-${selectedRun.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Social Cleanup Machine</p>
        <h1>Industrielle Filterstrecke</h1>
        <p className="lede">
          Rohtext einspeisen, Sprache pruefen, Analyse filtern und die sechs Ebenen als
          sichtbare Maschinenstrecke lesen.
        </p>
        <form className="composer" onSubmit={handleSubmit}>
          <label htmlFor="problemtext">Problemtext</label>
          <textarea
            id="problemtext"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Beschreibe ein gesellschaftliches Problem oder einen kontroversen Diskurs."
            rows={6}
          />
          <button disabled={loading || !text.trim()} type="submit">
            {loading ? "Analysiere..." : "Analyse starten"}
          </button>
        </form>
        {error ? <p className="error-banner">{error}</p> : null}
      </section>

      <section className="workspace-grid">
        <aside className="runs-panel">
          <div className="panel-header">
            <h2>Runs</h2>
            <button onClick={() => void refreshRuns()} type="button">
              Aktualisieren
            </button>
          </div>
          {runs.length === 0 ? <p>Keine Runs geladen.</p> : null}
          <ul className="runs-list">
            {runs.map((run) => (
              <li key={run.id}>
                <button className="run-item" onClick={() => void handleSelectRun(run.id)} type="button">
                  <span>#{run.id}</span>
                  <strong>{run.input_text}</strong>
                  <small>
                    {run.validation_status} · {run.prompt_version}
                  </small>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="pipeline-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">SCM Core</p>
              <h2>{getMachineStatus(selectedRun).headline}</h2>
            </div>
            <button disabled={!selectedRun} onClick={handleExport} type="button">
              JSON exportieren
            </button>
          </div>
          {selectedRun ? (
            <>
              <div className="machine-summary">
                <div className={`machine-status machine-status-${getMachineStatus(selectedRun).tone}`}>
                  <strong>{getMachineStatus(selectedRun).headline}</strong>
                  <span>{selectedRun.error_reason ?? "Analysefluss aktiv und nachvollziehbar."}</span>
                </div>
                <div className="run-meta">
                  <span>Sprache · {formatLanguage(selectedRun.detected_language)}</span>
                  <span>Confidence · {formatConfidence(selectedRun.language_confidence)}</span>
                  <span>Modell · {selectedRun.model_id}</span>
                  <span>Prompt · {selectedRun.prompt_version}</span>
                  <span>Status · {selectedRun.validation_status}</span>
                </div>
              </div>

              <div className="stage-strip" aria-label="Maschinenstufen">
                {MACHINE_STAGES.map(([key, label]) => {
                  const isLanguageFailed =
                    key === "language" &&
                    (selectedRun.error_code === "LANGUAGE_CONFIDENCE_TOO_LOW" ||
                      selectedRun.error_code === "UNSUPPORTED_LANGUAGE");
                  const isFailedAfterLanguage =
                    selectedRun.run_status === "failed" && key !== "language";
                  const stageTone = isLanguageFailed
                    ? "failed"
                    : isFailedAfterLanguage
                      ? "idle"
                      : "active";

                  return (
                    <article className={`stage-node stage-node-${stageTone}`} key={key}>
                      <p>{label}</p>
                    </article>
                  );
                })}
              </div>

              {selectedRun.error_code ? (
                <section className="machine-stop" aria-label="Fehlerzustand">
                  <strong>{getMachineStatus(selectedRun).headline}</strong>
                  <p>{selectedRun.error_code}</p>
                </section>
              ) : null}

              <div className="pipeline-grid">
                {LEVELS.map(([key, label, guidingQuestion]) => {
                  const level = selectedRun.analysis_json?.[key];
                  const visibleEntries = (level?.eintraege ?? []).slice(0, 3);
                  return (
                    <article className={`level-card level-card-${key}`} key={key}>
                      <div className="level-head">
                        <p className="level-index">Filtermodul</p>
                        <h3>{label}</h3>
                        <span>{guidingQuestion}</span>
                      </div>
                      <p className="level-summary">{level?.beschreibung ?? "Keine Daten"}</p>
                      <ul>
                        {visibleEntries.map((entry) => (
                          <li key={entry.text}>{entry.text}</li>
                        ))}
                      </ul>
                      {!visibleEntries.length ? <p className="level-empty">Modul ohne Ausgabe.</p> : null}
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <p>Waehle einen Run aus oder starte eine neue Analyse.</p>
          )}
        </section>
      </section>
    </main>
  );
}
