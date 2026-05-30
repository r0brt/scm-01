# Governance Evidence Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the documentation evidence trail for governance, Datenschutz, AI Act, traceability and verification without changing application code or PDF layout.

**Architecture:** This is a docs-only refinement. `README.md` becomes the fast entry point, while Arc42 chapter 08, `docs/privacy-and-ai-governance.md`, `docs/acceptance-checklist.md` and `docs/test-report.md` remain the source documents for architecture, governance, acceptance and verification evidence.

**Tech Stack:** Markdown documentation, existing repo docs, `rg`, `git diff --check`.

---

### Task 1: README Evidence Navigation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add an evidence navigation section after `## Dokumentations-Navigation`**

Insert this section after the existing documentation navigation list:

```markdown
## Abgabe- und Nachweisnavigation

Für eine schnelle Prüfung des aktuellen MVP-Standes sind besonders diese Dokumente relevant:

- Architektur und Laufzeitsichten: [`docs/arc42/README.md`](docs/arc42/README.md)
- Datenschutz, KI-Governance und AI-Act-Einordnung: [`docs/privacy-and-ai-governance.md`](docs/privacy-and-ai-governance.md)
- Abnahme gegen PRD-Kriterien: [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md)
- Ausgeführte Tests, CI und bekannte Limitationen: [`docs/test-report.md`](docs/test-report.md)
- Diagrammquellen und gerenderte SVGs: [`docs/diagrams/README.md`](docs/diagrams/README.md)

Die Dokumentation beschreibt bewusst den MVP-Stand. Vollständige Privacy Operations, produktionsreife Observability, formale Rechtsprüfung und finale PDF-Layoutoptimierung bleiben ausserhalb dieses Nachweisstandes.
```

- [ ] **Step 2: Verify README links**

Run:

```bash
rg -n "Abgabe- und Nachweisnavigation|privacy-and-ai-governance|acceptance-checklist|test-report" README.md
```

Expected: all four phrases appear in `README.md`.

### Task 2: Governance Document Precision

**Files:**
- Modify: `docs/privacy-and-ai-governance.md`

- [ ] **Step 1: Strengthen the purpose section**

Refine `## Zweck und Einordnung` so it explicitly says the document is an architecture-level MVP governance view and not a legal compliance assessment.

Use wording consistent with:

```markdown
Dieses Dokument ist eine Architektur- und MVP-Governance-Sicht. Es macht Datenflüsse, Verantwortlichkeiten, externe Abhängigkeiten und Grenzen nachvollziehbar, behauptet aber keine vollständige rechtliche Konformität für einen konkreten Produktivbetrieb.
```

- [ ] **Step 2: Add a short evidence map**

Add a subsection after `## Zweck und Einordnung`:

```markdown
## Nachweisbezug

Dieses Dokument verweist inhaltlich auf folgende Nachweise:

- `docs/arc42/08_querschnittliche_konzepte.md` für Cross-Cutting Concepts, Datenschutz, LLM-Adapter und Traceability
- `docs/acceptance-checklist.md` für den aktuellen Abnahmestand
- `docs/test-report.md` für lokal und in CI dokumentierte Verifikation
- `docs/diagrams/rendered/` für gerenderte Architektur- und Datenflussdiagramme
```

- [ ] **Step 3: Tighten AI Act language**

In `## AI-Act-Einordnung`, ensure the text states that SCM integrates an external model in the optional provider path, does not develop a GPAI model, and keeps human review central.

- [ ] **Step 4: Verify no overclaiming**

Run:

```bash
rg -n "vollständige.*Konformität|garantiert|rechtskonform|Compliance-Nachweis" docs/privacy-and-ai-governance.md
```

Expected: any match is either negated or explicitly framed as not claimed.

### Task 3: Arc42 Cross-Cutting Alignment

**Files:**
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 1: Add a compact evidence pointer in `## Datenschutz und KI-Governance`**

Keep the section concise and add one sentence that connects Datenschutz, AI-Governance and evidence documents:

```markdown
Die Nachweise dazu verteilen sich bewusst: arc42 beschreibt die Architekturentscheidung, `docs/privacy-and-ai-governance.md` vertieft Datenflüsse und Grenzen, `docs/acceptance-checklist.md` hält den Abnahmestand fest und `docs/test-report.md` dokumentiert die technische Verifikation.
```

- [ ] **Step 2: Clarify traceability boundary**

In `## Traceability und Laufnachvollziehbarkeit`, make the boundary explicit:

```markdown
Damit ist ein Run gut erklärbar, aber noch kein vollständiger Audit-Trail über Browser, API, Datenbank, Logs und externen Provider hinweg vorhanden.
```

- [ ] **Step 3: Verify chapter remains concise**

Run:

```bash
wc -w docs/arc42/08_querschnittliche_konzepte.md
```

Expected: chapter remains broadly in the same size range and does not become a duplicated governance document.

### Task 4: Acceptance Checklist Evidence Links

**Files:**
- Modify: `docs/acceptance-checklist.md`

- [ ] **Step 1: Add an evidence references section**

Add a short section before `## Offene Restpunkte`:

```markdown
## Verweis auf Nachweisdokumente

- Architekturstand und Querschnittskonzepte: `docs/arc42/`
- Datenschutz, KI-Governance, AI-Act-Einordnung und MVP-Grenzen: `docs/privacy-and-ai-governance.md`
- Ausgeführte technische Verifikation: `docs/test-report.md`
- Diagrammquellen und gerenderte SVGs: `docs/diagrams/README.md`
```

- [ ] **Step 2: Keep limitation wording honest**

Review `## Offene Restpunkte` and keep it clear that provider operation, broader E2E coverage and observability remain future work.

- [ ] **Step 3: Verify checklist contains evidence links**

Run:

```bash
rg -n "Verweis auf Nachweisdokumente|privacy-and-ai-governance|test-report|diagrams/README" docs/acceptance-checklist.md
```

Expected: all references appear.

### Task 5: Test Report Framing

**Files:**
- Modify: `docs/test-report.md`

- [ ] **Step 1: Add a short scope paragraph near the top**

Add after the baseline lines:

```markdown
Dieser Testreport dokumentiert die zuletzt ausgeführten lokalen und CI-bezogenen Nachweise. Er ist kein vollständiger Produktionsabnahmetest, sondern ein reproduzierbarer MVP-Nachweis für Backend, Frontend, Compose-Startfähigkeit und den lokalen UJ1-E2E-Pfad.
```

- [ ] **Step 2: Add a cross-reference to acceptance checklist**

Add after `## Abgedeckte Nachweise` intro or before the bullet list:

```markdown
Die fachliche Einordnung dieser Nachweise erfolgt ergänzend in `docs/acceptance-checklist.md`.
```

- [ ] **Step 3: Verify no new test result is implied**

Run:

```bash
rg -n "neu ausgeführt|erneut verifiziert|aktuell ausgeführt" docs/test-report.md
```

Expected: no match unless explicitly tied to the existing documented run.

### Task 6: Final Verification and Commit

**Files:**
- Review all changed documentation files.

- [ ] **Step 1: Verify docs-only scope**

Run:

```bash
git diff --name-only
```

Expected: only `README.md`, `docs/**` planning/spec/docs files are listed.

- [ ] **Step 2: Check whitespace**

Run:

```bash
git diff --check
```

Expected: no output and exit code `0`.

- [ ] **Step 3: Check key phrases**

Run:

```bash
rg -n "Abgabe- und Nachweisnavigation|Nachweisbezug|Verweis auf Nachweisdokumente|MVP-Nachweis" README.md docs/privacy-and-ai-governance.md docs/acceptance-checklist.md docs/test-report.md
```

Expected: each document contributes at least one relevant match.

- [ ] **Step 4: Commit**

Run:

```bash
git add README.md docs/privacy-and-ai-governance.md docs/arc42/08_querschnittliche_konzepte.md docs/acceptance-checklist.md docs/test-report.md docs/superpowers/specs/2026-05-30-governance-evidence-polish-design.md docs/superpowers/plans/2026-05-30-governance-evidence-polish.md
git commit -m "docs: polish governance evidence links"
```

Expected: commit succeeds.
