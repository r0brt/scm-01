# Test Report

Stand: 2026-03-22

## Ausgefuehrte Commands

### Backend Integration

```bash
cd backend
uv run pytest -q tests/integration
```

Resultat:

- `1 passed`

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed`

## Abgedeckte Nachweise

- API-zu-Persistenz-Integrationsfluss fuer Analyse, Liste, Detail und Rerun
- UJ1-End-to-End-Nachweis: Texteingabe im Frontend, Analyse ausloesen, Pipeline sichtbar

## Bekannte Limitationen

- E2E deckt bewusst nur einen kritischen Happy Path ab
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung laeuft weiterhin ueber Stub/Adapter ohne echten Provider-Call im Test
