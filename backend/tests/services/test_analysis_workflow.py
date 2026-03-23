from app.db.base import Base
from app.db.session import create_engine, create_session_factory
from app.services.analysis_workflow import create_analysis_run


class FakeLanguageDetector:
    def __init__(
        self,
        language: str = "de",
        confidence: float = 0.95,
        *,
        output_language: str | None = None,
        output_confidence: float | None = None,
    ) -> None:
        self.language = language
        self.confidence = confidence
        self.output_language = output_language or language
        self.output_confidence = output_confidence if output_confidence is not None else confidence
        self.calls: list[str] = []

    def detect(self, text: str):
        self.calls.append(text)
        if len(self.calls) == 1:
            language = self.language
            confidence = self.confidence
        else:
            language = self.output_language
            confidence = self.output_confidence
        return {
            "language": language,
            "confidence": confidence,
            "error_code": None if confidence >= 0.80 else "LANGUAGE_CONFIDENCE_TOO_LOW",
        }


class FakeAdapter:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str | None]] = []

    def generate_analysis(self, text: str, *, language: str | None = None):
        self.calls.append((text, language))
        return {
            "payload": {
                "symptome": {"beschreibung": "A", "eintraege": [{"text": "A"}]},
                "ursachen": {"beschreibung": "B", "eintraege": [{"text": "B"}]},
                "emotionen": {"beschreibung": "C", "eintraege": [{"text": "C"}]},
                "narrative": {"beschreibung": "D", "eintraege": [{"text": "D"}]},
                "mythen": {"beschreibung": "E", "eintraege": [{"text": "E"}]},
                "essenz": {"beschreibung": "F", "eintraege": [{"text": "F"}]},
            },
            "model_id": "fake-model",
            "prompt_version": "v-test",
        }


def make_session():
    """Create an in-memory session for workflow tests."""
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    session_factory = create_session_factory(engine)
    return session_factory()


def test_create_analysis_run_uses_injected_adapter_metadata() -> None:
    adapter = FakeAdapter()
    detector = FakeLanguageDetector()

    with make_session() as session:
        run = create_analysis_run(
            session,
            "Adaptertext",
            adapter=adapter,
            language_detector=detector,
        )

    assert detector.calls[0] == "Adaptertext"
    assert len(detector.calls) == 2
    assert adapter.calls == [("Adaptertext", "de")]
    assert run.detected_language == "de"
    assert run.language_confidence == 0.95
    assert run.model_id == "fake-model"
    assert run.prompt_version == "v-test"
    assert run.analysis_json["symptome"]["eintraege"][0]["text"] == "A"


def test_create_analysis_run_fails_for_low_language_confidence() -> None:
    adapter = FakeAdapter()
    detector = FakeLanguageDetector(confidence=0.42)

    with make_session() as session:
        run = create_analysis_run(
            session,
            "Haus logement housing",
            adapter=adapter,
            language_detector=detector,
        )

    assert detector.calls == ["Haus logement housing"]
    assert adapter.calls == []
    assert run.run_status == "failed"
    assert run.validation_status == "invalid"
    assert run.error_code == "LANGUAGE_CONFIDENCE_TOO_LOW"
    assert run.analysis_json is None


def test_create_analysis_run_fails_for_unsupported_language() -> None:
    adapter = FakeAdapter()
    detector = FakeLanguageDetector(language="it", confidence=0.99)

    with make_session() as session:
        run = create_analysis_run(
            session,
            "La crisi abitativa colpisce molte famiglie.",
            adapter=adapter,
            language_detector=detector,
        )

    assert detector.calls == ["La crisi abitativa colpisce molte famiglie."]
    assert adapter.calls == []
    assert run.run_status == "failed"
    assert run.validation_status == "invalid"
    assert run.error_code == "UNSUPPORTED_LANGUAGE"
    assert run.analysis_json is None


def test_create_analysis_run_fails_when_output_language_does_not_match_input_language() -> None:
    adapter = FakeAdapter()
    detector = FakeLanguageDetector(
        language="de",
        confidence=0.99,
        output_language="en",
        output_confidence=0.99,
    )

    adapter.generate_analysis = lambda text, language=None: {  # type: ignore[method-assign]
        "payload": {
            "symptome": {"beschreibung": "Visible housing pressure", "eintraege": [{"text": "Housing costs rise"}]},
            "ursachen": {"beschreibung": "Market concentration", "eintraege": [{"text": "Supply stays low"}]},
            "emotionen": {"beschreibung": "Public frustration", "eintraege": [{"text": "Anger"}]},
            "narrative": {"beschreibung": "Meritocracy frame", "eintraege": [{"text": "Work harder"}]},
            "mythen": {"beschreibung": "Common simplification", "eintraege": [{"text": "Poverty is a choice"}]},
            "essenz": {"beschreibung": "Core issue", "eintraege": [{"text": "Distribution conflict"}]},
        },
        "model_id": "fake-model",
        "prompt_version": "v-test",
    }

    with make_session() as session:
        run = create_analysis_run(
            session,
            "Die Einkommenschere geht immer weiter auf.",
            adapter=adapter,
            language_detector=detector,
        )

    assert run.run_status == "failed"
    assert run.validation_status == "invalid"
    assert run.error_code == "OUTPUT_LANGUAGE_MISMATCH"
    assert run.analysis_json is None
