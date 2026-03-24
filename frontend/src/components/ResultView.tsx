import type { PipelineViewModel } from "../types";
import { Stage } from "./Stage";

type ResultViewProps = {
  viewModel: PipelineViewModel;
};

export function ResultView({ viewModel }: ResultViewProps) {
  const run = viewModel.run;
  const isFailed = viewModel.status === "failed";

  return (
    <div className="pipeline-frame pipeline-frame-result">
      {isFailed && run?.error_code ? (
        <section className="pipeline-inline-error" aria-label="Fehlerzustand">
          <strong>{run.error_reason ?? "Analyse gestoppt"}</strong>
          <span>{run.error_code}</span>
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
