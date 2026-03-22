# M2 Validation and Repair Design

## Ziel

M2 fuehrt eine erste robuste Validierungs- und Repair-Schicht fuer den bestehenden Analysevertrag ein. Der Deliverable umfasst einen strukturierten Validation-Report, eine kleine Fehlercode-Taxonomie und einen begrenzten Repair-Loop ohne echten LLM-Provider.

## Kontext

M1 hat den strukturellen Analysevertrag mit JSON Schema, Pydantic-Modellen und Contract-Tests etabliert. M2 baut darauf auf und prueft Analyse-Payloads zentral, statt Schema- und Modellvalidierung spaeter verteilt zu duplizieren.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M2
- `docs/prd.md`
- `docs/arc42/08_querschnittliche_konzepte.md`
- `backend/app/models/analysis.py`
- `schemas/analysis.schema.json`

## Scope

Enthalten:

- Validierungsservice fuer Analyse-Payloads
- strukturierter Validation-Report fuer Erfolg und Fehlerfaelle
- kleine Fehlercode-Taxonomie fuer M2
- Repair-Loop mit maximal zwei Reparaturversuchen
- Tests fuer happy path, repair succeeds und repair fails after 2

Nicht enthalten:

- echte LLM-Calls
- API-Endpunkte
- Persistenz von Reports oder Runs
- sprachliche oder fachsemantische Zusatzregeln ausserhalb des bestehenden Contracts

## Fachliche Grundentscheidung

Validation und Repair bleiben in M2 reine Backend-Services mit klarer Eingabe und Ausgabe. Sie arbeiten auf rohen Payloads und liefern entweder eine validierte `Analyse` oder einen fehlgeschlagenen Report zurueck.

Dadurch bleibt die Schicht spaeter fuer API, Persistenz und LLM-Adapter wiederverwendbar.

## Ergebnisform

Die Validierung liefert ein Ergebnisobjekt mit mindestens:

- `run_status`
- `validation_status`
- `attempts`
- `error_code`
- `analysis`
- `report`

Der Report enthaelt einzelne Checks oder Fehler, damit Fehler spaeter nachvollziehbar persistiert und angezeigt werden koennen.

## Fehlercodes in M2

M2 benoetigt nur eine kleine, explizite Taxonomie:

- `SCHEMA_VALIDATION_FAILED`
- `MODEL_VALIDATION_FAILED`
- `REPAIR_LIMIT_EXCEEDED`

Weitere Codes gehoeren in spaetere Milestones, wenn zusaetzliche Regeln dazukommen.

## Repair-Loop

Der Repair-Loop bekommt:

- eine initiale Payload
- eine Reparaturfunktion
- eine maximale Anzahl zusaetzlicher Versuche von `2`

Ablauf:

1. initiale Payload validieren
2. bei Erfolg sofort gruene Rueckgabe
3. bei Fehler Reparaturfunktion mit Payload und Fehlerkontext aufrufen
4. reparierte Payload erneut validieren
5. nach zwei erfolglosen Reparaturen mit `REPAIR_LIMIT_EXCEEDED` abbrechen

Die Reparaturfunktion bleibt abstrakt und wird in Tests als Stub/Fake injiziert.

## Teststrategie

M2 fuehrt dedizierte Tests unter `backend/tests/validation/` ein:

1. valid payload -> direkt erfolgreich
2. invalid payload -> Repair liefert gueltige Payload -> erfolgreich nach Retry
3. invalid payload -> Repair bleibt ungueltig -> Fehler nach maximal zwei Reparaturen

Die Tests pruefen sowohl Statusfelder als auch den Validation-Report.

## Dateischnitt

Geplante Backend-Dateien:

- `backend/app/services/validation.py` fuer Validation-Report und Servicefunktionen
- `backend/app/services/repair.py` fuer Repair-Loop-Orchestrierung
- `backend/app/services/__init__.py` fuer Exporte
- `backend/tests/validation/test_validation_service.py`
- `backend/tests/validation/test_repair_loop.py`

## Definition of Done

M2 ist fertig, wenn:

- Validation-Service fuer Analyse-Payloads existiert
- Repair-Loop mit maximal zwei Reparaturen existiert
- Fehlercodes und Validation-Report klar modelliert sind
- `cd backend && uv run pytest -q tests/validation` gruen ist
- bestehende Contract-Tests nicht regressieren

## Risiken und Guardrails

- Keine Vermischung mit API- oder Persistenzmodellen
- Keine impliziten Fallbacks
- Keine Vorwegnahme echter LLM-Adapterlogik
- Repair bleibt strikt begrenzt und explizit
