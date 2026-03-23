# Real LLM Filter Machine Design

> Archivhinweis: Diese Spec beschreibt weiterhin die historische Filtermaschinen-Gestaltungsidee, verwendet aber teilweise alte Ebenenamen. Fuer den aktuellen fachlichen Vertrag auf `main` gelten `docs/scm.md`, `docs/prd.md` und `schemas/analysis.schema.json`.

## Ziel

SCM soll vom technisch funktionierenden MVP-Geruest zu einer fachlich glaubwuerdigen, visuell markanten Filtermaschine ausgebaut werden. Dazu werden zwei Luecken geschlossen: echte LLM-Integration statt Stub und reale Sprachdetektion gemaess PRD. Parallel wird das bestehende Frontend nicht ersetzt, sondern in eine lineare, industrialisierte Filterstrecke weiterentwickelt.

## Kontext

Der aktuelle Stand deckt API, Persistenz, Validation/Repair, UI-Grundstruktur, Compose-Betrieb und Abschlussdokumentation ab. Offen bleiben jedoch genau die Punkte, die fuer die eigentliche Produktwirkung zentral sind:

- die Analyse stammt noch aus einem Stub statt aus einem echten Modell
- Sprachdetektion gemaess NFR6/AC6/AC8 ist noch nicht umgesetzt
- die UI zeigt derzeit eine funktionale Pipeline, aber noch keine praegnante Filtermaschinen-Inszenierung

Referenzen:

- `docs/prd.md`
- `PLAN.md`
- `AGENTS.md`
- `docs/arc42/05_bausteinsicht.md`
- `docs/arc42/06_laufzeitsicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`

## Scope

Enthalten:

- produktive OpenAI-basierte Analyseerzeugung fuer den synchronen Analysepfad
- lokale Sprachdetektion fuer `de`, `fr`, `en`
- explizite Fehlsemantik bei niedriger Sprachsicherheit oder nicht unterstuetzter Sprache
- Anpassung der Persistenz- und Workflow-Metadaten an echte Sprachdetektion
- Ausbau des bestehenden Frontends zur linearen, industrialisierten Filtermaschine

Nicht enthalten:

- asynchrone Jobs oder Queue-Systeme
- mehrere Analysemodi im UI
- Provider-Vergleich oder Multi-Provider-Routing
- breitere Diskursanalysefunktionen ausserhalb des bestehenden Analyse-Contracts

## Fachliche Grundentscheidung

### 1. Backend zuerst fachlich echt machen

Die naechste Produktstufe muss zuerst echte Analyse und echte Sprachentscheidung liefern. Ohne diesen Schritt wuerde eine staerkere UI nur Stub-Daten inszenieren. Deshalb bleibt die API synchron, der Flow aber wird fachlich erweitert:

1. Sprache erkennen
2. bei zu niedriger Sicherheit sauber als `failed` beenden
3. OpenAI-Analyse erzeugen
4. gegen Schema/Pydantic validieren und bei Bedarf bounded repairen
5. Ergebnis und Metadaten persistieren

### 2. Sprachdetektion lokal, Analyse ueber OpenAI

Sprachdetektion und Analyse bleiben getrennte Probleme. Die Sprache soll lokal erkannt werden, damit dieser Schritt billig, schnell, testbar und vom eigentlichen LLM unabhaengig bleibt. Das eigentliche Analyse-Payload kommt danach ueber den produktiven OpenAI-Adapter.

Unterstuetzte Sprachen fuer diesen Ausbau:

- `de`
- `fr`
- `en`

Regel:

- bei `language_confidence < 0.80` wird der Lauf als `failed` gespeichert
- bei nicht unterstuetzter Sprache ebenfalls `failed`

### 3. Ein fester Analysemodus

Im UI gibt es weiterhin genau einen Analysemodus. Varianten wie `praezise`, `didaktisch` oder `kompakt` werden bewusst vertagt. So bleiben Prompt, Evaluation, Fehlfaelle und UX beherrschbar.

## Architektur

### Backend-Bausteine

Folgende Verantwortlichkeiten werden klar getrennt:

- `LanguageDetector`-Port plus lokale Standardimplementierung
- produktiver `AnalysisGenerator`-Adapter fuer OpenAI
- Workflow-Orchestrierung fuer Sprache, Analyse, Validation, Repair und Persistenz
- API bleibt nach aussen stabil

Erwartete Metadaten pro Run:

- `detected_language`
- `language_confidence`
- `model_id`
- `prompt_version`
- `run_status`
- `validation_status`
- `error_code`

Neue relevante Fehlerfaelle:

- `LANGUAGE_CONFIDENCE_TOO_LOW`
- `UNSUPPORTED_LANGUAGE`
- bestehende Validation-/Repair-Fehler bleiben erhalten

## Frontend-Richtung

### Bestehenden Workspace zur Filtermaschine ausbauen

Das Frontend wird nicht als neue App neu erfunden. Stattdessen wird der bestehende Workspace in eine lineare Maschinenstrecke umgebaut.

Visuelles Prinzip:

- der Problemtext ist Rohmaterial
- danach folgt eine sichtbare Kette aus Analyse- und Filterstationen
- die sechs Ebenen sind der Kern dieser Strecke
- Sprache, Analyse, Repair und Fehler sind als Maschinenzustand sichtbar

### Visuelle Sprache

Die App soll `industrial / mechanisch` wirken, nicht wie ein austauschbares Dashboard.

Erwartete Eigenschaften:

- klare Maschinenmodule statt bloßer Karten
- gerichteter Fluss von links nach rechts oder oben nach unten
- deutliche Material-/Filtermetapher
- gemeinsame visuelle Familie fuer alle sechs Stufen, aber mit klarer Differenzierung

Inszenierung der sechs Stufen:

1. `beobachtungen`: sachlich, messfeldartig
2. `erklaerungen`: verbindend, kausal
3. `emotionen`: dichter, druckvoller
4. `zuschreibungen`: markierend, etikettierend
5. `schlussfolgerungen`: verdichtend
6. `massnahmen`: ausleitend, handlungsgerichtet

### Informationsdichte

Standardzustand pro Stufe:

- Titel
- kurze Leitfrage
- Summary
- 2-3 sichtbare Punkte

Vertiefung per Interaktion:

- alle Punkte
- Run-Metadaten
- Validierungs- oder Fehlerdetails

## Status- und Fehlerdarstellung

Die Maschine zeigt nicht nur erfolgreiche Durchlaeufe. Gerade mit echter LLM-Integration muessen Unsicherheit und Fehler transparent sichtbar sein.

Darstellung:

- Sprachdetektion als frueher Checkpoint mit Sprache und Confidence
- laufende Analyse als aktivierte Strecke
- `repair` als sichtbarer Nachbearbeitungsschritt
- `failed` als Stop an der betroffenen Stelle, nicht nur als separates Banner

Beispiele:

- Sprachproblem stoppt vor der eigentlichen Filterstrecke
- Validation-/Repair-Problem stoppt im Analyse-/Pruefschritt
- gueltige Analyse fuellt alle sechs Filtermodule

## Testing

Backend:

- Unit-Tests fuer Sprachdetektion und Workflow-Fehlpfade
- Adapter-Tests ohne Netz fuer den Port
- klar isolierte Tests fuer niedrige Sprachsicherheit und nicht unterstuetzte Sprache

Frontend:

- Komponententests fuer Statusdarstellung und Maschinenmodule
- mindestens ein aktualisierter E2E-Pfad mit echter Statusanzeige

Integration:

- API-zu-Persistenz mit echter Sprachdetektion und injiziertem/fake LLM
- reale OpenAI-Integration nur dort, wo sie kontrolliert konfiguriert und explizit ausgefuehrt wird

## Risiken

- echte LLM-Integration kann Antwortzeiten und Formatdrift sichtbar machen
- Sprachdetektion kann bei kurzen oder gemischten Inputs haeufig in den `failed`-Pfad laufen
- starke UI-Inszenierung kann schnell in Show-Design statt Lesbarkeit kippen

## Definition of Done

Der Ausbau ist fertig, wenn:

- die API echte Sprachdetektion fuer `de`/`fr`/`en` ausfuehrt
- der Analysepfad produktiv ueber OpenAI laufen kann
- niedrige Sprachsicherheit und nicht unterstuetzte Sprache sauber persistiert und angezeigt werden
- das Frontend die Analyse als visuell erkennbare Filtermaschine darstellt
- die sechs Stufen sofort sichtbar sind und Summary plus 2-3 Punkte zeigen
- Tests und Dokumentation den neuen fachlichen Stand nachvollziehbar absichern
