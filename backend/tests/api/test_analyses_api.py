from pathlib import Path

from fastapi.testclient import TestClient

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
    def generate_analysis(self, text: str):
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


def make_client(
    tmp_path: Path,
    *,
    language: str = "de",
    confidence: float = 0.95,
) -> TestClient:
    database_url = f"sqlite+pysqlite:///{tmp_path / 'api.db'}"
    app = create_app(
        database_url=database_url,
        initialize_schema=True,
        analysis_adapter=FakeAdapter(),
        language_detector=FakeLanguageDetector(language=language, confidence=confidence),
    )
    return TestClient(app)


def test_post_analyses_creates_and_persists_run(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot in der Stadt"})

    assert response.status_code == 201
    payload = response.json()
    assert payload["input_text"] == "Wohnungsnot in der Stadt"
    assert payload["run_status"] == "completed"
    assert payload["validation_status"] == "valid"
    assert payload["detected_language"] == "de"
    assert payload["language_confidence"] == 0.95
    assert payload["prompt_version"] == "v-fake"
    assert payload["model_id"] == "fake-api-model"
    assert payload["analysis_json"]["symptome"]["eintraege"]
    assert payload["validation_report"]["checks"][0]["stage"] == "schema"


def test_get_analyses_returns_created_runs(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Erster Text"}).json()

    response = client.get("/api/v1/analyses")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["id"] == created["id"]
    assert payload[0]["input_text"] == "Erster Text"


def test_get_analysis_by_id_returns_detail(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Detailtext"}).json()

    response = client.get(f"/api/v1/analyses/{created['id']}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == created["id"]
    assert payload["input_text"] == "Detailtext"


def test_post_rerun_creates_new_run_with_same_input(tmp_path: Path) -> None:
    client = make_client(tmp_path)
    created = client.post("/api/v1/analyses", json={"text": "Bitte neu ausfuehren"}).json()

    response = client.post(f"/api/v1/analyses/{created['id']}/rerun")

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] != created["id"]
    assert payload["input_text"] == created["input_text"]
    assert payload["run_status"] == "completed"


def test_get_unknown_analysis_returns_error_contract(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.get("/api/v1/analyses/9999")

    assert response.status_code == 404
    payload = response.json()
    assert payload["error"]["code"] == "ANALYSIS_NOT_FOUND"
    assert payload["error"]["message"] == "Analysis run not found"
    assert payload["error"]["details"]["analysis_id"] == 9999
    assert payload["error"]["correlation_id"]


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
