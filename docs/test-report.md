# Test Report

Stand: 2026-05-29
Baseline-Commit: `8186e05`

## Ausgeführte Commands

### Backend Gesamt-Testlauf

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run pytest -q
```

Resultat:

- `49 passed in 4.92s`

Hinweis:

- der Lauf wurde zuletzt auf der Branch `feat/traceability-hardening` ueber `uv` mit der projektbezogenen Python-3.13-Umgebung ausgefuehrt

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 file passed`
- `10 tests passed`

Hinweis:

- der UI-Testlauf deckt zentrale Struktur- und Darstellungsinvarianten der Analyse-/Archiv-Ansicht, die Trennung zwischen Archiv-Auswahl und Analyse-Ansicht sowie das Scrollen zum oberen Seitenbereich nach Archiv-Run-Auswahl ab

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 459ms`

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed in 5.2s`

Beobachtung:

- das Playwright-Setup nutzt nun dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports:
  - Frontend E2E: `14173`
  - Backend E2E: `18000`
- dadurch sind Konflikte mit den Standardports `4173` und `8000` deutlich weniger wahrscheinlich
- benutzerdefinierte lokale Konflikte auf den gewählten E2E-Ports bleiben weiterhin möglich
- nach `npx playwright install` starteten Frontend- und Backend-Webserver im Playwright-Setup korrekt
- der UJ1-Browserpfad wurde erfolgreich ausgefuehrt

## Abgedeckte Nachweise

- kompletter Backend-Testlauf für Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- projektbezogene Python-3.13-Ausführung über `uv`
- aktueller Re-Onboarding-Nachweis, dass `main` lokal sauber und mit `origin/main` ausgerichtet ist
- E2E-Setup und UJ1-Browserpfad laufen lokal erfolgreich

## Bekannte Limitationen

- E2E deckt weiterhin nur einen kritischen Happy Path für UJ1 ab
- der E2E-Lauf benötigt lokal installierte Playwright-Browser-Binaries
- der lokale E2E-Lauf nutzt eigene dedizierte Ports statt `4173` und `8000`, kann aber weiterhin durch benutzerdefinierte Konflikte auf den gewählten E2E-Ports blockiert werden
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung läuft in Tests weiterhin über Stub/Fake-Adapter ohne echten Provider-Call
- Compose ist im aktuellen Freeze-Prep nicht erneut end-to-end verifiziert worden
