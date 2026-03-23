# M1 Analysis Contract Design

> Archivhinweis: Diese historische Spec dokumentiert einen frueheren Vertragsstand. Der aktuelle fachliche Vertrag liegt auf `main` in `docs/scm.md`, `docs/prd.md` und `schemas/analysis.schema.json` bei `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`.

## Ziel

M1 definiert den ersten verbindlichen Analysevertrag fuer SCM. Der Deliverable umfasst ein versioniertes JSON Schema, passende Pydantic-Modelle im Backend, Contract-Tests sowie Fixtures fuer Eingabetexte und gueltige/ungueltige JSON-Beispiele.

## Kontext

Der Umsetzungsplan fordert in M1 einen verbindlichen Analysevertrag fuer die sechs Ebenen. Das PRD verlangt ein striktes JSON-Output-Format, Schema-Validierung vor Persistenz und Acceptance-Kriterien fuer sechs korrekt benannte Ebenen.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M1
- `docs/prd.md`
- `docs/arc42/02_randbedingungen.md`
- `docs/arc42/04_loesungsstrategie.md`
- `docs/arc42/08_querschnittliche_konzepte.md`

## Scope

Enthalten:

- `schemas/analysis.schema.json`
- Pydantic-Modelle fuer die Analyse-Payload im Backend
- Contract-Tests unter `backend/tests/contracts/`
- mindestens 20 Text-Fixtures unter `backend/tests/fixtures/inputs/`
- gueltige und ungueltige JSON-Beispiele fuer Contract-Tests
- minimale Doku-Nachfuehrung fuer die jetzt verbindlich benannten sechs Ebenen

Nicht enthalten:

- echte LLM-Calls
- Repair-Loop oder fachliche Konsistenzregeln aus M2
- API-Endpunkte fuer Analysen
- Persistenzmodelle oder Run-Metadaten
- Sprachdetektion

## Fachliche Grundentscheidung

Das Schema modelliert nur die fachliche Analyse-Payload, nicht den spaeteren Persistenz- oder Run-Kontext. Dadurch bleiben Analysevertrag und Laufmetadaten entkoppelt.

Die sechs Ebenen werden dokumentnah und verbindlich auf Deutsch festgelegt:

- `beobachtungen`
- `erklaerungen`
- `emotionen`
- `zuschreibungen`
- `schlussfolgerungen`
- `massnahmen`

Diese Liste repraesentiert die sechs festen Top-Level-Dimensionen jeder validen Analyse.

## Payload-Form

Die Analyse-Payload besitzt genau sechs Pflichtfelder auf Top-Level, eines pro Ebene.

Jede Ebene wird in M1 mit derselben stabilen Mindeststruktur modelliert:

```json
{
  "zusammenfassung": "string",
  "punkte": ["string"]
}
```

Regeln in M1:

- `zusammenfassung` ist Pflicht und ein String
- `punkte` ist Pflicht und eine Liste von Strings
- `punkte` muss mindestens einen Eintrag enthalten
- zusaetzliche Top-Level-Felder sind nicht erlaubt
- zusaetzliche Felder innerhalb einer Ebene sind nicht erlaubt

M1 bleibt dabei bewusst strukturell strikt, aber fachlich noch nicht ueberreguliert. Tiefergehende Konsistenzregeln gehoeren nach M2.

## Backend-Modelle

Im Backend werden Pydantic-Modelle eingefuehrt, die dieselbe Form wie das JSON Schema erzwingen:

- ein Modell fuer eine einzelne Ebene
- ein Modell fuer die gesamte Analyse mit sechs fest benannten Feldern

Die Modellnamen sollen klar und fachnah sein, damit spaetere API- und Validierungslogik darauf aufbauen kann.

## Teststrategie

M1 umfasst drei Testarten:

1. Schema-Validierung gegen gueltige Beispielpayloads
2. Negativtests gegen ungueltige Payloads
3. Pydantic-Model-Tests, damit Backend-Modelle und Schema dieselbe Struktur erzwingen

Zusaetzliche Testartefakte:

- mindestens 20 Text-Fixtures unter `backend/tests/fixtures/inputs/`
- mehrere gueltige JSON-Beispiele
- mehrere ungueltige JSON-Beispiele, z. B.:
  - fehlende Ebenen
  - falsche Feldnamen
  - falsche Typen
  - leere `punkte`
  - unzulaessige Zusatzfelder

## Dokumentationsfolgen

Da AC1 die sechs Ebenen als korrekt benannt fordert, muessen diese Namen nach M1 nicht mehr nur implizit bleiben. PRD oder arc42 werden minimal nachgezogen, damit der Vertrag auch in den Docs eindeutig referenzierbar ist.

## Definition of Done

Der Branch ist fertig, wenn:

- `schemas/analysis.schema.json` existiert
- Backend-Modelle fuer die Analyse-Payload existieren
- `backend/tests/contracts/` gueltige und ungueltige Beispiele prueft
- `backend/tests/fixtures/inputs/` mindestens 20 Texte enthaelt
- `cd backend && uv run pytest -q tests/contracts` gruen ist
- relevante Doku die sechs verbindlichen Ebenennamen explizit nennt

## Risiken und Guardrails

- Kein Vorziehen von M2-Validierungslogik
- Keine Vermischung von Analysevertrag und Run-Metadaten
- Keine Spekulation ueber spaetere API- oder DB-Formate
- Die Ebenennamen werden jetzt bewusst festgelegt; spaetere Aenderungen sind Vertragsaenderungen und muessen entsprechend behandelt werden

## Naechster Schritt

Nach Review dieser Spec wird ein Implementierungsplan fuer `feat/m1-analysis-contract` erstellt und anschliessend in einem separaten Feature-Branch umgesetzt.
