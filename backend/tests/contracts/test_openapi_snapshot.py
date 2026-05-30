import json
from pathlib import Path

from app.main import create_app

REPO_ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT_PATH = REPO_ROOT / "docs" / "api" / "openapi.json"
ERROR_RESPONSE_REF = "#/components/schemas/ErrorResponse"


def test_openapi_snapshot_matches_runtime_schema() -> None:
    app = create_app(database_url="sqlite+pysqlite:///:memory:", initialize_schema=False)
    expected = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    assert app.openapi() == expected


def _response_schema_ref(openapi: dict, path: str, method: str, status_code: int) -> str:
    return openapi["paths"][path][method]["responses"][str(status_code)]["content"][
        "application/json"
    ]["schema"]["$ref"]


def test_openapi_documents_public_error_contract() -> None:
    app = create_app(database_url="sqlite+pysqlite:///:memory:", initialize_schema=False)
    openapi = app.openapi()

    schemas = openapi["components"]["schemas"]
    assert schemas["ErrorPayload"]["required"] == [
        "code",
        "message",
        "details",
        "correlation_id",
    ]
    assert schemas["ErrorResponse"]["properties"]["error"]["$ref"] == (
        "#/components/schemas/ErrorPayload"
    )

    assert _response_schema_ref(openapi, "/api/v1/analyses", "post", 422) == ERROR_RESPONSE_REF
    assert (
        _response_schema_ref(openapi, "/api/v1/analyses/{analysis_id}", "get", 404)
        == ERROR_RESPONSE_REF
    )
    assert (
        _response_schema_ref(openapi, "/api/v1/analyses/{analysis_id}", "get", 422)
        == ERROR_RESPONSE_REF
    )
    assert (
        _response_schema_ref(openapi, "/api/v1/analyses/{analysis_id}/rerun", "post", 404)
        == ERROR_RESPONSE_REF
    )
    assert (
        _response_schema_ref(openapi, "/api/v1/analyses/{analysis_id}/rerun", "post", 422)
        == ERROR_RESPONSE_REF
    )
