import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[3]
SCHEMA_PATH = ROOT / "schemas" / "analysis.schema.json"
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_analysis_schema_accepts_minimal_valid_payload() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload)) == []


def test_analysis_schema_rejects_payload_with_missing_level() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "missing_level.json")

    validator = Draft202012Validator(schema)

    errors = list(validator.iter_errors(payload))

    assert any(
        error.validator == "required" and "massnahmen" in error.message
        for error in errors
    )
