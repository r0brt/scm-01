from sqlalchemy.orm import Session

from app.api.errors import ApiError
from app.language.base import LanguageDetectionResult, LanguageDetector
from app.language.local_detector import (
    SUPPORTED_LANGUAGES,
    UNSUPPORTED_LANGUAGE,
    LocalLanguageDetector,
)
from app.llm.base import AnalysisGenerationResult, AnalysisGenerator
from app.llm.stub import StubAnalysisGenerator
from app.repositories.run_repository import create_run, get_run, list_runs
from app.services.validation import validate_analysis_payload

DEFAULT_ANALYSIS_GENERATOR = StubAnalysisGenerator()
DEFAULT_LANGUAGE_DETECTOR = LocalLanguageDetector()
OUTPUT_LANGUAGE_MISMATCH = "OUTPUT_LANGUAGE_MISMATCH"


def _normalize_generation_result(
    generation: AnalysisGenerationResult | dict,
) -> AnalysisGenerationResult:
    if isinstance(generation, AnalysisGenerationResult):
        return generation

    return AnalysisGenerationResult(
        payload=generation["payload"],
        model_id=generation["model_id"],
        prompt_version=generation["prompt_version"],
    )


def _normalize_language_detection(
    detection: LanguageDetectionResult | dict,
) -> LanguageDetectionResult:
    if isinstance(detection, LanguageDetectionResult):
        return detection

    return LanguageDetectionResult(
        language=detection["language"],
        confidence=detection["confidence"],
        error_code=detection.get("error_code"),
    )
def create_analysis_run(
    session: Session,
    text: str,
    *,
    correlation_id: str,
    adapter: AnalysisGenerator = DEFAULT_ANALYSIS_GENERATOR,
    language_detector: LanguageDetector = DEFAULT_LANGUAGE_DETECTOR,
):
    """Generate, validate, and persist a new analysis run."""
    detection = _normalize_language_detection(language_detector.detect(text))
    language_error = detection.error_code
    if language_error is None and detection.language not in SUPPORTED_LANGUAGES:
        language_error = UNSUPPORTED_LANGUAGE

    if language_error is not None:
        return create_run(
            session,
            correlation_id=correlation_id,
            input_text=text,
            analysis_json=None,
            validation_report={
                "checks": [
                    {
                        "stage": "language",
                        "status": "failed",
                        "error_code": language_error,
                        "details": {
                            "detected_language": detection.language,
                            "language_confidence": detection.confidence,
                        },
                    }
                ]
            },
            detected_language=detection.language,
            language_confidence=detection.confidence,
            model_id="not-run",
            prompt_version="not-run",
            run_status="failed",
            validation_status="invalid",
            error_code=language_error,
            error_reason="Language detection failed",
        )

    generation = _normalize_generation_result(
        adapter.generate_analysis(text, language=detection.language)
    )
    validation = validate_analysis_payload(generation.payload)
    analysis_json = validation.analysis.model_dump() if validation.analysis is not None else None
    validation_report = validation.report

    if analysis_json is not None:
        output_text = _flatten_analysis_text(analysis_json)
        output_detection = _normalize_language_detection(language_detector.detect(output_text))
        if output_detection.error_code is not None or output_detection.language != detection.language:
            validation_report = {
                "checks": [
                    *validation.report["checks"],
                    {
                        "stage": "output_language",
                        "status": "failed",
                        "error_code": OUTPUT_LANGUAGE_MISMATCH,
                        "details": {
                            "expected_language": detection.language,
                            "detected_language": output_detection.language,
                            "language_confidence": output_detection.confidence,
                        },
                    },
                ]
            }
            return create_run(
                session,
                correlation_id=correlation_id,
                input_text=text,
                analysis_json=None,
                validation_report=validation_report,
                detected_language=detection.language,
                language_confidence=detection.confidence,
                model_id=generation.model_id,
                prompt_version=generation.prompt_version,
                run_status="failed",
                validation_status="invalid",
                error_code=OUTPUT_LANGUAGE_MISMATCH,
                error_reason="Output language does not match detected input language",
            )

    return create_run(
        session,
        correlation_id=correlation_id,
        input_text=text,
        analysis_json=analysis_json,
        validation_report=validation_report,
        detected_language=detection.language,
        language_confidence=detection.confidence,
        model_id=generation.model_id,
        prompt_version=generation.prompt_version,
        run_status=validation.run_status,
        validation_status=validation.validation_status,
        error_code=validation.error_code,
        error_reason=None if validation.error_code is None else "Stub validation failed",
    )


def _flatten_analysis_text(payload: dict) -> str:
    parts: list[str] = []
    for level in payload.values():
        if not isinstance(level, dict):
            continue
        beschreibung = level.get("beschreibung")
        if isinstance(beschreibung, str):
            parts.append(beschreibung)
        for entry in level.get("eintraege", []):
            text = entry.get("text") if isinstance(entry, dict) else None
            if isinstance(text, str):
                parts.append(text)
    return "\n".join(parts)


def get_analysis_run_or_404(session: Session, run_id: int):
    """Return a run by id or raise the public 404 API error."""
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
    """Return persisted analysis runs in repository order."""
    return list_runs(session)


def rerun_analysis(
    session: Session,
    run_id: int,
    *,
    correlation_id: str,
    adapter: AnalysisGenerator = DEFAULT_ANALYSIS_GENERATOR,
    language_detector: LanguageDetector = DEFAULT_LANGUAGE_DETECTOR,
):
    """Create a fresh run from the input text of an existing run."""
    run = get_analysis_run_or_404(session, run_id)
    return create_analysis_run(
        session,
        run.input_text,
        correlation_id=correlation_id,
        adapter=adapter,
        language_detector=language_detector,
    )
