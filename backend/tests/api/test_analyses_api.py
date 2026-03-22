from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app


def make_client(tmp_path: Path) -> TestClient:
    database_url = f"sqlite+pysqlite:///{tmp_path / 'api.db'}"
    app = create_app(database_url=database_url, initialize_schema=True)
    return TestClient(app)


def test_post_analyses_creates_and_persists_run(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot in der Stadt"})

    assert response.status_code == 201
    payload = response.json()
    assert payload["input_text"] == "Wohnungsnot in der Stadt"
    assert payload["run_status"] == "completed"
    assert payload["validation_status"] == "valid"
    assert payload["prompt_version"] == "stub-v1"
    assert payload["model_id"] == "stub-analysis-generator"
    assert payload["analysis_json"]["beobachtungen"]["punkte"]
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
