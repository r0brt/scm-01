# Projektidee: Social Clean-Up Machine

> Hinweis: Dieses Dokument hält die ursprüngliche Projektidee fest. Für den aktuellen verbindlichen Projektstand gelten `docs/prd.md`, `schemas/analysis.schema.json`, `backend/app/models/analysis.py`, `prompts/v2/analysis.md` sowie die arc42-Dokumentation. `docs/scm.md` dient als fachlicher Hintergrund und nicht als alleinige Quelle des Laufzeitvertrags.

**CAS AI-Assisted Software Engineering**  
**Autor:** Robert Haemmerli  
**Aufgabe:** Projektidee  
**Datum:** 18.02.2026

---

## Vision

Komplexe gesellschaftliche Problemstellungen sollen so aufbereitet werden, dass argumentative Ebenen klar voneinander getrennt sichtbar werden.

Symptome, Ursachenannahmen, Emotionen, Narrative und vereinfachende Zuschreibungen werden transparent strukturiert, sodass Diskussionen nachvollziehbarer und differenzierter geführt werden können.

Die *Social Clean-Up Machine* versteht sich als Instrument zur strukturellen Klärung, nicht zur inhaltlichen Bewertung. Ziel ist es, den Kern eines Problems sichtbar zu machen und argumentative Vermischungen systematisch offenzulegen.

---

## Lösungsansatz

Die Applikation verarbeitet frei formulierte Texte zu gesellschaftlichen Problemstellungen in einem mehrstufigen Analyseprozess.

Die Resultate werden:

- in einem strukturierten Format ausgegeben
- visuell innerhalb einer Web-Applikation dargestellt

Die Darstellung basiert auf einer Filter- und Reinigungsmetapher. Ein Eingangstext wird durch sechs Filter geführt, wobei sichtbar wird, welche Aussagen auf welcher Ebene verbleiben.

### Analyse-Ebenen

Die sechs verbindlichen Analyse-Ebenen für SCM sind:

- `symptome` - beobachtbare Phänomene
- `ursachen` - Erklärungsansätze
- `emotionen` - dominierende Gefühle
- `narrative` - verbreitete Erzählmuster oder Frames
- `mythen` - Fehlannahmen und vereinfachende Zuschreibungen
- `essenz` - verdichtete, wertfreie Kernaussage

### Verarbeitung und Qualitätssicherung

Die Verarbeitung erfolgt nicht als isolierte Modellabfrage, sondern innerhalb klar definierter Regeln:

- feste Ausgabeformate
- Konsistenzprüfungen
- Validierungsmechanismen

Ziel ist eine reproduzierbare Verarbeitungskette statt einer einmaligen, schwer nachvollziehbaren Modellantwort.

Die Resultate:

- liegen in einem maschinenlesbaren Format vor
- können standardisiert weiterverarbeitet werden

Bei Abweichungen, zum Beispiel fehlenden Ebenen oder Inkonsistenzen, wird das Resultat im aktuellen Standardlaufzeitpfad als fehlerhaft markiert und mit Validierungsreport sowie Fehlercode persistiert. Eine separate bounded Repair-Logik ist im Repository vorbereitet, aber nicht in den Standardlaufzeitpfad eingebunden.

---

## Stakeholder

- **Studierende und Lehrpersonen**  
  Didaktische Unterstützung zur Analyse komplexer Argumentationen und Förderung reflektierter Diskussionen

- **Organisationen (Diskurs-Analyse)**  
  Strukturierte Aufarbeitung von Problemstellungen als Entscheidungsgrundlage oder zur Konfliktklärung

- **Fachpersonen KI-gestützte Software-Entwicklung**
  Demonstrator für kontrollierten, nachvollziehbaren KI-Einsatz in Architekturkontext

- **Bildungsinstitutionen (FH/Uni)**  
  Werkzeug für Forschung, Seminare und Methodentraining

---

## Kundenbedürfnis

Gesellschaftliche Debatten vermischen häufig:

- Beobachtungen
- Bewertungen
- Emotionen
- implizite Annahmen

Dies führt zu:

- Missverständnissen
- verkürzten Schlussfolgerungen
- ineffektiven Massnahmen

### Beitrag der Lösung

Die Anwendung ermöglicht:

- systematische Entflechtung komplexer Problemtexte
- klare Trennung argumentativer Ebenen
- Sichtbarmachung von Ursache-Wirkungs-Zusammenhängen
- Offenlegung impliziter Narrative
- Erkennung verbreiteter Vereinfachungen

**Nutzen:** strukturierte Grundlage für Analyse, Diskussion und Entscheidungsfindung

---

## Wichtigste Funktionen

- Erfassung freier Problemtexte
- KI-gestützte, strukturierte Schichtenanalyse
- Validierung und Konsistenzprüfung der Analyseergebnisse
- Persistente Speicherung von Eingaben und Resultaten
- Visuelle Darstellung der sechs Ebenen in der Web-Applikation
- Bereitstellung über klar definierte Schnittstellen
