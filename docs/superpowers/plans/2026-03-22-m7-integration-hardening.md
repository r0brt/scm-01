# M7 Integration Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add integration and end-to-end evidence for the SCM critical path and document the executed test results.

**Architecture:** Keep integration and E2E thin. Backend integration tests exercise the real FastAPI app against SQLite. Frontend E2E uses a single Playwright happy-path test against locally started frontend and backend servers. Document only real command output in the report.

**Tech Stack:** pytest, FastAPI TestClient/httpx, SQLite, Playwright

---

### Task 1: Write failing integration and E2E tests

**Files:**
- Create: `backend/tests/integration/test_analysis_flow.py`
- Create: `frontend/e2e/uj1.spec.ts`

- [ ] **Step 1: Write failing backend integration tests**
- [ ] **Step 2: Write failing frontend E2E test**
- [ ] **Step 3: Run the focused commands and confirm failure**

### Task 2: Add required test wiring

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/playwright.config.ts`
- Create: `frontend/tests-external/` only if needed

- [ ] **Step 1: Add Playwright dependency and script**
- [ ] **Step 2: Add Playwright config for local frontend/backend**
- [ ] **Step 3: Add any backend test helpers needed for integration setup**

### Task 3: Make tests pass

**Files:**
- Modify only what the new tests require

- [ ] **Step 1: Run `cd backend && uv run pytest -q tests/integration` and make it pass**
- [ ] **Step 2: Run `cd frontend && npm run test:e2e` and make it pass**

### Task 4: Test report and final verification

**Files:**
- Create: `docs/test-report.md`
- Modify: `README.md` if a minimal test note helps

- [ ] **Step 1: Document real commands, results, and known limitations**
- [ ] **Step 2: Re-run the final M7 commands**
- [ ] **Step 3: Commit with `test: add integration and e2e verification`**
