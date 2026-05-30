import logging
from pathlib import Path

from fastapi import Request
from fastapi.testclient import TestClient

from app.api.errors import REQUEST_CORRELATION_ID_KEY
from app.main import create_app


class FakeLanguageDetector:
    def detect(self, _text: str) -> dict[str, object]:
        return {
            "language": "de",
            "confidence": 0.95,
            "error_code": None,
        }


class FakeAdapter:
    def generate_analysis(
        self, text: str, *, language: str | None = None
    ) -> dict[str, object]:
        _ = language
        return {
            "payload": {
                "symptome": {"beschreibung": text, "eintraege": [{"text": "Symptom"}]},
                "ursachen": {"beschreibung": text, "eintraege": [{"text": "Ursache"}]},
                "emotionen": {"beschreibung": text, "eintraege": [{"text": "Emotion"}]},
                "narrative": {"beschreibung": text, "eintraege": [{"text": "Narrativ"}]},
                "mythen": {"beschreibung": text, "eintraege": [{"text": "Mythos"}]},
                "essenz": {"beschreibung": text, "eintraege": [{"text": "Essenz"}]},
            },
            "model_id": "fake-observability-model",
            "prompt_version": "v-fake",
        }


def make_client(
    tmp_path: Path,
    monkeypatch,
    *,
    correlation_id: str = "corr-observability",
) -> TestClient:
    def force_request_correlation_id(request: Request) -> str:
        setattr(request.state, REQUEST_CORRELATION_ID_KEY, correlation_id)
        return correlation_id

    monkeypatch.setattr("app.main.ensure_request_correlation_id", force_request_correlation_id)

    app = create_app(
        database_url=f"sqlite+pysqlite:///{tmp_path / 'observability.db'}",
        initialize_schema=True,
        analysis_adapter=FakeAdapter(),
        language_detector=FakeLanguageDetector(),
    )
    return TestClient(app)


def test_success_response_exposes_request_correlation_id_header(
    tmp_path: Path, monkeypatch
) -> None:
    client = make_client(tmp_path, monkeypatch, correlation_id="corr-success-header")

    response = client.post("/api/v1/analyses", json={"text": "Nachweisbarer Lauf"})

    assert response.status_code == 201
    assert response.json()["correlation_id"] == "corr-success-header"
    assert response.headers["x-correlation-id"] == "corr-success-header"


def test_error_response_exposes_same_correlation_id_in_body_and_header(
    tmp_path: Path, monkeypatch
) -> None:
    client = make_client(tmp_path, monkeypatch, correlation_id="corr-error-header")

    response = client.get("/api/v1/analyses/9999")

    assert response.status_code == 404
    assert response.json()["error"]["correlation_id"] == "corr-error-header"
    assert response.headers["x-correlation-id"] == "corr-error-header"


def test_request_log_contains_traceability_context(
    tmp_path: Path, monkeypatch, caplog
) -> None:
    client = make_client(tmp_path, monkeypatch, correlation_id="corr-log-entry")

    with caplog.at_level(logging.INFO, logger="scm.api"):
        response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["x-correlation-id"] == "corr-log-entry"
    request_logs = [
        record
        for record in caplog.records
        if record.name == "scm.api" and record.message == "request_completed"
    ]
    assert len(request_logs) == 1
    record = request_logs[0]
    assert record.correlation_id == "corr-log-entry"
    assert record.method == "GET"
    assert record.path == "/health"
    assert record.status_code == 200
