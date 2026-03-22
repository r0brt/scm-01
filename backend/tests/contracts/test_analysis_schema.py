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


def test_analysis_schema_accepts_richer_valid_payload() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "valid" / "analysis_rich.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload)) == []


def test_analysis_schema_rejects_unknown_top_level_field() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "unknown_top_level_field.json")

    validator = Draft202012Validator(schema)
    errors = list(validator.iter_errors(payload))

    assert any(
        error.validator == "additionalProperties" and list(error.path) == []
        for error in errors
    )


def test_analysis_schema_rejects_empty_punkte() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")

    validator = Draft202012Validator(schema)
    errors = list(validator.iter_errors(payload))

    assert any(
        error.validator == "minItems"
        and list(error.path) == ["beobachtungen", "punkte"]
        for error in errors
    )


def test_analysis_schema_rejects_non_string_punkt() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "non_string_punkt.json")

    validator = Draft202012Validator(schema)
    errors = list(validator.iter_errors(payload))

    assert any(
        error.validator == "type"
        and list(error.path) == ["beobachtungen", "punkte", 0]
        for error in errors
    )


def test_analysis_schema_rejects_missing_zusammenfassung() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "missing_zusammenfassung.json")

    validator = Draft202012Validator(schema)
    errors = list(validator.iter_errors(payload))

    assert any(
        error.validator == "required" and list(error.path) == ["beobachtungen"]
        for error in errors
    )


def test_input_fixture_set_contains_at_least_twenty_texts() -> None:
    inputs_dir = ROOT / "backend" / "tests" / "fixtures" / "inputs"

    text_files = sorted(inputs_dir.glob("*.txt"))

    assert len(text_files) >= 20
