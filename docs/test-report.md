# Test Report

Stand: 2026-05-30
Baseline-Commit: `33aa027`

Dieser Testreport dokumentiert die zuletzt ausgeführten lokalen und CI-bezogenen Nachweise. Er ist kein vollständiger Produktionsabnahmetest, sondern ein reproduzierbarer MVP-Nachweis für Backend, Frontend, Compose-Startfähigkeit und den lokalen UJ1-E2E-Pfad.

## Ausgeführte Commands

### Backend Linting

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
```

Resultat:

- `All checks passed!`

### Backend Gesamt-Testlauf

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Resultat:

- `49 passed in 2.19s`

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 file passed`
- `10 tests passed`
- `Duration 2.33s`

Hinweis:

- der UI-Testlauf deckt zentrale Struktur- und Darstellungsinvarianten der Analyse-/Archiv-Ansicht, die Trennung zwischen Archiv-Auswahl und Analyse-Ansicht sowie das Scrollen zum oberen Seitenbereich nach Archiv-Run-Auswahl ab

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 719ms`

### Docker Compose Laufzeitnachweis

```bash
docker compose up -d --build
docker compose ps
docker compose down
```

Resultat:

- `docker compose up -d --build` baute `scm-01-api` und `scm-01-frontend`, zog `postgres:17-alpine` und startete `db`, `api` und `frontend`
- `docker compose ps` zeigte `scm-01-db-1` als `Up ... (healthy)` sowie `scm-01-api-1` und `scm-01-frontend-1` als `Up`
- veröffentlichte Ports laut Compose-Status: API `8000`, DB `5432`, Frontend `4173`
- `curl -fsS http://127.0.0.1:8000/health` lieferte `{"status":"ok"}`
- `curl -fsS -I http://127.0.0.1:4173` lieferte `HTTP/1.1 200 OK`
- `docker compose down` stoppte und entfernte die drei Container sowie das Compose-Netzwerk erfolgreich

Hinweis:

- Docker-Zugriff und Host-HTTP-Prüfung wurden ausserhalb der Codex-Sandbox ausgeführt, weil die Sandbox keinen direkten Zugriff auf den Docker-Socket beziehungsweise die veröffentlichten Host-Ports erlaubt

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed in 3.6s`

Beobachtung:

- das Playwright-Setup nutzt nun dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports:
  - Frontend E2E: `14173`
  - Backend E2E: `18000`
- dadurch sind Konflikte mit den Standardports `4173` und `8000` deutlich weniger wahrscheinlich
- benutzerdefinierte lokale Konflikte auf den gewählten E2E-Ports bleiben weiterhin möglich
- nach `npx playwright install` starteten Frontend- und Backend-Webserver im Playwright-Setup korrekt
- der UJ1-Browserpfad wurde erfolgreich ausgeführt

## Abgedeckte Nachweise

Die fachliche Einordnung dieser Nachweise erfolgt ergänzend in `docs/acceptance-checklist.md`.

- kompletter Backend-Testlauf für Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- projektbezogene Python-3.13-Ausführung über `uv`
- aktueller Nachweis auf `main`-Commit `33aa027`
- Docker-Compose-Zielbetrieb startet lokal mit API, Frontend und PostgreSQL; API-Health und Frontend-HTTP-Status wurden über die veröffentlichten Host-Ports geprüft
- E2E-Setup und UJ1-Browserpfad laufen lokal erfolgreich

## Automatisierter Quality Gate

GitHub Actions führt für Pull Requests und Pushes auf `main` einen Basic Quality Gate aus. Dieser umfasst Backend-Linting, Backend-Tests, Frontend-Unit-/UI-Tests und Frontend-Build. Der aktuelle `main`-Push zu `33aa027` war erfolgreich (`CI`, Run `26683234622`, 2026-05-30T11:58:50Z). Playwright-E2E bleibt bewusst ausserhalb dieses ersten CI-Ausbaus.

## Bekannte Limitationen

- E2E deckt weiterhin nur einen kritischen Happy Path für UJ1 ab
- der E2E-Lauf benötigt lokal installierte Playwright-Browser-Binaries
- der lokale E2E-Lauf nutzt eigene dedizierte Ports statt `4173` und `8000`, kann aber weiterhin durch benutzerdefinierte Konflikte auf den gewählten E2E-Ports blockiert werden
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung läuft in Tests weiterhin über Stub/Fake-Adapter ohne echten Provider-Call
- Compose wurde lokal als Start-/Status-/HTTP-/Stop-Nachweis verifiziert; dies ersetzt noch keinen produktionsnahen Betriebs- oder Lasttest
