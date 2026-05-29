# UI-Transparenz Design

## Ziel

Diese Runde ergänzt die bestehende Analyse-Eingabe um eine kleine, sichtbare Transparenzschicht direkt im Frontend. Nutzende sollen vor dem Start einer Analyse klar erkennen, dass sie mit einer KI-gestützten Funktion arbeiten, dass sensible Inhalte ungeeignet sind, dass Eingaben und Resultate gespeichert werden können und dass die Ausgabe keine Wahrheits- oder Rechtsprüfung darstellt.

## Ausgangslage

Die aktuelle Oberfläche ist bewusst fokussiert und reduziert. Der Analyse-Flow beginnt direkt mit dem Composer, enthält aber derzeit keinen ausdrücklichen Transparenzhinweis zu KI, Speicherung oder inhaltlichen Grenzen. Diese Information ist in der Doku inzwischen sauber beschrieben, in der UI selbst aber noch nicht sichtbar.

Gerade weil das bestehende UI inzwischen gestalterisch stimmig ist, darf diese Runde das Verhalten nicht verändern. Es geht nicht um neue Interaktionen, keinen Modal-Dialog, keine Checkbox und keine Blockierlogik, sondern um eine unaufdringliche, aber ehrliche sichtbare Einordnung.

## Scope

In Scope:

- ein subtiler Transparenzhinweis innerhalb des bestehenden Composer-Panels
- die vier vereinbarten Inhalte:
  - KI-gestützte Analyse
  - keine sensiblen/personenbezogenen Daten eingeben
  - Eingaben und Resultate können gespeichert werden
  - keine Wahrheits- oder Rechtsprüfung
- minimale Styling-Anpassungen in der bestehenden visuellen Sprache
- Testanpassung für die sichtbaren Texte
- ein zusätzlicher Live-Check im Browser nach der Implementierung

Out of Scope:

- jede Änderung am UI-Verhalten
- neue Interaktionen, Checkboxen, Modals oder Bestätigungsflows
- Backend-, API- oder Persistenzänderungen
- grössere Umgestaltung des Composer-Layouts

## Designentscheidung

Der Hinweis wird als kleine integrierte Infobox oder Microcopy-Gruppe direkt im bestehenden Composer dargestellt. Er soll sichtbar genug sein, um nicht als versteckte Fussnote durchzugehen, aber zurückhaltend genug, um die bestehende Wirkung des UI nicht zu stören.

Die Transparenz wird damit:

- an der relevanten Stelle sichtbar, nämlich direkt bei der Texteingabe
- nicht auf mehrere entfernte Stellen verteilt
- nicht durch Interaktionspflichten oder Warn-Mechaniken aufgeladen

## Inhaltliche Leitlinie

Die Sprache soll nicht juristisch oder alarmistisch klingen. Sie soll klar, ruhig und menschlich bleiben. Der Ton passt zur bestehenden App-Sprache und soll keinen „Banner-Alarm“-Eindruck erzeugen.

Der Hinweisblock soll deshalb kurz und scanbar sein. Er muss nicht exakt diese Formulierung übernehmen, soll aber inhaltlich alle vier Punkte vollständig abdecken.

## Platzierung

Die Platzierung erfolgt innerhalb von `AnalysisComposer`, im unmittelbaren Kontext von Textfeld und Submit-Button. Das Ziel ist, dass ein Nutzer den Hinweis beim Erfassen des Problemtexts natürlich mitliest, ohne dass der Rest des Flows umgebaut wird.

Geeignet sind insbesondere:

- direkt unter dem Textfeld
- oder zwischen Textfeld und Submit-Bereich

Nicht geeignet sind:

- globaler Banner ausserhalb des Composer-Kontexts
- separater Dialog
- versteckter Tooltip

## Technische Leitlinien

Es werden nur die bestehenden Frontend-Dateien für Struktur, Stil und Test angerührt:

- `frontend/src/components/AnalysisComposer.tsx`
- `frontend/src/styles.css`
- `frontend/src/App.test.tsx`

Der bestehende Datenfluss bleibt unverändert. Insbesondere bleiben unberührt:

- Submit-Logik
- Ladeverhalten
- Tab-Verhalten
- Reveal-/Pipeline-Logik
- Archiv-Interaktion

## Verifikation

Diese Runde braucht zwei Formen von Prüfung:

1. automatisierter Frontend-Test für die sichtbaren Transparenztexte
2. Live-Check im Browser, um zu prüfen:
   - bleibt der Hinweis gut lesbar
   - bleibt das Layout ruhig
   - wirkt der Composer nicht überladen
   - bleibt die mobile/kompakte Wirkung plausibel

## Definition of Done

- Transparenzhinweis ist im Composer sichtbar
- alle vier inhaltlichen Pflichtpunkte sind in der UI abgedeckt
- keine Änderung am UI-Verhalten
- Frontend-Tests und Build laufen
- Live-Check im Browser bestätigt, dass der Hinweis gestalterisch zum bestehenden UI passt
