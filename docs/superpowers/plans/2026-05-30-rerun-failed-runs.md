# Rerun Failed Runs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove and document that rerun works for existing runs regardless of success or failure status.

**Architecture:** The backend already implements rerun by loading an existing run, reusing its `input_text`, and creating a fresh run through the normal analysis workflow. This PR should not change runtime behaviour unless tests reveal a gap; it should add service/API coverage and minimal documentation that rerun is a new immutable attempt, not Repair and not an overwrite.

**Tech Stack:** Python 3.13, FastAPI TestClient, pytest, Markdown docs.

---

## Scope

- Add service-level coverage for rerunning a failed analysis run.
- Add API-level coverage for `POST /api/v1/analyses/{id}/rerun` when the source run is failed.
- Clarify PRD/arc42/acceptance wording that rerun applies to existing runs independent of status.

## Non-Scope

- Do not change UI behaviour.
- Do not activate Repair.
- Do not change analysis generation, validation, API routes or persistence schema unless a test exposes a real bug.
- Do not overwrite existing runs.

## Files

- Modify: `backend/tests/services/test_analysis_workflow.py`
- Modify: `backend/tests/api/test_analyses_api.py`
- Modify: `docs/prd.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/acceptance-checklist.md`
- Modify: `docs/test-report.md`

## Task 1: Service-level failed rerun coverage

**Files:**
- Modify: `backend/tests/services/test_analysis_workflow.py`

- [x] **Step 1: Add service test**

Add a test after `test_rerun_analysis_persists_new_correlation_id`:

```python
def test_rerun_analysis_accepts_failed_source_run() -> None:
    failed_adapter = FakeAdapter()
    failed_detector = FakeLanguageDetector(confidence=0.42)
    rerun_adapter = FakeAdapter()
    rerun_detector = FakeLanguageDetector()

    with make_session() as session:
        original = create_analysis_run(
            session,
            "Fehlerlauf erneut ausfuehren",
            correlation_id="corr-failed-original",
            adapter=failed_adapter,
            language_detector=failed_detector,
        )
        original_id = original.id

        rerun = rerun_analysis(
            session,
            original_id,
            correlation_id="corr-failed-rerun",
            adapter=rerun_adapter,
            language_detector=rerun_detector,
        )

    assert original.run_status == "failed"
    assert original.validation_status == "invalid"
    assert original.error_code == "LANGUAGE_CONFIDENCE_TOO_LOW"
    assert original.analysis_json is None
    assert rerun.id != original_id
    assert rerun.input_text == original.input_text
    assert rerun.correlation_id == "corr-failed-rerun"
    assert rerun.run_status == "completed"
    assert rerun.validation_status == "valid"
```

- [x] **Step 2: Run service test**

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/services/test_analysis_workflow.py
```

Expected result: pass if existing behaviour already satisfies PRD semantics.

## Task 2: API-level failed rerun coverage

**Files:**
- Modify: `backend/tests/api/test_analyses_api.py`

- [x] **Step 1: Add API test**

Add a test after `test_post_rerun_creates_new_run_with_same_input`:

```python
def test_post_rerun_creates_new_run_from_failed_source_run(tmp_path: Path) -> None:
    failed_client = make_client(tmp_path, confidence=0.32)
    failed = failed_client.post(
        "/api/v1/analyses", json={"text": "Fehlerlauf bitte erneut pruefen"}
    ).json()

    rerun_client = make_client(tmp_path)
    response = rerun_client.post(f"/api/v1/analyses/{failed['id']}/rerun")

    assert response.status_code == 201
    rerun = response.json()
    assert failed["run_status"] == "failed"
    assert failed["analysis_json"] is None
    assert rerun["id"] != failed["id"]
    assert rerun["input_text"] == failed["input_text"]
    assert rerun["run_status"] == "completed"
    assert rerun["validation_status"] == "valid"

    original_after_rerun = rerun_client.get(f"/api/v1/analyses/{failed['id']}").json()
    assert original_after_rerun["run_status"] == "failed"
    assert original_after_rerun["analysis_json"] is None
```

- [x] **Step 2: Run API tests**

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/api/test_analyses_api.py
```

Expected result: pass if API already supports failed source runs.

## Task 3: Documentation alignment

**Files:**
- Modify: `docs/prd.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/acceptance-checklist.md`
- Modify: `docs/test-report.md`

- [x] **Step 1: Clarify PRD rerun semantics**

Add one sentence under `10.3 Rerun Semantik`:

```markdown
* Rerun ist unabhängig vom Status des ursprünglichen Laufs möglich; auch ein `failed` Lauf kann als neuer Versuch erneut ausgeführt werden.
```

- [x] **Step 2: Clarify arc42 runtime wording**

In `docs/arc42/06_laufzeitsicht.md`, extend scenario 3 with:

```markdown
Der Quell-Run kann erfolgreich oder fehlgeschlagen sein; Rerun ist keine Reparatur des alten Laufs, sondern ein neuer Versuch mit demselben Eingabetext.
```

- [x] **Step 3: Update acceptance checklist**

Add a product/architecture checklist item:

```markdown
- [x] Rerun erzeugt auch aus fehlgeschlagenen Quell-Runs einen neuen unveränderlichen Analyseversuch
```

- [x] **Step 4: Update test report**

Add the focused rerun failure-path command/result and update the backend test count.

## Task 4: Verification and PR

- [x] **Step 1: Run focused verification**

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/services/test_analysis_workflow.py tests/api/test_analyses_api.py
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
```

- [x] **Step 2: Run full backend tests**

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

- [ ] **Step 3: Commit and push**

```bash
git add backend/tests/services/test_analysis_workflow.py backend/tests/api/test_analyses_api.py docs/prd.md docs/arc42/06_laufzeitsicht.md docs/acceptance-checklist.md docs/test-report.md docs/superpowers/plans/2026-05-30-rerun-failed-runs.md
git commit -m "test: cover rerun for failed runs"
git push -u origin test/rerun-failed-runs
```

Open a draft PR:

- Title: `Cover rerun for failed runs`
- Summary: `Adds service/API coverage and documentation for rerunning failed source runs without mutating the original run.`

## Self-Review

- Spec coverage: Covers PRD UJ3, FR9 and 10.3 rerun semantics for failed source runs.
- Placeholder scan: No placeholders or unspecified implementation steps remain.
- Scope control: No UI, Repair, API route or runtime behaviour changes are planned unless tests reveal a real gap.
