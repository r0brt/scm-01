import { useEffect, useState } from "react";

import { createAnalysis, getAnalysis, listAnalyses } from "./api";
import { AnalysisComposer } from "./components/AnalysisComposer";
import { PipelineView } from "./components/PipelineView";
import { RunHistoryPanel } from "./components/RunHistoryPanel";
import { usePipelineViewModel } from "./pipeline";
import "./styles.css";
import type { AnalysisRun } from "./types";

export default function App() {
  const [text, setText] = useState("");
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AnalysisRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealToken, setRevealToken] = useState(0);

  const pipelineViewModel = usePipelineViewModel(selectedRun, revealToken);

  useEffect(() => {
    void refreshRuns();
  }, []);

  async function refreshRuns(options?: { preserveSelection?: boolean }) {
    try {
      const nextRuns = await listAnalyses();
      setRuns(nextRuns);
      if (!options?.preserveSelection && !selectedRun && nextRuns[0]) {
        setSelectedRun(nextRuns[0]);
        setRevealToken(0);
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
      const run = await getAnalysis(runId);
      setSelectedRun(run);
      setRevealToken(0);
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
      <header className="topbar">
        <div className="topbar-brand">
          <p>Social Clean-Up Machine</p>
          <span>SCM Interface / Deterministic Filter System</span>
        </div>
        <div className="topbar-state">
          <span>System Status</span>
          <strong>Ready / UX-State-Driven</strong>
        </div>
      </header>

      <AnalysisComposer
        loading={loading}
        onSubmit={handleSubmit}
        onTextChange={setText}
        text={text}
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="workspace-grid">
        <div className="workspace-main">
          <PipelineView onExport={handleExport} viewModel={pipelineViewModel} />
        </div>
        <div className="workspace-side">
          <RunHistoryPanel
            onRefresh={() => void refreshRuns()}
            onSelectRun={(runId) => void handleSelectRun(runId)}
            runs={runs}
            selectedRunId={selectedRun?.id ?? null}
          />
        </div>
      </section>
    </main>
  );
}
