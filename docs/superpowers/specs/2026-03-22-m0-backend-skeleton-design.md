# M0 Backend Skeleton Design

## Ziel

Der erste Implementierungsschritt erstellt ein minimales, reproduzierbares Backend-Skeleton fuer SCM. Der Scope ist strikt auf M0 begrenzt: `uv`-basiertes Python-Projekt, FastAPI-App, `GET /health`, `pytest`-Harness, `ruff`-Linting und dokumentierte Run-/Test-Kommandos.

## Kontext

Der Umsetzungsplan fordert in M0 ein arbeitsfaehiges Backend-Skeleton mit `/health`, Test-Harness und reproduzierbaren Commands. Das Repository enthaelt bisher nur Konzept- und Architekturartefakte; es gibt noch keinen Anwendungscode.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M0
- `docs/prd.md`
- `docs/arc42/02_randbedingungen.md`
- `docs/arc42/05_bausteinsicht.md`

## Scope

Enthalten:

- neues Verzeichnis `backend/`
- `uv`-Projektkonfiguration fuer Python 3.13
- FastAPI-App mit genau einem Endpoint `GET /health`
- Test via `pytest` und FastAPI `TestClient`
- `ruff` als initiales Linting
- README-Ergaenzung fuer Backend-Setup, Start und Tests

Nicht enthalten:

- Datenbank, SQLAlchemy, Alembic
- API-v1-Endpunkte ausser `/health`
- JSON-Schema, Pydantic-Domainmodelle, Contract-Tests
- LLM-Adapter, Prompt-Versionierung, Docker, CI

## Designentscheidungen

### Projektstruktur

Die Backend-Struktur bleibt klein und klar:

- `backend/pyproject.toml`
- `backend/app/__init__.py`
- `backend/app/main.py`
- `backend/tests/test_health.py`

Diese Struktur ist absichtlich konservativ. Sie schafft einen sauberen Startpunkt fuer spaetere M1/M2-Artefakte, ohne schon jetzt zusaetzliche Layer oder Module einzufuehren.

### Health Endpoint

`GET /health` liefert HTTP `200` mit einem stabilen JSON-Body:

```json
{"status":"ok"}
```

Der Endpoint prueft bewusst keine externen Abhaengigkeiten. In M0 dient er nur als Bootstrap-Healthcheck fuer lokalen Start und spaetere Containerisierung.

### Teststrategie

Der erste Test ist ein API-Test gegen die laufende FastAPI-App per `TestClient`. Er prueft genau ein Verhalten:

- Statuscode ist `200`
- Antwort ist `{"status":"ok"}`

Die Implementierung erfolgt test-first. Weitere Tests oder Infrastruktur werden in diesem Schritt bewusst nicht vorgezogen.

### Tooling

`ruff` wird direkt in M0 aufgenommen, weil es geringe Einfuehrungskosten hat und fruehe Strukturdisziplin schafft. Das vermeidet spaeteren Nachzug fuer triviale PEP8-/Import-Themen.

## Definition of Done

Der Branch ist fertig, wenn:

- `backend/` als `uv`-Projekt vorhanden ist
- FastAPI lokal startbar ist
- `GET /health` mit `200` und `{"status":"ok"}` antwortet
- `cd backend && uv run pytest -q` gruen ist
- `cd backend && uv run ruff check .` gruen ist
- README die minimalen Backend-Kommandos dokumentiert

## Risiken und Guardrails

- Kein Scope-Creep in Richtung Persistenz oder API-v1
- Keine produktive Fachlogik ohne vorangehenden Test
- Keine Annahme, dass spaetere Modulgrenzen jetzt schon ausmodelliert werden muessen

## Naechster Schritt

Nach Review dieser Spec wird ein Implementierungsplan fuer `feat/m0-backend-skeleton` erstellt und anschliessend in einem separaten Feature-Branch umgesetzt.
