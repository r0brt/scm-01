# Test Report

Stand: 2026-05-31
Baseline-Commit: `107761a`

Dieser Testreport dokumentiert die zuletzt ausgeführten lokalen und CI-bezogenen Nachweise. Er ist kein vollständiger Produktionsabnahmetest, sondern ein reproduzierbarer MVP-Nachweis für Backend, Frontend, Compose-Startfähigkeit und den lokalen UJ1-E2E-Pfad.

## Ausgeführte Commands

### Backend Linting

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
```

Resultat:

- `All checks passed!`

### Backend Gesamt-Testlauf

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Resultat:

- `63 passed in 1.22s`

### OpenAPI Snapshot

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/export_openapi.py
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_openapi_snapshot.py
```

Resultat:

- `docs/api/openapi.json` wurde aus `create_app().openapi()` erzeugt
- `3 passed in 0.52s`

Hinweis:

- der Snapshot dokumentiert den public Error-Contract und den `X-Correlation-ID` Response-Header für die API-Antworten

### NFR1 Contract Compliance

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/measure_contract_compliance.py
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_nfr1_contract_compliance.py
```

Resultat:

- `NFR1 contract compliance: 20/20 valid without repair (100.0%)`
- `Minimum threshold: 90.0%`
- `Repair attempts: 0`
- `2 passed in 0.35s`

Hinweis:

- die Messung läuft offline mit deterministischen Fixture-Doubles für Spracherkennung und Analyseerzeugung
- sie prüft den lokalen Analyse-, Validierungs- und Persistenzpfad gegen das definierte Eingabeset
- sie ist kein Qualitätsnachweis für Antworten eines externen LLM-Providers

### NFR3 Performance

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 python scripts/measure_nfr3_performance.py
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/contracts/test_nfr3_performance.py
```

Resultat:

- `NFR3 performance: 21/21 successful API analyses`
- `Input length limit: <= 1000 chars`
- `Max input length: 1000 chars`
- `p95 response time: 0.003s`
- `Slowest response time: 0.005s`
- `Maximum threshold: 5.000s`
- `2 passed in 0.69s`

Hinweis:

- die Messung läuft offline über den FastAPI-TestClient mit deterministischen Fixture-Doubles
- App-Erzeugung, Schema-Initialisierung und ein Warm-up-Request liegen ausserhalb der gemessenen Requests
- sie misst den lokalen API-/Analysepfad ohne externen LLM-Provider, ohne Docker/Compose und ohne Lasttestcharakter

### NFR5 Backend Coverage

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage run -m pytest -q tests/contracts/test_analysis_models.py tests/contracts/test_analysis_schema.py tests/language tests/llm tests/services tests/validation tests/persistence
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 coverage report
```

Resultat:

- `34 passed in 1.21s`
- `TOTAL 232 12 95%`
- `fail_under = 80`

Hinweis:

- der Messbereich ist in `backend/pyproject.toml` auf `app/language`, `app/llm`, `app/models`, `app/repositories` und `app/services` begrenzt
- damit wird der im PRD beschriebene Domain-/Application-Layer ohne UI gemessen
- API-Schicht, App-Bootstrapping, Datenbank-Session-Infrastruktur, Alembic-Migrationen und Frontend-Code sind bewusst nicht Teil dieser Coverage-Kennzahl

### Rerun Fehlerfälle

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/services/test_analysis_workflow.py tests/api/test_analyses_api.py
```

Resultat:

- `17 passed in 0.66s`

Hinweis:

- der Testlauf deckt ab, dass Rerun auch von einem `failed` Quell-Run einen neuen Run mit gleicher Eingabe erzeugt
- der ursprüngliche Fehlerlauf bleibt unverändert und auditierbar
- Rerun wird dabei nicht als Repair des alten Laufs behandelt

### Traceability / Observability

```bash
cd backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q tests/api/test_traceability_observability.py
```

Resultat:

- `3 passed in 0.84s`

Hinweis:

- der Testlauf prüft, dass erfolgreiche API-Antworten dieselbe requestgebundene `correlation_id` im Body und im `X-Correlation-ID` Header sichtbar machen
- Fehlerantworten verwenden dieselbe `correlation_id` im Error-Contract und im Response-Header
- der Request-Abschluss wird mit Methode, Pfad, Statuscode und `correlation_id` als Log-Kontext erfasst

### Frontend Unit/UI

```bash
cd frontend
npm run test -- --run
```

Resultat:

- `1 file passed`
- `10 tests passed`
- `Duration 2.13s`

Hinweis:

- der UI-Testlauf deckt zentrale Struktur- und Darstellungsinvarianten der Analyse-/Archiv-Ansicht, die Trennung zwischen Archiv-Auswahl und Analyse-Ansicht sowie das Scrollen zum oberen Seitenbereich nach Archiv-Run-Auswahl ab

### Frontend Build

```bash
cd frontend
npm run build
```

Resultat:

- `built in 965ms`

### Docker Compose Laufzeitnachweis

```bash
docker compose up -d --build
docker compose ps
docker compose down
```

Resultat:

- `docker compose up -d --build` baute `scm-01-api` und `scm-01-frontend`, zog `postgres:17-alpine` und startete `db`, `api` und `frontend`
- `docker compose ps` zeigte `scm-01-db-1` als `Up ... (healthy)` sowie `scm-01-api-1` und `scm-01-frontend-1` als `Up`
- veröffentlichte Ports laut Compose-Status: API `8000`, DB `5432`, Frontend `4173`
- `curl -fsS http://127.0.0.1:8000/health` lieferte `{"status":"ok"}`
- `curl -fsS -I http://127.0.0.1:4173` lieferte `HTTP/1.1 200 OK`
- `docker compose down` stoppte und entfernte die drei Container sowie das Compose-Netzwerk erfolgreich

Hinweis:

- die Host-HTTP-Prüfung wurde ausserhalb der Codex-Sandbox ausgeführt, weil die Sandbox keinen direkten Zugriff auf die veröffentlichten Host-Ports erlaubt

### Frontend E2E

```bash
cd frontend
npm run test:e2e
```

Resultat:

- `1 passed in 4.1s`

Beobachtung:

- das Playwright-Setup nutzt nun dedizierte lokale E2E-Ports statt der normalen Dev-/Compose-Ports:
  - Frontend E2E: `14173`
  - Backend E2E: `18000`
- dadurch sind Konflikte mit den Standardports `4173` und `8000` deutlich weniger wahrscheinlich
- benutzerdefinierte lokale Konflikte auf den gewählten E2E-Ports bleiben weiterhin möglich
- bei vorhandenen Playwright-Browser-Binaries starteten Frontend- und Backend-Webserver im Playwright-Setup korrekt
- der UJ1-Browserpfad wurde erfolgreich ausgeführt

## NFR-Evidenzstatus

Die folgenden Punkte trennen bewusst zwischen vorhandenen Nachweisen, offline gemessenen Zielgrössen und bekannten Grenzen. Damit bleiben PRD-Anforderungen nachvollziehbar, ohne aus lokalen Smoke-, Contract- oder UI-Tests statistische Aussagen für nicht gemessene Bereiche abzuleiten.

| NFR | Status | Einordnung |
| --- | --- | --- |
| NFR1 Contract Compliance `>=90%` | Offline gemessen | `scripts/measure_contract_compliance.py` führt die 20 statischen Eingabe-Fixtures durch den lokalen Analyse-Workflow mit deterministischen Fixture-Doubles. Ergebnis: `20/20` schema-valide Läufe ohne Repair (`100.0%`). Dies misst nicht die Qualität eines externen LLM-Providers. |
| NFR2 Fehlerpfad/Repair | Teilweise nachgewiesen | Der aktive Standardpfad persistiert strukturell ungültige Payloads explizit als `failed`. Die bounded Repair-Funktion ist getestet, aber nicht im Standardpfad verdrahtet. |
| NFR3 Performance `p95 < 5s` | Offline gemessen | `scripts/measure_nfr3_performance.py` misst 20 statische Eingabe-Fixtures plus einen deterministischen 1'000-Zeichen-Grenzfall über die lokale API mit deterministischen Fixture-Doubles. Ergebnis: `21/21` erfolgreich, `p95 0.003s`, langsamster Request `0.005s`. Dies ist kein Lasttest und keine Aussage zur Latenz eines externen LLM-Providers. |
| NFR4 Nachvollziehbarkeit | Nachgewiesen im MVP-Rahmen | Run-Metadaten wie `correlation_id`, `prompt_version`, `model_id`, `run_status`, `validation_status` und Fehlerangaben sind implementiert, persistiert und in Tests/Doku sichtbar. Die requestgebundene `correlation_id` wird zusätzlich im `X-Correlation-ID` Header und im Request-Log-Kontext nachgewiesen. |
| NFR5 Wartbarkeit/Testbarkeit | Gemessen im Backend-Domain-/Application-Scope | Die Coverage-Konfiguration misst `app/language`, `app/llm`, `app/models`, `app/repositories` und `app/services` mit backendnahen Contract-, Language-, LLM-, Service-, Validation- und Persistence-Tests. Ergebnis: `95%` Statement Coverage gegen `fail_under = 80`. Frontend und API-/Bootstrapping-Code sind nicht Teil dieser PRD-Kennzahl. |
| NFR6 Sprachdetektion | Nachgewiesen im MVP-Rahmen | Sprachdetektion, Confidence-Schwelle und Fehlerfälle sind im Backend implementiert und über Tests abgesichert. |

## Abgedeckte Nachweise

Die fachliche Einordnung dieser Nachweise erfolgt ergänzend in `docs/acceptance-checklist.md`.

- kompletter Backend-Testlauf für Contract-, Validation-, Persistenz-, API-, Service- und Integrationstests
- versionierter OpenAPI-Snapshot für den API-v1-Vertrag inklusive Drift-Test, Error-Contract und `X-Correlation-ID` Response-Header
- Offline-NFR1-Messlauf über 20 Eingabe-Fixtures mit `20/20` schema-validen Läufen ohne Repair
- Offline-NFR3-Messlauf über 21 API-Analysen inklusive 1'000-Zeichen-Grenzfall mit `p95 0.003s` gegen den Zielwert `< 5s`
- NFR5-Backend-Coverage im Domain-/Application-Scope mit `95%` gegen den Zielwert `>=80%`
- Rerun aus fehlgeschlagenen Quell-Runs als neuer unveränderlicher Analyseversuch
- Request-to-Response-Nachvollziehbarkeit über `correlation_id`, `X-Correlation-ID` Header und Request-Log-Kontext
- Frontend-Unit-/UI-Testlauf und Produktions-Build
- projektbezogene Python-3.13-Ausführung über `uv`
- aktueller Nachweis auf `main`-Commit `107761a`
- Docker-Compose-Zielbetrieb startet lokal mit API, Frontend und PostgreSQL; API-Health und Frontend-HTTP-Status wurden über die veröffentlichten Host-Ports geprüft
- E2E-Setup und UJ1-Browserpfad laufen lokal erfolgreich

## Automatisierter Quality Gate

GitHub Actions führt für Pull Requests und Pushes auf `main` einen Basic Quality Gate aus. Dieser umfasst Backend-Linting, Backend-Tests, Frontend-Unit-/UI-Tests und Frontend-Build. Der aktuelle `main`-Push zu `107761a` war erfolgreich (`CI`, Run `26695777780`, 2026-05-30T21:47:50Z). Playwright-E2E bleibt bewusst ausserhalb dieses ersten CI-Ausbaus.

## Bekannte Limitationen

- E2E deckt weiterhin nur einen kritischen Happy Path für UJ1 ab
- der E2E-Lauf benötigt lokal installierte Playwright-Browser-Binaries
- der lokale E2E-Lauf nutzt eigene dedizierte Ports statt `4173` und `8000`, kann aber weiterhin durch benutzerdefinierte Konflikte auf den gewählten E2E-Ports blockiert werden
- Frontend-E2E nutzt lokale Dev-Server statt Docker/Compose
- LLM-Erzeugung läuft in Tests weiterhin über Stub/Fake-Adapter ohne echten Provider-Call
- der NFR1-Messlauf nutzt deterministische Fixture-Doubles und ersetzt keinen Qualitätsnachweis für einen externen LLM-Provider
- der NFR3-Messlauf nutzt deterministische Fixture-Doubles, FastAPI-TestClient und lokale SQLite-Persistenz; er ersetzt keinen produktionsnahen Lasttest und keine Messung mit externem LLM-Provider
- die NFR5-Coverage-Kennzahl bezieht sich auf den Backend-Domain-/Application-Scope gemäss PRD und nicht auf UI, API-Bootstrapping oder produktionsnahe Systemabdeckung
- Request-Logs werden lokal erzeugt, aber nicht zentral aggregiert; der Nachweis ersetzt keinen produktionsreifen Observability-Stack
- Compose wurde lokal als Start-/Status-/HTTP-/Stop-Nachweis verifiziert; dies ersetzt noch keinen produktionsnahen Betriebs- oder Lasttest
