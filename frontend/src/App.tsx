import { useEffect, useState } from "react";

import { createAnalysis, getAnalysis, listAnalyses } from "./api";
import "./styles.css";
import type { AnalysisRun } from "./types";

const LEVELS = [
  ["beobachtungen", "Beobachtungen"],
  ["erklaerungen", "Erklaerungen"],
  ["emotionen", "Emotionen"],
  ["zuschreibungen", "Zuschreibungen"],
  ["schlussfolgerungen", "Schlussfolgerungen"],
  ["massnahmen", "Massnahmen"],
] as const;

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
        <h1>Analyse-Workspace</h1>
        <p className="lede">
          Problemtext eingeben, Analyse starten, Pipeline lesen und Runs als JSON exportieren.
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
            <h2>Pipeline</h2>
            <button disabled={!selectedRun} onClick={handleExport} type="button">
              JSON exportieren
            </button>
          </div>
          {selectedRun ? (
            <>
              <div className="run-meta">
                <span>{selectedRun.model_id}</span>
                <span>{selectedRun.prompt_version}</span>
                <span>{selectedRun.validation_status}</span>
              </div>
              <div className="pipeline-grid">
                {LEVELS.map(([key, label]) => {
                  const level = selectedRun.analysis_json?.[key];
                  return (
                    <article className="level-card" key={key}>
                      <h3>{label}</h3>
                      <p>{level?.zusammenfassung ?? "Keine Daten"}</p>
                      <ul>
                        {(level?.punkte ?? []).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
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
