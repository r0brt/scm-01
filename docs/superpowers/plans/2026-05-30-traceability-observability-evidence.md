# Traceability Observability Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Requestgebundene `correlation_id` als kleinen, reproduzierbaren Nachweis über API-Body, Error-Contract, `X-Correlation-ID` Header, OpenAPI und Request-Log-Kontext absichern.

**Architecture:** Die bestehende FastAPI-Middleware bleibt der zentrale Ort für requestgebundene Korrelation. Analyse-Workflow, Run-Persistenz, API-Routenlogik und Frontend-Verhalten bleiben unverändert; ergänzt werden nur additiver Response-Header, strukturierter Log-Kontext und OpenAPI-Dokumentation.

**Tech Stack:** Python 3.13, FastAPI, pytest/TestClient, Standard-Library `logging`, OpenAPI-Snapshot, arc42/Testreport.

---

### Task 1: API-Observability test-first absichern

**Files:**
- Create: `backend/tests/api/test_traceability_observability.py`
- Modify: `backend/app/main.py`

- [ ] Write tests for success responses, error responses and request-completion logs.
- [ ] Verify RED with `uv run --python 3.13 pytest -q tests/api/test_traceability_observability.py`; expected failure: missing `x-correlation-id` header.
- [ ] Set `X-Correlation-ID` in middleware and log `request_completed` with `correlation_id`, method, path and status code.
- [ ] Verify GREEN with the same focused test; expected pass.

### Task 2: OpenAPI contract evidence ergänzen

**Files:**
- Modify: `backend/tests/contracts/test_openapi_snapshot.py`
- Modify: `docs/api/openapi.json`
- Modify: `backend/app/main.py`

- [ ] Add a contract test that checks `X-Correlation-ID` response headers on health, analysis, lookup and rerun responses.
- [ ] Verify RED with `uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py`; expected failure: headers not documented or snapshot mismatch.
- [ ] Document the header in FastAPI route responses and regenerate the snapshot with `uv run --python 3.13 python scripts/export_openapi.py`.
- [ ] Verify GREEN with the OpenAPI snapshot test.

### Task 3: Dokumentation und Nachweise aktualisieren

**Files:**
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `docs/test-report.md`
- Modify: `docs/acceptance-checklist.md`

- [ ] Describe the new header/log evidence as NFR4 traceability support.
- [ ] Keep the limitation explicit: no central log aggregation and no production-grade end-to-end audit trail.

### Task 4: Final verification

- [ ] Focused checks:
  `uv run --python 3.13 pytest -q tests/api/test_traceability_observability.py tests/api/test_analyses_api.py tests/contracts/test_openapi_snapshot.py`
- [ ] Backend checks:
  `uv run --python 3.13 ruff check .`
  `uv run --python 3.13 pytest -q`
- [ ] Commit with `test: add traceability observability evidence` and open a draft PR.

## Observed Verification

- Focused RED: `test_traceability_observability.py` failed with missing `x-correlation-id` headers.
- Focused GREEN: `test_traceability_observability.py` -> `3 passed in 0.84s`.
- OpenAPI RED: `test_openapi_snapshot.py` failed before header documentation/snapshot export.
- OpenAPI GREEN: `test_openapi_snapshot.py` -> `3 passed in 0.52s`.
- Combined focused verification: API + OpenAPI scope -> `17 passed in 0.68s`.
- Backend lint: `ruff check .` -> `All checks passed!`.
- Backend full test suite: `pytest -q` -> `63 passed in 1.22s`.
