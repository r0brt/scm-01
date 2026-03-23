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

ESSENCE_DESCRIPTION_BY_LANGUAGE = {
    "de": (
        "Die Essenz verdichtet das Problem auf den grundlegenden Konflikt. "
        "Sie beschreibt, worum es unter der Oberflaeche wirklich geht. "
        "Sie bleibt dabei neutral und knapp."
    ),
    "fr": (
        "L'essence condense le probleme en son conflit central. "
        "Elle decrit ce qui se joue sous la surface. "
        "Elle reste neutre et concise."
    ),
    "en": (
        "The essence condenses the problem into its core conflict. "
        "It states what the issue is fundamentally about beneath the surface. "
        "It stays neutral and concise."
    ),
}

ESSENCE_POINTS_BY_LANGUAGE = {
    "de": [
        "Zentral ist der zugrunde liegende Verteilungskonflikt.",
        "Sichtbare Symptome weisen auf strukturellen Druck hin.",
        "Die Lage verlangt eine verdichtete, nicht polemische Einordnung.",
    ],
    "fr": [
        "Le coeur du probleme est un conflit de repartition.",
        "Les symptomes visibles indiquent une pression structurelle.",
        "La situation demande une formulation condensee et non polemique.",
    ],
    "en": [
        "At the core lies an underlying distribution conflict.",
        "Visible symptoms point to structural pressure.",
        "The situation calls for a condensed, non-polemical framing.",
    ],
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
        essence_description = ESSENCE_DESCRIPTION_BY_LANGUAGE.get(
            language_key,
            ESSENCE_DESCRIPTION_BY_LANGUAGE["de"],
        )
        essence_points = ESSENCE_POINTS_BY_LANGUAGE.get(
            language_key,
            ESSENCE_POINTS_BY_LANGUAGE["de"],
        )
        payload = {
            "symptome": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "ursachen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "emotionen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "narrative": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "mythen": {"beschreibung": summary, "eintraege": [{"text": point}]},
            "essenz": {
                "beschreibung": essence_description,
                "eintraege": [{"text": entry} for entry in essence_points],
            },
        }
        return AnalysisGenerationResult(
            payload=payload,
            model_id=STUB_MODEL_ID,
            prompt_version=STUB_PROMPT_VERSION,
        )
