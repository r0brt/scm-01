# 06 Laufzeitsicht

## Szenario 1: Verfuegbarkeitspruefung des Backends

1. Ein Client ruft `GET /health` am Backend auf.
2. Die FastAPI-Anwendung nimmt die Anfrage ohne weitere Abhängigkeiten entgegen.
3. Das Backend antwortet mit HTTP `200`.
4. Der Response-Body ist `{"status":"ok"}`.

## Szenario 2: Analyse eines Problemtexts via API v1

Die folgende textuelle Abfolge wird zusätzlich durch [docs/diagrams/uj1-sequence.puml](/Users/robert/code/scm-01/docs/diagrams/uj1-sequence.puml:1) visualisiert.

1. Ein Client sendet `POST /api/v1/analyses` mit einem Problemtext.
2. Das Backend erkennt zuerst lokal die dominante Sprache und bewertet die Sicherheit der Erkennung.
3. Bei zu geringer Sicherheit oder nicht unterstuetzter Sprache endet der Lauf sofort als `failed`; ein Run mit Fehlercode und Sprachmetadaten wird trotzdem persistiert.
4. Bei erfolgreicher Spracherkennung uebergibt das Backend die erkannte Sprache explizit an den konfigurierten Analyse-Adapter. Im Produktivpfad ist dies der OpenAI-Adapter, alternativ bleibt ein Stub-Pfad fuer Offline-Tests verfuegbar.
5. Der Adapter fordert die sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` im versionierten SCM-Vertrag aus `docs/scm.md`, `prompts/v2/analysis.md` und `schemas/analysis.schema.json` an und erzwingt dabei dieselbe Sprache wie im Eingabetext.
6. Das Backend validiert die Analyse gegen Schema und Pydantic-Modelle und fuehrt bei Bedarf einen begrenzten Repair-Loop aus.
7. Anschliessend prueft das Backend die dominante Sprache der gesamten Analyseausgabe. Bei Abweichung oder zu geringer Sicherheit endet der Lauf mit `OUTPUT_LANGUAGE_MISMATCH`.
8. Der Run wird mit Analyse-JSON oder Fehlerzustand, Validation-Report, Sprachmetadaten und Traceability-Feldern persistiert.
9. Die API antwortet synchron mit dem gespeicherten Run.

## Szenario 3: Retrieval und Rerun

1. Ein Client ruft `GET /api/v1/analyses` oder `GET /api/v1/analyses/{id}` auf.
2. Das Backend liest die gespeicherten Runs aus der Persistenz und liefert sie als API-Responses aus.
3. Bei `POST /api/v1/analyses/{id}/rerun` wird der urspruengliche `input_text` erneut verarbeitet.
4. Auch beim Rerun werden Spracherkennung, Analyse, Validierung und moeglicher Repair erneut durchlaufen.
5. Das System persistiert dafuer einen neuen Run; der alte Run bleibt unveraendert.
6. Eine Uebersetzung alter Analyse-Payloads in den neuen Vertrag findet nicht statt; der aktuelle Laufzeitpfad erwartet ausschliesslich das aktive SCM-Format.

## Szenario 4: Deterministische Entfaltung im Frontend

1. Die Benutzerin gibt einen Problemtext im `AnalysisComposer` ein und startet die Analyse.
2. `App.tsx` sendet den Text an `POST /api/v1/analyses` und setzt den UI-Zustand waehrenddessen auf `loading`.
3. Nach erfolgreicher Antwort wird der neue Run als selektierter Run gesetzt und ein `revealToken` erhoeht.
4. `usePipelineViewModel` erkennt den neuen Token und ueberfuehrt die Anzeige zuerst in den Zustand `result_received`.
5. Danach aktiviert der Hook die sechs Stages `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` in fester Reihenfolge mit einem Zeitintervall.
6. `PipelineView` rendert waehrend dieser Entfaltung einen Flow-Modus mit Fortschrittsleiste und genau einer sichtbaren aktiven Stage; abgeschlossene und zukuenftige Stages erscheinen dort nur als reduzierte Timeline-Knoten.
7. Nach Abschluss wechselt die UI in einen Review-Modus: alle sechs Stages werden gleichzeitig sichtbar, Details bleiben je Stage optional aufklappbar, und die `Essenz` bleibt standardmaessig geoeffnet.
8. Wird stattdessen ein historischer Run aus dem Archiv-Tab geladen, zeigt das Frontend den gespeicherten Endzustand direkt im Review-Modus ohne erneute Entfaltungsanimation.
9. Schlaegt die Analyse fehl oder liegt kein gueltiges `analysis_json` vor, wechselt die Ansicht in einen terminalen Fehlerzustand und zeigt Fehlercode sowie Fehlertext explizit an.
