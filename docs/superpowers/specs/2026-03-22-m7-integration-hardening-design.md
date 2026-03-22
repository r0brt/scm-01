# M7 Integration Hardening Design

## Ziel

M7 liefert den ersten bewertbaren Integrationsnachweis fuer SCM. Der Deliverable umfasst eine Backend-Integrationssuite, einen minimalen E2E-Test fuer UJ1 und einen Testreport mit echten Ausfuehrungsresultaten.

## Kontext

Nach M6 existieren Backend, Persistenz, API, Adapter-Schnittstelle und Frontend. Es fehlt aber noch ein expliziter End-to-End-Nachweis fuer den kritischen Pfad sowie ein dokumentierter Testreport.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M7
- `docs/prd.md`
- `frontend/src/App.tsx`
- `backend/app/main.py`

## Scope

Enthalten:

- Backend-Integrationstests unter `backend/tests/integration/`
- ein minimaler Frontend-E2E-Test fuer UJ1
- erforderliches Test-Wiring fuer lokale Integration/E2E-Ausfuehrung
- `docs/test-report.md` mit realen Commands und Ergebnissen

Nicht enthalten:

- breite E2E-Matrix
- visuelle Regressionstests
- Docker/Compose-basierte Testorchestrierung

## Fachliche Grundentscheidung

Der UJ1-Nachweis bleibt bewusst klein, aber echt:

1. Frontend laeuft lokal
2. Backend laeuft lokal
3. Nutzer gibt Text ein
4. Analyse wird erstellt
5. Pipeline wird sichtbar

Backend-Integrationstests pruefen denselben Fluss ohne Browser auf API-Ebene gegen eine echte Testdatenbank.

## Teststrategie

### Backend Integration

Die Integrationssuite prueft mindestens:

- `POST /api/v1/analyses` speichert einen neuen Run
- `GET /api/v1/analyses` und `GET /api/v1/analyses/{id}` liefern den Run wieder aus
- `POST /api/v1/analyses/{id}/rerun` erzeugt einen zweiten Run

### Frontend E2E

Ein einzelner kritischer Test fuer UJ1:

- Seite oeffnen
- Text eingeben
- Analyse starten
- Pipeline-Element erscheint

## Tooling

Fuer E2E wird ein minimales Playwright-Setup eingefuehrt. Die Testumgebung startet Frontend und Backend ueber lokale Dev-Server.

## Dokumentationsfolgen

M7 erzeugt explizite Nachweise und deshalb:

- `docs/test-report.md`
- optional kleine Hinweise in `README.md`

## Definition of Done

M7 ist fertig, wenn:

- `cd backend && uv run pytest -q tests/integration` gruen ist
- `cd frontend && npm run test:e2e` gruen ist
- `docs/test-report.md` die realen Befehle und Ergebnisse dokumentiert

## Risiken und Guardrails

- kein ueberladener E2E-Umfang
- keine Netzaufrufe ausser lokalen Dev-Servern
- Testreport nur mit tatsaechlich ausgefuehrten Commands aktualisieren
