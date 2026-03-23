import type { CSSProperties, KeyboardEvent } from "react";
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
  onExport: () => void;
};

function getPreviewEntries(stage: PipelineStageViewModel) {
  return stage.entries.slice(0, stage.key === "essenz" ? 2 : 1);
}

function getProcessingEntries(stage: PipelineStageViewModel) {
  return stage.entries.slice(0, stage.key === "essenz" ? 3 : 2);
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

export function PipelineView({ viewModel, onExport }: PipelineViewProps) {
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
  const completedStageKeys = viewModel.stages
    .filter((stage) => stage.status === "completed")
    .map((stage) => stage.key);
  const areAllCompletedStagesExpanded =
    viewModel.status === "completed" &&
    completedStageKeys.length > 0 &&
    completedStageKeys.every((key) => key === "essenz" || expandedStageKeys.includes(key));
  const timelineStyle = {
    "--active-stage-index": activeStageIndex,
  } as CSSProperties;

  useEffect(() => {
    setExpandedStageKeys(viewModel.status === "completed" ? ["essenz"] : []);
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
    if (viewModel.status === "completed" && stage.key === "essenz") {
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

  function toggleAllCompletedStages() {
    if (viewModel.status !== "completed") {
      return;
    }

    setExpandedStageKeys(
      areAllCompletedStagesExpanded ? ["essenz"] : completedStageKeys,
    );
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
    const shouldShowProcessingNote = stage.entries.length > processingEntries.length && stage.key === "essenz";
    const shouldRenderContent = stage.status !== "idle";
    const isTerminal = stage.key === lastStageKey;
    const compactSummary = getCompactSummary(stage.key);
    const fullSummary = stage.summary.trim() || compactSummary;
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
          compactProcessing ? "stage-card-flow-focus" : "",
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
        role="article"
        tabIndex={stage.status === "completed" && !activeStage ? 0 : -1}
      >
        <div className="stage-card-head">
          <div>
            <h3>{stage.title}</h3>
          </div>
          <span className={`stage-status stage-status-${stage.status}`}>Status: {stage.status}</span>
        </div>
        {stage.status === "processing" ? <div className="stage-signal" aria-hidden="true" /> : null}
        {shouldRenderContent ? (
          <div className="stage-content">
            {stage.status === "processing" ? (
              <>
                <ul className="stage-entries stage-entries-processing">
                  {processingEntries.map((entry) => (
                    <li key={entry.text}>{entry.text}</li>
                  ))}
                </ul>
                {shouldShowProcessingNote ? (
                  <p className="stage-archive-note">Details folgen im Review</p>
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
            {!stage.entries.length ? <p className="stage-empty">Noch kein strukturierter Output.</p> : null}
          </div>
        ) : (
          <p className="stage-empty">{compactProcessing ? "Wartet" : "Bereit"}</p>
        )}
        {isTerminal ? (
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
          <p className="panel-kicker">Filterstrecke</p>
        </div>
        {viewModel.status === "completed" ? (
          <div className="panel-actions">
            <button className="secondary-action" onClick={toggleAllCompletedStages} type="button">
              {areAllCompletedStagesExpanded ? "Alle reduzieren" : "Alle oeffnen"}
            </button>
            <button className="secondary-action secondary-action-ghost" disabled={!run} onClick={onExport} type="button">
              JSON exportieren
            </button>
          </div>
        ) : null}
      </div>

      <div className={`machine-status machine-status-${viewModel.tone} ${isReviewMode ? "machine-status-review" : "machine-status-flow"}`}>
        <strong>{viewModel.headline}</strong>
        {!isReviewMode ? <span>{viewModel.description}</span> : null}
      </div>

      {run && (viewModel.status === "completed" || viewModel.status === "failed") ? (
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
          <div className="pipeline-flow-track" aria-label="Analysepipeline" style={timelineStyle}>
            {viewModel.stages.map((stage, index) => (
              <div
                className={[
                  "flow-node",
                  stage.status === "processing" ? "flow-node-active" : "",
                  stage.status === "completed" ? "flow-node-completed" : "",
                  stage.status === "idle" ? "flow-node-future" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={stage.key}
              >
                <span className="flow-node-dot" aria-hidden="true" />
                <span className="flow-node-label">
                  {index + 1}. {stage.title}
                </span>
              </div>
            ))}
          </div>
          <div className="pipeline-focus-card">
            {activeStage ? renderStageCard(activeStage, { forceExpanded: true, compactProcessing: true }) : null}
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
            <div className="pipeline-timeline" aria-label="Analysepipeline">
              {viewModel.stages.map((stage) => renderStageCard(stage, { reviewMode: true }))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
