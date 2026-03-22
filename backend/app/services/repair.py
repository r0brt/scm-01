from collections.abc import Callable
from typing import Any

from app.services.validation import ValidationResult, validate_analysis_payload

REPAIR_LIMIT_EXCEEDED = "REPAIR_LIMIT_EXCEEDED"

RepairFunction = Callable[[dict[str, Any], dict[str, Any]], dict[str, Any]]


def validate_with_repair(
    payload: dict[str, Any], repair: RepairFunction, *, max_repairs: int = 2
) -> ValidationResult:
    """Validate a payload and retry through a bounded repair callback."""
    current_payload = payload
    result = validate_analysis_payload(current_payload, attempts=0)
    if result.validation_status == "valid":
        return result

    for attempt in range(1, max_repairs + 1):
        current_payload = repair(current_payload, result.report)
        result = validate_analysis_payload(current_payload, attempts=attempt)
        if result.validation_status == "valid":
            return result

    checks = list(result.report["checks"])
    checks.append(
        {
            "stage": "repair",
            "status": "failed",
            "error_code": REPAIR_LIMIT_EXCEEDED,
            "details": {"max_repairs": max_repairs},
        }
    )

    return ValidationResult(
        run_status="failed",
        validation_status="invalid",
        attempts=max_repairs,
        error_code=REPAIR_LIMIT_EXCEEDED,
        analysis=None,
        report={"checks": checks},
    )
