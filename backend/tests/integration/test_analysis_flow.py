from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app


def make_client(tmp_path: Path) -> TestClient:
    database_url = f"sqlite+pysqlite:///{tmp_path / 'integration.db'}"
    app = create_app(database_url=database_url, initialize_schema=True)
    return TestClient(app)


def test_analysis_flow_create_list_detail_and_rerun(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    created_response = client.post("/api/v1/analyses", json={"text": "Integrationsfall"})
    assert created_response.status_code == 201
    created = created_response.json()

    list_response = client.get("/api/v1/analyses")
    assert list_response.status_code == 200
    listed = list_response.json()
    assert listed[0]["id"] == created["id"]

    detail_response = client.get(f"/api/v1/analyses/{created['id']}")
    assert detail_response.status_code == 200
    assert detail_response.json()["input_text"] == "Integrationsfall"

    rerun_response = client.post(f"/api/v1/analyses/{created['id']}/rerun")
    assert rerun_response.status_code == 201
    rerun = rerun_response.json()
    assert rerun["id"] != created["id"]
    assert rerun["input_text"] == created["input_text"]
