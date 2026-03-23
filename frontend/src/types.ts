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
