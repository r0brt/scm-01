# NFR3 Performance Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reproducible NFR3 performance evidence path for the local analysis API.

**Architecture:** The measurement runs FastAPI in-process with deterministic fixture doubles for language detection and analysis generation. App creation, schema initialization and one warm-up request stay outside the measured requests, so the result covers the local API/analysis path without cold start, external provider latency or network calls.

**Tech Stack:** Python 3.13, FastAPI TestClient, pytest, SQLite, Markdown documentation.

---

## Scope

- Create `backend/scripts/measure_nfr3_performance.py`.
- Create `backend/tests/contracts/test_nfr3_performance.py`.
- Update `docs/test-report.md`, `docs/acceptance-checklist.md` and `docs/arc42/10_qualitaetsszenarien.md`.

## Non-Scope

- No runtime, UI, schema or provider behaviour changes.
- No external LLM call.
- No production load-test claim.

## Tasks

- [x] Add failing test for missing NFR3 measurement module.
  RED result: `ModuleNotFoundError: No module named 'scripts.measure_nfr3_performance'`.

- [x] Extend test expectation so the measured set includes the 1'000-character boundary case.
  RED result: existing implementation measured only 20 short fixtures.

- [x] Implement deterministic offline API measurement.
  The script measures 20 static fixtures plus `generated-1000-char-boundary`, checks `p95 < 5s`, fails on oversized inputs, failed API runs or threshold breach.

- [x] Run focused verification.

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/measure_nfr3_performance.py
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_nfr3_performance.py
```

Observed result:

- `NFR3 performance: 21/21 successful API analyses`
- `Max input length: 1000 chars`
- `p95 response time: 0.003s`
- `Slowest response time: 0.005s`
- `2 passed in 0.69s`

- [x] Run backend verification.

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Observed result:

- `All checks passed!`
- `58 passed in 1.29s`

- [ ] Commit, push and open draft PR.

## Self-Review

- Covers PRD NFR3 `p95 < 5s` for analysis requests up to 1'000 characters.
- Keeps the claim limited to offline API measurement with deterministic doubles.
- Leaves provider latency, Docker/Compose and production-like load testing as explicit non-scope.
