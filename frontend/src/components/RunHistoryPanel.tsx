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
    <aside className="runs-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Archiv</p>
          <h2>Runs</h2>
          <p className="runs-copy">Vorherige Laeufe bleiben abrufbar, treten aber bewusst hinter die aktive Filterstrecke zurueck.</p>
        </div>
        <button onClick={onRefresh} type="button">
          Aktualisieren
        </button>
      </div>
      {runs.length === 0 ? <p>Keine Runs geladen.</p> : null}
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
