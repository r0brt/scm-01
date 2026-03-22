# M3 Persistence Runs Design

## Ziel

M3 fuehrt eine nachvollziehbare Persistenz fuer Analyse-Runs ein. Der Deliverable umfasst ein DB-Schema fuer Runs, SQLAlchemy-Modelle, Alembic-Migrationen, einen kleinen Repository-Layer und Persistenztests.

## Kontext

Nach M1 und M2 liegen Analysevertrag sowie Validation-/Repair-Grundlogik im Backend vor, aber es existiert noch keine persistente Speicherung fuer Inputs, Analyseergebnisse, Reports und Metadaten.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M3
- `docs/prd.md`
- `docs/arc42/07_verteilungssicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`

## Scope

Enthalten:

- SQLAlchemy-2-Basismodell fuer Runs
- DB-Session-/Engine-Setup
- Alembic-Konfiguration und initiale Migration
- Repository-Layer fuer Run speichern und abrufen
- Persistenztests gegen SQLite
- minimale Doku-Nachfuehrung inklusive DB-Diagramm

Nicht enthalten:

- API-Endpunkte
- echte PostgreSQL-Integration im Testlauf
- LLM-Adapter
- Rerun-Endpoint-Logik

## Fachliche Grundentscheidung

Produktionsziel bleibt PostgreSQL, aber M3 testet gegen SQLite, um einen schnellen lokalen TDD-Loop ohne externe Infrastruktur zu behalten. Das Schema und die Migrationen bleiben dabei relational sauber und portierbar.

## Run-Modell

Ein Run speichert mindestens die im PRD geforderten Kernfelder:

- `id`
- `input_text`
- `analysis_json`
- `validation_report`
- `detected_language`
- `language_confidence`
- `model_id`
- `prompt_version`
- `run_status`
- `validation_status`
- `error_code`
- `error_reason`
- `created_at`

`analysis_json` und `validation_report` werden als JSON-Spalten modelliert. Fuer fehlgeschlagene Runs darf `analysis_json` null sein.

## Repository-Schnitt

M3 braucht nur einen kleinen, expliziten Repository-Layer:

- `create_run(...)`
- `get_run(run_id)`
- `list_runs()`

Das reicht fuer spaetere API- und Rerun-Arbeit, ohne schon Application-Services vorwegzunehmen.

## Alembic

Alembic wird in M3 eingefuehrt mit:

- `alembic.ini`
- `backend/alembic/`
- initialer Migration fuer die Tabelle `runs`

Die Migration erzeugt das Schema explizit, statt auf implizite `create_all()`-Effekte zu setzen.

## Teststrategie

Persistenztests pruefen:

1. Run mit validem Analyse-JSON wird gespeichert und gelesen
2. fehlgeschlagener Run mit `analysis_json = null` wird gespeichert
3. `list_runs()` liefert Runs in absteigender Erstellungsreihenfolge

Die Tests laufen mit SQLite, erzeugen das Schema aus den SQLAlchemy-Metadaten und verifizieren den Repository-Layer isoliert.

## Dokumentationsfolgen

M3 aendert die Persistenz- und Deployment-Sicht. Deshalb werden mindestens:

- `docs/arc42/07_verteilungssicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`
- `docs/diagrams/db-erd.puml`

nachgezogen.

## Definition of Done

M3 ist fertig, wenn:

- SQLAlchemy-Modelle und Repository existieren
- Alembic-Migration fuer `runs` existiert
- `cd backend && uv run alembic upgrade head` erfolgreich laeuft
- `cd backend && uv run pytest -q tests/persistence` gruen ist
- DB-ERD in `docs/diagrams/db-erd.puml` aktualisiert ist

## Risiken und Guardrails

- Kein Vorziehen von API- oder Rerun-Logik
- Kein Mischen von SQLite-Testdetails in Produktionskonfiguration
- Keine impliziten Fallbacks fuer fehlende Persistenzfelder
