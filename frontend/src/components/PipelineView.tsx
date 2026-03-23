import type { PipelineViewModel } from "../types";

function formatLanguage(language: string | null | undefined): string {
  return language ? language.toUpperCase() : "UNBEKANNT";
}

function formatConfidence(confidence: number | null | undefined): string {
  return typeof confidence === "number" ? confidence.toFixed(2) : "--";
}

type PipelineViewProps = {
  viewModel: PipelineViewModel;
  onExport: () => void;
};

export function PipelineView({ viewModel, onExport }: PipelineViewProps) {
  const run = viewModel.run;
  const lastStageKey = viewModel.stages[viewModel.stages.length - 1]?.key;

  return (
    <section className="pipeline-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">SCM Core</p>
          <h2>{viewModel.headline}</h2>
          <p className="panel-copy">Die Maschine entfaltet die Analyse als vertikale Sequenz von Symptom bis Essenz.</p>
        </div>
        <button disabled={!run} onClick={onExport} type="button">
          JSON exportieren
        </button>
      </div>

      <div className={`machine-status machine-status-${viewModel.tone}`}>
        <strong>{viewModel.headline}</strong>
        <span>{viewModel.description}</span>
      </div>

      {run ? (
        <div className="run-meta">
          <span>Sprache · {formatLanguage(run.detected_language)}</span>
          <span>Confidence · {formatConfidence(run.language_confidence)}</span>
          <span>Modell · {run.model_id}</span>
          <span>Prompt · {run.prompt_version}</span>
          <span>Status · {run.validation_status}</span>
        </div>
      ) : null}

      {viewModel.isTerminalError && run?.error_code ? (
        <section className="machine-stop" aria-label="Fehlerzustand">
          <strong>{run.error_reason ?? "Analyse gestoppt"}</strong>
          <p>{run.error_code}</p>
        </section>
      ) : null}

      <div className="pipeline-frame">
        <div className="pipeline-caption" aria-hidden="true">
          <span>Einspeisung</span>
          <span>Filterstrecke</span>
          <span>Endzustand</span>
        </div>

        <div className="pipeline-timeline" aria-label="Analysepipeline">
          {viewModel.stages.map((stage) => (
            <article
              aria-label={`Stage ${stage.title}`}
              className={[
                "stage-card",
                `stage-card-${stage.status}`,
                stage.key === lastStageKey ? "stage-card-terminal" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={stage.key}
            >
              <div className="stage-card-head">
                <div>
                  <p className="stage-index">{stage.subtitle}</p>
                  <h3>{stage.title}</h3>
                </div>
                <span className={`stage-status stage-status-${stage.status}`}>Status: {stage.status}</span>
              </div>
              <p className="stage-prompt">{stage.prompt}</p>
              <p className="stage-summary">{stage.summary}</p>
              <ul className="stage-entries">
                {stage.entries.map((entry) => (
                  <li key={entry.text}>{entry.text}</li>
                ))}
              </ul>
              {!stage.entries.length ? <p className="stage-empty">Noch kein strukturierter Output.</p> : null}
              {stage.key === lastStageKey ? <p className="stage-terminal-label">Finaler Destillationspunkt</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
