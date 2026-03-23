# Projektidee: Social Clean-Up Machine

**CAS AI-Assisted Software Engineering**  
**Autor:** Robert Haemmerli  
**Aufgabe:** Projektidee  
**Datum:** 18.02.2026

---

## Vision

Komplexe gesellschaftliche Problemstellungen sollen so aufbereitet werden, dass argumentative Ebenen klar voneinander getrennt sichtbar werden.

Symptome, Ursachenannahmen, Emotionen, Narrative und vereinfachende Zuschreibungen werden transparent strukturiert, sodass Diskussionen nachvollziehbarer und differenzierter gefuehrt werden koennen.

Die *Social Clean-Up Machine* versteht sich als Instrument zur strukturellen Klaerung, nicht zur inhaltlichen Bewertung. Ziel ist es, den Kern eines Problems sichtbar zu machen und argumentative Vermischungen systematisch offenzulegen.

---

## Loesungsansatz

Die Applikation verarbeitet frei formulierte Texte zu gesellschaftlichen Problemstellungen in einem mehrstufigen Analyseprozess.

Die Resultate werden:

- in einem strukturierten Format ausgegeben
- visuell innerhalb einer Web-Applikation dargestellt

Die Darstellung basiert auf einer Filter- und Reinigungsmetapher. Ein Eingangstext wird durch sechs Filter gefuehrt, wobei sichtbar wird, welche Aussagen auf welcher Ebene verbleiben.

### Analyse-Ebenen

Die sechs verbindlichen Analyse-Ebenen fuer SCM sind:

- `symptome` - beobachtbare Phaenomene
- `ursachen` - Erklaerungsansaetze
- `emotionen` - dominierende Gefuehle
- `narrative` - verbreitete Erzaehlmuster oder Frames
- `mythen` - Fehlannahmen und vereinfachende Zuschreibungen
- `essenz` - verdichtete, wertfreie Kernaussage

### Verarbeitung und Qualitaetssicherung

Die Verarbeitung erfolgt nicht als isolierte Modellabfrage, sondern innerhalb klar definierter Regeln:

- feste Ausgabeformate
- Konsistenzpruefungen
- Validierungsmechanismen

Ziel ist eine reproduzierbare Verarbeitungskette statt einer einmaligen, schwer nachvollziehbaren Modellantwort.

Die Resultate:

- liegen in einem maschinenlesbaren Format vor
- koennen standardisiert weiterverarbeitet werden

Bei Abweichungen, zum Beispiel fehlenden Ebenen oder Inkonsistenzen:

- wird das Resultat als fehlerhaft markiert
- erfolgt eine erneute Generierung ueber einen Korrekturschritt

---

## Stakeholder

- **Studierende und Lehrpersonen**  
  Didaktische Unterstuetzung zur Analyse komplexer Argumentationen und Foerderung reflektierter Diskussionen

- **Organisationen (Diskurs-Analyse)**  
  Strukturierte Aufarbeitung von Problemstellungen als Entscheidungsgrundlage oder zur Konfliktklaerung

- **Fachpersonen KI-gestuetzte Software-Entwicklung**  
  Demonstrator fuer kontrollierten, nachvollziehbaren KI-Einsatz in Architekturkontext

- **Bildungsinstitutionen (FH/Uni)**  
  Werkzeug fuer Forschung, Seminare und Methodentraining

---

## Kundenbeduerfnis

Gesellschaftliche Debatten vermischen haeufig:

- Beobachtungen
- Bewertungen
- Emotionen
- implizite Annahmen

Dies fuehrt zu:

- Missverstaendnissen
- verkuerzten Schlussfolgerungen
- ineffektiven Massnahmen

### Beitrag der Loesung

Die Anwendung ermoeglicht:

- systematische Entflechtung komplexer Problemtexte
- klare Trennung argumentativer Ebenen
- Sichtbarmachung von Ursache-Wirkungs-Zusammenhaengen
- Offenlegung impliziter Narrative
- Erkennung verbreiteter Vereinfachungen

**Nutzen:** strukturierte Grundlage fuer Analyse, Diskussion und Entscheidungsfindung

---

## Wichtigste Funktionen

- Erfassung freier Problemtexte
- KI-gestuetzte, strukturierte Schichtenanalyse
- Validierung und Konsistenzpruefung der Analyseergebnisse
- Persistente Speicherung von Eingaben und Resultaten
- Visuelle Darstellung der sechs Ebenen in der Web-Applikation
- Bereitstellung ueber klar definierte Schnittstellen
