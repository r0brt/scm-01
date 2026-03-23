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
            "symptome": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "ursachen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "emotionen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "narrative": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "mythen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "essenz": {"beschreibung": summary, "eintraege": [{"text": point}]},
        }
        return AnalysisGenerationResult(
            payload=payload,
            model_id=STUB_MODEL_ID,
            prompt_version=STUB_PROMPT_VERSION,
        )
