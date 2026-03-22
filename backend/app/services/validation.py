import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from pydantic import ValidationError

from app.models import Analyse

ROOT = Path(__file__).resolve().parents[3]
SCHEMA_PATH = ROOT / "schemas" / "analysis.schema.json"

SCHEMA_VALIDATION_FAILED = "SCHEMA_VALIDATION_FAILED"
MODEL_VALIDATION_FAILED = "MODEL_VALIDATION_FAILED"


@dataclass(slots=True)
class ValidationResult:
    """Result of validating an analysis payload against contract and model."""

    run_status: str
    validation_status: str
    attempts: int
    error_code: str | None
    analysis: Analyse | None
    report: dict[str, Any]


def load_analysis_schema() -> dict[str, Any]:
    """Load the analysis JSON Schema from the versioned schema directory."""
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def _schema_error_details(payload: dict[str, Any]) -> list[dict[str, Any]]:
    validator = Draft202012Validator(load_analysis_schema())
    errors = sorted(validator.iter_errors(payload), key=lambda error: list(error.path))
    return [
        {
            "message": error.message,
            "validator": error.validator,
            "path": list(error.path),
        }
        for error in errors
    ]


def validate_analysis_payload(
    payload: dict[str, Any], *, attempts: int = 0
) -> ValidationResult:
    """Validate a payload against schema and Pydantic model constraints."""
    schema_errors = _schema_error_details(payload)
    if schema_errors:
        return ValidationResult(
            run_status="failed",
            validation_status="invalid",
            attempts=attempts,
            error_code=SCHEMA_VALIDATION_FAILED,
            analysis=None,
            report={
                "checks": [
                    {
                        "stage": "schema",
                        "status": "failed",
                        "error_code": SCHEMA_VALIDATION_FAILED,
                        "details": schema_errors,
                    }
                ]
            },
        )

    try:
        analysis = Analyse.model_validate(payload)
    except ValidationError as exc:
        return ValidationResult(
            run_status="failed",
            validation_status="invalid",
            attempts=attempts,
            error_code=MODEL_VALIDATION_FAILED,
            analysis=None,
            report={
                "checks": [
                    {"stage": "schema", "status": "passed"},
                    {
                        "stage": "model",
                        "status": "failed",
                        "error_code": MODEL_VALIDATION_FAILED,
                        "details": exc.errors(),
                    },
                ]
            },
        )

    return ValidationResult(
        run_status="completed",
        validation_status="valid",
        attempts=attempts,
        error_code=None,
        analysis=analysis,
        report={
            "checks": [
                {"stage": "schema", "status": "passed"},
                {"stage": "model", "status": "passed"},
            ]
        },
    )
