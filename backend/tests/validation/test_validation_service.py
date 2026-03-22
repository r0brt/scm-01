import json
from pathlib import Path

from app.services.validation import validate_analysis_payload

ROOT = Path(__file__).resolve().parents[3]
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_validate_analysis_payload_returns_successful_result_for_valid_payload() -> None:
    payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")

    result = validate_analysis_payload(payload)

    assert result.run_status == "completed"
    assert result.validation_status == "valid"
    assert result.attempts == 0
    assert result.error_code is None
    assert result.analysis is not None
    assert result.report["checks"] == [
        {"stage": "schema", "status": "passed"},
        {"stage": "model", "status": "passed"},
    ]


def test_validate_analysis_payload_returns_failed_result_for_invalid_payload() -> None:
    payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")

    result = validate_analysis_payload(payload)

    assert result.run_status == "failed"
    assert result.validation_status == "invalid"
    assert result.attempts == 0
    assert result.error_code == "SCHEMA_VALIDATION_FAILED"
    assert result.analysis is None
    assert result.report["checks"][0]["stage"] == "schema"
    assert result.report["checks"][0]["status"] == "failed"
    assert result.report["checks"][0]["error_code"] == "SCHEMA_VALIDATION_FAILED"
    assert result.report["checks"][0]["details"]
