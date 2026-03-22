# Social Cleanup Machine

Dieses Repository enthält derzeit das Concept-/Conception-Pack des Projekts.

## Dokumentations-Navigation

- Product Requirements: [`docs/prd.md`](docs/prd.md)
- Umsetzungsplan: [`PLAN.md`](PLAN.md)
- Arbeitsvereinbarung: [`AGENTS.md`](AGENTS.md)
- Architekturdokumentation (arc42): [`docs/arc42/README.md`](docs/arc42/README.md)
- Architekturentscheidungen (ADRs): [`docs/adr/`](docs/adr/)
- Diagramme: [`docs/diagrams/README.md`](docs/diagrams/README.md)

## Aktueller Scope

Dieses Change Set enthält das Backend-Skeleton sowie Konzept- und Architekturartefakte.
Das Backend-Skeleton ist vorhanden, aber der Scope bleibt bewusst klein.

### Backend Bootstrap

Das Backend zielt auf Python `3.13` gemäß Repository-Baseline.

```bash
cd backend
uv run uvicorn app.main:app --reload
uv run pytest -q
uv run ruff check .
```

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

Lokal ist aktuell Node `v25.6.1` vorhanden. Für M0 auf `22 LTS` wechseln (gemäss `.nvmrc`), bevor Frontend-Scaffolding/Build ausgeführt wird.
