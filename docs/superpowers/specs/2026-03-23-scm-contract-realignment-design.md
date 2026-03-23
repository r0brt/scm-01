# SCM Contract Realignment Design

## Ziel

Diese Aenderung richtet den zentralen SCM-Analysevertrag wieder an der urspruenglichen Projektidee aus. Die sechs verbindlichen Ebenen lauten danach:

- `symptome`
- `ursachen`
- `emotionen`
- `narrative`
- `mythen`
- `essenz`

Der bestehende Vertrag auf `main` mit `beobachtungen`, `erklaerungen`, `emotionen`, `zuschreibungen`, `schlussfolgerungen`, `massnahmen` wird vollstaendig ersetzt.

## Kontext

Der aktuelle Produktstand ist intern konsistent, weicht aber von der vom Maintainer bestaetigten fachlichen Quelle ab. Die Projektidee vom 18.02.2026 beschreibt SCM als Filtermaschine ueber `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz`. Diese Quelle soll wieder die fachliche Wahrheit des Projekts sein.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M1, M5, M6, M8, M9
- `docs/prd.md`
- Projektidee "Social Clean-Up Machine" vom 18.02.2026
- `docs/arc42/05_bausteinsicht.md`
- `docs/arc42/06_laufzeitsicht.md`
- `docs/arc42/07_verteilungssicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`
- `docs/arc42/10_qualitaetsszenarien.md`

## Scope

Enthalten:

- neues fachliches Quelldokument `docs/scm.md`
- PRD-Nachfuehrung auf die sechs Ebenen der Projektidee
- Contract-Reset in Schema, Prompt und Backend-Modellen
- Anpassung der Analyse- und Validierungstests
- Anpassung der Frontend-Pipeline und UI-Texte
- arc42-Nachfuehrung fuer Vertrags-, Prompt- und Laufzeitsicht

Nicht enthalten:

- Rueckwaertskompatibilitaet fuer alte Payloads
- Datenmigration bestehender Runs
- paralleler Support fuer alte und neue Ebenen
- neue Produktfeatures ausserhalb des Vertragswechsels

## Fachliche Grundentscheidung

Die Projektidee wird als primaere fachliche Quelle explizit ins Repo uebernommen. `docs/scm.md` beschreibt die Produktidee und die semantische Bedeutung der sechs Ebenen. `docs/prd.md` und nachgelagerte Artefakte muessen dieser Quelle folgen, nicht umgekehrt.

Die Ebenen bedeuten:

- `symptome`: beobachtbare Phaenomene im Problemfeld
- `ursachen`: Erklaerungsansaetze fuer das Auftreten der Symptome
- `emotionen`: dominante Gefuehlslagen im Diskurs
- `narrative`: verbreitete Erzaehlmuster oder Frames
- `mythen`: Fehlannahmen und vereinfachende Zuschreibungen
- `essenz`: verdichtete, wertfreie Kernaussage

Die bisherige Ebene `massnahmen` entfaellt vollstaendig und wird nicht abgebildet. Die bisherige Ebene `zuschreibungen` geht nicht als eigener technischer Key weiter, sondern wird konzeptionell innerhalb `mythen` mitgefuehrt.

## Vertragsform

Der technische Vertrag wird auf die fruehere Form mit benannten Ebenen und strukturierteren Eintraegen zurueckgestellt:

```json
{
  "symptome": {
    "beschreibung": "string",
    "eintraege": [{"text": "string"}]
  }
}
```

Regeln:

- genau sechs Pflichtfelder auf Top-Level
- keine zusaetzlichen Top-Level-Felder
- jede Ebene besitzt `beschreibung` und `eintraege`
- `eintraege` enthaelt mindestens ein Objekt mit Pflichtfeld `text`
- keine zusaetzlichen Felder innerhalb der Ebenen oder Eintraege

Diese Form gilt fuer:

- `schemas/analysis.schema.json`
- Prompt-Ausgabeformat unter `prompts/v1/analysis.md`
- Pydantic-Modelle und Validierung
- persistierte `analysis_json` fuer neue Runs
- Frontend-Typen und Darstellung

## Inkompatibilitaet

Dies ist bewusst ein harter Vertragswechsel. Bestehende gespeicherte Runs mit dem aktuellen Vertrag duerfen fachlich und technisch veralten. Es gibt:

- keine Migrationslogik fuer bestehende `analysis_json`
- keine Alias-Felder
- keine serverseitige Uebersetzung alter Payloads

Falls alte Runs im UI oder in Tests brechen, wird das im Rahmen dieser Aenderung durch konsistente Fixtures und klare Annahmen fuer nur noch neue Payloads bereinigt.

## Komponentenfolgen

### Dokumentation

- `docs/scm.md` wird neu angelegt und enthaelt die Projektidee als fachliche Quelle.
- `docs/prd.md` wird auf dieselben sechs Ebenen und Begriffe umgestellt.
- Relevante arc42-Kapitel werden auf den geaenderten Vertrag, Prompt und Laufzeitkontext angepasst.

### Backend

- Schema und Pydantic-Modelle werden auf die neuen Keys und Feldnamen umgestellt.
- Tests fuer Schema, Modelle, API, LLM-Adapter und Workflow werden auf den neuen Vertrag angepasst.
- Persistenz bleibt strukturell gleich; nur die Form von `analysis_json` aendert sich.

### Frontend

- Anzeige, Typen und Tests muessen die neuen Ebenen und Begriffe nutzen.
- Die Filtermetapher bleibt bestehen, aber die letzte Stufe wird `Essenz` statt `Massnahmen`.

## Teststrategie

Die Aenderung gilt erst als fertig, wenn alle betroffenen Ebenen denselben Vertrag sprechen.

Mindestens relevant:

- `cd backend && uv run pytest -q tests/contracts`
- `cd backend && uv run pytest -q tests/api tests/services tests/llm`
- `cd frontend && npm run test -- --run`
- `cd frontend && npm run build`

Wenn Compose oder Laufzeitdoku angepasst wird:

- `docker compose up --build -d`
- `docker compose ps`
- `docker compose down`

## Risiken und Guardrails

- Kein teilweiser Mischzustand zwischen alten und neuen Ebenen
- Keine implizite semantische Abschwaechung von `mythen`
- Keine halbherzige Rueckwaertskompatibilitaet
- Doku, Prompt, Schema, Backend und Frontend muessen in derselben Aenderung nachgezogen werden

## Definition of Done

Die Aenderung ist abgeschlossen, wenn:

- `docs/scm.md` die Projektidee als fachliche Quelle enthaelt
- `docs/prd.md` und relevante arc42-Kapitel dieselben sechs Ebenen nennen
- `schemas/analysis.schema.json` auf `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz` validiert
- Backend-Modelle, Prompt und Tests auf denselben Vertrag umgestellt sind
- Frontend-Darstellung und Typen auf denselben Vertrag umgestellt sind
- die relevanten Backend- und Frontend-Tests gruen sind

## Naechster Schritt

Nach Freigabe dieser Spec folgt ein Implementierungsplan fuer den Contract-Reset als ein zusammenhaengender, nicht rueckwaertskompatibler Change.
