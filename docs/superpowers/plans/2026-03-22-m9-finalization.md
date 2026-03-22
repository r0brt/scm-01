# M9 Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring SCM to an abgabefaehigen final state through documentation freeze, final verification, acceptance checklist, and AI reflection.

**Architecture:** M9 changes no product behavior. The work is documentation- and verification-driven: update final docs from the actual repository state, run the final commands, and record only real evidence. Keep all additions small and explicit.

**Tech Stack:** Markdown docs, pytest, Vitest, Vite build, Docker Compose

---

### Task 1: Final verification baseline

**Files:**
- Modify: `docs/test-report.md`

- [ ] **Step 1: Run `cd backend && uv run pytest -q` and record the real result**
- [ ] **Step 2: Run `cd frontend && npm run test -- --run` and record the real result**
- [ ] **Step 3: Run `cd frontend && npm run build` and record the real result**
- [ ] **Step 4: Run `docker compose up -d`, `docker compose ps`, `docker compose down` and record the real result**

### Task 2: Final documentation updates

**Files:**
- Modify: `README.md`
- Modify: `docs/test-report.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `docs/arc42/11_technische_risiken.md`

- [ ] **Step 1: Update README only where final run/test instructions need a concise final-state adjustment**
- [ ] **Step 2: Expand `docs/test-report.md` from M7-only evidence to the final project test report**
- [ ] **Step 3: Replace `docs/arc42/10_qualitaetsszenarien.md` placeholder content with concrete SCM quality scenarios**
- [ ] **Step 4: Replace `docs/arc42/11_technische_risiken.md` placeholder content with concrete SCM technical risks**

### Task 3: Add final submission artifacts

**Files:**
- Create: `docs/acceptance-checklist.md`
- Create: `docs/ki-reflexion.md`

- [ ] **Step 1: Add a short acceptance checklist mapped to the implemented milestones and reproducible commands**
- [ ] **Step 2: Add a short AI reflection covering where Codex accelerated the work and where manual review remained important**

### Task 4: Final consistency and commit

**Files:**
- Modify only files from Tasks 1-3 if consistency fixes are needed

- [ ] **Step 1: Run `git diff --check` and fix any documentation formatting issues**
- [ ] **Step 2: Re-read changed files against `PLAN.md`, `docs/prd.md`, and `AGENTS.md` for consistency**
- [ ] **Step 3: Commit with `docs: finalize submission artifacts`**
