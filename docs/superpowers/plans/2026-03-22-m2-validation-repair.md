# M2 Validation and Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a backend validation service and bounded repair loop for analysis payloads without introducing API, persistence, or real LLM integration.

**Architecture:** Keep the existing analysis schema and Pydantic model as the source of truth. Add a small validation service that turns schema/model failures into a structured report, then wrap it with a repair orchestrator that retries at most two times using an injected repair function.

**Tech Stack:** Python 3.13, FastAPI backend package layout, Pydantic v2, jsonschema, pytest

---

### Task 1: Validation tests first

**Files:**
- Create: `backend/tests/validation/test_validation_service.py`
- Create: `backend/tests/validation/test_repair_loop.py`
- Use: `backend/tests/fixtures/contracts/valid/analysis_minimal.json`
- Use: `backend/tests/fixtures/contracts/invalid/empty_punkte.json`

- [ ] **Step 1: Write failing validation-service tests**
- [ ] **Step 2: Run `cd backend && uv run pytest -q tests/validation/test_validation_service.py` and confirm failure**
- [ ] **Step 3: Write failing repair-loop tests**
- [ ] **Step 4: Run `cd backend && uv run pytest -q tests/validation/test_repair_loop.py` and confirm failure**

### Task 2: Implement validation service

**Files:**
- Create: `backend/app/services/__init__.py`
- Create: `backend/app/services/validation.py`
- Reuse: `backend/app/models/analysis.py`
- Reuse: `schemas/analysis.schema.json`

- [ ] **Step 1: Add report/result data models and schema-loading helper**
- [ ] **Step 2: Implement payload validation against schema and `Analyse`**
- [ ] **Step 3: Run `cd backend && uv run pytest -q tests/validation/test_validation_service.py` and confirm pass**

### Task 3: Implement repair loop

**Files:**
- Create: `backend/app/services/repair.py`
- Modify: `backend/app/services/__init__.py`
- Reuse: `backend/app/services/validation.py`

- [ ] **Step 1: Add bounded repair orchestration around the validation service**
- [ ] **Step 2: Return explicit failure with `REPAIR_LIMIT_EXCEEDED` after two unsuccessful repairs**
- [ ] **Step 3: Run `cd backend && uv run pytest -q tests/validation/test_repair_loop.py` and confirm pass**

### Task 4: Regression verification

**Files:**
- Verify only

- [ ] **Step 1: Run `cd backend && uv run pytest -q tests/validation`**
- [ ] **Step 2: Run `cd backend && uv run pytest -q tests/contracts tests/validation`**
- [ ] **Step 3: Review git diff for scope discipline**
- [ ] **Step 4: Commit with `feat: add validation service and repair loop`**
