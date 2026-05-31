import sqlite3
from pathlib import Path

from fastapi import Request
from fastapi.testclient import TestClient

from app.api.errors import REQUEST_CORRELATION_ID_KEY, ApiError
from app.main import create_app


class FakeLanguageDetector:
    def __init__(self, language: str = "de", confidence: float = 0.95) -> None:
        self.language = language
        self.confidence = confidence

    def detect(self, _text: str):
        return {
            "language": self.language,
            "confidence": self.confidence,
            "error_code": None if self.confidence >= 0.80 else "LANGUAGE_CONFIDENCE_TOO_LOW",
        }


class FakeAdapter:
    def generate_analysis(self, text: str, *, language: str | None = None):
        return {
            "payload": {
                "symptome": {"beschreibung": text, "eintraege": [{"text": f"{text}-symptom"}]},
                "ursachen": {"beschreibung": text, "eintraege": [{"text": f"{text}-ursache"}]},
                "emotionen": {"beschreibung": text, "eintraege": [{"text": f"{text}-emotion"}]},
                "narrative": {"beschreibung": text, "eintraege": [{"text": f"{text}-narrativ"}]},
                "mythen": {"beschreibung": text, "eintraege": [{"text": f"{text}-mythos"}]},
                "essenz": {"beschreibung": text, "eintraege": [{"text": f"{text}-essenz"}]},
            },
            "model_id": "fake-api-model",
            "prompt_version": "v-fake",
        }


class FailingAdapter:
    def generate_analysis(self, text: str, *, language: str | None = None):
        raise RuntimeError("provider unavailable")


def make_client(
    tmp_path: Path,
    *,
    language: str = "de",
    confidence: float = 0.95,
    analysis_adapter=None,
    raise_server_exceptions: bool = True,
) -> TestClient:
    database_url = f"sqlite+pysqlite:///{tmp_path / 'api.db'}"
    app = create_app(
        database_url=database_url,
        initialize_schema=True,
        analysis_adapter=analysis_adapter or FakeAdapter(),
        language_detector=FakeLanguageDetector(language=language, confidence=confidence),
    )
    return TestClient(app, raise_server_exceptions=raise_server_exceptions)


def test_post_analyses_creates_and_persists_run(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot in der Stadt"})

    assert response.status_code == 201
    payload = response.json()
    assert payload["correlation_id"]
    assert payload["input_text"] == "Wohnungsnot in der Stadt"
    assert payload["run_status"] == "completed"
    assert payload["validation_status"] == "valid"
    assert payload["detected_language"] == "de"
    assert payload["language_confidence"] == 0.95
    assert payload["prompt_version"] == "v-fake"
    assert payload["model_id"] == "fake-api-model"
    assert payload["analysis_json"]["symptome"]["eintraege"]
    assert payload["validation_report"]["checks"][0]["stage"] == "schema"


def test_post_analyses_persists_request_correlation_id(tmp_path: Path, monkeypatch) -> None:
    expected_correlation_id = "corr-http-create"

    def force_request_correlation_id(request: Request) -> str:
        setattr(request.state, REQUEST_CORRELATION_ID_KEY, expected_correlation_id)
        return expected_correlation_id

    monkeypatch.setattr("app.main.ensure_request_correlation_id", force_request_correlation_id)
    client = make_client(tmp_path)

    response = client.post("/api/v1/analyses", json={"text": "Persistiere Request-ID"})

    assert response.status_code == 201
    payload = response.json()
    assert payload["correlation_id"] == expected_correlation_id
    run_id = payload["id"]

    with sqlite3.connect(tmp_path / "api.db") as connection:
        stored_correlation_id = connection.execute(
            "SELECT correlation_id FROM runs WHERE id = ?",
            (run_id,),
        ).fetchone()

    assert stored_correlation_id == (expected_correlation_id,)


def test_get_analyses_returns_created_runs(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Erster Text"}).json()

    response = client.get("/api/v1/analyses")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["id"] == created["id"]
    assert payload[0]["correlation_id"] == created["correlation_id"]
    assert payload[0]["input_text"] == "Erster Text"


def test_get_analysis_by_id_returns_detail(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Detailtext"}).json()

    response = client.get(f"/api/v1/analyses/{created['id']}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == created["id"]
    assert payload["correlation_id"] == created["correlation_id"]
    assert payload["input_text"] == "Detailtext"


def test_post_rerun_creates_new_run_with_same_input(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Bitte neu ausfuehren"}).json()

    response = client.post(f"/api/v1/analyses/{created['id']}/rerun")

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] != created["id"]
    assert payload["correlation_id"]
    assert payload["input_text"] == created["input_text"]
    assert payload["run_status"] == "completed"


def test_post_rerun_creates_new_run_from_failed_source_run(tmp_path: Path) -> None:
    failed_client = make_client(tmp_path, confidence=0.32)
    failed = failed_client.post(
        "/api/v1/analyses", json={"text": "Fehlerlauf bitte erneut pruefen"}
    ).json()

    rerun_client = make_client(tmp_path)
    response = rerun_client.post(f"/api/v1/analyses/{failed['id']}/rerun")

    assert response.status_code == 201
    rerun = response.json()
    assert failed["run_status"] == "failed"
    assert failed["analysis_json"] is None
    assert rerun["id"] != failed["id"]
    assert rerun["input_text"] == failed["input_text"]
    assert rerun["run_status"] == "completed"
    assert rerun["validation_status"] == "valid"

    original_after_rerun = rerun_client.get(f"/api/v1/analyses/{failed['id']}").json()
    assert original_after_rerun["run_status"] == "failed"
    assert original_after_rerun["analysis_json"] is None


def test_run_api_exposes_persisted_correlation_ids_consistently(
    tmp_path: Path, monkeypatch
) -> None:
    def next_request_correlation_id(request: Request) -> str:
        if request.method == "POST" and request.url.path == "/api/v1/analyses":
            correlation_id = "corr-create"
        elif request.method == "POST" and request.url.path.endswith("/rerun"):
            correlation_id = "corr-rerun"
        else:
            correlation_id = "corr-read"
        setattr(request.state, REQUEST_CORRELATION_ID_KEY, correlation_id)
        return correlation_id

    monkeypatch.setattr("app.main.ensure_request_correlation_id", next_request_correlation_id)
    client = make_client(tmp_path)

    created = client.post("/api/v1/analyses", json={"text": "Nachvollziehbarer Lauf"}).json()
    listed = client.get("/api/v1/analyses").json()
    detail = client.get(f"/api/v1/analyses/{created['id']}").json()
    rerun = client.post(f"/api/v1/analyses/{created['id']}/rerun").json()

    assert created["correlation_id"] == "corr-create"
    assert listed[0]["correlation_id"] == "corr-create"
    assert detail["correlation_id"] == "corr-create"
    assert rerun["correlation_id"] == "corr-rerun"


def test_post_analyses_maps_provider_failure_to_error_contract_without_run(
    tmp_path: Path, monkeypatch
) -> None:
    expected_correlation_id = "corr-provider-failure"

    def force_request_correlation_id(request: Request) -> str:
        setattr(request.state, REQUEST_CORRELATION_ID_KEY, expected_correlation_id)
        return expected_correlation_id

    monkeypatch.setattr("app.main.ensure_request_correlation_id", force_request_correlation_id)
    client = make_client(
        tmp_path,
        analysis_adapter=FailingAdapter(),
        raise_server_exceptions=False,
    )

    response = client.post("/api/v1/analyses", json={"text": "Provider faellt aus"})

    assert response.status_code == 502
    assert response.headers["X-Correlation-ID"] == expected_correlation_id
    payload = response.json()
    assert payload["error"]["code"] == "ANALYSIS_PROVIDER_ERROR"
    assert payload["error"]["message"] == "Analysis provider failed"
    assert payload["error"]["details"] == {"stage": "analysis_provider"}
    assert payload["error"]["correlation_id"] == expected_correlation_id

    with sqlite3.connect(tmp_path / "api.db") as connection:
        run_count = connection.execute("SELECT COUNT(*) FROM runs").fetchone()

    assert run_count == (0,)


def test_post_rerun_maps_provider_failure_to_error_contract_without_new_run(
    tmp_path: Path, monkeypatch
) -> None:
    create_client = make_client(tmp_path)
    created = create_client.post(
        "/api/v1/analyses", json={"text": "Rerun Providerfehler"}
    ).json()
    expected_correlation_id = "corr-rerun-provider-failure"

    def force_request_correlation_id(request: Request) -> str:
        setattr(request.state, REQUEST_CORRELATION_ID_KEY, expected_correlation_id)
        return expected_correlation_id

    monkeypatch.setattr("app.main.ensure_request_correlation_id", force_request_correlation_id)
    rerun_client = make_client(
        tmp_path,
        analysis_adapter=FailingAdapter(),
        raise_server_exceptions=False,
    )

    response = rerun_client.post(f"/api/v1/analyses/{created['id']}/rerun")

    assert response.status_code == 502
    assert response.headers["X-Correlation-ID"] == expected_correlation_id
    payload = response.json()
    assert payload["error"]["code"] == "ANALYSIS_PROVIDER_ERROR"
    assert payload["error"]["message"] == "Analysis provider failed"
    assert payload["error"]["details"] == {"stage": "analysis_provider"}
    assert payload["error"]["correlation_id"] == expected_correlation_id

    with sqlite3.connect(tmp_path / "api.db") as connection:
        run_count = connection.execute("SELECT COUNT(*) FROM runs").fetchone()

    assert run_count == (1,)


def test_get_unknown_analysis_returns_error_contract(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.get("/api/v1/analyses/9999")

    assert response.status_code == 404
    payload = response.json()
    assert payload["error"]["code"] == "ANALYSIS_NOT_FOUND"
    assert payload["error"]["message"] == "Analysis run not found"
    assert payload["error"]["details"]["analysis_id"] == 9999
    assert payload["error"]["correlation_id"]


def test_api_error_reuses_request_scoped_correlation_id(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    app = client.app

    @app.get("/_test/api-error")
    def trigger_api_error(request: Request) -> None:
        raise ApiError(
            status_code=409,
            code="TEST_ERROR",
            message="Triggered test error",
            details={
                "request_correlation_id": getattr(
                    request.state, REQUEST_CORRELATION_ID_KEY
                )
            },
        )

    response = client.get("/_test/api-error")

    assert response.status_code == 409
    payload = response.json()
    assert payload["error"]["code"] == "TEST_ERROR"
    assert payload["error"]["correlation_id"] == payload["error"]["details"][
        "request_correlation_id"
    ]


def test_post_analyses_returns_failed_run_for_low_language_confidence(tmp_path: Path) -> None:
    client = make_client(tmp_path, confidence=0.32)

    response = client.post("/api/v1/analyses", json={"text": "Haus logement housing"})

    assert response.status_code == 201
    payload = response.json()
    assert payload["run_status"] == "failed"
    assert payload["validation_status"] == "invalid"
    assert payload["error_code"] == "LANGUAGE_CONFIDENCE_TOO_LOW"
    assert payload["analysis_json"] is None


def test_post_analyses_returns_failed_run_for_unsupported_language(tmp_path: Path) -> None:
    client = make_client(tmp_path, language="it", confidence=0.98)

    response = client.post(
        "/api/v1/analyses",
        json={"text": "La crisi abitativa colpisce molte famiglie."},
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["run_status"] == "failed"
    assert payload["validation_status"] == "invalid"
    assert payload["error_code"] == "UNSUPPORTED_LANGUAGE"
    assert payload["analysis_json"] is None
