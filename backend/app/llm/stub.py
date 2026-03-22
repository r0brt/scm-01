from app.llm.base import AnalysisGenerationResult

STUB_MODEL_ID = "stub-analysis-generator"
STUB_PROMPT_VERSION = "stub-v1"


class StubAnalysisGenerator:
    """Generate deterministic placeholder analyses for local and test use."""

    def generate_analysis(self, text: str) -> AnalysisGenerationResult:
        """Return a contract-valid placeholder analysis for the given text."""
        summary = f"Stub-Analyse fuer: {text}"
        point = f"Ableitung aus Input: {text}"
        payload = {
            "beobachtungen": {"zusammenfassung": summary, "punkte": [point]},
            "erklaerungen": {"zusammenfassung": summary, "punkte": [point]},
            "emotionen": {"zusammenfassung": summary, "punkte": [point]},
            "zuschreibungen": {"zusammenfassung": summary, "punkte": [point]},
            "schlussfolgerungen": {"zusammenfassung": summary, "punkte": [point]},
            "massnahmen": {"zusammenfassung": summary, "punkte": [point]},
        }
        return AnalysisGenerationResult(
            payload=payload,
            model_id=STUB_MODEL_ID,
            prompt_version=STUB_PROMPT_VERSION,
        )
