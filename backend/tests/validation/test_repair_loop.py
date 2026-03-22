import json
from pathlib import Path

from app.services.repair import validate_with_repair

ROOT = Path(__file__).resolve().parents[3]
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_validate_with_repair_returns_success_after_single_repair() -> None:
    invalid_payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")
    valid_payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")

    repair_calls: list[dict] = []

    def repair(payload: dict, report: dict) -> dict:
        repair_calls.append({"payload": payload, "report": report})
        return valid_payload

    result = validate_with_repair(invalid_payload, repair)

    assert result.run_status == "completed"
    assert result.validation_status == "valid"
    assert result.attempts == 1
    assert result.error_code is None
    assert result.analysis is not None
    assert len(repair_calls) == 1


def test_validate_with_repair_fails_after_two_unsuccessful_repairs() -> None:
    invalid_payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")

    repair_attempts: list[dict] = []

    def repair(payload: dict, report: dict) -> dict:
        repair_attempts.append({"payload": payload, "report": report})
        return payload

    result = validate_with_repair(invalid_payload, repair)

    assert result.run_status == "failed"
    assert result.validation_status == "invalid"
    assert result.attempts == 2
    assert result.error_code == "REPAIR_LIMIT_EXCEEDED"
    assert result.analysis is None
    assert len(repair_attempts) == 2
    assert result.report["checks"][-1]["stage"] == "repair"
    assert result.report["checks"][-1]["status"] == "failed"
    assert result.report["checks"][-1]["error_code"] == "REPAIR_LIMIT_EXCEEDED"
