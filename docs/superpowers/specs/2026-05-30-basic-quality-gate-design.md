# Basic Quality Gate CI Design

## Ziel

Dieses Change führt einen kleinen, stabilen GitHub-Actions-Quality-Gate ein. Pull Requests und Pushes auf `main` sollen automatisch die wichtigsten lokalen Qualitätsnachweise ausführen: Backend-Linting, Backend-Tests, Frontend-Tests und Frontend-Build.

## Kontext

Der aktuelle Stand ist lokal gut verifizierbar, aber GitHub meldete beim letzten PR keine Checks. Für die Abgabe ist eine automatische CI sinnvoll, weil sie Reproduzierbarkeit, Nachvollziehbarkeit und Review-Qualität sichtbar verbessert.

Relevante Quellen:

- `AGENTS.md`: fordert reproduzierbare Changes, Tests und kleine Branches.
- `README.md`: dokumentiert Backend- und Frontend-Testbefehle.
- `backend/pyproject.toml`: definiert Python `>=3.13,<3.14`, `ruff` und `pytest`.
- `frontend/package.json`: definiert `test`, `build` und `test:e2e`.
- `docs/test-report.md`: dokumentiert bisher lokale Verifikation und bekannte E2E-Grenzen.

## Designentscheidung

Der erste CI-Ausbau ist bewusst ein **CI light**:

- Backend-Job mit Python 3.13 und `uv`
- Frontend-Job mit Node und `npm`
- kein E2E im ersten CI-PR
- keine Provider-/Netzabhängigkeit
- keine Secrets
- keine Docker-Compose-Prüfung

Damit wird der wichtigste Qualitätsnachweis automatisiert, ohne sofort Playwright-Browser, Ports oder externe Anbieter in die CI zu ziehen.

## Scope

In Scope:

- `.github/workflows/ci.yml`
- Trigger für `pull_request` und `push` auf `main`
- Backend-Check:
  - `uv run --python 3.13 ruff check .`
  - `uv run --python 3.13 pytest -q`
- Frontend-Check:
  - `npm ci`
  - `npm run test -- --run`
  - `npm run build`
- kurze Doku-Ergänzung in `README.md` und/oder `docs/test-report.md`

Out of Scope:

- Playwright-E2E in CI
- Docker-Compose-E2E in CI
- OpenAI-/Provider-Integration in CI
- Deployment
- Branch-Protection-Regeln in GitHub
- Coverage-Reporting

## CI-Struktur

Der Workflow erhält zwei unabhängige Jobs:

1. `backend`
   - Checkout
   - Python 3.13 bereitstellen
   - `uv` installieren
   - Backend-Abhängigkeiten über `uv run` auflösen
   - `ruff` und `pytest` ausführen

2. `frontend`
   - Checkout
   - Node bereitstellen
   - `npm ci` in `frontend/`
   - Vitest im Run-Modus ausführen
   - Produktions-Build ausführen

Die Jobs laufen parallel. Ein PR gilt als technisch nicht bereit, wenn einer dieser Jobs fehlschlägt.

## Risiken und Grenzen

- GitHub Actions kann erstmals Tooling-Probleme sichtbar machen, die lokal bisher nicht auffielen.
- Python 3.13 und `uv` müssen im Workflow explizit eingerichtet werden.
- Frontend-E2E bleibt weiterhin nur lokal dokumentiert, bis ein späterer separater CI-Ausbau folgt.
- Ohne aktivierte Branch Protection blockieren fehlschlagende Checks nicht automatisch einen Merge; sie sind aber sichtbar und reviewbar.

## Verifikation

Lokal vor dem Push:

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q

cd ../frontend
npm ci
npm run test -- --run
npm run build
```

Nach dem Push:

- PR öffnen
- GitHub Actions Checks abwarten
- falls rot: Logs prüfen, fixen, erneut pushen

## Definition of Done

- CI-Workflow existiert unter `.github/workflows/ci.yml`.
- Workflow läuft auf PRs und Pushes auf `main`.
- Backend-Job führt `ruff` und `pytest` aus.
- Frontend-Job führt Unit/UI-Tests und Build aus.
- Doku nennt den Basic Quality Gate und grenzt E2E als späteren Ausbau ab.
- Lokale Checks laufen weiterhin grün.
- PR zeigt GitHub Checks an.
