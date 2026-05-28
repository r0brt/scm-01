from uuid import uuid4

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

REQUEST_CORRELATION_ID_KEY = "correlation_id"


class ApiError(Exception):
    """Application error mapped to the public API error contract."""

    def __init__(
        self, *, status_code: int, code: str, message: str, details: dict | None = None
    ) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)


def build_error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    details: dict | None = None,
    correlation_id: str,
) -> JSONResponse:
    """Build a standardized JSON API error response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "details": details or {},
                "correlation_id": correlation_id,
            }
        },
    )


def ensure_request_correlation_id(request: Request) -> str:
    """Return the request correlation ID, creating one if necessary."""
    existing = getattr(request.state, REQUEST_CORRELATION_ID_KEY, None)
    if existing:
        return existing

    correlation_id = str(uuid4())
    setattr(request.state, REQUEST_CORRELATION_ID_KEY, correlation_id)
    return correlation_id


def get_request_correlation_id(request: Request | None) -> str:
    """Read the request correlation ID, falling back to a new UUID."""
    if request is not None:
        existing = getattr(request.state, REQUEST_CORRELATION_ID_KEY, None)
        if existing:
            return existing

    return str(uuid4())


async def api_error_handler(request: Request, exc: ApiError) -> JSONResponse:
    """Convert an application error into the public error contract."""
    return build_error_response(
        status_code=exc.status_code,
        code=exc.code,
        message=exc.message,
        details=exc.details,
        correlation_id=get_request_correlation_id(request),
    )


async def request_validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Map FastAPI request validation errors to the public error contract."""
    return build_error_response(
        status_code=422,
        code="INVALID_REQUEST",
        message="Request validation failed",
        details={"errors": exc.errors()},
        correlation_id=get_request_correlation_id(request),
    )
