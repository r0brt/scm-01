# Test Report

Stand: 2026-05-27
Baseline-Commit: `8186e05`

## Ausgeführte Commands

### Backend Gesamt-Testlauf

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q
```

Resultat:

- `45 passed in 1.52s`

Hinweis:

- der Lauf wurde über `uv` mit der projektbezogenen Python-3.13-Umgebung ausgeführt

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
- lokale Portkonflikte auf `4173` oder `8000` bleiben eine bekannte Voraussetzung, wenn gleichzeitig ein Compose-Stack oder andere Dev-Server laufen
- der Lauf scheiterte anschliessend an fehlenden lokal installierten Playwright-Browser-Binaries
- empfohlener Folge-Command laut Playwright: `npx playwright install`

## Abgedeckte Nachweise

- kompletter Backend-Testlauf für Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- projektbezogene Python-3.13-Ausführung über `uv`
- aktueller Re-Onboarding-Nachweis, dass `main` lokal sauber und mit `origin/main` ausgerichtet ist
- E2E-Setup startet lokal korrekt bis zum Browser-Launch

## Bekannte Limitationen

- E2E deckt weiterhin nur einen kritischen Happy Path für UJ1 ab
- der aktuelle E2E-Lauf benötigt lokal installierte Playwright-Browser-Binaries
- fuer den lokalen E2E-Lauf muessen die benoetigten Dev-Ports frei sein; parallele Compose- oder andere lokale Dev-Server koennen den Start blockieren
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung läuft in Tests weiterhin über Stub/Fake-Adapter ohne echten Provider-Call
- Compose ist im aktuellen Freeze-Prep nicht erneut end-to-end verifiziert worden
