# Test Report

Stand: 2026-05-27
Baseline-Commit: `8186e05`

## Ausgefuehrte Commands

### Backend Gesamt-Testlauf

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q
```

Resultat:

- `45 passed in 1.52s`

Hinweis:

- der Lauf wurde ueber `uv` mit der projektbezogenen Python-3.13-Umgebung ausgefuehrt

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 file passed`
- `7 tests passed`

Hinweis:

- der UI-Testlauf deckt zentrale Struktur- und Darstellungsinvarianten der Analyse-/Archiv-Ansicht ab

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 460ms`

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- nicht erfolgreich abgeschlossen

Beobachtung:

- nach dem Stoppen des lokalen Compose-Stacks starteten Frontend- und Backend-Webserver im Playwright-Setup korrekt
- der Lauf scheiterte anschliessend an fehlenden lokal installierten Playwright-Browser-Binaries
- empfohlener Folge-Command laut Playwright: `npx playwright install`

## Abgedeckte Nachweise

- kompletter Backend-Testlauf fuer Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- projektbezogene Python-3.13-Ausfuehrung ueber `uv`
- aktueller Re-Onboarding-Nachweis, dass `main` lokal sauber und mit `origin/main` ausgerichtet ist
- E2E-Setup startet lokal korrekt bis zum Browser-Launch

## Bekannte Limitationen

- E2E deckt weiterhin nur einen kritischen Happy Path fuer UJ1 ab
- der aktuelle E2E-Lauf benoetigt lokal installierte Playwright-Browser-Binaries
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung laeuft in Tests weiterhin ueber Stub/Fake-Adapter ohne echten Provider-Call
- Compose ist im aktuellen Freeze-Prep nicht erneut end-to-end verifiziert worden
