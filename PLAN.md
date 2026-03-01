# PLAN.md — Umsetzungsplan (Roadmap) von PRD zum finalen Produkt

Dieses Dokument beschreibt die Umsetzung **ausgehend von `docs/prd.md`** bis zum lieferfähigen Produkt.

Leitplanken:

* modularer Monolith zuerst, spätere Service-/Container-Extraktion optional
* strikter JSON-Vertrag + Schema-Validierung + bounded Repair-Loop
* Persistenz + UI-Pipeline
* reproduzierbare Commands (uv/npm) + Tests + dokumentierte Testresultate

Traceability: Jeder Meilenstein referenziert PRD-Elemente (FR/NFR/AC).

---

## M0 — Repo Bootstrap (minimal, aber sauber)

**Ziel:** Arbeitsfähiger Skeleton-Stand + lokale Reproduzierbarkeit.
**Deliverables:**

* Backend skeleton (FastAPI) + `/health`
* Test harness (`pytest`)
* Frontend skeleton (falls schon vorhanden: build/test lauffähig)
* README “how to run” (lokal)
  **PRD-Bezug:** AC5 (teilweise), NFR5 (Grundlage)

**DoD (Commands):**

* `cd backend && uv run pytest -q`
* (falls frontend) `cd frontend && npm run build`

**Out of Scope:** DB, LLM, Docker, CI.

---

## M1 — Contract-First: JSON Schema + Typed Models + Contract Tests

**Ziel:** Verbindlicher Analysevertrag für die 6 Ebenen.
**Deliverables:** versioniertes JSON Schema, Pydantic Models, Contract Tests, Fixtures.
**PRD-Bezug:** FR2, FR3, NFR1, AC1, AC2

**DoD (Commands):**

* `cd backend && uv run pytest -q tests/contracts`
* Fixtures vorhanden: `tests/fixtures/inputs/*.txt` (mind. 20) + valid/invalid JSON Beispiele

**Out of Scope:** echte LLM Calls.

---

## M2 — Validation + Repair Loop (ohne echten LLM)

**Ziel:** Robuste Schema-/Regelprüfung + bounded Repair.
**Deliverables:** Validation report format, retry policy, fail semantics.
**PRD-Bezug:** FR4, NFR2, AC2

**DoD (Commands):**

* `cd backend && uv run pytest -q tests/validation`
* Tests: happy path, repair succeeds, repair fails after 2

---

## M3 — Persistenz (Runs) + Migrationen

**Ziel:** Nachvollziehbare Speicherung von Runs inkl. Metadaten.
**Deliverables:** DB-Schema, Alembic Migrationen, Repository-Layer.
**PRD-Bezug:** FR5, NFR4, AC4

**DoD (Commands):**

* `cd backend && uv run alembic upgrade head`
* `cd backend && uv run pytest -q tests/persistence`
* DB-ERD aktualisiert (`docs/diagrams/db-erd.puml`)

---

## M4 — REST API v1 (Analyse + Runs)

**Ziel:** API-v1 stabilisieren: Analyse starten + Runs abrufen + rerun.
**Deliverables:** Endpoints gem. PRD, Error contract, OpenAPI sichtbar.
**PRD-Bezug:** FR1, FR9, AC7, Error Contract

**DoD (Commands):**

* `cd backend && uv run pytest -q tests/api`
* Endpoints:

  * `POST /api/v1/analyses`
  * `GET /api/v1/analyses`
  * `GET /api/v1/analyses/{id}`
  * `POST /api/v1/analyses/{id}/rerun`

---

## M5 — LLM Adapter (real) + Prompt Versioning

**Ziel:** Echte LLM Integration als Adapter, Tests bleiben mocked.
**Deliverables:** LLM adapter interface + OpenAI implementation, prompts/v1, traceability fields.
**PRD-Bezug:** NFR4, Operational Definitions, UC2/UC3

**DoD (Commands):**

* `cd backend && uv run pytest -q`
* Keine Network calls in tests; adapter via mocks
* Prompt liegt unter `prompts/v1/...`, `prompt_version=v1` wird persistiert

---

## M6 — UI: Input + Pipeline View + Detail + JSON Export

**Ziel:** Nutzbare Oberfläche (nicht “Design System”).
**Deliverables:** Eingabe, Ergebnisdarstellung als 6-stufige Pipeline, Run-Liste, JSON Export.
**PRD-Bezug:** FR6, FR7, FR8, AC3

**DoD (Commands):**

* `cd frontend && npm run test -- --run`
* `cd frontend && npm run build`

---

## M7 — Integrationshärtung + Testreport

**Ziel:** Bewertungsfähige Nachweise.
**Deliverables:** Integrationssuite, 1 E2E für UJ1, Testreport.
**PRD-Bezug:** NFR5, AC5, NFR1/NFR3 Nachweise

**DoD (Commands):**

* `cd backend && uv run pytest -q tests/integration`
* `cd frontend && npm run test:e2e` (Playwright/Cypress minimal)
* `docs/test-report.md` aktualisiert (Commands + Results + Known limitations)

---

## M8 — Docker Compose (lokaler Betrieb)

**Ziel:** Reproduzierbarer Betrieb via Compose.
**Deliverables:** `docker-compose.yml`, Dockerfiles, `.env.example`, Start/Stop Anleitung.
**PRD-Bezug:** MVP Deliverables, AC5

**DoD (Commands):**

* `docker compose up --build -d`
* `docker compose ps`
* `docker compose down`

---

## M9 — Finalisierung (Docs, Abnahme, Reflexion)

**Ziel:** Abgabefähigkeit.
**Deliverables:** Doku-Freeze, Abnahmecheckliste, KI-Reflexion, optionaler Service-Extraktionsplan (ohne Umsetzung).
**PRD-Bezug:** AC1–AC8

**DoD (Commands):**

* `cd backend && uv run pytest -q`
* `cd frontend && npm run test -- --run && npm run build`
* `docker compose up -d && docker compose ps`
* arc42 Kapitel 6/7/10/11 konsistent, ADRs aktuell

---

## Optional: Service-Extraktion (nur wenn Zeit & Nutzen klar)

Erst nach M0–M9: Kriterien/Plan dokumentieren, keine erzwungene Umsetzung.
