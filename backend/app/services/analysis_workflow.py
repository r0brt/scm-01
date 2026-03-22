from sqlalchemy.orm import Session

from app.api.errors import ApiError
from app.repositories.run_repository import create_run, get_run, list_runs
from app.services.validation import validate_analysis_payload

STUB_MODEL_ID = "stub-analysis-generator"
STUB_PROMPT_VERSION = "stub-v1"


def _make_stub_analysis_payload(text: str) -> dict:
    summary = f"Stub-Analyse fuer: {text}"
    point = f"Ableitung aus Input: {text}"
    return {
        "beobachtungen": {"zusammenfassung": summary, "punkte": [point]},
        "erklaerungen": {"zusammenfassung": summary, "punkte": [point]},
        "emotionen": {"zusammenfassung": summary, "punkte": [point]},
        "zuschreibungen": {"zusammenfassung": summary, "punkte": [point]},
        "schlussfolgerungen": {"zusammenfassung": summary, "punkte": [point]},
        "massnahmen": {"zusammenfassung": summary, "punkte": [point]},
    }


def create_analysis_run(session: Session, text: str):
    payload = _make_stub_analysis_payload(text)
    validation = validate_analysis_payload(payload)
    analysis_json = validation.analysis.model_dump() if validation.analysis is not None else None

    return create_run(
        session,
        input_text=text,
        analysis_json=analysis_json,
        validation_report=validation.report,
        detected_language="de",
        language_confidence=1.0,
        model_id=STUB_MODEL_ID,
        prompt_version=STUB_PROMPT_VERSION,
        run_status=validation.run_status,
        validation_status=validation.validation_status,
        error_code=validation.error_code,
        error_reason=None if validation.error_code is None else "Stub validation failed",
    )


def get_analysis_run_or_404(session: Session, run_id: int):
    run = get_run(session, run_id)
    if run is None:
        raise ApiError(
            status_code=404,
            code="ANALYSIS_NOT_FOUND",
            message="Analysis run not found",
            details={"analysis_id": run_id},
        )
    return run


def list_analysis_runs(session: Session):
    return list_runs(session)


def rerun_analysis(session: Session, run_id: int):
    run = get_analysis_run_or_404(session, run_id)
    return create_analysis_run(session, run.input_text)
