from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AnalysisCreateRequest(BaseModel):
    """Request body for creating a new analysis run."""

    text: str = Field(min_length=1)


class ErrorPayload(BaseModel):
    """Public API error payload."""

    code: str
    message: str
    details: dict[str, Any]
    correlation_id: str


class ErrorResponse(BaseModel):
    """Public API error response envelope."""

    error: ErrorPayload


class AnalysisRunResponse(BaseModel):
    """API response schema for a persisted analysis run."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    correlation_id: str
    input_text: str
    analysis_json: dict[str, Any] | None
    validation_report: dict[str, Any]
    detected_language: str
    language_confidence: float
    model_id: str
    prompt_version: str
    run_status: str
    validation_status: str
    error_code: str | None
    error_reason: str | None
    created_at: datetime
