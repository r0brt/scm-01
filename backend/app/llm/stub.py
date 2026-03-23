from app.llm.base import AnalysisGenerationResult

STUB_MODEL_ID = "stub-analysis-generator"
STUB_PROMPT_VERSION = "stub-v1"

SUMMARY_BY_LANGUAGE = {
    "de": "Stub-Analyse fuer",
    "fr": "Analyse fictive pour",
    "en": "Stub analysis for",
}

POINT_BY_LANGUAGE = {
    "de": "Ableitung aus Input",
    "fr": "Derivation du texte",
    "en": "Derived from input",
}


class StubAnalysisGenerator:
    """Generate deterministic placeholder analyses for local and test use."""

    def generate_analysis(
        self, text: str, *, language: str | None = None
    ) -> AnalysisGenerationResult:
        """Return a contract-valid placeholder analysis for the given text."""
        language_key = language or "de"
        summary = f"{SUMMARY_BY_LANGUAGE.get(language_key, SUMMARY_BY_LANGUAGE['de'])}: {text}"
        point = f"{POINT_BY_LANGUAGE.get(language_key, POINT_BY_LANGUAGE['de'])}: {text}"
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
