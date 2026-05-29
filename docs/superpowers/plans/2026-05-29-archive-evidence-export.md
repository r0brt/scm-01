# Archiv-Nachweis und Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make run traceability and JSON export visible in the Archiv tab, verify the E2E path after installing Playwright browsers, and document local data cleanup boundaries without changing Analyse page behavior.

**Architecture:** Keep `Analyse` as the unchanged analysis flow. Treat `Archiv` as the review/evidence surface for selected runs. Do not introduce API-v2, a deletion API, a slim list API, or reflection content in this change.

**Tech Stack:** React, TypeScript, CSS, Vitest, Playwright, Markdown

---

### Task 1: Confirm current Archiv and Analyse boundaries

**Files:**
- Inspect: `frontend/src/App.tsx`
- Inspect: `frontend/src/components/RunHistoryPanel.tsx`
- Inspect: `frontend/src/types.ts`
- Inspect: `docs/prd.md`
- Inspect: `docs/arc42/07_verteilungssicht.md`
- Inspect: `docs/arc42/08_querschnittliche_konzepte.md`

- [x] **Step 1: Verify Analyse behavior that must remain unchanged**

Check current `handleSubmit`, `PipelineView`, `ResultView`, and `AnalysisComposer` usage. Do not alter submit/reveal/error behavior.

- [x] **Step 2: Verify Archiv current behavior**

Check that selecting a run currently loads the run and switches to `Analyse`. Decide the smallest change needed so Archiv can show details while preserving an explicit route to open the run in Analyse.

### Task 2: Add Archiv detail metadata and JSON export

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/RunHistoryPanel.tsx`
- Modify: `frontend/src/types.ts`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [x] **Step 1: Add missing frontend type field**

Ensure `AnalysisRun` includes `correlation_id`.

- [x] **Step 2: Keep selected archive runs in Archiv**

Adjust archive selection so it can load and store the selected run without automatically changing the active tab to `Analyse`.

- [x] **Step 3: Add explicit Analyse opening action**

Add an `In Analyse öffnen` action from the Archiv detail area that uses the already loaded selected run and switches to the Analyse tab. This keeps Analyse behavior unchanged and makes the navigation deliberate.

- [x] **Step 4: Render compact metadata in Archiv**

Show at least:
- `created_at`
- `run_status`
- `validation_status`
- `model_id`
- `prompt_version`
- `correlation_id`
- `detected_language`
- `language_confidence`
- `error_code` when present

- [x] **Step 5: Add JSON export from Archiv**

Export the selected run as a complete JSON file. Use a browser download via `Blob`, `URL.createObjectURL`, hidden anchor click, and cleanup with `URL.revokeObjectURL`.

- [x] **Step 6: Style the Archiv detail area**

Keep styling aligned with the existing restrained Archiv UI. Avoid changing the Analyse view styles.

- [x] **Step 7: Add focused frontend tests**

Cover:
- selecting a run keeps the user in Archiv and shows metadata
- `In Analyse öffnen` switches to Analyse with the selected run
- JSON export control exists for a selected run
- stylesheet includes the new Archiv detail classes

- [x] **Step 8: Run frontend checks**

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

Expected: pass

### Task 3: Verify Playwright E2E after installing browsers

**Files:**
- Possibly modify: `docs/test-report.md`

- [x] **Step 1: Install Playwright browsers**

```bash
cd /Users/robert/code/scm-01/frontend
npx playwright install
```

- [x] **Step 2: Run E2E**

```bash
cd /Users/robert/code/scm-01/frontend
npm run test:e2e
```

- [x] **Step 3: Update test report**

Update `docs/test-report.md` with the actual E2E result, date, and any remaining limitation.

### Task 4: Add local data cleanup documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/privacy-and-ai-governance.md`

- [x] **Step 1: Add README cleanup note**

Document local cleanup options for Compose data and local E2E/SQLite data without claiming a production deletion workflow.

- [x] **Step 2: Add privacy governance cleanup note**

Extend the retention section with the same limitation: local deletion is an environment cleanup action in the MVP, not a user-facing deletion feature.

### Task 5: Final verification and summary

**Files:**
- Modify: `docs/test-report.md` if command outputs changed
- Inspect: `git diff`

- [x] **Step 1: Run backend tests**

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

- [x] **Step 2: Re-run frontend tests and build**

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

- [x] **Step 3: Check diff hygiene**

```bash
cd /Users/robert/code/scm-01
git diff --check
git status --short
```

- [x] **Step 4: Prepare summary**

Include:
- files changed
- tests run
- E2E result
- residual risks
- suggested commit message
