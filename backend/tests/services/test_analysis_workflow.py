from pathlib import Path

from app.db.base import Base
from app.db.session import create_engine, create_session_factory
from app.services.analysis_workflow import create_analysis_run


class FakeAdapter:
    def __init__(self) -> None:
        self.calls: list[str] = []

    def generate_analysis(self, text: str):
        self.calls.append(text)
        return {
            "payload": {
                "beobachtungen": {"zusammenfassung": "A", "punkte": ["A"]},
                "erklaerungen": {"zusammenfassung": "B", "punkte": ["B"]},
                "emotionen": {"zusammenfassung": "C", "punkte": ["C"]},
                "zuschreibungen": {"zusammenfassung": "D", "punkte": ["D"]},
                "schlussfolgerungen": {"zusammenfassung": "E", "punkte": ["E"]},
                "massnahmen": {"zusammenfassung": "F", "punkte": ["F"]},
            },
            "model_id": "fake-model",
            "prompt_version": "v-test",
        }


def make_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    session_factory = create_session_factory(engine)
    return session_factory()


def test_create_analysis_run_uses_injected_adapter_metadata() -> None:
    adapter = FakeAdapter()

    with make_session() as session:
        run = create_analysis_run(session, "Adaptertext", adapter=adapter)

    assert adapter.calls == ["Adaptertext"]
    assert run.model_id == "fake-model"
    assert run.prompt_version == "v-test"
    assert run.analysis_json["beobachtungen"]["punkte"] == ["A"]
