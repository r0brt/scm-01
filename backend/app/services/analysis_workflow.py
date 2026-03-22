from sqlalchemy.orm import Session

from app.api.errors import ApiError
from app.llm.base import AnalysisGenerationResult, AnalysisGenerator
from app.llm.stub import StubAnalysisGenerator
from app.repositories.run_repository import create_run, get_run, list_runs
from app.services.validation import validate_analysis_payload

DEFAULT_ANALYSIS_GENERATOR = StubAnalysisGenerator()


def _normalize_generation_result(generation: AnalysisGenerationResult | dict) -> AnalysisGenerationResult:
    if isinstance(generation, AnalysisGenerationResult):
        return generation

    return AnalysisGenerationResult(
        payload=generation["payload"],
        model_id=generation["model_id"],
        prompt_version=generation["prompt_version"],
    )


def create_analysis_run(
    session: Session, text: str, *, adapter: AnalysisGenerator = DEFAULT_ANALYSIS_GENERATOR
):
    generation = _normalize_generation_result(adapter.generate_analysis(text))
    validation = validate_analysis_payload(generation.payload)
    analysis_json = validation.analysis.model_dump() if validation.analysis is not None else None

    return create_run(
        session,
        input_text=text,
        analysis_json=analysis_json,
        validation_report=validation.report,
        detected_language="de",
        language_confidence=1.0,
        model_id=generation.model_id,
        prompt_version=generation.prompt_version,
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


def rerun_analysis(
    session: Session, run_id: int, *, adapter: AnalysisGenerator = DEFAULT_ANALYSIS_GENERATOR
):
    run = get_analysis_run_or_404(session, run_id)
    return create_analysis_run(session, run.input_text, adapter=adapter)
