import os
from collections.abc import Iterator

from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session

from app.api.errors import (
    ApiError,
    api_error_handler,
    ensure_request_correlation_id,
    request_validation_error_handler,
)
from app.api.schemas import AnalysisCreateRequest, AnalysisRunResponse
from app.db.base import Base
from app.db.session import create_engine, create_session_factory, get_database_url
from app.language.base import LanguageDetector
from app.language.local_detector import LocalLanguageDetector
from app.llm.base import AnalysisGenerator
from app.llm.openai_adapter import OpenAIAnalysisGenerator
from app.llm.stub import StubAnalysisGenerator
from app.services.analysis_workflow import (
    create_analysis_run,
    get_analysis_run_or_404,
    list_analysis_runs,
    rerun_analysis,
)


def _build_analysis_adapter(analysis_adapter: AnalysisGenerator | None) -> AnalysisGenerator:
    """Resolve the configured analysis adapter, preferring explicit injection."""
    if analysis_adapter is not None:
        return analysis_adapter

    provider = os.getenv("SCM_ANALYSIS_PROVIDER", "stub").strip().lower()
    if provider == "openai":
        model_id = os.getenv("SCM_OPENAI_MODEL", "gpt-5.2").strip() or "gpt-5.2"
        return OpenAIAnalysisGenerator(model_id=model_id)

    return StubAnalysisGenerator()


def create_app(
    *,
    database_url: str | None = None,
    initialize_schema: bool = False,
    analysis_adapter: AnalysisGenerator | None = None,
    language_detector: LanguageDetector | None = None,
) -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI()
    adapter = _build_analysis_adapter(analysis_adapter)
    detector = language_detector or LocalLanguageDetector()
    should_initialize_schema = initialize_schema or os.getenv("SCM_INITIALIZE_SCHEMA") == "1"

    engine = create_engine(database_url or get_database_url())
    session_factory = create_session_factory(engine)
    if should_initialize_schema:
        Base.metadata.create_all(engine)

    def get_db() -> Iterator[Session]:
        with session_factory() as session:
            yield session

    app.add_exception_handler(ApiError, api_error_handler)
    app.add_exception_handler(RequestValidationError, request_validation_error_handler)

    @app.middleware("http")
    async def attach_correlation_id(request: Request, call_next):
        ensure_request_correlation_id(request)
        response = await call_next(request)
        return response

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post(
        "/api/v1/analyses",
        response_model=AnalysisRunResponse,
        status_code=status.HTTP_201_CREATED,
    )
    def create_analysis(
        request: AnalysisCreateRequest,
        http_request: Request,
        session: Session = Depends(get_db),
    ) -> AnalysisRunResponse:
        return AnalysisRunResponse.model_validate(
            create_analysis_run(
                session,
                request.text,
                correlation_id=ensure_request_correlation_id(http_request),
                adapter=adapter,
                language_detector=detector,
            )
        )

    @app.get("/api/v1/analyses", response_model=list[AnalysisRunResponse])
    def get_analyses(session: Session = Depends(get_db)) -> list[AnalysisRunResponse]:
        return [AnalysisRunResponse.model_validate(run) for run in list_analysis_runs(session)]

    @app.get("/api/v1/analyses/{analysis_id}", response_model=AnalysisRunResponse)
    def get_analysis(
        analysis_id: int, session: Session = Depends(get_db)
    ) -> AnalysisRunResponse:
        return AnalysisRunResponse.model_validate(get_analysis_run_or_404(session, analysis_id))

    @app.post(
        "/api/v1/analyses/{analysis_id}/rerun",
        response_model=AnalysisRunResponse,
        status_code=status.HTTP_201_CREATED,
    )
    def rerun_existing_analysis(
        analysis_id: int,
        http_request: Request,
        session: Session = Depends(get_db),
    ) -> AnalysisRunResponse:
        return AnalysisRunResponse.model_validate(
            rerun_analysis(
                session,
                analysis_id,
                correlation_id=ensure_request_correlation_id(http_request),
                adapter=adapter,
                language_detector=detector,
            )
        )

    return app


app = create_app()
