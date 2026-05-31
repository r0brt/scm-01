# Social Cleanup Machine

Social Cleanup Machine (SCM) ist ein MVP zur strukturellen Klärung frei formulierter Problemtexte. Die Anwendung zerlegt Texte in sechs feste Ebenen (`symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`) und macht diese Verarbeitung als Pipeline sichtbar.

SCM beurteilt Inhalte nicht moralisch, politisch oder faktisch. Das System dient als nachvollziehbarer Analyse- und Diskussionsrahmen: Eingabetext, Analyseergebnis, Validierung, Metadaten und technische Fehlerpfade werden explizit dokumentiert.

## Aktueller Stand

Der aktuelle Stand enthält:

- FastAPI-Backend mit API-v1 für Analyse, Listenansicht, Detailansicht und Rerun
- striktes JSON-Schema für Analyseausgaben unter `schemas/`
- versionierte Prompts unter `prompts/`
- lokale Sprachdetektion für `de`, `fr` und `en`
- LLM-Adapter mit lokalem Stub-Default und optionalem OpenAI-Pfad
- SQLAlchemy/Alembic-Persistenz für immutable Analyse-Runs
- React/Vite-Frontend mit Analyseansicht, Archiv, Metadaten und JSON-Export
- lokaler Zielbetrieb via Docker Compose mit `frontend`, `api` und PostgreSQL-`db`
- arc42-Dokumentation, ADRs, OpenAPI-Snapshot, Testreport und Abnahmecheckliste

Referenz-Release: `v0.9.0-review-baseline`. Die Restplanung Richtung `v1.0.0` steht in [`docs/v1.0-roadmap.md`](docs/v1.0-roadmap.md).

## Schnellstart mit Docker Compose

Der einfachste lokale Start nutzt Docker Compose. Standardmässig läuft die Analyse über den Stub-Adapter und benötigt keinen externen LLM-Zugriff.

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

Erreichbarkeit:

- Frontend: <http://127.0.0.1:4173>
- Backend Health: <http://127.0.0.1:8000/health>

Stoppen:

```bash
docker compose down
```

Lokale Compose-Daten inklusive PostgreSQL-Volume löschen:

```bash
docker compose down -v
```

## Lokaler Entwicklungsstart

Voraussetzungen:

- Python `3.13.12` gemäss [`.python-version`](.python-version)
- Node.js `22` gemäss [`.nvmrc`](.nvmrc)
- `uv`, `npm`, Docker und Docker Compose

Backend:

```bash
cd backend
uv run --python 3.13 uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Das Frontend erwartet die API im lokalen Entwicklungsmodus über die konfigurierte Vite-/Proxy-Umgebung. Für einen vollständigen lokalen Zielbetrieb ist Docker Compose der bevorzugte Einstieg.

## LLM-Konfiguration

Ohne weitere Konfiguration nutzt das Backend den deterministischen Stub-Adapter. Für einen lokalen Lauf mit OpenAI-Provider:

```bash
export SCM_ANALYSIS_PROVIDER=openai
export SCM_OPENAI_MODEL=gpt-5.2
export OPENAI_API_KEY=...
cd backend
uv run --python 3.13 uvicorn app.main:app --reload
```

Bei Compose werden dieselben Variablen über `.env` gesetzt. Tests dürfen keine Netzwerkaufrufe an externe Provider ausführen; Providerzugriffe laufen dort über kontrollierte Doubles oder Mocks.

## API

Der versionierte API-Vertrag ist als OpenAPI-Snapshot dokumentiert:

- [`docs/api/openapi.json`](docs/api/openapi.json)

Aktuelle API-v1-Endpunkte:

- `POST /api/v1/analyses`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{analysis_id}`
- `POST /api/v1/analyses/{analysis_id}/rerun`
- `GET /health`

Fehlerantworten folgen dem dokumentierten Error-Contract mit `error.code`, `message`, optionalen `details` und `correlation_id`. Zusätzlich wird die requestgebundene `correlation_id` über den `X-Correlation-ID` Header sichtbar.

OpenAPI-Snapshot aktualisieren:

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/export_openapi.py
```

## Tests und Verifikation

Backend:

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Frontend:

```bash
cd frontend
npm run test -- --run
npm run build
```

Lokaler Playwright-Journey-Test:

```bash
cd frontend
npm run test:e2e
```

Hinweise:

- Playwright-Browser müssen lokal installiert sein, falls sie noch fehlen: `npx playwright install`
- der E2E-Test nutzt eigene lokale Ports und mockt die Analyse-API kontrolliert
- der reale Backend-/API-/Persistenzpfad wird separat durch Backend-, API-, Contract-, Validierungs- und Persistenztests nachgewiesen

Der aktuelle Test- und Nachweisstand ist in [`docs/test-report.md`](docs/test-report.md) dokumentiert.

GitHub Actions führt für Pull Requests und Pushes auf `main` den Basic Quality Gate aus:

- Backend: Ruff und Pytest
- Frontend: Vitest und Produktions-Build

Der Playwright-E2E-Pfad bleibt ein lokaler Nachweis und ist im Testreport beschrieben.

## Dokumentation

Zentrale Dokumente:

- Produktanforderungen: [`docs/prd.md`](docs/prd.md)
- Roadmap: [`PLAN.md`](PLAN.md) und [`docs/v1.0-roadmap.md`](docs/v1.0-roadmap.md)
- Arbeitsregeln für Codex und Maintainer: [`AGENTS.md`](AGENTS.md)
- arc42-Architekturdokumentation: [`docs/arc42/README.md`](docs/arc42/README.md)
- Architekturentscheidungen: [`docs/adr/`](docs/adr/)
- Datenschutz und KI-Governance: [`docs/privacy-and-ai-governance.md`](docs/privacy-and-ai-governance.md)
- Abnahmecheckliste: [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md)
- Testreport: [`docs/test-report.md`](docs/test-report.md)
- Diagrammquellen und gerenderte SVGs: [`docs/diagrams/README.md`](docs/diagrams/README.md)

Die arc42-Dokumentation ist das primäre Architekturdokument. Bei Änderungen an API, Datenmodell, Deployment, LLM-Integration, Validierung, Repair, Logging oder Traceability müssen die betroffenen arc42-Kapitel und gegebenenfalls ADRs, OpenAPI-Snapshot, Testreport oder Abnahmecheckliste nachgeführt werden.

## Repository-Struktur

```text
backend/   FastAPI-Backend, Services, LLM-Adapter, Persistenz, Tests
frontend/  React/Vite-Frontend und Playwright-Konfiguration
schemas/   versionierter JSON-Vertrag der Analyseausgabe
prompts/   versionierte Analyse-Prompts
docs/      PRD, arc42, ADRs, Testreport, Diagramme und Governance-Doku
```

## Bewusste Grenzen des MVP

- keine autonome fachliche, moralische oder politische Beurteilung
- kein Fact-Checking und keine Quellenprüfung
- keine Benutzerverwaltung, Rollen oder Mehrmandantenfähigkeit
- keine produktionsreife Datenschutz-Organisation oder vollständige Privacy Operations
- keine produktionsnahe Observability mit zentraler Logaggregation, Metriken und Alerting
- keine produktionsnahe Lastmessung mit externem Provider

Diese Grenzen sind bewusst dokumentiert, damit der aktuelle MVP-Stand nachvollziehbar bleibt und spätere Erweiterungen kontrolliert geplant werden können.
