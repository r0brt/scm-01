# Test Report

Stand: 2026-03-23

## Ausgefuehrte Commands

### Backend Gesamt-Testlauf

```bash
cd backend
uv run pytest -q
```

Resultat:

- `39 passed in 0.84s`

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 file passed`
- `2 tests passed`

Hinweis:

- fuer den finalen Lauf wurde `frontend/vite.config.ts` nachgezogen, damit Vitest keine Playwright-E2E-Dateien aus `frontend/e2e/` einsammelt
- der aktuelle UI-Testlauf deckt den zustandsgetriebenen Pipeline-View-Model-Pfad des Frontends ab

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 324ms`

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed`

Hinweis:

- der kritische Journey-Test UJ1 prueft den neuen Frontend-Flow mit Texteingabe, Analyse-Start und sichtbarer Pipeline
- der Locator fuer die Stage `Symptome` wurde nach dem Frontend-Refactor auf einen eindeutigen Heading-Locator praezisiert, damit der E2E-Nachweis im Strict-Mode stabil bleibt

### Docker Compose

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

Resultat:

- `frontend`, `api`, `db` erfolgreich gestartet
- `db` war `healthy`
- Stack wurde sauber wieder beendet

## Abgedeckte Nachweise

- kompletter Backend-Testlauf fuer Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf, Produktions-Build und deterministischer Pipeline-UX-Flow
- API-zu-Persistenz-Integrationsfluss fuer Analyse, Liste, Detail und Rerun
- UJ1-End-to-End-Nachweis: Texteingabe im Frontend, Analyse ausloesen, Pipeline sichtbar
- lokaler Compose-Betrieb mit `frontend`, `api` und `db`
- lokale Sprachdetektion fuer `de`, `fr` und `en` inkl. Fehlerpfaden fuer zu geringe Confidence und nicht unterstuetzte Sprache

## Bekannte Limitationen

- E2E deckt bewusst nur einen kritischen Happy Path ab
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung laeuft weiterhin ueber Stub/Adapter ohne echten Provider-Call im Test
- Compose ist als lokaler Zielbetrieb verifiziert; produktionsnahe Themen wie TLS, Secret-Management und Observability bleiben ausserhalb des MVP
