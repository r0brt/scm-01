# Traceability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stable request-scoped `correlation_id` that flows from HTTP request handling into API error responses and newly persisted analysis runs, then expose that field through the run API.

**Architecture:** Keep the implementation small and backend-local. A request-scoped `correlation_id` is created once in the FastAPI lifecycle, reused in error responses, passed into the analysis workflow, persisted on new runs, and returned by the API response schema. This improves request-to-run traceability without introducing a broader logging stack.

**Tech Stack:** FastAPI, SQLAlchemy, Alembic, Pydantic, pytest, Markdown docs

---

### Task 1: Introduce request-scoped correlation IDs in the API layer

**Files:**
- Modify: `backend/app/api/errors.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/api/test_analyses_api.py`
- Test: `backend/tests/api/test_health.py`

- [ ] **Step 1: Inspect the current error-contract and app wiring**

Check the current shape before changing it:

```python
# backend/app/api/errors.py
"correlation_id": str(uuid4())
```

```python
# backend/app/main.py
app = FastAPI()
app.add_exception_handler(ApiError, api_error_handler)
```

- [ ] **Step 2: Add a tiny request-correlation helper**

Introduce a helper in `backend/app/api/errors.py` with the target shape:

```python
REQUEST_CORRELATION_ID_KEY = "correlation_id"

def ensure_request_correlation_id(request: Request) -> str:
    existing = getattr(request.state, REQUEST_CORRELATION_ID_KEY, None)
    if existing:
        return existing
    correlation_id = str(uuid4())
    setattr(request.state, REQUEST_CORRELATION_ID_KEY, correlation_id)
    return correlation_id
```

Also add a reader with fallback:

```python
def get_request_correlation_id(request: Request | None) -> str:
    if request is not None:
        existing = getattr(request.state, REQUEST_CORRELATION_ID_KEY, None)
        if existing:
            return existing
    return str(uuid4())
```

- [ ] **Step 3: Rework the error builder to reuse the request ID**

Update `build_error_response(...)` and the handlers along these lines:

```python
def build_error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    details: dict | None = None,
    correlation_id: str,
) -> JSONResponse:
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
```

```python
async def api_error_handler(request: Request, exc: ApiError) -> JSONResponse:
    return build_error_response(
        status_code=exc.status_code,
        code=exc.code,
        message=exc.message,
        details=exc.details,
        correlation_id=get_request_correlation_id(request),
    )
```

- [ ] **Step 4: Add request middleware in the app factory**

Update `backend/app/main.py` so each request gets a stable ID before endpoint logic or exception handling:

```python
from fastapi import Depends, FastAPI, Request, status
from starlette.responses import Response
```

```python
@app.middleware("http")
async def attach_correlation_id(request: Request, call_next):
    ensure_request_correlation_id(request)
    response = await call_next(request)
    return response
```

The middleware does not need to emit a response header in this round unless the existing code already does so.

- [ ] **Step 5: Add or update API tests for stable error IDs**

Add a focused test in `backend/tests/api/test_analyses_api.py` or another API test file, for example:

```python
def test_missing_analysis_uses_request_correlation_id(test_client):
    response = test_client.get("/api/v1/analyses/999")

    assert response.status_code == 404
    payload = response.json()
    assert payload["error"]["code"] == "ANALYSIS_NOT_FOUND"
    assert payload["error"]["correlation_id"]
```

If you can reach the same request state twice in a controlled test, assert reuse; otherwise at least assert the value is present through the standard handler path.

- [ ] **Step 6: Run the smallest relevant backend API tests**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q tests/api/test_analyses_api.py
```

Expected: pass

- [ ] **Step 7: Commit**

```bash
git add /Users/robert/code/scm-01/backend/app/api/errors.py /Users/robert/code/scm-01/backend/app/main.py /Users/robert/code/scm-01/backend/tests/api/test_analyses_api.py
git commit -m "feat: add request-scoped correlation ids"
```

### Task 2: Persist correlation IDs on new runs

**Files:**
- Modify: `backend/app/db/models.py`
- Modify: `backend/app/repositories/run_repository.py`
- Modify: `backend/app/services/analysis_workflow.py`
- Create: `backend/alembic/versions/20260529_01_add_correlation_id_to_runs.py`
- Test: `backend/tests/persistence/test_run_repository.py`
- Test: `backend/tests/services/test_analysis_workflow.py`

- [ ] **Step 1: Extend the model and repository signatures**

Target shape:

```python
# backend/app/db/models.py
correlation_id: Mapped[str] = mapped_column(String(36), nullable=False)
```

```python
# backend/app/repositories/run_repository.py
def create_run(
    session: Session,
    *,
    correlation_id: str,
    input_text: str,
    ...
) -> RunRecord:
```

- [ ] **Step 2: Add the Alembic migration**

Create a migration like:

```python
def upgrade() -> None:
    op.add_column(
        "runs",
        sa.Column("correlation_id", sa.String(length=36), nullable=True),
    )
    op.execute("UPDATE runs SET correlation_id = 'legacy-migration-placeholder' WHERE correlation_id IS NULL")
    op.alter_column("runs", "correlation_id", nullable=False)
```

Adjust the placeholder strategy if you prefer a better deterministic legacy value, but do not leave historical rows null.

The downgrade should drop the column.

- [ ] **Step 3: Thread correlation IDs through the workflow**

Update `backend/app/services/analysis_workflow.py` signatures:

```python
def create_analysis_run(
    session: Session,
    text: str,
    *,
    correlation_id: str,
    adapter: AnalysisGenerator = DEFAULT_ANALYSIS_GENERATOR,
    language_detector: LanguageDetector = DEFAULT_LANGUAGE_DETECTOR,
):
```

Then pass `correlation_id=correlation_id` into every `create_run(...)` call in:
- language failure path
- output-language mismatch path
- success path

Also update `rerun_analysis(...)` to accept and pass through the request correlation ID.

- [ ] **Step 4: Add persistence and workflow tests**

Update repository/persistence tests with concrete assertions, for example:

```python
assert loaded.correlation_id == "corr-test-123"
```

Update workflow tests so created runs preserve the provided request correlation ID:

```python
run = create_analysis_run(
    session,
    "Problemtext",
    correlation_id="corr-workflow-1",
    adapter=fake_adapter,
    language_detector=fake_detector,
)

assert run.correlation_id == "corr-workflow-1"
```

- [ ] **Step 5: Run focused backend tests**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q tests/persistence/test_run_repository.py tests/services/test_analysis_workflow.py
```

Expected: pass

- [ ] **Step 6: Commit**

```bash
git add /Users/robert/code/scm-01/backend/app/db/models.py /Users/robert/code/scm-01/backend/app/repositories/run_repository.py /Users/robert/code/scm-01/backend/app/services/analysis_workflow.py /Users/robert/code/scm-01/backend/alembic/versions/20260529_01_add_correlation_id_to_runs.py /Users/robert/code/scm-01/backend/tests/persistence/test_run_repository.py /Users/robert/code/scm-01/backend/tests/services/test_analysis_workflow.py
git commit -m "feat: persist run correlation ids"
```

### Task 3: Expose correlation IDs through the run API

**Files:**
- Modify: `backend/app/api/schemas.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/api/test_analyses_api.py`
- Test: `backend/tests/api/test_app_factory.py`

- [ ] **Step 1: Extend the public response schema**

Add the field to `AnalysisRunResponse`:

```python
correlation_id: str
```

- [ ] **Step 2: Pass request IDs into create/rerun endpoints**

Update the endpoint signatures in `backend/app/main.py`:

```python
def create_analysis(
    request: AnalysisCreateRequest,
    http_request: Request,
    session: Session = Depends(get_db),
) -> AnalysisRunResponse:
```

Then call:

```python
create_analysis_run(
    session,
    request.text,
    correlation_id=ensure_request_correlation_id(http_request),
    adapter=adapter,
    language_detector=detector,
)
```

Do the same for `rerun_existing_analysis(...)`.

List/detail endpoints do not need to generate new IDs; they should just expose the stored field through the response schema.

- [ ] **Step 3: Add API tests for successful run correlation IDs**

Add or update tests like:

```python
def test_create_analysis_returns_correlation_id(test_client):
    response = test_client.post("/api/v1/analyses", json={"text": "Wohnungsnot"})
    payload = response.json()

    assert response.status_code == 201
    assert payload["correlation_id"]
```

And for detail/list responses:

```python
assert payload["correlation_id"] == created_payload["correlation_id"]
```

- [ ] **Step 4: Run focused API tests**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q tests/api/test_analyses_api.py tests/api/test_app_factory.py
```

Expected: pass

- [ ] **Step 5: Commit**

```bash
git add /Users/robert/code/scm-01/backend/app/api/schemas.py /Users/robert/code/scm-01/backend/app/main.py /Users/robert/code/scm-01/backend/tests/api/test_analyses_api.py /Users/robert/code/scm-01/backend/tests/api/test_app_factory.py
git commit -m "feat: expose run correlation ids"
```

### Task 4: Refresh traceability documentation and final verification

**Files:**
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/privacy-and-ai-governance.md`
- Modify: `docs/acceptance-checklist.md`
- Modify: `docs/test-report.md` only if verification results need to be recorded

- [ ] **Step 1: Update traceability wording in arc42**

Refresh the relevant section so it no longer says the `correlation_id` is only a point-in-time error-contract helper. Target wording should reflect:

```md
- requestgebundene `correlation_id`
- Persistenz auf neuen Runs
- gleiche ID in Fehlerantwort und Run
- weiterhin noch kein vollständiger Ende-zu-Ende-Audit-Trail über alle Schichten
```

- [ ] **Step 2: Update the governance companion**

Adjust the traceability and governance sections in `docs/privacy-and-ai-governance.md` to reflect the improved request-to-run path while keeping the current MVP limits honest.

- [ ] **Step 3: Align the acceptance checklist**

Refine checklist bullets so they acknowledge the improved traceability without implying full observability or full audit coverage.

- [ ] **Step 4: Run the broadest relevant backend verification**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q
```

Expected: pass

- [ ] **Step 5: Verify diff hygiene**

Run:

```bash
cd /Users/robert/code/scm-01
git diff --check
```

Expected: no output

- [ ] **Step 6: Commit**

```bash
git add /Users/robert/code/scm-01/docs/arc42/08_querschnittliche_konzepte.md /Users/robert/code/scm-01/docs/privacy-and-ai-governance.md /Users/robert/code/scm-01/docs/acceptance-checklist.md
git commit -m "docs: update traceability documentation"
```
