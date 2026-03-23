import json

import pytest

from app.llm.openai_adapter import OpenAIAnalysisGenerator


def test_openai_analysis_generator_requires_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    adapter = OpenAIAnalysisGenerator()

    with pytest.raises(RuntimeError, match="OPENAI_API_KEY"):
        adapter.generate_analysis("Wohnungsnot in der Stadt")


def test_openai_analysis_generator_calls_responses_api_with_json_schema(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FakeResponse:
        output_text = json.dumps(
            {
                "symptome": {"beschreibung": "A", "eintraege": [{"text": "A1"}]},
                "ursachen": {"beschreibung": "B", "eintraege": [{"text": "B1"}]},
                "emotionen": {"beschreibung": "C", "eintraege": [{"text": "C1"}]},
                "narrative": {"beschreibung": "D", "eintraege": [{"text": "D1"}]},
                "mythen": {"beschreibung": "E", "eintraege": [{"text": "E1"}]},
                "essenz": {"beschreibung": "F", "eintraege": [{"text": "F1"}]},
            }
        )

    class FakeResponsesAPI:
        def __init__(self) -> None:
            self.calls: list[dict] = []

        def create(self, **kwargs):
            self.calls.append(kwargs)
            return FakeResponse()

    class FakeOpenAIClient:
        def __init__(self, *, api_key: str) -> None:
            self.api_key = api_key
            self.responses = FakeResponsesAPI()

    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setattr("app.llm.openai_adapter.OpenAI", FakeOpenAIClient)

    adapter = OpenAIAnalysisGenerator()
    result = adapter.generate_analysis("Wohnungsnot in der Stadt")

    assert result.model_id == "gpt-5.2"
    assert result.prompt_version == "v1"
    assert result.payload["symptome"]["beschreibung"] == "A"
    assert adapter.client.responses.calls[0]["text"]["format"]["type"] == "json_schema"
    assert adapter.client.responses.calls[0]["text"]["format"]["strict"] is True
    assert adapter.client.responses.calls[0]["input"] == "Wohnungsnot in der Stadt"
