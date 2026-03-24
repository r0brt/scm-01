# Analyse/Archiv IA Design

## Ziel

Das Frontend soll auf eine klare Informationsarchitektur mit zwei Top-Level-Bereichen reduziert werden: `Analyse` als Arbeitsflaeche und `Archiv` als Zugriff auf bestehende Runs. Die Pipeline bleibt das primaere Anzeigeformat fuer Ergebnisse, waehrend der Verlauf aus der Analyseflaeche entfernt wird.

## Kontext

Der aktuelle Frontend-Stand mischt Eingabe, aktive Pipeline und Verlauf in derselben Ansicht. Das erhoeht die visuelle Last und erschwert den schnellen Zugriff auf den eigentlichen Analysezustand. Der PRD verlangt sowohl die Pipeline-Darstellung (`FR6`) als auch das Wiederfinden vergangener Runs (`UJ2`), aber nicht deren Gleichzeitigkeit in derselben Ansicht.

Referenzen:

- `AGENTS.md`
- `PLAN.md`
- `docs/prd.md`

## Scope

Enthalten:

- zwei Tabs `Analyse` und `Archiv`
- kompakte Eingabesektion `Problem eingeben`
- Pipeline als Hauptfokus der Analyse-Ansicht
- leerer Analysezustand ohne Run
- Archivliste, auch bei null Runs verfuegbar
- Klick auf Archiv-Eintrag laedt Run, uebernimmt `Problemtext` und wechselt automatisch zu `Analyse`
- reduzierte, schnell scannbare Stage-Inhalte mit maximal 2-3 Bullet Points

Nicht enthalten:

- Backend- oder API-Aenderungen
- neue Archivfilter oder Suche
- neue Statusleisten, Hilfetexte oder technische Zusatzansichten
- fachliche Aenderungen an bestehenden Run-Daten

Explizite Abweichung vom bisherigen MVP-Frontend:

- Auf ausdruecklichen User-Wunsch wird der sichtbare JSON-Button aus dieser Ansicht entfernt.
- Metadaten und Detaildaten bleiben ueber die bestehende Run-Detail-API erhalten, werden in diesem Refactor aber nicht mehr als dominante Primaerflaeche inszeniert.

## Informationsarchitektur

### Analyse

Die Analyse-Ansicht hat genau zwei funktionale Bereiche:

1. kompakter Eingabeblock oben
2. Pipeline darunter als dominanter Hauptbereich

Der Eingabeblock ist bewusst sekundaer gestaltet. Er bleibt erreichbar, soll aber nicht mit der Pipeline konkurrieren.

Wenn noch kein Run gestartet oder geladen wurde, zeigt die Analyseflaeche weiterhin den Eingabeblock und darunter einen klaren Leerzustand:

- `Noch keine Analyse gestartet`

### Archiv

Das Archiv ist ein eigener Top-Level-Tab und bleibt immer erreichbar. Die Ansicht zeigt eine Liste der vorhandenen Runs oder bei leerem Zustand nur die leere Liste bzw. einen neutralen Hinweis.

Jeder Eintrag ist klickbar. Ein Klick:

1. laedt den Run per bestehender Detail-API
2. setzt ihn als selektierten Run
3. uebernimmt `input_text` in das Eingabefeld
4. wechselt direkt zum Tab `Analyse`

Damit bleibt das Archiv primaer Auswahlflaeche. Die eigentliche Detailansicht eines Runs findet nach dem Wechsel in `Analyse` ueber die Pipeline statt.

Falls das Nachladen eines Archiv-Runs fehlschlaegt:

- der Tab bleibt auf `Archiv`
- die bisherige Auswahl bleibt unveraendert
- die bestehende Fehleranzeige wird weiterverwendet

## Pipeline-Verhalten

Die Pipeline bleibt vertikal und zeigt immer die sechs fachlichen Ebenen in fixer Reihenfolge.

Reduktionsregeln:

- keine beschreibenden Absaetze
- pro Stage hoechstens 2-3 Bullet Points
- keine langen Saetze

Fokusregeln:

- aktive Stage ist visuell hervorgehoben
- inaktive Stages sind bewusst entschaerft
- im Endzustand bleiben alle sechs sichtbar
- `Essenz` erhaelt die staerkste visuelle Betonung

Technische Marker fuer diese Regeln:

- aktive bzw. reduzierte Zustande werden ueber `data-stage-density` markiert
- die besondere Hervorhebung von `Essenz` wird ueber `data-stage-emphasis="essenz"` markiert
- das Archiv bleibt ein eigener `tabpanel`, die Pipeline erscheint nur im `Analyse`-`tabpanel`

Fehlerfaelle bleiben innerhalb derselben Pipeline-Struktur sichtbar. Es gibt keine separate globale Statusleiste mehr.

## Komponentenrichtung

- `App.tsx` steuert nur noch Tab, Auswahlzustand, Eingabetext und API-Interaktionen.
- `AnalysisComposer` bleibt der kompakte Eingabeblock.
- `RunHistoryPanel` wird zur Archivliste ohne Mischlogik.
- `PipelineView` rendert die reduzierte Pipeline fuer leer, laufend, abgeschlossen und fehlgeschlagen.
- `Stage` bleibt die gemeinsame Darstellungseinheit pro Ebene.

## Testing

Es braucht aktualisierte Frontend-Tests fuer:

- Tab-Struktur und Leerzustand
- Archiv-Zugriff auch ohne Runs
- automatisches Laden eines Runs aus dem Archiv inklusive Uebernahme des Problemtexts
- Fehlerfall beim Laden eines Archiv-Runs
- reduzierte Pipeline-Dichte
- aktive Stage im Laufzustand
- betonte `Essenz` im Endzustand

## Definition of Done

Die Aenderung ist fertig, wenn:

- genau zwei Tabs sichtbar sind: `Analyse` und `Archiv`
- Verlauf und Pipeline nicht mehr in derselben Ansicht gemischt sind
- die Analyse-Ansicht ohne Run den Text `Noch keine Analyse gestartet` zeigt
- das Archiv auch ohne Runs erreichbar bleibt
- ein Archiv-Klick den Run laedt, den Problemtext uebernimmt und zu `Analyse` wechselt
- JSON-Export, globale Statusleisten, Erklaertexte und alte Labels entfernt sind
- Frontend-Tests und Build erfolgreich laufen
