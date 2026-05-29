import { useEffect } from "react";

import type { AnalysisRun } from "../types";

type RunHistoryPanelProps = {
  runs: AnalysisRun[];
  selectedRun: AnalysisRun | null;
  selectedRunId: number | null;
  onRefresh: () => void;
  onOpenInAnalyse: () => void;
  onSelectRun: (runId: number) => void;
};

export function RunHistoryPanel({
  runs,
  selectedRun,
  selectedRunId,
  onRefresh,
  onOpenInAnalyse,
  onSelectRun,
}: RunHistoryPanelProps) {
  useEffect(() => {
    if (!selectedRun) {
      return;
    }

    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [selectedRun?.id]);

  function handleExportRun() {
    if (!selectedRun) {
      return;
    }

    const blob = new Blob([JSON.stringify(selectedRun, null, 2)], {
      type: "application/json",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `scm-run-${selectedRun.id}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  return (
    <div className="archive-workspace">
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
                <strong className="run-item-title" title={run.input_text}>
                  {run.input_text}
                </strong>
                <small className="run-item-status">
                  {run.run_status} · {run.validation_status}
                </small>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section aria-label="Archiv-Details" className="archive-detail-panel">
        {selectedRun ? (
          <>
            <div className="archive-detail-header">
              <div>
                <p className="archive-detail-kicker">Run #{selectedRun.id}</p>
                <h2>{selectedRun.input_text}</h2>
              </div>
              <div className="archive-detail-actions">
                <button onClick={onOpenInAnalyse} type="button">
                  In Analyse öffnen
                </button>
                <button onClick={handleExportRun} type="button">
                  JSON exportieren
                </button>
              </div>
            </div>

            <dl className="archive-metadata-grid">
              <div>
                <dt>Erstellt</dt>
                <dd>{new Date(selectedRun.created_at).toLocaleString("de-CH")}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  {selectedRun.run_status} · {selectedRun.validation_status}
                </dd>
              </div>
              <div>
                <dt>Modell</dt>
                <dd>{selectedRun.model_id}</dd>
              </div>
              <div>
                <dt>Prompt</dt>
                <dd>{selectedRun.prompt_version}</dd>
              </div>
              <div>
                <dt>Correlation ID</dt>
                <dd>{selectedRun.correlation_id}</dd>
              </div>
              <div>
                <dt>Sprache</dt>
                <dd>
                  {selectedRun.detected_language} · {selectedRun.language_confidence.toFixed(2)}
                </dd>
              </div>
              {selectedRun.error_code ? (
                <div>
                  <dt>Fehlercode</dt>
                  <dd>{selectedRun.error_code}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : (
          <div className="archive-detail-empty">
            <p>Run auswählen, um Nachweise und Export zu sehen.</p>
          </div>
        )}
      </section>
    </div>
  );
}
