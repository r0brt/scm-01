from app.llm.stub import StubAnalysisGenerator


def test_stub_generator_returns_richer_essenz_payload() -> None:
    result = StubAnalysisGenerator().generate_analysis(
        "Die Einkommenschere geht immer weiter auf.",
        language="de",
    )

    essenz = result.payload["essenz"]

    assert len(essenz["eintraege"]) == 3
    assert all(entry["text"] for entry in essenz["eintraege"])
    assert essenz["beschreibung"].count(".") >= 2
