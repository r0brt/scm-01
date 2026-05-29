# Archiv-Nachweis und Export Design

## Ziel

Diese Runde schliesst letzte abgaberelevante Nachweisluecken, ohne den Analyse-Flow der Hauptseite zu veraendern. Das Archiv wird als Review- und Nachweisort gestaerkt: ausgewaehlte Runs sollen dort technische Metadaten sichtbar machen und als vollstaendiges JSON exportierbar sein. Zusaetzlich wird der lokale E2E-Nachweis hergestellt und die Datenschutzdokumentation um konkrete lokale Bereinigungshinweise ergaenzt.

## Kontext

Die Bewertungskriterien betonen Spezifikation, Entwurf, Programmierung, Validierung sowie KI-Einsatz und Reflexion. Fuer den aktuellen Abgabestand sind insbesondere folgende Anforderungen relevant:

- `docs/prd.md`: FR7 fordert Metadatenanzeige, FR8 fordert JSON-Export pro Lauf, NFR4 fordert Nachvollziehbarkeit.
- `docs/arc42/07_verteilungssicht.md`: beschreibt das Frontend mit Pipeline, Archiv und JSON-Export.
- `docs/arc42/08_querschnittliche_konzepte.md`: beschreibt Traceability, `correlation_id`, Prompt-/Modellnachweis und Grenzen.
- `docs/privacy-and-ai-governance.md`: beschreibt Datenschutzgrenzen und lokale Persistenz.
- `AGENTS.md`: fordert kleine, reviewbare Changes, reproduzierbare Nachweise und Doku-Konsistenz.

## Harte Randbedingung

Die Hauptseite `Analyse` bleibt im Verhalten unveraendert.

Das bedeutet:

- keine neuen Aktionen, Metadaten oder Export-Bedienelemente in der Analyseansicht
- keine Aenderung an Texteingabe, Submit, Ladezustand, Reveal-/Pipeline-Verhalten oder Fehlerdarstellung
- keine Aenderung am bestehenden Analyse-Flow nach `Analyse starten`
- keine Reflexionsinhalte in `docs/ki-reflexion.md`

## Designentscheidung

Das Archiv ist der bessere Ort fuer Nachvollziehbarkeit und Export. Die Analyseansicht bleibt der Arbeits- und Flow-Ort. Das Archiv wird zum Review-Ort fuer gespeicherte Runs, technische Herkunft, Status und Weiterverarbeitung.

Ein ausgewaehlter Archiv-Run soll deshalb im Archiv selbst eine Detail-/Nachweisflaeche erhalten. Von dort kann der Run weiterhin explizit in der Analyseansicht geoeffnet werden, falls die Pipelineansicht betrachtet werden soll.

## Scope

In Scope:

- Archiv-Detailbereich fuer den aktuell ausgewaehlten Run
- sichtbare Run-Metadaten im Archiv:
  - `created_at`
  - `run_status`
  - `validation_status`
  - `model_id`
  - `prompt_version`
  - `correlation_id`
  - `detected_language`
  - `language_confidence`
  - optional `error_code`
- JSON-Export des vollstaendigen Run-Objekts aus dem Archiv
- Frontend-Tests fuer Metadaten und Export-Bedienung
- Playwright-Browser installieren und `npm run test:e2e` erneut ausfuehren
- `docs/test-report.md` mit tatsaechlichem E2E-Ergebnis aktualisieren
- README und Datenschutz-/Governance-Doku um lokale Bereinigungshinweise ergaenzen

Out of Scope:

- API-v2 oder neue API-Version
- datensparsame Listen-API
- echte Loesch-API
- neues Rollen-/Rechtemodell
- produktionsreife Retention- oder Privacy-Operations-Prozesse
- neue ADR, solange keine neue Architekturentscheidung entsteht
- inhaltliche Reflexion der KI-Nutzung

## UI-Leitlinie

Der Archiv-Detailbereich soll ruhig und sekundär wirken. Er darf die Run-Liste nicht ersetzen und die Analyseansicht nicht kopieren. Die wichtigsten Informationen sollen scanbar bleiben; der Export ist eine klare, aber nicht dominante Aktion.

Empfohlene Struktur:

- Run-Liste im Archiv bleibt sichtbar.
- Auswahl eines Runs zeigt einen Detailbereich im Archiv.
- Detailbereich zeigt Input-Auszug, technische Metadaten und Export-Aktion.
- Eine separate Aktion `In Analyse öffnen` kann zur bestehenden Pipelineansicht wechseln.

## Verifikation

Automatisierte Checks:

- `cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q`
- `cd frontend && npm run test -- --run`
- `cd frontend && npm run build`
- `cd frontend && npm run test:e2e`

Manuelle/inhaltliche Checks:

- Analyse-Flow bleibt unveraendert.
- Archiv zeigt Metadaten und Export fuer ausgewaehlten Run.
- JSON-Export enthaelt das vollstaendige Run-Objekt.
- Datenschutzdoku beschreibt lokale Bereinigung ehrlich, ohne Produktiv-Compliance zu behaupten.

## Definition of Done

- Spec und Plan liegen unter `docs/superpowers/`.
- Archiv zeigt Nachweis-Metadaten fuer den ausgewaehlten Run.
- Archiv bietet vollstaendigen JSON-Export.
- Frontend-Tests decken Archiv-Nachweis und Export-Bedienung ab.
- Playwright-Browser sind lokal installiert und der E2E-Lauf wurde erneut versucht oder bestanden.
- `docs/test-report.md` dokumentiert den aktuellen Stand.
- README und Datenschutzdoku enthalten lokale Bereinigungshinweise.
- Finale relevante Tests laufen oder verbleibende Voraussetzungen sind dokumentiert.
