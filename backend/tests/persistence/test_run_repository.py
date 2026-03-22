import json
from pathlib import Path

from app.db.base import Base
from app.db.session import create_engine, create_session_factory
from app.repositories.run_repository import create_run, get_run, list_runs

ROOT = Path(__file__).resolve().parents[3]
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def make_session_factory():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    return create_session_factory(engine)


def test_create_and_get_run_persists_full_payload() -> None:
    session_factory = make_session_factory()
    analysis_json = load_json(FIXTURES / "valid" / "analysis_minimal.json")
    validation_report = {
        "checks": [
            {"stage": "schema", "status": "passed"},
            {"stage": "model", "status": "passed"},
        ]
    }

    with session_factory() as session:
        created = create_run(
            session,
            input_text="Ein Testtext",
            analysis_json=analysis_json,
            validation_report=validation_report,
            detected_language="de",
            language_confidence=0.99,
            model_id="test-model",
            prompt_version="v1",
            run_status="completed",
            validation_status="valid",
            error_code=None,
            error_reason=None,
        )
        loaded = get_run(session, created.id)

    assert loaded is not None
    assert loaded.id == created.id
    assert loaded.input_text == "Ein Testtext"
    assert loaded.analysis_json == analysis_json
    assert loaded.validation_report == validation_report
    assert loaded.detected_language == "de"
    assert loaded.language_confidence == 0.99
    assert loaded.model_id == "test-model"
    assert loaded.prompt_version == "v1"
    assert loaded.run_status == "completed"
    assert loaded.validation_status == "valid"
    assert loaded.error_code is None
    assert loaded.error_reason is None
    assert loaded.created_at is not None


def test_create_run_allows_failed_run_without_analysis_json() -> None:
    session_factory = make_session_factory()

    with session_factory() as session:
        created = create_run(
            session,
            input_text="Fehlerhafter Testtext",
            analysis_json=None,
            validation_report={"checks": [{"stage": "repair", "status": "failed"}]},
            detected_language="de",
            language_confidence=0.51,
            model_id="test-model",
            prompt_version="v1",
            run_status="failed",
            validation_status="invalid",
            error_code="REPAIR_LIMIT_EXCEEDED",
            error_reason="Repair did not produce valid payload",
        )
        loaded = get_run(session, created.id)

    assert loaded is not None
    assert loaded.analysis_json is None
    assert loaded.run_status == "failed"
    assert loaded.validation_status == "invalid"
    assert loaded.error_code == "REPAIR_LIMIT_EXCEEDED"
    assert loaded.error_reason == "Repair did not produce valid payload"


def test_list_runs_returns_newest_first() -> None:
    session_factory = make_session_factory()
    analysis_json = load_json(FIXTURES / "valid" / "analysis_minimal.json")
    validation_report = {"checks": [{"stage": "schema", "status": "passed"}]}

    with session_factory() as session:
        first = create_run(
            session,
            input_text="Erster Lauf",
            analysis_json=analysis_json,
            validation_report=validation_report,
            detected_language="de",
            language_confidence=0.95,
            model_id="test-model",
            prompt_version="v1",
            run_status="completed",
            validation_status="valid",
            error_code=None,
            error_reason=None,
        )
        second = create_run(
            session,
            input_text="Zweiter Lauf",
            analysis_json=analysis_json,
            validation_report=validation_report,
            detected_language="de",
            language_confidence=0.96,
            model_id="test-model",
            prompt_version="v1",
            run_status="completed",
            validation_status="valid",
            error_code=None,
            error_reason=None,
        )
        runs = list_runs(session)

    assert [run.id for run in runs] == [second.id, first.id]
