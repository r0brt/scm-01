import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { PipelineStageViewModel, PipelineViewModel, StageKey } from "../types";

function formatLanguage(language: string | null | undefined): string {
  return language ? language.toUpperCase() : "UNBEKANNT";
}

function formatConfidence(confidence: number | null | undefined): string {
  return typeof confidence === "number" ? confidence.toFixed(2) : "--";
}

type PipelineViewProps = {
  viewModel: PipelineViewModel;
};

function getPreviewEntries(stage: PipelineStageViewModel) {
  return stage.entries.slice(0, stage.key === "essenz" ? 2 : 1);
}

function getProcessingEntries(stage: PipelineStageViewModel) {
  return stage.entries.slice(0, 2);
}

function getReducedStageCopy(stage: PipelineStageViewModel) {
  if (stage.status === "completed") {
    return "Extraktion gesichert";
  }

  return "Wartet auf Aktivierung";
}

function getStageToggleHint(stage: PipelineStageViewModel, expanded: boolean) {
  if (stage.status !== "completed") {
    return null;
  }

  if (expanded) {
    return "Klick blendet Details wieder aus";
  }

  return stage.entries.length > 3 ? "Klick zeigt alle Eintraege" : "Klick oeffnet die Stage";
}

function getStageFlowClass(stage: PipelineStageViewModel) {
  if (stage.status === "processing") {
    return "stage-card-current";
  }

  if (stage.status === "completed") {
    return "stage-card-past";
  }

  return "stage-card-future";
}

function getCompactSummary(stageKey: StageKey) {
  const compactSummaryByStage: Record<StageKey, string> = {
    symptome: "Sichtbare Hinweise",
    ursachen: "Strukturelle Treiber",
    emotionen: "Dominante Spannung",
    narrative: "Praegende Deutungen",
    mythen: "Verkuerzte Annahmen",
    essenz: "Verdichtete Kernaussage",
  };

  return compactSummaryByStage[stageKey];
}

export function PipelineView({ viewModel }: PipelineViewProps) {
  const run = viewModel.run;
  const lastStageKey = viewModel.stages[viewModel.stages.length - 1]?.key;
  const activeStage = viewModel.stages.find((stage) => stage.status === "processing") ?? null;
  const isProcessingMode =
    viewModel.status === "submitting" ||
    viewModel.status === "result_received" ||
    viewModel.status === "revealing";
  const isReviewMode = viewModel.status === "completed";
  const activeStageIndex = Math.max(
    0,
    viewModel.stages.findIndex((stage) => stage.status === "processing"),
  );
  const activeStageRef = useRef<HTMLElement | null>(null);
  const [expandedStageKeys, setExpandedStageKeys] = useState<StageKey[]>([]);
  const processingHeadline = activeStage
    ? `Analyse laeuft - ${activeStage.title} wird analysiert`
    : "Analyse laeuft";

  useEffect(() => {
    setExpandedStageKeys([]);
  }, [run?.id, viewModel.status]);

  useEffect(() => {
    if (viewModel.status !== "result_received" && viewModel.status !== "revealing") {
      return;
    }

    activeStageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [viewModel.status, viewModel.stages]);

  function isStageExpanded(stage: PipelineStageViewModel) {
    if (stage.status === "processing") {
      return true;
    }
    return stage.status === "completed" && expandedStageKeys.includes(stage.key);
  }

  function toggleStage(stage: PipelineStageViewModel) {
    if (stage.status !== "completed" || activeStage) {
      return;
    }

    setExpandedStageKeys((current) => {
      if (stage.key === "essenz") {
        return current;
      }

      return current.includes(stage.key)
        ? current.filter((key) => key !== stage.key)
        : [...current, stage.key];
    });
  }

  function renderStageCard(
    stage: PipelineStageViewModel,
    options?: {
      reviewMode?: boolean;
      forceExpanded?: boolean;
      compactProcessing?: boolean;
    },
  ) {
    const reviewMode = options?.reviewMode ?? false;
    const compactProcessing = options?.compactProcessing ?? false;
    const expanded = options?.forceExpanded ?? isStageExpanded(stage);
    const previewEntries = getPreviewEntries(stage);
    const processingEntries = getProcessingEntries(stage);
    const toggleHint = getStageToggleHint(stage, expanded);
    const shouldShowFullDetails = expanded && stage.status === "completed";
    const shouldShowCompactSummary = compactProcessing && stage.status === "processing";
    const isProcessingTrack = compactProcessing;
    const shouldRenderContent = isProcessingTrack ? true : stage.status !== "idle";
    const isTerminal = stage.key === lastStageKey;
    const compactSummary = getCompactSummary(stage.key);
    const fullSummary = stage.summary.trim() || compactSummary;
    const reviewBulletLimit = stage.key === "essenz" ? 3 : 2;
    const hasReviewDetails = reviewMode && stage.entries.length > reviewBulletLimit;
    const reviewEntries = shouldShowFullDetails ? stage.entries : stage.entries.slice(0, reviewBulletLimit);
    const isReducedProcessingStage = isProcessingTrack && stage.status !== "processing";
    const reducedStageCopy = getReducedStageCopy(stage);
    function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleStage(stage);
      }
    }

    return (
                <article
        aria-label={`Stage ${stage.title}`}
        className={[
          "stage-card",
          reviewMode ? "stage-card-review" : "stage-card-flow",
          reviewMode && stage.key === "essenz" ? "stage-card-review-essence" : "",
          isProcessingTrack ? "stage-card-processing-track" : "",
          compactProcessing && stage.status === "processing" ? "stage-card-flow-focus" : "",
          getStageFlowClass(stage),
          `stage-card-${stage.status}`,
          expanded ? "stage-card-expanded" : "stage-card-condensed",
          isTerminal ? "stage-card-terminal" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        key={stage.key}
        onClick={() => toggleStage(stage)}
        onKeyDown={handleKeyDown}
        ref={stage.status === "processing" ? activeStageRef : null}
        aria-expanded={expanded}
        data-stage-density={isReducedProcessingStage ? "reduced" : "active"}
        role="article"
        tabIndex={reviewMode && stage.status === "completed" && !activeStage ? 0 : -1}
      >
        <div className="stage-card-head">
          <div>
            {isProcessingTrack ? <p className="stage-index">{stage.subtitle}</p> : null}
            <h3>{stage.title}</h3>
          </div>
          {!compactProcessing && !reviewMode ? (
            <span className={`stage-status stage-status-${stage.status}`}>Status: {stage.status}</span>
          ) : null}
        </div>
        {stage.status === "processing" ? <div className="stage-signal" aria-hidden="true" /> : null}
        {shouldRenderContent ? (
          <div className="stage-content">
            {isReducedProcessingStage ? (
              <p className="stage-summary">{reducedStageCopy}</p>
            ) : stage.status === "processing" ? (
              <>
                {shouldShowCompactSummary ? <p className="stage-summary">{fullSummary}</p> : null}
                <ul className="stage-entries stage-entries-processing">
                  {processingEntries.map((entry) => (
                    <li key={entry.text}>{entry.text}</li>
                  ))}
                </ul>
              </>
            ) : reviewMode ? (
              <>
                <p className="stage-summary">{fullSummary}</p>
                <ul className="stage-entries">
                  {reviewEntries.map((entry) => (
                    <li key={entry.text}>{entry.text}</li>
                  ))}
                </ul>
                {hasReviewDetails ? (
                  <button
                    className="stage-details-toggle"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleStage(stage);
                    }}
                    type="button"
                  >
                    {shouldShowFullDetails ? "Details ausblenden" : "Details anzeigen"}
                  </button>
                ) : null}
              </>
            ) : shouldShowFullDetails ? (
              <>
                <p className="stage-summary">{fullSummary}</p>
                <ul className="stage-entries">
                  {stage.entries.map((entry) => (
                    <li key={entry.text}>{entry.text}</li>
                  ))}
                </ul>
                {toggleHint ? <p className="stage-archive-note">{toggleHint}</p> : null}
              </>
            ) : (
              <>
                <p className="stage-summary">{compactSummary}</p>
                <ul className="stage-entries stage-entries-preview">
                  {previewEntries.map((entry) => (
                    <li key={entry.text}>{entry.text}</li>
                  ))}
                </ul>
                {toggleHint ? <p className="stage-archive-note">{toggleHint}</p> : null}
              </>
            )}
            {!stage.entries.length && !compactProcessing ? (
              <p className="stage-empty">Noch kein strukturierter Output.</p>
            ) : null}
          </div>
        ) : (
          <p className="stage-empty">{compactProcessing ? "Wartet" : "Bereit"}</p>
        )}
        {isTerminal && !compactProcessing && !reviewMode ? (
          <p className="stage-terminal-label">
            {stage.status === "completed" ? "Finales Kondensat" : "Finaler Destillationspunkt"}
          </p>
        ) : null}
      </article>
    );
  }

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

      {!isProcessingMode && !isReviewMode ? (
        <div className={`machine-status machine-status-${viewModel.tone} ${isReviewMode ? "machine-status-review" : "machine-status-flow"}`}>
          <strong>{viewModel.headline}</strong>
          {!isReviewMode ? <span>{viewModel.description}</span> : null}
        </div>
      ) : null}

      {run && viewModel.status === "failed" ? (
        <div className="run-meta">
          <span>Sprache · {formatLanguage(run.detected_language)}</span>
          <span>Modell · {run.model_id}</span>
          <span>Status · {run.validation_status}</span>
        </div>
      ) : null}

      {viewModel.isTerminalError && run?.error_code ? (
        <section className="machine-stop" aria-label="Fehlerzustand">
          <strong>{run.error_reason ?? "Analyse gestoppt"}</strong>
          <p>{run.error_code}</p>
        </section>
      ) : null}

      {isProcessingMode ? (
        <div className="pipeline-frame pipeline-frame-flow">
          <div
            className="pipeline-timeline pipeline-timeline-processing"
            aria-label="Analysepipeline"
            data-active-stage-index={activeStageIndex}
          >
            {viewModel.stages.map((stage) =>
              renderStageCard(stage, {
                forceExpanded: stage.status === "processing",
                compactProcessing: true,
              }),
            )}
          </div>
        </div>
      ) : (
        <div className="pipeline-frame">
          <div className="pipeline-caption" aria-hidden="true">
            <span>Einspeisung</span>
            <span>Filterstrecke</span>
            <span>Endzustand</span>
          </div>

          <div className="pipeline-viewport pipeline-viewport-complete">
            <div className="pipeline-timeline pipeline-timeline-review" aria-label="Analysepipeline">
              {viewModel.stages.map((stage) => renderStageCard(stage, { reviewMode: true }))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
