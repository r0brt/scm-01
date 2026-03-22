export type AnalysisLevel = {
  zusammenfassung: string;
  punkte: string[];
};

export type AnalysisJson = {
  beobachtungen: AnalysisLevel;
  erklaerungen: AnalysisLevel;
  emotionen: AnalysisLevel;
  zuschreibungen: AnalysisLevel;
  schlussfolgerungen: AnalysisLevel;
  massnahmen: AnalysisLevel;
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
