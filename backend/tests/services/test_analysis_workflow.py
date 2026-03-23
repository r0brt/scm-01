from app.db.base import Base
from app.db.session import create_engine, create_session_factory
from app.services.analysis_workflow import create_analysis_run


class FakeLanguageDetector:
    def __init__(self, language: str = "de", confidence: float = 0.95) -> None:
        self.language = language
        self.confidence = confidence
        self.calls: list[str] = []

    def detect(self, text: str):
        self.calls.append(text)
        return {
            "language": self.language,
            "confidence": self.confidence,
            "error_code": None if self.confidence >= 0.80 else "LANGUAGE_CONFIDENCE_TOO_LOW",
        }


class FakeAdapter:
    def __init__(self) -> None:
        self.calls: list[str] = []

    def generate_analysis(self, text: str):
        self.calls.append(text)
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

    assert detector.calls == ["Adaptertext"]
    assert adapter.calls == ["Adaptertext"]
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
