# Real LLM Filter Machine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real language detection and OpenAI-backed analysis generation, then turn the existing frontend into a visually distinct filter machine for the six analysis stages.

**Architecture:** Keep the public API stable while separating language detection, analysis generation, validation/repair, and persistence inside the backend workflow. In the frontend, preserve the existing workspace flow but transform the presentation into an industrial linear filter machine with explicit status and error states.

**Tech Stack:** FastAPI, SQLAlchemy, local language detection library, OpenAI adapter, React, Vite, TypeScript, Playwright, pytest

---

### Task 1: Add failing tests for language detection and workflow behavior

**Files:**
- Create: `backend/tests/language/test_language_detector.py`
- Modify: `backend/tests/services/test_analysis_workflow.py`
- Modify: `backend/tests/api/test_analyses_api.py`

- [ ] **Step 1: Write failing tests for supported languages `de`, `fr`, `en` and low-confidence handling**
- [ ] **Step 2: Write failing workflow tests for `LANGUAGE_CONFIDENCE_TOO_LOW` and `UNSUPPORTED_LANGUAGE`**
- [ ] **Step 3: Extend API tests to cover failed runs from language detection**
- [ ] **Step 4: Run the focused backend tests and confirm they fail for the expected reason**

### Task 2: Implement language detection and integrate it into the workflow

**Files:**
- Create: `backend/app/language/base.py`
- Create: `backend/app/language/local_detector.py`
- Modify: `backend/app/services/analysis_workflow.py`
- Modify: `backend/app/main.py`
- Modify: `backend/app/repositories/run_repository.py` only if metadata handling needs small adjustments
- Modify: `backend/pyproject.toml`
- Modify: `backend/uv.lock`

- [ ] **Step 1: Add a `LanguageDetector` port and a local default implementation**
- [ ] **Step 2: Return dominant language plus confidence for `de`, `fr`, `en`**
- [ ] **Step 3: Fail the workflow early when confidence is below `0.80` or the language is unsupported**
- [ ] **Step 4: Persist language metadata and explicit error codes for failed language checks**
- [ ] **Step 5: Run focused tests to make sure language detection and workflow failures now pass**

### Task 3: Turn the OpenAI adapter into the productive analysis path

**Files:**
- Modify: `backend/app/llm/openai_adapter.py`
- Modify: `backend/app/main.py`
- Modify: `backend/app/services/analysis_workflow.py`
- Modify: `backend/tests/services/test_analysis_workflow.py`
- Modify: `backend/tests/api/test_analyses_api.py`
- Optional small helper: `backend/app/config.py`

- [ ] **Step 1: Add explicit runtime configuration for choosing stub vs OpenAI adapter**
- [ ] **Step 2: Keep tests offline by injecting fake adapters instead of hitting the network**
- [ ] **Step 3: Make the production path use the OpenAI adapter when enabled by environment**
- [ ] **Step 4: Verify that existing validation/repair semantics still wrap the real generator path**
- [ ] **Step 5: Run the relevant backend test set again**

### Task 4: Update documentation and architecture artifacts for the new backend behavior

**Files:**
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `docs/arc42/11_technische_risiken.md`
- Modify: `README.md`
- Optional: new ADR only if a genuinely new architectural decision is introduced beyond existing ADRs

- [ ] **Step 1: Document the new runtime sequence including language detection**
- [ ] **Step 2: Document the local language detector, confidence threshold, and failure semantics**
- [ ] **Step 3: Update quality and risk chapters for real provider integration and language handling**
- [ ] **Step 4: Add only the minimal README configuration/run notes needed for the new productive path**

### Task 5: Add failing frontend tests for the filter machine presentation

**Files:**
- Modify: `frontend/src/App.test.tsx`
- Optional create: `frontend/src/components/` if the UI split is needed

- [ ] **Step 1: Write failing tests for language/status display in the UI**
- [ ] **Step 2: Write failing tests for six visible filter modules with summary and points**
- [ ] **Step 3: Run frontend tests and confirm the new assertions fail**

### Task 6: Transform the frontend into the industrial filter machine

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/styles.css`
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/types.ts`
- Create component files under `frontend/src/components/` if the current file becomes unwieldy

- [ ] **Step 1: Add explicit machine states for language check, analysis, repair, valid, and failed**
- [ ] **Step 2: Redesign the pipeline into a linear industrial filter machine**
- [ ] **Step 3: Give each analysis stage a distinct but related visual identity**
- [ ] **Step 4: Show summary plus 2-3 points by default and reveal more detail on interaction**
- [ ] **Step 5: Surface language metadata and failure reasons as part of the machine, not just as a banner**
- [ ] **Step 6: Run frontend tests and build until they pass**

### Task 7: Refresh end-to-end verification and final checks

**Files:**
- Modify: `frontend/e2e/uj1.spec.ts`
- Modify: `docs/test-report.md` if the new behavior changes the final evidence meaningfully

- [ ] **Step 1: Update the E2E path to assert the new machine presentation and visible analysis states**
- [ ] **Step 2: Run `cd backend && uv run ruff check .`**
- [ ] **Step 3: Run `cd backend && uv run pytest -q`**
- [ ] **Step 4: Run `cd frontend && npm run test -- --run`**
- [ ] **Step 5: Run `cd frontend && npm run build`**
- [ ] **Step 6: Run `cd frontend && npm run test:e2e`**
- [ ] **Step 7: Run `docker compose up -d`, `docker compose ps`, and `docker compose down` if runtime configuration changed**
- [ ] **Step 8: Commit with a message that reflects the implemented deliverable, for example `feat: add real analysis flow and filter machine ui`**
