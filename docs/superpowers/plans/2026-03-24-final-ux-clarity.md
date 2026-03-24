# Final UX Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing frontend for clearer wording, calmer hierarchy, and faster scanability without changing navigation, data flow, or feature scope.

**Architecture:** Keep the current `Analyse`/`Archiv` structure intact and limit the work to copy, styling, and density refinement. The implementation stays inside existing components: `App` for the Analyse intro, `AnalysisComposer` for input copy, `RunHistoryPanel` for archive compression, `Stage` plus CSS for pipeline emphasis, and tests to lock the new clarity contract.

**Tech Stack:** React, TypeScript, CSS, Vitest, Playwright

---

## File Structure

- Modify: `frontend/src/App.tsx`
  - Add the always-visible Analyse context block above the composer within the existing Analyse tab.
- Modify: `frontend/src/components/AnalysisComposer.tsx`
  - Replace redundant wording and reduce input prominence.
- Modify: `frontend/src/components/RunHistoryPanel.tsx`
  - Compress archive entries to one-line title plus subtle status.
- Modify: `frontend/src/components/Stage.tsx`
  - Tighten stage typography and state hierarchy.
- Modify: `frontend/src/styles.css`
  - Rebalance spacing, color meaning, and emphasis without changing layout structure.
- Modify: `frontend/src/App.test.tsx`
  - Add assertions for intro copy, input wording, archive density, and stage emphasis markers.

### Task 1: Lock the new wording and Analyse intro

**Files:**
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/AnalysisComposer.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions for:

- `Social Cleanup Machine` visible in the Analyse tab
- descriptive intro text visible in the Analyse tab
- input title `Problem`
- placeholder `Beschreibe das Problem kurz...`
- old wording `Problem eingeben` and `Problemtext eingeben` absent

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL because the current Analyse tab still uses the older wording and lacks the intro.

- [ ] **Step 3: Write minimal implementation**

Add the small Analyse context block in `App.tsx` and update the composer copy in `AnalysisComposer.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: PASS for the new wording/intro assertions.

### Task 2: Lock archive density and truncation

**Files:**
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/src/components/RunHistoryPanel.tsx`
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Write the failing test**

Assert archive entries render only:

- `#ID`
- one visible title line
- one subtle status line

Use stable selectors/classes rather than visual guesswork:

- `.run-item-title` for the one-line title contract
- `.run-item-status` for the subtle status line
- CSS truncation contract via `overflow: hidden`, `white-space: nowrap`, `text-overflow: ellipsis`

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL until the archive item markup/CSS is reduced.

- [ ] **Step 3: Write minimal implementation**

Keep the same click behavior, but compress entry styling and ensure title truncation to a single line.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: PASS for archive-density assertions.

### Task 3: Lock pipeline hierarchy and Essenz emphasis

**Files:**
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/src/components/Stage.tsx`
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Write the failing test**

Assert:

- active stage keeps strongest state marker
- completed stages remain readable but reduced
- upcoming stages use lower-emphasis markers
- `STAGE XX` is lighter metadata
- `Essenz` keeps `data-stage-emphasis="essenz"` and a stronger density/styling hook

Use stable markers:

- `data-stage-tone="active" | "completed" | "upcoming" | "failed"`
- `.stage-index` for the reduced `STAGE XX` metadata
- `.stage-card-essenz` plus `data-stage-emphasis="essenz"` for the final result treatment

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL because the current hierarchy and density are not yet tightened enough.

- [ ] **Step 3: Write minimal implementation**

Reduce vertical spacing and stage metadata prominence. Strengthen active-state contrast, soften completed/upcoming states, and give `Essenz` a subtly warmer, slightly roomier treatment without adding animation.

## Context References

- `AGENTS.md`
- `PLAN.md`
- `docs/prd.md`
- `docs/arc42/05_bausteinsicht.md`

## Expected Output

- Files changed in the frontend clarity pass
- Suggested commit message: `refactor: refine frontend ux hierarchy and clarity`

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: PASS for hierarchy/emphasis assertions.

### Task 4: Final verification

**Files:**
- Modify as needed: `frontend/e2e/uj1.spec.ts`

- [ ] **Step 1: Run the full frontend test suite**

Run: `cd frontend && npm run test -- --run`
Expected: PASS

- [ ] **Step 2: Run the frontend build**

Run: `cd frontend && npm run build`
Expected: PASS

- [ ] **Step 3: Run the frontend E2E flow if visible text changed**

Run: `cd frontend && npm run test:e2e`
Expected: PASS, or document environment blocker.
