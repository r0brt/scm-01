# OpenAPI Contract Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Version the FastAPI OpenAPI contract as a repository evidence artifact and keep it reproducibly in sync with the application.

**Architecture:** FastAPI remains the source of truth for the runtime OpenAPI schema. A small backend script exports `create_app().openapi()` to `docs/api/openapi.json`; a contract test compares the committed snapshot with the current runtime schema. Documentation links the snapshot without changing API behaviour. The API title, version and public error response schema are made explicit in FastAPI metadata so the exported contract is identifiable and complete for documented success and error paths.

**Tech Stack:** Python/FastAPI, pytest, JSON OpenAPI snapshot, Markdown docs.

---

## Scope

- Add an OpenAPI export script.
- Add `docs/api/openapi.json` as a committed snapshot.
- Add a backend test that fails if the snapshot drifts from the runtime OpenAPI schema.
- Link the API contract from README, arc42 and acceptance evidence.
- Make OpenAPI `title` and `version` explicit.
- Document the existing public API error envelope in OpenAPI.

## Non-Scope

- Do not change API endpoints or runtime error handling. OpenAPI metadata and documentation-only response schemas may be made explicit.
- Do not introduce an external OpenAPI generator.
- Do not add UI changes.
- Do not add performance, coverage or NFR tooling.

## Files

- Create: `backend/scripts/export_openapi.py`
- Create: `backend/tests/contracts/test_openapi_snapshot.py`
- Create: `docs/api/openapi.json`
- Modify: `backend/app/api/schemas.py`
- Modify: `backend/app/main.py`
- Modify: `README.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/acceptance-checklist.md`
- Modify: `docs/test-report.md`

## Task 1: Add reproducible OpenAPI export

**Files:**
- Create: `backend/scripts/export_openapi.py`
- Create: `docs/api/openapi.json`
- Modify: `backend/app/api/schemas.py`
- Modify: `backend/app/main.py`

- [x] **Step 1: Make OpenAPI metadata explicit**

Set explicit FastAPI metadata in `backend/app/main.py`:

```python
app = FastAPI(title="Social Cleanup Machine API", version="0.1.0")
```

- [x] **Step 2: Document the public error envelope**

Add OpenAPI-facing models for the existing runtime error shape:

```python
class ErrorPayload(BaseModel):
    code: str
    message: str
    details: dict[str, Any]
    correlation_id: str


class ErrorResponse(BaseModel):
    error: ErrorPayload
```

Reference `ErrorResponse` in the documented `404` and `422` route responses.

- [x] **Step 3: Create the export script**

Create `backend/scripts/export_openapi.py`:

```python
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
OPENAPI_PATH = REPO_ROOT / "docs" / "api" / "openapi.json"

sys.path.insert(0, str(BACKEND_ROOT))

from app.main import create_app  # noqa: E402


def main() -> None:
    """Export the FastAPI OpenAPI contract as a deterministic JSON snapshot."""
    app = create_app(database_url="sqlite+pysqlite:///:memory:", initialize_schema=False)
    OPENAPI_PATH.parent.mkdir(parents=True, exist_ok=True)
    OPENAPI_PATH.write_text(
        json.dumps(app.openapi(), indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
```

- [x] **Step 4: Generate the snapshot**

Run:

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/export_openapi.py
```

Expected result: `docs/api/openapi.json` exists and contains `/api/v1/analyses`, `/api/v1/analyses/{analysis_id}`, `/api/v1/analyses/{analysis_id}/rerun`, `/health`, `ErrorPayload` and `ErrorResponse`.

## Task 2: Add snapshot drift test

**Files:**
- Create: `backend/tests/contracts/test_openapi_snapshot.py`

- [x] **Step 1: Add the test**

Create `backend/tests/contracts/test_openapi_snapshot.py`:

```python
import json
from pathlib import Path

from app.main import create_app


REPO_ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT_PATH = REPO_ROOT / "docs" / "api" / "openapi.json"


def test_openapi_snapshot_matches_runtime_schema() -> None:
    app = create_app(database_url="sqlite+pysqlite:///:memory:", initialize_schema=False)
    expected = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    assert app.openapi() == expected
```

- [x] **Step 2: Add an error contract assertion**

Extend the contract test to assert that `ErrorPayload`, `ErrorResponse` and the documented `404`/`422` responses are present in OpenAPI.

- [x] **Step 3: Verify the test passes**

Run:

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py
```

Expected result: the snapshot test passes.

## Task 3: Link the API contract evidence

**Files:**
- Modify: `README.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/acceptance-checklist.md`
- Modify: `docs/test-report.md`

- [x] **Step 1: Update README navigation and commands**

Add `docs/api/openapi.json` to the evidence navigation and document the export command.

- [x] **Step 2: Update arc42 runtime/cross-cutting text**

In arc42, mention that FastAPI runtime OpenAPI remains the source and that `docs/api/openapi.json` is the versioned snapshot evidence.

- [x] **Step 3: Update acceptance and test evidence**

Add the OpenAPI snapshot test and export command to `docs/acceptance-checklist.md` and `docs/test-report.md`.

## Task 4: Verification

- [x] **Step 1: Run focused checks**

Run:

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py tests/api
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
```

Expected result: focused backend checks pass.

- [x] **Step 2: Inspect OpenAPI paths**

Run:

```bash
rg -n '"/api/v1/analyses"|"/api/v1/analyses/\\{analysis_id\\}"|"/api/v1/analyses/\\{analysis_id\\}/rerun"|"/health"|"ErrorPayload"|"ErrorResponse"' docs/api/openapi.json
```

Expected result: all expected paths and error schemas are present.

- [x] **Step 3: Check status**

Run:

```bash
git status --short
```

Expected result: only planned files are changed.

## Task 5: Commit and PR preparation

- [x] **Step 1: Review diff**

Run:

```bash
git diff -- backend/app/api/schemas.py backend/app/main.py backend/scripts/export_openapi.py backend/tests/contracts/test_openapi_snapshot.py docs/api/openapi.json README.md docs/arc42/06_laufzeitsicht.md docs/arc42/08_querschnittliche_konzepte.md docs/acceptance-checklist.md docs/test-report.md docs/superpowers/plans/2026-05-30-openapi-contract-evidence.md
```

Expected result: OpenAPI evidence only; no API behaviour changes.

- [ ] **Step 2: Commit**

Run:

```bash
git add backend/app/api/schemas.py backend/app/main.py backend/scripts/export_openapi.py backend/tests/contracts/test_openapi_snapshot.py docs/api/openapi.json README.md docs/arc42/06_laufzeitsicht.md docs/arc42/08_querschnittliche_konzepte.md docs/acceptance-checklist.md docs/test-report.md docs/superpowers/plans/2026-05-30-openapi-contract-evidence.md
git commit -m "docs: add openapi contract evidence"
```

- [ ] **Step 3: Push and open draft PR**

Run:

```bash
git push -u origin docs/openapi-contract-evidence
```

Open a draft PR with:

- Title: `Add OpenAPI contract evidence`
- Summary: `Exports and versions the FastAPI OpenAPI schema and adds a drift test plus documentation links.`
- Verification: include the exact commands from Task 4.

## Self-Review

- Spec coverage: The plan provides an exported API contract, a reproducible generation command and a drift test.
- Placeholder scan: The plan contains no placeholders or unspecified implementation steps.
- Scope control: No endpoint, UI, runtime or LLM behaviour changes are planned.
