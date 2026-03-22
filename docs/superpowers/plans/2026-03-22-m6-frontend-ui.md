# M6 Frontend UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small but usable frontend for creating analyses, viewing the six-stage pipeline, browsing runs, and exporting JSON.

**Architecture:** Build a single-page React + Vite + TypeScript app with a thin API client. Keep state local to the page: one input form, one selected run, one run list, one export action. Use tests for key rendering and interaction, not for exhaustive UI micro-behavior.

**Tech Stack:** React, Vite, TypeScript, Vitest, Testing Library

---

### Task 1: Frontend skeleton

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig*.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

- [ ] **Step 1: Add minimal React/Vite scaffold and dependencies**
- [ ] **Step 2: Add test runner wiring**

### Task 2: UI tests first

**Files:**
- Create: `frontend/src/App.test.tsx`

- [ ] **Step 1: Write failing test for render + analyse action**
- [ ] **Step 2: Run `cd frontend && npm run test -- --run` and confirm failure**

### Task 3: App implementation

**Files:**
- Create: `frontend/src/api.ts`
- Create: `frontend/src/types.ts`
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/styles.css`

- [ ] **Step 1: Add API client and frontend types**
- [ ] **Step 2: Implement input, pipeline, run list, and JSON export**
- [ ] **Step 3: Run `cd frontend && npm run test -- --run` and confirm pass**

### Task 4: Docs and build verification

**Files:**
- Modify: `README.md`
- Modify: `docs/arc42/05_bausteinsicht.md`
- Modify: `docs/arc42/07_verteilungssicht.md`

- [ ] **Step 1: Update frontend/docs references**
- [ ] **Step 2: Run `cd frontend && npm run build`**
- [ ] **Step 3: Commit with `feat: add frontend analysis workspace`**
