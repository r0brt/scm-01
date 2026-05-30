import json
from pathlib import Path

from app.main import create_app

REPO_ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT_PATH = REPO_ROOT / "docs" / "api" / "openapi.json"


def test_openapi_snapshot_matches_runtime_schema() -> None:
    app = create_app(database_url="sqlite+pysqlite:///:memory:", initialize_schema=False)
    expected = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    assert app.openapi() == expected
