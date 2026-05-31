# Abnahmecheckliste

Stand: 2026-05-31

## Produkt und Architektur

- [x] Analysevertrag mit sechs Ebenen ist definiert und implementiert
- [x] Strikte Validierungslogik ist im aktiven Laufzeitpfad vorhanden
- [x] Bounded Repair-Logik ist im Repository vorbereitet, aber im aktuellen Standardpfad nicht verdrahtet
- [x] Analyse-Runs werden mit Traceability-Metadaten inklusive `correlation_id` persistiert
- [x] API-v1 für Analyse, Liste, Detail und Rerun ist vorhanden
- [x] API-v1 ist als OpenAPI-Snapshot unter `docs/api/openapi.json` inklusive Error-Contract und `X-Correlation-ID` Header versioniert
- [x] Rerun erzeugt auch aus fehlgeschlagenen Quell-Runs einen neuen unveränderlichen Analyseversuch
- [x] Frontend zeigt Eingabe, Pipeline, Run-Liste, Archiv-Nachweise und JSON-Export
- [x] Lokaler Zielbetrieb via Docker Compose ist dokumentiert

## Datenschutz, KI-Governance und Nachvollziehbarkeit

- [x] Datenschutz- und KI-Governance-Annahmen sind dokumentiert
- [x] Externe Datenpfade und Grenzen des MVP sind explizit beschrieben
- [x] Requestgebundene `correlation_id` wird bei neuen Runs mitpersistiert und in Fehlerantworten wiederverwendet
- [x] Requestgebundene `correlation_id` ist zusätzlich im `X-Correlation-ID` Header und im Request-Log-Kontext sichtbar
- [x] Traceability-Felder pro Run sind dokumentiert und im Datenmodell sichtbar
- [x] Technische Providerfehler werden als `ANALYSIS_PROVIDER_ERROR` mit HTTP 502 über den API-Fehlervertrag beantwortet und nicht als Analyse-Run persistiert
- [x] Die Grenze zwischen Run-Nachvollziehbarkeit und vollständigem Ende-zu-Ende-Audit-Trail ist offengelegt

## PRD-Abnahmekriterien

- [x] AC1: sechs Ebenen vorhanden und korrekt benannt
- [x] AC2: schema-valide Ausgabe oder expliziter `failed`-Zustand mit Report
- [x] AC3: UI zeigt Pipeline oder klaren Fehlerzustand
- [x] AC4: Analysen sind persistiert und abrufbar
- [x] AC5: Unit-/Integrations-Tests reproduzierbar; ein frontendseitiger UJ1-E2E-Testpfad mit gemockter Analyse-API ist vorhanden und dokumentiert
- [x] AC6: lokale Sprachdetektion für `de`, `fr` und `en` ist umgesetzt
- [x] AC7: API-v1-Endpunkte sind implementiert und dokumentiert
- [x] AC8: Sprachdetektionsfehler für geringe Confidence und nicht unterstützte Sprache sind separat implementiert

## Erfolgreich verifizierte Commands und Nachweise

Aktueller Refresh auf `main` nach PR #64: Backend-Linting, Backend-Gesamttestlauf, Frontend-Unit-/UI-Testlauf, Frontend-Build und GitHub Actions CI wurden auf Commit `4eaeccf` neu verifiziert. Die übrigen Spezialnachweise bleiben als zuletzt dokumentierte lokale MVP-Nachweise geführt und werden vor dem finalen `v1.0.0`-Freeze nochmals vollständig aktualisiert.

- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/measure_contract_compliance.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_nfr1_contract_compliance.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/measure_nfr3_performance.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_nfr3_performance.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage run -m pytest -q tests/contracts/test_analysis_models.py tests/contracts/test_analysis_schema.py tests/language tests/llm tests/services tests/validation tests/persistence`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage report`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/services/test_analysis_workflow.py tests/api/test_analyses_api.py`
- [x] `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/api/test_traceability_observability.py`
- [x] `cd frontend && npm run test -- --run`
- [x] `cd frontend && npm run build`
- [x] `cd frontend && npm run test:e2e`
- [x] GitHub Actions `CI` auf `main` für Referenz-Commit `4eaeccf`, Run `26715457857`

## NFR-Nachweisstatus

- [x] NFR1 Teilnachweis: 20 statische Eingabe-Fixtures sowie Contract-, Validation-, API- und Workflow-Tests sind vorhanden
- [x] NFR1 Zielmetrik: Offline-Fixture-Harness misst `20/20` schema-valide Läufe ohne Repair (`100.0%`) gegen das definierte Eingabeset; dies ist keine Aussage zur Live-Providerqualität
- [x] NFR2 Teilnachweis: aktiver Fehlerpfad persistiert ungültige Payloads explizit als `failed`; bounded Repair ist separat getestet, aber nicht im Standardpfad aktiv
- [x] NFR3 Zielmetrik: Offline-API-Benchmark misst `21/21` erfolgreiche Analyseantworten inklusive 1'000-Zeichen-Grenzfall mit `p95 0.003s` gegen den Zielwert `< 5s`; dies ist kein produktionsnaher Lasttest und keine Aussage zur Live-Providerlatenz
- [x] NFR4 Nachvollziehbarkeit: zentrale Traceability-Metadaten werden persistiert und über API/Archiv sichtbar; requestgebundene `correlation_id` wird über Response-Header und Request-Log-Kontext nachgewiesen
- [x] NFR5 Teilnachweis: Backend-/Frontend-Tests und ein frontendseitiger UJ1-E2E-Test laufen reproduzierbar
- [x] NFR5 Coverage-Ziel: Backend-Domain-/Application-Scope erreicht `95%` Statement Coverage gegen den Zielwert `>=80%`; UI, API-Bootstrapping und produktionsnahe Systemabdeckung sind nicht Teil dieser Kennzahl
- [x] NFR6 Sprachdetektion: unterstützte Sprachen, Confidence-Schwelle und Fehlerfälle sind implementiert und getestet

## Nachweise mit bekannten Voraussetzungen oder Limitationen

- [x] `docker compose up -d --build`
- [x] `docker compose ps`
- [x] `curl -fsS http://127.0.0.1:8000/health`
- [x] `curl -fsS -I http://127.0.0.1:4173`
- [x] `docker compose down`
  Compose wurde am 2026-05-30 als Start-/Status-/HTTP-/Stop-Nachweis für den lokalen Zielbetrieb mit API, Frontend und PostgreSQL verifiziert. Die Host-HTTP-Prüfung erfolgte ausserhalb der Codex-Sandbox, weil die Sandbox keinen direkten Zugriff auf veröffentlichte Host-Ports erlaubt.
- [x] `cd frontend && npm run test:e2e`
  Der Testpfad nutzt dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports und lief erfolgreich durch. Die Analyse-API wird im UJ1-Test kontrolliert gemockt; der reale Backend-/API-/Persistenzpfad ist über separate Tests abgedeckt. Playwright-Browser-Binaries müssen lokal vorhanden sein.

## Verweis auf Nachweisdokumente

- Architekturstand und Querschnittskonzepte: `docs/arc42/`
- Datenschutz, KI-Governance, AI-Act-Einordnung und MVP-Grenzen: `docs/privacy-and-ai-governance.md`
- Ausgeführte technische Verifikation: `docs/test-report.md`
- Diagrammquellen und gerenderte SVGs: `docs/diagrams/README.md`

## Offene Restpunkte

- [ ] Echte Provider-Integration mit Netz und produktionsnaher Betriebsumgebung ist bewusst nicht Teil des MVP
- [ ] Mehrsprachigkeit ist bewusst auf `de`, `fr` und `en` begrenzt; weitere Sprachen bleiben mögliche Folgearbeit
- [ ] Breitere E2E-Matrix, frei verfügbare E2E-Ports und produktionsnahe Observability bleiben mögliche Folgearbeit
- [ ] Produktionsnahe NFR3-Lastmessung mit externem Provider, breitere Observability und produktionsnahe Systemabdeckung bleiben mögliche Folgearbeit
