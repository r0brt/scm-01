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

  return (
    <section className="pipeline-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">SCM Core</p>
          <h2>{viewModel.headline}</h2>
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

      <div className="pipeline-timeline" aria-label="Analysepipeline">
        {viewModel.stages.map((stage) => (
          <article
            aria-label={`Stage ${stage.title}`}
            className={`stage-card stage-card-${stage.status}`}
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
          </article>
        ))}
      </div>
    </section>
  );
}
