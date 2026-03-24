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

  const pipelineViewModel = usePipelineViewModel(selectedRun, revealToken, loading);
  const isProcessing =
    pipelineViewModel.status === "submitting" ||
    pipelineViewModel.status === "result_received" ||
    pipelineViewModel.status === "revealing";
  const isCompletedLike =
    pipelineViewModel.status === "completed" || pipelineViewModel.status === "failed";
  const isIdle = !isProcessing && !isCompletedLike;
  const showArchive = runs.length > 0;

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
      const run = await getAnalysis(runId);
      setSelectedRun(run);
      setRevealToken(0);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Run konnte nicht geladen werden.");
    }
  }

  return (
    <main className="page-shell app-shell">
      <AnalysisComposer
        loading={loading}
        onSubmit={handleSubmit}
        onTextChange={setText}
        text={text}
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="app-frame">
        {!isIdle ? (
          <section className="app-main">
            <PipelineView viewModel={pipelineViewModel} />
          </section>
        ) : null}

        {showArchive && !isProcessing ? (
          <section className={`app-secondary ${isCompletedLike ? "app-secondary-result" : ""}`}>
            <div className="app-secondary-body">
              <RunHistoryPanel
                onRefresh={() => void refreshRuns()}
                onSelectRun={(runId) => void handleSelectRun(runId)}
                runs={runs}
                selectedRunId={selectedRun?.id ?? null}
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
