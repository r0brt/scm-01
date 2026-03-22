# M4 API v1 Design

## Ziel

M4 stabilisiert die erste REST-API fuer SCM. Der Deliverable umfasst Endpunkte fuer Analyse erstellen, Runs listen, Run-Details lesen und Rerun ausloesen.

## Kontext

M1 bis M3 liefern Analysevertrag, Validation-/Repair-Basis und Persistenz fuer Runs. M4 verbindet diese Bausteine ueber eine erste API-Schicht, ohne bereits echte LLM-Integration einzufuehren.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M4
- `docs/prd.md`
- `backend/app/models/analysis.py`
- `backend/app/services/validation.py`
- `backend/app/repositories/run_repository.py`

## Scope

Enthalten:

- `POST /api/v1/analyses`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{id}`
- `POST /api/v1/analyses/{id}/rerun`
- API-Fehlerform gemaess PRD
- API-Tests fuer die vier Endpunkte

Nicht enthalten:

- echter LLM-Provider
- Authentifizierung
- Export-Endpoint
- asynchrone Job-Verarbeitung

## Fachliche Grundentscheidung

Die API bleibt in M4 synchron und nutzt eine kontrollierte Stub-Analyseerzeugung. Dadurch wird der API-Vertrag stabilisiert, waehrend M5 spaeter nur die Erzeugungsstrategie durch einen echten Adapter ersetzt.

## API-Verhalten

### POST /api/v1/analyses

Request:

```json
{
  "text": "..."
}
```

Verhalten:

- erzeugt aus dem Text eine stubbed Analyse-Payload
- validiert und persistiert einen neuen Run
- gibt den gespeicherten Run zurueck

### GET /api/v1/analyses

- liefert eine Liste gespeicherter Runs
- neueste Runs zuerst

### GET /api/v1/analyses/{id}

- liefert den gespeicherten Run
- bei unbekannter ID: Fehlervertrag mit passendem Code

### POST /api/v1/analyses/{id}/rerun

- liest den bestehenden Run
- erzeugt mit demselben `input_text` einen neuen Run
- persistiert und liefert den neuen Run

## Fehlervertrag

Alle API-Fehler folgen dem PRD-Format:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable",
    "details": {},
    "correlation_id": "uuid"
  }
}
```

M4 braucht mindestens:

- `ANALYSIS_NOT_FOUND`
- `INVALID_REQUEST`

## Interne Struktur

M4 fuehrt eine kleine Application-Schicht ein:

- API-Schemas fuer Request/Response
- Analyse-Orchestrierung fuer Stub-Erzeugung + Validation + Persistenz
- Fehlerabbildung fuer HTTP-Ausnahmen

Die Stub-Erzeugung bleibt explizit und austauschbar.

## Teststrategie

API-Tests pruefen mindestens:

1. `POST /api/v1/analyses` erzeugt und speichert einen Run
2. `GET /api/v1/analyses` liefert eine Liste
3. `GET /api/v1/analyses/{id}` liefert Details
4. `POST /api/v1/analyses/{id}/rerun` erzeugt einen neuen Run
5. unbekannte Run-ID liefert Fehlervertrag

## Dokumentationsfolgen

M4 aendert Schnittstellen und Laufzeitverhalten. Deshalb werden mindestens:

- `docs/arc42/06_laufzeitsicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`

minimal nachgezogen.

## Definition of Done

M4 ist fertig, wenn:

- die vier API-v1-Endpunkte existieren
- API-Fehler dem PRD folgen
- `cd backend && uv run pytest -q tests/api` gruen ist
- OpenAPI den Endpunktumfang sichtbar abbildet

## Risiken und Guardrails

- keine echte LLM-Logik in M4 verstecken
- kein Vorziehen von komplexer Business-Logik fuer M5
- Fehlervertrag konsistent zentral abbilden
