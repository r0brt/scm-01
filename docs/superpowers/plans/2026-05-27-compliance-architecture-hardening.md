# Compliance and Architecture Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen SCM's submission readiness through documentation-only work covering privacy, AI governance, traceability, and a more substantial arc42 package without changing product behavior.

**Architecture:** Keep arc42 as the primary architecture document and add one focused governance companion document plus three text-based diagrams. Treat reflection as author-owned content: this plan may prepare structure and framing, but must not write the personal core on the author's behalf.

**Tech Stack:** Markdown, PlantUML, repository documentation, local verification commands

---

### Task 1: Add the governance companion document

**Files:**
- Create: `docs/privacy-and-ai-governance.md`
- Modify: `docs/arc42/README.md`

- [ ] **Step 1: Create `docs/privacy-and-ai-governance.md` with these top-level sections**
  Sections: `Zweck und Einordnung`, `Verarbeitete Daten`, `Datenfluesse und externe Empfaenger`, `Aufbewahrung und Loeschannahmen`, `Transparenz und menschliche Verantwortung`, `AI-Act-Einordnung`, `Grenzen des MVP`.
- [ ] **Step 2: In `docs/privacy-and-ai-governance.md`, describe the real SCM data path**
  Include: raw `input_text`, analysis payload, validation report, traceability metadata, optional OpenAI path, and local persistence.
- [ ] **Step 3: In `docs/privacy-and-ai-governance.md`, make the MVP limits explicit**
  Include: no formal legal opinion, no production-ready privacy operations, no claim of full compliance completeness.
- [ ] **Step 4: Update `docs/arc42/README.md` so the chapter set or maintenance notes explicitly reference the governance companion document as a supporting artifact**

### Task 2: Add supporting diagrams for context, runtime, and deployment

**Files:**
- Create: `docs/diagrams/system-context.puml`
- Create: `docs/diagrams/uj1-sequence.puml`
- Create: `docs/diagrams/container-view.puml`
- Modify: `docs/diagrams/README.md`

- [ ] **Step 1: Create `docs/diagrams/system-context.puml` for the textual system context already described in arc42**
  Show: user, browser/frontend, backend API, PostgreSQL, OpenAI provider, plus the key data exchanges.
- [ ] **Step 2: Create `docs/diagrams/uj1-sequence.puml` for the UJ1 analysis flow**
  Show: text entry, language detection, adapter call, validation, persistence, and response back to the UI.
- [ ] **Step 3: Create `docs/diagrams/container-view.puml` for the local Compose topology**
  Show: `frontend`, `api`, `db`, port exposure, and the OpenAI dependency as an external service.
- [ ] **Step 4: Update `docs/diagrams/README.md` so these three diagram sources are listed and their intended arc42 references are clear**

### Task 3: Expand arc42 chapter 02 and 03 with compliance-aware system framing

**Files:**
- Modify: `docs/arc42/02_randbedingungen.md`
- Modify: `docs/arc42/03_systemkontext_und_abgrenzung.md`

- [ ] **Step 1: Extend chapter 02 with legal and organizational constraints relevant to SCM**
  Cover: privacy-sensitive free text, external AI provider usage, transparency expectations, MVP limits, and submission context.
- [ ] **Step 2: Extend chapter 03 with a stronger text-level system context**
  Cover: actors, boundaries, where data enters, where data leaves the local system, and how SCM remains a support tool rather than an autonomous decision-maker.
- [ ] **Step 3: Add explicit references from chapter 03 to `docs/diagrams/system-context.puml` and `docs/privacy-and-ai-governance.md`**

### Task 4: Expand arc42 chapter 07 and 08 with deployment, privacy, and traceability details

**Files:**
- Modify: `docs/arc42/07_verteilungssicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 1: Extend chapter 07 with a clearer deployment narrative**
  Cover: which data stays local, when data may be sent to OpenAI, how Compose maps services, and what the MVP does not cover operationally.
- [ ] **Step 2: Add a reference from chapter 07 to `docs/diagrams/container-view.puml`**
- [ ] **Step 3: Extend chapter 08 with explicit privacy and AI-governance cross-cutting concerns**
  Cover: data categories, retention assumptions, transparency assumptions, human oversight, and limits of the current controls.
- [ ] **Step 4: Extend chapter 08 with a stronger traceability explanation**
  Cover: `prompt_version`, `model_id`, `validation_report`, `run_status`, `validation_status`, `error_code`, `created_at`, and the current limits around `correlation_id`.
- [ ] **Step 5: Add a reference from chapter 08 to `docs/privacy-and-ai-governance.md`**

### Task 5: Expand arc42 chapter 10 and 11 with quality and risk coverage for the new criteria

**Files:**
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `docs/arc42/11_technische_risiken.md`

- [ ] **Step 1: Add one privacy-focused quality scenario to chapter 10**
  Example scope: sensitive input handling, explicit limits, or controlled external forwarding assumptions.
- [ ] **Step 2: Add one transparency/governance-focused quality scenario to chapter 10**
  Example scope: the system remains understandable as a KI-supported analysis aid rather than a truth engine.
- [ ] **Step 3: Add one stronger traceability scenario to chapter 10**
  Example scope: a saved run can be explained through payload, metadata, validation report, and known audit gaps.
- [ ] **Step 4: Extend chapter 11 with privacy and governance risks**
  Cover: personal data in free text, external provider dependency, false perception of objectivity, incomplete audit trails, and MVP-vs-production boundary risks.

### Task 6: Prepare the reflection boundary without writing the personal core

**Files:**
- Modify: `docs/ki-reflexion.md`

- [ ] **Step 1: Rework `docs/ki-reflexion.md` into a clearly structured reflection scaffold**
  Keep sections that support the final submission, but avoid a finished ghostwritten personal narrative.
- [ ] **Step 2: Replace generic statements with explicit prompts or framing markers where author-owned content must still be supplied**
  Example areas: hardest tradeoff, wrong assumption, governance learning, role of human review.
- [ ] **Step 3: Keep only those completed passages that are factual repository context rather than personal authorship claims**
- [ ] **Step 4: If no author-provided reflection points are available yet, stop after the scaffold and leave the personal content intentionally incomplete**

### Task 7: Final consistency pass and documentation verification

**Files:**
- Modify only files from Tasks 1-6 if consistency fixes are needed

- [ ] **Step 1: Re-read all changed files against `AGENTS.md`, `PLAN.md`, `docs/prd.md`, and the freeze baseline notes**
- [ ] **Step 2: Verify that arc42 remains the primary narrative and all supporting artifacts are referenced from the right chapters**
- [ ] **Step 3: Check that no document claims product capabilities or legal certainty that the repo does not actually support**
- [ ] **Step 4: Run `git diff --check` and fix any formatting issues**
- [ ] **Step 5: Estimate whether the expanded arc42 plus reflection package is plausibly moving toward the `25-30 Seiten` target and note any remaining gap**
- [ ] **Step 6: Commit with `docs: harden compliance and architecture documentation`**
