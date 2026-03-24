import { Stage } from "./Stage";
import type { PipelineViewModel } from "../types";

type ResultViewProps = {
  viewModel: PipelineViewModel;
};

function formatLanguage(language: string | null | undefined): string {
  return language ? language.toUpperCase() : "UNBEKANNT";
}

export function ResultView({ viewModel }: ResultViewProps) {
  const run = viewModel.run;
  const isFailed = viewModel.status === "failed";

  return (
    <div className="pipeline-frame pipeline-frame-result">
      <div className="pipeline-caption" aria-hidden="true">
        <span>Einspeisung</span>
        <span>Filterstrecke</span>
        <span>Endzustand</span>
      </div>

      {run && isFailed ? (
        <div className="run-meta">
          <span>Sprache · {formatLanguage(run.detected_language)}</span>
          <span>Modell · {run.model_id}</span>
          <span>Status · {run.validation_status}</span>
        </div>
      ) : null}

      <div className={`machine-status machine-status-${viewModel.tone} machine-status-result`}>
        <strong>{viewModel.headline}</strong>
        <span>{isFailed ? "Der Ablauf wurde vor dem Extraktionspfad gestoppt." : viewModel.description}</span>
      </div>

      {isFailed && run?.error_code ? (
        <section className="machine-stop" aria-label="Fehlerzustand">
          <strong>{run.error_reason ?? "Analyse gestoppt"}</strong>
          <p>{run.error_code}</p>
        </section>
      ) : null}

      <div className="pipeline-timeline pipeline-timeline-result" aria-label="Analysepipeline">
        {viewModel.stages.map((stage) => (
          <Stage key={stage.key} mode={isFailed ? "failed" : "completed"} stage={stage} />
        ))}
      </div>
    </div>
  );
}
