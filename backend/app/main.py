from collections.abc import Iterator

from fastapi import Depends, FastAPI, status
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session

from app.api.errors import ApiError, api_error_handler, request_validation_error_handler
from app.api.schemas import AnalysisCreateRequest, AnalysisRunResponse
from app.db.base import Base
from app.db.session import create_engine, create_session_factory, get_database_url
from app.services.analysis_workflow import (
    create_analysis_run,
    get_analysis_run_or_404,
    list_analysis_runs,
    rerun_analysis,
)


def create_app(*, database_url: str | None = None, initialize_schema: bool = False) -> FastAPI:
    app = FastAPI()

    engine = create_engine(database_url or get_database_url())
    session_factory = create_session_factory(engine)
    if initialize_schema:
        Base.metadata.create_all(engine)

    def get_db() -> Iterator[Session]:
        with session_factory() as session:
            yield session

    app.add_exception_handler(ApiError, api_error_handler)
    app.add_exception_handler(RequestValidationError, request_validation_error_handler)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post(
        "/api/v1/analyses",
        response_model=AnalysisRunResponse,
        status_code=status.HTTP_201_CREATED,
    )
    def create_analysis(
        request: AnalysisCreateRequest, session: Session = Depends(get_db)
    ) -> AnalysisRunResponse:
        return AnalysisRunResponse.model_validate(create_analysis_run(session, request.text))

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
        analysis_id: int, session: Session = Depends(get_db)
    ) -> AnalysisRunResponse:
        return AnalysisRunResponse.model_validate(rerun_analysis(session, analysis_id))

    return app


app = create_app()
