# NFR5 Coverage Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reproducible backend coverage evidence path for PRD NFR5.

**Architecture:** Coverage is measured only for the backend Domain/Application scope named in the PRD: language, LLM, models, repositories and services. UI, API bootstrapping, database infrastructure and migrations remain outside this metric so the number stays meaningful.

**Tech Stack:** Python 3.13, coverage.py, pytest, uv, Markdown documentation.

---

## Scope

- Add `coverage` as a backend dev dependency.
- Configure coverage scope and `fail_under = 80` in `backend/pyproject.toml`.
- Add a small contract test that guards the configured NFR5 coverage scope.
- Update `docs/test-report.md`, `docs/acceptance-checklist.md` and `docs/arc42/10_qualitaetsszenarien.md`.

## Non-Scope

- No runtime, API or UI behaviour changes.
- No frontend coverage measurement.
- No production-like system coverage claim.

## Tasks

- [x] Add failing config guard test.
  RED result: `KeyError: 'coverage'` before `tool.coverage` existed.

- [x] Add coverage dependency and configuration.
  Scope: `app/language`, `app/llm`, `app/models`, `app/repositories`, `app/services`; threshold: `80`.

- [x] Measure NFR5 backend coverage.

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage run -m pytest -q tests/contracts/test_analysis_models.py tests/contracts/test_analysis_schema.py tests/language tests/llm tests/services tests/validation tests/persistence
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage report
```

Observed result:

- `34 passed in 1.21s`
- `TOTAL 232 12 95%`
- `fail_under = 80`

- [x] Update NFR5 evidence documentation.

- [x] Run final backend verification.
  Observed result: `ruff check .` -> `All checks passed!`; `pytest -q` -> `59 passed in 1.14s`.

- [ ] Commit, push and open draft PR.

## Self-Review

- Covers PRD NFR5 for backend Domain/Application Layer without UI.
- Keeps the claim limited to statement coverage, not test quality or production observability.
- Avoids adding coverage as a hard GitHub Actions gate in this PR.
