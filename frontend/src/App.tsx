import { useEffect, useState } from "react";

import { createAnalysis, getAnalysis, listAnalyses } from "./api";
import { AnalysisComposer } from "./components/AnalysisComposer";
import { PipelineView } from "./components/PipelineView";
import { RunHistoryPanel } from "./components/RunHistoryPanel";
import { usePipelineViewModel } from "./pipeline";
import "./styles.css";
import type { AnalysisRun } from "./types";

type TopLevelTab = "analyse" | "archiv";

export default function App() {
  const [text, setText] = useState("");
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AnalysisRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TopLevelTab>("analyse");
  const [revealToken, setRevealToken] = useState(0);

  const pipelineViewModel = usePipelineViewModel(selectedRun, revealToken, loading);
  const hasRun = loading || selectedRun !== null;

  useEffect(() => {
    void refreshRuns();
  }, []);

  async function refreshRuns(options?: { preserveSelection?: boolean }) {
    try {
      const nextRuns = await listAnalyses();
      setRuns(nextRuns);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Runs konnten nicht geladen werden.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveTab("analyse");
    setSelectedRun(null);
    setLoading(true);
    setError(null);

    try {
      const run = await createAnalysis(text);
      setSelectedRun(run);
      setRevealToken((current) => current + 1);
      setText("");
      await refreshRuns({ preserveSelection: true });
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
      setError(null);
      const run = await getAnalysis(runId);
      setSelectedRun(run);
      setText(run.input_text);
      setActiveTab("analyse");
      setRevealToken(0);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Run konnte nicht geladen werden.");
    }
  }

  return (
    <main className="page-shell app-shell">
      <div aria-label="Bereiche" className="top-level-tabs" role="tablist">
        <button
          aria-controls="analyse-panel"
          aria-selected={activeTab === "analyse"}
          className={`tab-button ${activeTab === "analyse" ? "tab-button-active" : ""}`}
          id="analyse-tab"
          onClick={() => setActiveTab("analyse")}
          role="tab"
          type="button"
        >
          Analyse
        </button>
        <button
          aria-controls="archiv-panel"
          aria-selected={activeTab === "archiv"}
          className={`tab-button ${activeTab === "archiv" ? "tab-button-active" : ""}`}
          id="archiv-tab"
          onClick={() => setActiveTab("archiv")}
          role="tab"
          type="button"
        >
          Archiv
        </button>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      {activeTab === "analyse" ? (
        <section aria-labelledby="analyse-tab" className="analysis-layout" id="analyse-panel" role="tabpanel">
          <header className="analysis-context">
            <p className="analysis-context-title">Social Cleanup Machine</p>
            <p className="analysis-context-copy">
              Analysiert komplexe gesellschaftliche Themen in sechs Ebenen: Symptome,
              Ursachen, Emotionen, Narrative, Mythen und Essenz.
            </p>
          </header>
          <AnalysisComposer
            loading={loading}
            onSubmit={handleSubmit}
            onTextChange={setText}
            text={text}
          />
          <div className="app-frame">
            {hasRun ? (
              <section className="app-main">
                <PipelineView viewModel={pipelineViewModel} />
              </section>
            ) : (
              <section className="pipeline-empty-state">
                <p>Noch keine Analyse gestartet</p>
              </section>
            )}
          </div>
        </section>
      ) : (
        <section aria-labelledby="archiv-tab" className="archive-layout" id="archiv-panel" role="tabpanel">
          <RunHistoryPanel
            onRefresh={() => void refreshRuns()}
            onSelectRun={(runId) => void handleSelectRun(runId)}
            runs={runs}
            selectedRunId={selectedRun?.id ?? null}
          />
        </section>
      )}
    </main>
  );
}
