# Abnahmecheckliste

Stand: 2026-03-23

## Produkt und Architektur

- [x] Analysevertrag mit sechs Ebenen ist definiert und implementiert
- [x] Validation- und bounded Repair-Logik sind vorhanden
- [x] Analyse-Runs werden mit Traceability-Metadaten persistiert
- [x] API-v1 fuer Analyse, Liste, Detail und Rerun ist vorhanden
- [x] Frontend zeigt Eingabe, Pipeline, Run-Liste und JSON-Export
- [x] Lokaler Zielbetrieb via Docker Compose ist dokumentiert und verifiziert

## PRD-Abnahmekriterien

- [x] AC1: sechs Ebenen vorhanden und korrekt benannt
- [x] AC2: schema-valide Ausgabe oder expliziter `failed`-Zustand mit Report
- [x] AC3: UI zeigt Pipeline oder klaren Fehlerzustand
- [x] AC4: Analysen sind persistiert und abrufbar
- [x] AC5: Unit-/Integrations-Tests reproduzierbar; ein E2E-Test fuer UJ1 vorhanden
- [x] AC6: lokale Sprachdetektion fuer `de`, `fr` und `en` ist umgesetzt
- [x] AC7: API-v1-Endpunkte sind implementiert und dokumentiert
- [x] AC8: Sprachdetektionsfehler fuer geringe Confidence und nicht unterstuetzte Sprache sind separat implementiert

## Reproduzierbare Verifikation

- [x] `cd backend && uv run pytest -q`
- [x] `cd frontend && npm run test -- --run`
- [x] `cd frontend && npm run build`
- [x] `cd frontend && npm run test:e2e`
- [x] `docker compose up -d`
- [x] `docker compose ps`
- [x] `docker compose down`

## Offene Restpunkte

- [ ] Echte Provider-Integration mit Netz und produktionsnaher Betriebsumgebung ist bewusst nicht Teil des MVP
- [ ] Mehrsprachigkeit ist bewusst auf `de`, `fr` und `en` begrenzt; weitere Sprachen bleiben moegliche Folgearbeit
- [ ] Breitere E2E-Matrix und produktionsnahe Observability bleiben moegliche Folgearbeit
