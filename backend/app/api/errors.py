from uuid import uuid4

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ApiError(Exception):
    def __init__(
        self, *, status_code: int, code: str, message: str, details: dict | None = None
    ) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)


def build_error_response(
    *, status_code: int, code: str, message: str, details: dict | None = None
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "details": details or {},
                "correlation_id": str(uuid4()),
            }
        },
    )


async def api_error_handler(_: Request, exc: ApiError) -> JSONResponse:
    return build_error_response(
        status_code=exc.status_code,
        code=exc.code,
        message=exc.message,
        details=exc.details,
    )


async def request_validation_error_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    return build_error_response(
        status_code=422,
        code="INVALID_REQUEST",
        message="Request validation failed",
        details={"errors": exc.errors()},
    )
