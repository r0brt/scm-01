# Abnahmecheckliste

Stand: 2026-05-30

## Produkt und Architektur

- [x] Analysevertrag mit sechs Ebenen ist definiert und implementiert
- [x] Strikte Validierungslogik ist im aktiven Laufzeitpfad vorhanden
- [x] Bounded Repair-Logik ist im Repository vorbereitet, aber im aktuellen Standardpfad nicht verdrahtet
- [x] Analyse-Runs werden mit Traceability-Metadaten inklusive `correlation_id` persistiert
- [x] API-v1 für Analyse, Liste, Detail und Rerun ist vorhanden
- [x] Frontend zeigt Eingabe, Pipeline, Run-Liste, Archiv-Nachweise und JSON-Export
- [x] Lokaler Zielbetrieb via Docker Compose ist dokumentiert

## Datenschutz, KI-Governance und Nachvollziehbarkeit

- [x] Datenschutz- und KI-Governance-Annahmen sind dokumentiert
- [x] Externe Datenpfade und Grenzen des MVP sind explizit beschrieben
- [x] Requestgebundene `correlation_id` wird bei neuen Runs mitpersistiert und in Fehlerantworten wiederverwendet
- [x] Traceability-Felder pro Run sind dokumentiert und im Datenmodell sichtbar
- [x] Die Grenze zwischen Run-Nachvollziehbarkeit und vollständigem Ende-zu-Ende-Audit-Trail ist offengelegt

## PRD-Abnahmekriterien

- [x] AC1: sechs Ebenen vorhanden und korrekt benannt
- [x] AC2: schema-valide Ausgabe oder expliziter `failed`-Zustand mit Report
- [x] AC3: UI zeigt Pipeline oder klaren Fehlerzustand
- [x] AC4: Analysen sind persistiert und abrufbar
- [x] AC5: Unit-/Integrations-Tests reproduzierbar; ein UJ1-E2E-Testpfad ist vorhanden und dokumentiert
- [x] AC6: lokale Sprachdetektion für `de`, `fr` und `en` ist umgesetzt
- [x] AC7: API-v1-Endpunkte sind implementiert und dokumentiert
- [x] AC8: Sprachdetektionsfehler für geringe Confidence und nicht unterstützte Sprache sind separat implementiert

## Aktuell erfolgreich verifizierte Commands

- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q`
- [x] `cd frontend && npm run test -- --run`
- [x] `cd frontend && npm run build`
- [x] GitHub Actions `CI` auf `main` für Commit `9cfa2b9`

## Nachweise mit bekannten Voraussetzungen oder Limitationen

- [x] `cd frontend && npm run test:e2e`
  Der Testpfad nutzt dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports und lief nach `npx playwright install` erfolgreich durch.
- [x] `docker compose up -d --build`
- [x] `docker compose ps`
- [x] `docker compose down`
  Compose wurde am 2026-05-30 als Start-/Status-/Stop-Nachweis für den lokalen Zielbetrieb mit API, Frontend und PostgreSQL verifiziert. Ein zusätzlicher HTTP-End-to-End-Test über die veröffentlichten Host-Ports wurde in der aktuellen Codex-Sandbox nicht erfolgreich durchgeführt.

## Verweis auf Nachweisdokumente

- Architekturstand und Querschnittskonzepte: `docs/arc42/`
- Datenschutz, KI-Governance, AI-Act-Einordnung und MVP-Grenzen: `docs/privacy-and-ai-governance.md`
- Ausgeführte technische Verifikation: `docs/test-report.md`
- Diagrammquellen und gerenderte SVGs: `docs/diagrams/README.md`

## Offene Restpunkte

- [ ] Echte Provider-Integration mit Netz und produktionsnaher Betriebsumgebung ist bewusst nicht Teil des MVP
- [ ] Mehrsprachigkeit ist bewusst auf `de`, `fr` und `en` begrenzt; weitere Sprachen bleiben mögliche Folgearbeit
- [ ] Breitere E2E-Matrix, frei verfügbare E2E-Ports und produktionsnahe Observability bleiben mögliche Folgearbeit
