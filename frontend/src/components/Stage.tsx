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
          <p className="stage-summary">{stage.status === "completed" ? "Extraktion gesichert" : "Wartet auf Aktivierung"}</p>
        ) : null}

        {isActiveProcessingStage ? (
          <>
            <p className="stage-summary">{getCompletedSummary(stage.summary)}</p>
            {processingEntries.length > 0 ? (
              <ul className="stage-entries stage-entries-processing">
                {processingEntries.map((entry) => (
                  <li key={entry.text}>{entry.text}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {isCompletedStage ? (
          <>
            <p className="stage-summary stage-summary-compact">{getCompletedSummary(stage.summary)}</p>
            {completedEntries.length > 0 ? (
              <ul className="stage-entries stage-entries-compact">
                {completedEntries.map((entry) => (
                  <li key={entry.text}>{entry.text}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {isFailedStage ? (
          <p className="stage-summary stage-summary-failed">Keine validen Analyseinhalte vorhanden.</p>
        ) : null}

        {!isFailedStage && !isCompletedStage && !isProcessingStage ? (
          <p className="stage-empty">Bereit</p>
        ) : null}
      </div>
    </article>
  );
});
