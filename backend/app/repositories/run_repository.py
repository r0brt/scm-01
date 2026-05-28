from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import RunRecord


def create_run(
    session: Session,
    *,
    correlation_id: str,
    input_text: str,
    analysis_json: dict[str, Any] | None,
    validation_report: dict[str, Any],
    detected_language: str,
    language_confidence: float,
    model_id: str,
    prompt_version: str,
    run_status: str,
    validation_status: str,
    error_code: str | None,
    error_reason: str | None,
) -> RunRecord:
    """Persist and return a new analysis run."""
    run = RunRecord(
        correlation_id=correlation_id,
        input_text=input_text,
        analysis_json=analysis_json,
        validation_report=validation_report,
        detected_language=detected_language,
        language_confidence=language_confidence,
        model_id=model_id,
        prompt_version=prompt_version,
        run_status=run_status,
        validation_status=validation_status,
        error_code=error_code,
        error_reason=error_reason,
    )
    session.add(run)
    session.commit()
    session.refresh(run)
    return run


def get_run(session: Session, run_id: int) -> RunRecord | None:
    """Return a single run by id or ``None`` if it does not exist."""
    return session.get(RunRecord, run_id)


def list_runs(session: Session) -> list[RunRecord]:
    """Return analysis runs ordered from newest to oldest."""
    statement = select(RunRecord).order_by(RunRecord.created_at.desc(), RunRecord.id.desc())
    return list(session.scalars(statement))
