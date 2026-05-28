# Social Cleanup Machine

Dieses Repository enthält den aktuellen MVP-Stand des Projekts inklusive Backend, Frontend, Persistenz, Docker-Compose-Betrieb und Projektdokumentation.

## Dokumentations-Navigation

- Product Requirements: [`docs/prd.md`](docs/prd.md)
- Umsetzungsplan: [`PLAN.md`](PLAN.md)
- Arbeitsvereinbarung: [`AGENTS.md`](AGENTS.md)
- Architekturdokumentation (arc42): [`docs/arc42/README.md`](docs/arc42/README.md)
- Architekturentscheidungen (ADRs): [`docs/adr/`](docs/adr/)
- Diagramme: [`docs/diagrams/README.md`](docs/diagrams/README.md)

## Aktueller Scope

Dieses Repository enthält inzwischen Backend-, Persistenz-, API- und Frontend-Bausteine des Projekts.
Der aktuelle Stand umfasst:

- FastAPI-Backend mit Analyse-, Run- und Rerun-API
- SQLAlchemy/Alembic-basierte Persistenz
- versionierte Prompts, lokale Sprachdetektion und konfigurierbare LLM-Adapter-Schnittstelle
- React/Vite-Frontend unter `frontend/`

### Backend Bootstrap

Das Backend zielt auf Python `3.13` gemäß Repository-Baseline; die Quick-Start-Befehle setzen deshalb Python `3.13` explizit voraus.

```bash
cd backend
uv run --python 3.13 uvicorn app.main:app --reload
uv run --python 3.13 pytest -q
uv run --python 3.13 ruff check .
```

Produktiver Analysepfad lokal:

```bash
cd backend
export SCM_ANALYSIS_PROVIDER=openai
export SCM_OPENAI_MODEL=gpt-5.2
export OPENAI_API_KEY=...
uv run --python 3.13 uvicorn app.main:app --reload
```

Ohne diese Konfiguration bleibt der Stub-Adapter der Default. Die lokale Sprachdetektion läuft in beiden Fällen vor jeder Analyse und akzeptiert aktuell `de`, `fr` und `en`.

## Environment Baseline (M0)

Unterstützte Baseline für M0:

- Python: `3.13.x` (aktuell gepinnt: `3.13.12`)
- Node.js: `22 LTS` (siehe `.nvmrc`)
- `uv`: installiert und verfügbar im PATH

### Verify (vor dem Scaffolding)

```bash
brew list --versions python@3.13 uv
python3.13 --version
uv --version
node --version
npm --version
```

Hinweis: Wenn `python3` auf macOS-System-Python zeigt (z. B. `/usr/bin/python3`), verwende für Projekt-Setup explizit `python3.13` oder passe den PATH an.

### Backend Bootstrap (Python 3.13 explizit)

Für den Backend-Start in M0 muss die Umgebung explizit mit Python 3.13 erstellt/selektiert werden (nicht implizit via `/usr/bin/python3`), z. B.:

```bash
cd backend
uv venv --python 3.13
uv run --python 3.13 pytest -q
```

### Node-Version für M0

Für M0 auf Node `22 LTS` wechseln (gemäss `.nvmrc`), bevor Frontend-Scaffolding/Build ausgeführt wird.

## Frontend Quick Start

```bash
cd frontend
npm install
npm run test -- --run
npm run test:e2e
npm run build
```

### Lokaler Playwright-Journey-Test

Für den lokalen Playwright-Journey-Test gilt:

- Playwright-Browser einmalig lokal installieren: `npx playwright install`
- `npm run test:e2e` startet eigene lokale Dev-Server für Backend und Frontend
- die Standardports für E2E sind bewusst getrennt von den normalen Dev-/Compose-Ports:
  - Frontend E2E: `14173` statt `4173`
  - Backend E2E: `18000` statt `8000`
- die E2E-Ports lassen sich bei Bedarf überschreiben mit `SCM_E2E_FRONTEND_PORT` und `SCM_E2E_BACKEND_PORT`

Beispiel mit expliziten Overrides:

```bash
cd frontend
SCM_E2E_FRONTEND_PORT=15173 SCM_E2E_BACKEND_PORT=19000 npm run test:e2e
```

## Docker Compose (M8)

Der lokale Zielbetrieb besteht aus drei Containern: `frontend`, `api` und `db`.
Das Frontend wird statisch via Nginx ausgeliefert und leitet `/api` an das Backend weiter. Die API führt beim Start automatisch `alembic upgrade head` gegen PostgreSQL aus.

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
docker compose down
```

Erreichbarkeit nach `up`:

- Frontend: `http://127.0.0.1:4173`
- Backend-Health: `http://127.0.0.1:8000/health`

## Finale Verifikation (M9)

```bash
cd backend && uv run pytest -q
cd frontend && npm run test -- --run
cd frontend && npm run build
docker compose up --build -d
docker compose ps
docker compose down
```
