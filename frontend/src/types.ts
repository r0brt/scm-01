export type AnalysisEntry = {
  text: string;
};

export type AnalysisLevel = {
  beschreibung: string;
  eintraege: AnalysisEntry[];
};

export type AnalysisJson = {
  symptome: AnalysisLevel;
  ursachen: AnalysisLevel;
  emotionen: AnalysisLevel;
  narrative: AnalysisLevel;
  mythen: AnalysisLevel;
  essenz: AnalysisLevel;
};

export type AnalysisRun = {
  id: number;
  input_text: string;
  analysis_json: AnalysisJson | null;
  validation_report: { checks: Array<Record<string, unknown>> };
  detected_language: string;
  language_confidence: number;
  model_id: string;
  prompt_version: string;
  run_status: string;
  validation_status: string;
  error_code: string | null;
  error_reason: string | null;
  created_at: string;
};

export type PipelineStatus =
  | "idle"
  | "submitting"
  | "result_received"
  | "revealing"
  | "completed"
  | "failed";

export type StageStatus = "idle" | "processing" | "completed";

export type StageKey = keyof AnalysisJson;

export type PipelineStageDefinition = {
  key: StageKey;
  title: string;
  subtitle: string;
  prompt: string;
};

export type PipelineStageViewModel = PipelineStageDefinition & {
  status: StageStatus;
  summary: string;
  entries: AnalysisEntry[];
};

export type PipelineViewModel = {
  headline: string;
  status: PipelineStatus;
  tone: "idle" | "processing" | "completed" | "failed";
  description: string;
  isTerminalError: boolean;
  run: AnalysisRun | null;
  stages: PipelineStageViewModel[];
};
