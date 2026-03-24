import { useEffect, useRef } from "react";

import { ResultView } from "./ResultView";
import { Stage } from "./Stage";
import type { PipelineViewModel } from "../types";

type PipelineViewProps = {
  viewModel: PipelineViewModel;
};

export function PipelineView({ viewModel }: PipelineViewProps) {
  const activeStage = viewModel.stages.find((stage) => stage.status === "processing") ?? null;
  const activeStageIndex = Math.max(
    0,
    viewModel.stages.findIndex((stage) => stage.status === "processing"),
  );
  const activeStageRef = useRef<HTMLElement | null>(null);
  const isProcessingMode =
    viewModel.status === "submitting" ||
    viewModel.status === "result_received" ||
    viewModel.status === "revealing";
  const processingHeadline = activeStage
    ? `Analyse laeuft - ${activeStage.title} wird analysiert`
    : "Analyse laeuft";

  useEffect(() => {
    if (viewModel.status !== "result_received" && viewModel.status !== "revealing") {
      return;
    }

    activeStageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [viewModel.status, viewModel.stages]);

  return (
    <section className={`pipeline-panel pipeline-panel-${viewModel.status}`}>
      <div className="panel-header">
        <div>
          {isProcessingMode ? (
            <p className="panel-live-status">{processingHeadline}</p>
          ) : (
            <p className="panel-kicker">Filterstrecke</p>
          )}
        </div>
      </div>

      {isProcessingMode ? (
        <div className="pipeline-frame pipeline-frame-flow">
          <div
            className="pipeline-timeline pipeline-timeline-processing"
            aria-label="Analysepipeline"
            data-active-stage-index={activeStageIndex}
          >
            {viewModel.stages.map((stage) => (
              <Stage
                key={stage.key}
                mode="processing"
                ref={stage.status === "processing" ? activeStageRef : undefined}
                stage={stage}
              />
            ))}
          </div>
        </div>
      ) : (
        <ResultView viewModel={viewModel} />
      )}
    </section>
  );
}
