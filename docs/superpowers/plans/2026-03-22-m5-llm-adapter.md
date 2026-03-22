# M5 LLM Adapter and Prompt Versioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce an adapter-based LLM integration point and prompt versioning while keeping all tests offline.

**Architecture:** Extract the current stub generation behind a provider interface. Keep a stub provider as default for offline operation and add an OpenAI-backed implementation behind the same interface. Load prompt text from `prompts/v1/analysis.md` and persist adapter-provided `model_id` and `prompt_version`.

**Tech Stack:** FastAPI backend, SQLAlchemy, pytest, offline fakes/mocks, prompt files under `prompts/v1`

---

### Task 1: Adapter tests first

**Files:**
- Modify: `backend/tests/api/test_analyses_api.py`
- Create: `backend/tests/services/test_analysis_workflow.py`

- [ ] **Step 1: Write failing tests for injected fake adapter usage**
- [ ] **Step 2: Run `cd backend && uv run pytest -q tests/services/test_analysis_workflow.py tests/api/test_analyses_api.py` and confirm failure**

### Task 2: Adapter abstraction and stub integration

**Files:**
- Create: `backend/app/llm/base.py`
- Create: `backend/app/llm/stub.py`
- Modify: `backend/app/services/analysis_workflow.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Add adapter protocol/result type**
- [ ] **Step 2: Move current stub generation into a stub adapter**
- [ ] **Step 3: Inject adapter into workflow and app factory**
- [ ] **Step 4: Run focused tests and confirm pass**

### Task 3: OpenAI adapter and prompt versioning

**Files:**
- Create: `backend/app/llm/openai_adapter.py`
- Create: `prompts/v1/analysis.md`

- [ ] **Step 1: Add OpenAI adapter implementation without using it in tests**
- [ ] **Step 2: Load prompt text from `prompts/v1/analysis.md`**
- [ ] **Step 3: Ensure adapter result drives persisted `model_id` and `prompt_version`**

### Task 4: Docs and regression verification

**Files:**
- Modify: `docs/arc42/07_verteilungssicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 1: Update adapter/prompt docs**
- [ ] **Step 2: Run `cd backend && uv run pytest -q`**
- [ ] **Step 3: Commit with `feat: add llm adapter and prompt versioning`**
