import { forwardRef } from "react";

import type { PipelineStageViewModel } from "../types";

type StageMode = "processing" | "completed" | "failed";

type StageProps = {
  mode: StageMode;
  stage: PipelineStageViewModel;
};

function getCompletedEntryLimit(stage: PipelineStageViewModel) {
  return stage.key === "essenz" ? 3 : 2;
}

function getCompletedSummary(summary: string) {
  return summary.trim() || "Noch keine Ausgabe verfuegbar.";
}

export const Stage = forwardRef<HTMLElement, StageProps>(function Stage({ mode, stage }, ref) {
  const isProcessingStage = mode === "processing";
  const isCompletedStage = mode === "completed";
  const isFailedStage = mode === "failed";
  const isActiveProcessingStage = isProcessingStage && stage.status === "processing";
  const isReducedProcessingStage = isProcessingStage && stage.status !== "processing";
  const completedEntries = stage.entries.slice(0, getCompletedEntryLimit(stage));
  const processingEntries = stage.entries.slice(0, 2);
  const density = isFailedStage
    ? "failed"
    : isCompletedStage
      ? "compact"
      : isReducedProcessingStage
        ? "reduced"
        : "active";
  const tone = isFailedStage
    ? "failed"
    : isActiveProcessingStage
      ? "active"
      : isCompletedStage || stage.status === "completed"
        ? "completed"
        : "upcoming";

  return (
    <article
      aria-label={`Stage ${stage.title}`}
      className={[
        "stage-card",
        `stage-card-mode-${mode}`,
        `stage-card-status-${stage.status}`,
        stage.key === "essenz" ? "stage-card-essenz" : "",
        isActiveProcessingStage ? "stage-card-processing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-stage-density={density}
      data-stage-emphasis={stage.key === "essenz" ? "essenz" : "default"}
      data-stage-tone={tone}
      ref={isActiveProcessingStage ? ref : null}
      role="article"
    >
      <div className="stage-card-head">
        <div>
          <p className="stage-index">{stage.subtitle}</p>
          <h3>{stage.title}</h3>
        </div>
      </div>

      {isActiveProcessingStage ? <div className="stage-signal" aria-hidden="true" /> : null}

      <div className="stage-content">
        {isReducedProcessingStage ? (
          <span className="stage-state-chip">
            {stage.status === "completed" ? "Gesichert" : "Wartet"}
          </span>
        ) : null}

        {isActiveProcessingStage ? (
          <>
            {processingEntries.length > 0 ? (
              <ul className="stage-entries stage-entries-processing">
                {processingEntries.map((entry) => (
                  <li key={entry.text}>{entry.text}</li>
                ))}
              </ul>
            ) : (
              <ul className="stage-entries stage-entries-processing">
                <li>{getCompletedSummary(stage.summary)}</li>
              </ul>
            )}
          </>
        ) : null}

        {isCompletedStage ? (
          <>
            {completedEntries.length > 0 ? (
              <ul className="stage-entries stage-entries-compact">
                {completedEntries.map((entry) => (
                  <li key={entry.text}>{entry.text}</li>
                ))}
              </ul>
            ) : (
              <ul className="stage-entries stage-entries-compact">
                <li>{getCompletedSummary(stage.summary)}</li>
              </ul>
            )}
          </>
        ) : null}

        {isFailedStage ? (
          <ul className="stage-entries stage-entries-failed">
            <li>Keine validen Analyseinhalte vorhanden.</li>
          </ul>
        ) : null}

        {!isFailedStage && !isCompletedStage && !isProcessingStage ? (
          <span className="stage-state-chip">Bereit</span>
        ) : null}
      </div>
    </article>
  );
});
