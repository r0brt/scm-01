from fastapi.testclient import TestClient

from app.main import create_app


def test_create_app_uses_openai_adapter_when_configured(
    monkeypatch,
    tmp_path,
) -> None:
    class FakeOpenAIAnalysisGenerator:
        def generate_analysis(self, text: str, *, language: str | None = None):
            return {
                "payload": {
                    "symptome": {"beschreibung": text, "eintraege": [{"text": "A"}]},
                    "ursachen": {"beschreibung": text, "eintraege": [{"text": "B"}]},
                    "emotionen": {"beschreibung": text, "eintraege": [{"text": "C"}]},
                    "narrative": {"beschreibung": text, "eintraege": [{"text": "D"}]},
                    "mythen": {"beschreibung": text, "eintraege": [{"text": "E"}]},
                    "essenz": {"beschreibung": text, "eintraege": [{"text": "F"}]},
                },
                "model_id": "openai-test-model",
                "prompt_version": "v1",
            }

    monkeypatch.setenv("SCM_ANALYSIS_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setattr(
        "app.main.OpenAIAnalysisGenerator",
        lambda: FakeOpenAIAnalysisGenerator(),
    )

    app = create_app(
        database_url=f"sqlite+pysqlite:///{tmp_path / 'factory.db'}",
        initialize_schema=True,
    )
    client = TestClient(app)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot"})

    assert response.status_code == 201
    assert response.json()["model_id"] == "openai-test-model"
    assert response.json()["correlation_id"]


def test_create_app_prefers_explicit_adapter_over_env_provider(monkeypatch, tmp_path) -> None:
    class ExplicitAdapter:
        def generate_analysis(self, text: str, *, language: str | None = None):
            return {
                "payload": {
                    "symptome": {"beschreibung": text, "eintraege": [{"text": "A"}]},
                    "ursachen": {"beschreibung": text, "eintraege": [{"text": "B"}]},
                    "emotionen": {"beschreibung": text, "eintraege": [{"text": "C"}]},
                    "narrative": {"beschreibung": text, "eintraege": [{"text": "D"}]},
                    "mythen": {"beschreibung": text, "eintraege": [{"text": "E"}]},
                    "essenz": {"beschreibung": text, "eintraege": [{"text": "F"}]},
                },
                "model_id": "explicit-model",
                "prompt_version": "v-explicit",
            }

    monkeypatch.setenv("SCM_ANALYSIS_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    app = create_app(
        database_url=f"sqlite+pysqlite:///{tmp_path / 'factory-explicit.db'}",
        initialize_schema=True,
        analysis_adapter=ExplicitAdapter(),
    )
    client = TestClient(app)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot"})

    assert response.status_code == 201
    assert response.json()["model_id"] == "explicit-model"
    assert response.json()["correlation_id"]
