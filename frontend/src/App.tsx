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
  const [workspaceTab, setWorkspaceTab] = useState<"pipeline" | "archive">("pipeline");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealToken, setRevealToken] = useState(0);

  const pipelineViewModel = usePipelineViewModel(selectedRun, revealToken, loading);
  const isReviewMode =
    pipelineViewModel.status === "completed" || pipelineViewModel.status === "failed";
  const isFlowMode =
    pipelineViewModel.status === "submitting" ||
    pipelineViewModel.status === "result_received" ||
    pipelineViewModel.status === "revealing";
  const showArchive = runs.length > 0;

  useEffect(() => {
    if (isFlowMode) {
      setWorkspaceTab("pipeline");
    }
  }, [isFlowMode]);

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
    <main className="page-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <p>Social Clean-Up Machine</p>
          <span>Sequentielle Analysepipeline</span>
        </div>
      </header>

      <AnalysisComposer
        loading={loading}
        onSubmit={handleSubmit}
        onTextChange={setText}
        text={text}
      />

      {error ? <p className="error-banner">{error}</p> : null}

      {showArchive && !isFlowMode ? (
        <nav className="workspace-tabs" aria-label="Arbeitsbereiche">
          <button
            className={workspaceTab === "pipeline" ? "workspace-tab workspace-tab-active" : "workspace-tab"}
            onClick={() => setWorkspaceTab("pipeline")}
            type="button"
          >
            Pipeline
          </button>
          <button
            className={workspaceTab === "archive" ? "workspace-tab workspace-tab-active" : "workspace-tab"}
            onClick={() => setWorkspaceTab("archive")}
            type="button"
          >
            Archiv
          </button>
        </nav>
      ) : null}

      <section className={`workspace-grid ${isReviewMode ? "workspace-grid-review" : "workspace-grid-flow"}`}>
        <div className={`workspace-main ${workspaceTab !== "pipeline" ? "workspace-main-hidden" : ""}`}>
          <PipelineView viewModel={pipelineViewModel} />
        </div>
        {showArchive && workspaceTab === "archive" ? (
          <section className={`workspace-secondary ${isReviewMode ? "workspace-secondary-review" : "workspace-secondary-flow"}`}>
            <div className="workspace-secondary-body">
              <RunHistoryPanel
                onRefresh={() => void refreshRuns()}
                onSelectRun={(runId) => void handleSelectRun(runId)}
                runs={runs}
                selectedRunId={selectedRun?.id ?? null}
              />
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
