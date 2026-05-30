# Abnahmecheckliste

Stand: 2026-05-30

## Produkt und Architektur

- [x] Analysevertrag mit sechs Ebenen ist definiert und implementiert
- [x] Strikte Validierungslogik ist im aktiven Laufzeitpfad vorhanden
- [x] Bounded Repair-Logik ist im Repository vorbereitet, aber im aktuellen Standardpfad nicht verdrahtet
- [x] Analyse-Runs werden mit Traceability-Metadaten inklusive `correlation_id` persistiert
- [x] API-v1 für Analyse, Liste, Detail und Rerun ist vorhanden
- [x] API-v1 ist als OpenAPI-Snapshot unter `docs/api/openapi.json` versioniert
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
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py`
- [x] `cd frontend && npm run test -- --run`
- [x] `cd frontend && npm run build`
- [x] `cd frontend && npm run test:e2e`
- [x] GitHub Actions `CI` auf `main` für Commit `758ba0d`, Run `26693076964`

## NFR-Nachweisstatus

- [x] NFR1 Teilnachweis: 20 statische Eingabe-Fixtures sowie Contract-, Validation-, API- und Workflow-Tests sind vorhanden
- [ ] NFR1 Zielmetrik: `>=90%` schema-valide generierte Analysen ohne Repair ist noch nicht automatisiert aggregiert gemessen
- [x] NFR2 Teilnachweis: aktiver Fehlerpfad persistiert ungültige Payloads explizit als `failed`; bounded Repair ist separat getestet, aber nicht im Standardpfad aktiv
- [ ] NFR3 Zielmetrik: `p95 < 5s` für Analyseantworten bis 1'000 Zeichen ist noch nicht über Benchmark oder Lasttest gemessen
- [x] NFR4 Nachvollziehbarkeit: zentrale Traceability-Metadaten werden persistiert und über API/Archiv sichtbar
- [x] NFR5 Teilnachweis: Backend-/Frontend-Tests und ein UJ1-E2E-Test laufen reproduzierbar
- [ ] NFR5 Coverage-Ziel: `80% Unit-Test-Coverage` ist noch nicht gemessen, da kein Coverage-Tooling konfiguriert ist
- [x] NFR6 Sprachdetektion: unterstützte Sprachen, Confidence-Schwelle und Fehlerfälle sind implementiert und getestet

## Nachweise mit bekannten Voraussetzungen oder Limitationen

- [x] `docker compose up -d --build`
- [x] `docker compose ps`
- [x] `curl -fsS http://127.0.0.1:8000/health`
- [x] `curl -fsS -I http://127.0.0.1:4173`
- [x] `docker compose down`
  Compose wurde am 2026-05-30 als Start-/Status-/HTTP-/Stop-Nachweis für den lokalen Zielbetrieb mit API, Frontend und PostgreSQL verifiziert. Die Host-HTTP-Prüfung erfolgte ausserhalb der Codex-Sandbox, weil die Sandbox keinen direkten Zugriff auf veröffentlichte Host-Ports erlaubt.
- [x] `cd frontend && npm run test:e2e`
  Der Testpfad nutzt dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports und lief erfolgreich durch. Playwright-Browser-Binaries müssen lokal vorhanden sein.

## Verweis auf Nachweisdokumente

- Architekturstand und Querschnittskonzepte: `docs/arc42/`
- Datenschutz, KI-Governance, AI-Act-Einordnung und MVP-Grenzen: `docs/privacy-and-ai-governance.md`
- Ausgeführte technische Verifikation: `docs/test-report.md`
- Diagrammquellen und gerenderte SVGs: `docs/diagrams/README.md`

## Offene Restpunkte

- [ ] Echte Provider-Integration mit Netz und produktionsnaher Betriebsumgebung ist bewusst nicht Teil des MVP
- [ ] Mehrsprachigkeit ist bewusst auf `de`, `fr` und `en` begrenzt; weitere Sprachen bleiben mögliche Folgearbeit
- [ ] Breitere E2E-Matrix, frei verfügbare E2E-Ports und produktionsnahe Observability bleiben mögliche Folgearbeit
- [ ] Automatisierte NFR-Messungen für NFR1, NFR3 und Coverage-Anteil von NFR5 bleiben mögliche Folgearbeit
