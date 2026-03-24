import { useEffect, useRef } from "react";

import { ResultView } from "./ResultView";
import { Stage } from "./Stage";
import type { PipelineViewModel } from "../types";

type PipelineViewProps = {
  viewModel: PipelineViewModel;
};

export function PipelineView({ viewModel }: PipelineViewProps) {
  const activeStageIndex = Math.max(
    0,
    viewModel.stages.findIndex((stage) => stage.status === "processing"),
  );
  const activeStageRef = useRef<HTMLElement | null>(null);
  const isProcessingMode =
    viewModel.status === "submitting" ||
    viewModel.status === "result_received" ||
    viewModel.status === "revealing";
  useEffect(() => {
    if (viewModel.status !== "result_received" && viewModel.status !== "revealing") {
      return;
    }

    if (typeof activeStageRef.current?.scrollIntoView === "function") {
      activeStageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [viewModel.status, viewModel.stages]);

  return (
    <section className={`pipeline-panel pipeline-panel-${viewModel.status}`}>
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
