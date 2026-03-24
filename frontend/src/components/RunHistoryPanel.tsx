import type { AnalysisRun } from "../types";

type RunHistoryPanelProps = {
  runs: AnalysisRun[];
  selectedRunId: number | null;
  onRefresh: () => void;
  onSelectRun: (runId: number) => void;
};

export function RunHistoryPanel({
  runs,
  selectedRunId,
  onRefresh,
  onSelectRun,
}: RunHistoryPanelProps) {
  return (
    <aside aria-label="Archiv" className="runs-panel">
      <div className="panel-header">
        <h2>Archiv</h2>
        <button onClick={onRefresh} type="button">
          Aktualisieren
        </button>
      </div>
      {runs.length === 0 ? <p className="runs-empty-state">Noch keine Analysen gespeichert</p> : null}
      <ul className="runs-list">
        {runs.map((run) => (
          <li key={run.id}>
            <button
              className={`run-item ${selectedRunId === run.id ? "run-item-active" : ""}`}
              onClick={() => onSelectRun(run.id)}
              type="button"
            >
              <span className="run-item-id">#{run.id}</span>
              <strong>{run.input_text}</strong>
              <small>
                {run.run_status} · {run.validation_status}
              </small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
