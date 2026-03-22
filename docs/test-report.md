# Test Report

Stand: 2026-03-22

## Ausgefuehrte Commands

### Backend Gesamt-Testlauf

```bash
cd backend
uv run pytest -q
```

Resultat:

- `26 passed`

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 passed`

Hinweis:

- fuer den finalen Lauf wurde `frontend/vite.config.ts` nachgezogen, damit Vitest keine Playwright-E2E-Dateien aus `frontend/e2e/` einsammelt

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 430ms`

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed`

### Docker Compose

```bash
docker compose up -d
docker compose ps
docker compose down
```

Resultat:

- `frontend`, `api`, `db` erfolgreich gestartet
- `db` war `healthy`
- Stack wurde sauber wieder beendet

## Abgedeckte Nachweise

- kompletter Backend-Testlauf fuer Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- API-zu-Persistenz-Integrationsfluss fuer Analyse, Liste, Detail und Rerun
- UJ1-End-to-End-Nachweis: Texteingabe im Frontend, Analyse ausloesen, Pipeline sichtbar
- lokaler Compose-Betrieb mit `frontend`, `api` und `db`

## Bekannte Limitationen

- E2E deckt bewusst nur einen kritischen Happy Path ab
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung laeuft weiterhin ueber Stub/Adapter ohne echten Provider-Call im Test
- Compose ist als lokaler Zielbetrieb verifiziert; produktionsnahe Themen wie TLS, Secret-Management und Observability bleiben ausserhalb des MVP
