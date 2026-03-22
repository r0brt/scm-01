# M3 Persistence Runs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a relational persistence layer for SCM runs with SQLAlchemy, Alembic, and repository tests.

**Architecture:** Introduce a minimal database layer around a single `runs` table. Keep the domain boundary narrow: one ORM model, one repository module, one database setup module, and one initial Alembic migration. Test persistence against SQLite while keeping the schema suitable for later PostgreSQL usage.

**Tech Stack:** Python 3.13, SQLAlchemy 2, Alembic, SQLite for tests, PostgreSQL-targeted schema design, pytest

---

### Task 1: Persistence tests first

**Files:**
- Create: `backend/tests/persistence/test_run_repository.py`
- Reuse: `backend/tests/fixtures/contracts/valid/analysis_minimal.json`

- [ ] **Step 1: Write failing repository tests for create/get/list**
- [ ] **Step 2: Run `cd backend && uv run pytest -q tests/persistence/test_run_repository.py` and confirm failure**

### Task 2: Database and ORM setup

**Files:**
- Modify: `backend/pyproject.toml`
- Create: `backend/app/db/base.py`
- Create: `backend/app/db/session.py`
- Create: `backend/app/db/models.py`
- Create: `backend/app/repositories/run_repository.py`

- [ ] **Step 1: Add SQLAlchemy and Alembic dependencies**
- [ ] **Step 2: Add metadata/base/session setup**
- [ ] **Step 3: Add `RunRecord` ORM model and repository functions**
- [ ] **Step 4: Run `cd backend && uv run pytest -q tests/persistence/test_run_repository.py` and confirm pass**

### Task 3: Alembic baseline

**Files:**
- Create: `backend/alembic.ini`
- Create: `backend/alembic/env.py`
- Create: `backend/alembic/script.py.mako`
- Create: `backend/alembic/versions/<timestamp>_create_runs_table.py`

- [ ] **Step 1: Add Alembic configuration wired to SQLAlchemy metadata**
- [ ] **Step 2: Add initial migration for `runs`**
- [ ] **Step 3: Run `cd backend && uv run alembic upgrade head` and confirm success**

### Task 4: Documentation and regression verification

**Files:**
- Modify: `docs/arc42/07_verteilungssicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Create: `docs/diagrams/db-erd.puml`

- [ ] **Step 1: Update persistence/deployment docs**
- [ ] **Step 2: Add DB ERD for `runs`**
- [ ] **Step 3: Run `cd backend && uv run pytest -q tests/contracts tests/validation tests/persistence`**
- [ ] **Step 4: Commit with `feat: add run persistence and migrations`**
