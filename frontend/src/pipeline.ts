import { useEffect, useState } from "react";

import type {
  AnalysisRun,
  PipelineStageDefinition,
  PipelineStatus,
  PipelineViewModel,
  StageKey,
  StageStatus,
} from "./types";

function getRevealTimings() {
  const globalScope = globalThis as typeof globalThis & { __SCM_TEST_MODE__?: boolean };
  const isTestMode = globalScope.__SCM_TEST_MODE__ === true;

  return {
    startDelayMs: isTestMode ? 10 : 1400,
    intervalMs: isTestMode ? 40 : 3400,
  };
}

export const PIPELINE_STAGES: PipelineStageDefinition[] = [
  {
    key: "symptome",
    title: "Symptome",
    subtitle: "Stage 01",
    prompt: "Welche beobachtbaren Phaenomene treten unmittelbar hervor?",
  },
  {
    key: "ursachen",
    title: "Ursachen",
    subtitle: "Stage 02",
    prompt: "Welche Strukturen und Erklaerungsansaetze treiben die Symptome?",
  },
  {
    key: "emotionen",
    title: "Emotionen",
    subtitle: "Stage 03",
    prompt: "Welche Affekte, Spannungen und Trigger werden aktiviert?",
  },
  {
    key: "narrative",
    title: "Narrative",
    subtitle: "Stage 04",
    prompt: "Welche Frames und Storylines ordnen den Diskurs?",
  },
  {
    key: "mythen",
    title: "Mythen",
    subtitle: "Stage 05",
    prompt: "Welche Vereinfachungen oder Fehlannahmen bleiben haengen?",
  },
  {
    key: "essenz",
    title: "Essenz",
    subtitle: "Stage 06",
    prompt: "Welche wertfreie Kernaussage bleibt uebrig?",
  },
] as const;

function buildStages(run: AnalysisRun | null, statuses: Record<StageKey, StageStatus>) {
  return PIPELINE_STAGES.map((stage) => {
    const level = run?.analysis_json?.[stage.key];
    return {
      ...stage,
      status: statuses[stage.key],
      summary: level?.beschreibung ?? "Noch keine Ausgabe verfuegbar.",
      entries: level?.eintraege ?? [],
    };
  });
}

function buildStageStatuses(activeIndex: number | null, completedThrough: number): Record<StageKey, StageStatus> {
  return PIPELINE_STAGES.reduce(
    (acc, stage, index) => {
      if (index <= completedThrough) {
        acc[stage.key] = "completed";
      } else if (activeIndex === index) {
        acc[stage.key] = "processing";
      } else {
        acc[stage.key] = "idle";
      }
      return acc;
    },
    {} as Record<StageKey, StageStatus>,
  );
}

function buildIdleViewModel(): PipelineViewModel {
  return {
    headline: "Bereit zur Analyse",
    status: "idle",
    tone: "idle",
    description: "Problemtext eingeben und starten.",
    isTerminalError: false,
    run: null,
    stages: buildStages(null, buildStageStatuses(null, -1)),
  };
}

function buildSubmittingViewModel(run: AnalysisRun | null): PipelineViewModel {
  return {
    headline: "Analyse laeuft",
    status: "submitting",
    tone: "processing",
    description: "Die erste Stufe wird in den Fokus gezogen.",
    isTerminalError: false,
    run,
    stages: buildStages(run, buildStageStatuses(0, -1)),
  };
}

function buildFailureViewModel(run: AnalysisRun): PipelineViewModel {
  return {
    headline: "Analyse blockiert",
    status: "failed",
    tone: "failed",
    description: run.error_reason ?? "Der Analysefluss wurde vorzeitig gestoppt.",
    isTerminalError: true,
    run,
    stages: buildStages(run, buildStageStatuses(null, -1)),
  };
}

function buildCompletedViewModel(run: AnalysisRun): PipelineViewModel {
  return {
    headline: "Analyse abgeschlossen",
    status: "completed",
    tone: "completed",
    description: "Alle sechs Ebenen sind sichtbar.",
    isTerminalError: false,
    run,
    stages: buildStages(run, buildStageStatuses(null, PIPELINE_STAGES.length - 1)),
  };
}

function buildRevealViewModel(
  run: AnalysisRun,
  status: PipelineStatus,
  activeIndex: number,
  completedThrough: number,
): PipelineViewModel {
  return {
    headline: status === "result_received" ? "Analyse laeuft" : "Stufe wird entfaltet",
    status,
    tone: "processing",
    description:
      status === "result_received"
        ? "Die Filterstrecke oeffnet jetzt schrittweise ihre Ebenen."
        : "Die naechste Stufe wird in den Fokus gezogen.",
    isTerminalError: false,
    run,
    stages: buildStages(run, buildStageStatuses(activeIndex, completedThrough)),
  };
}

function isFailedRun(run: AnalysisRun | null): run is AnalysisRun {
  return Boolean(run && (run.run_status === "failed" || run.error_code || !run.analysis_json));
}

export function usePipelineViewModel(selectedRun: AnalysisRun | null, revealToken: number, loading: boolean) {
  const [viewModel, setViewModel] = useState<PipelineViewModel>(() => buildIdleViewModel());

  useEffect(() => {
    const { startDelayMs, intervalMs } = getRevealTimings();

    if (loading) {
      setViewModel(buildSubmittingViewModel(selectedRun));
      return;
    }

    if (!selectedRun) {
      setViewModel(buildIdleViewModel());
      return;
    }

    if (isFailedRun(selectedRun)) {
      setViewModel(buildFailureViewModel(selectedRun));
      return;
    }

    if (revealToken === 0) {
      setViewModel(buildCompletedViewModel(selectedRun));
      return;
    }

    setViewModel(buildRevealViewModel(selectedRun, "result_received", 0, -1));

    let currentIndex = 0;
    let intervalId: number | null = null;
    const startTimeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        currentIndex += 1;

        if (currentIndex >= PIPELINE_STAGES.length) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          setViewModel(buildCompletedViewModel(selectedRun));
          return;
        }

        setViewModel(buildRevealViewModel(selectedRun, "revealing", currentIndex, currentIndex - 1));
      }, intervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimeoutId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [selectedRun, revealToken, loading]);

  return viewModel;
}
