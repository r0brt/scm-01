# 10 Qualitätsszenarien

## QS1: Vertragskonforme Analyseausgabe

- Szenario: Ein Nutzer startet eine Analyse über API oder UI.
- Stimulus: Der Analyse-Workflow erzeugt ein JSON-Payload.
- Erwartung: Das Payload ist schema-valide im aktiven SCM-Vertrag mit `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz`, oder der Run wird explizit als `failed` mit `validation_report` und `error_code` persistiert.
- Nachweis: Contract- und Validation-Tests im Backend sowie persistierte Run-Metadaten.

## QS2: Nachvollziehbarer Analyse-Run

- Szenario: Ein Maintainer oder Evaluator prüft einen bereits gelaufenen Analyse-Run.
- Stimulus: Ein Run wird über API oder Datenbank erneut betrachtet.
- Erwartung: `input_text`, `analysis_json`, `validation_report`, `model_id`, `prompt_version`, `run_status` und `validation_status` sind nachvollziehbar gespeichert.
- Nachweis: Persistenztests, API-Detailabruf und Datenmodell `runs`.

## QS3: Reproduzierbare lokale Ausführung

- Szenario: Das System soll auf einer frischen lokalen Umgebung erneut gestartet und getestet werden.
- Stimulus: Ein Maintainer fuehrt die dokumentierten `uv`, `npm` und `docker compose` Commands aus.
- Erwartung: Backend-Tests und Frontend-Build laufen reproduzierbar; fuer Compose- und E2E-Nachweise sind die jeweils dokumentierten lokalen Voraussetzungen und Grenzen sichtbar.
- Nachweis: README-Kommandos, `docs/test-report.md`, dokumentierte Freeze-/Re-Onboarding-Nachweise sowie die beschriebenen lokalen Voraussetzungen fuer Compose und Playwright.

## QS4: Kritische Nutzerreise UJ1

- Szenario: Ein Endnutzer gibt einen Problemtext ein und startet eine Analyse im Frontend.
- Stimulus: Texteingabe und Klick auf `Analyse starten`.
- Erwartung: Ein neuer Run wird erzeugt und die Pipeline mit den sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` wird sichtbar.
- Nachweis: Playwright-Journey-Test fuer UJ1 mit gemockter API sowie ergaenzende Backend-, API- und Persistenztests fuer den darunterliegenden Laufzeitpfad.

## QS5: Deterministische Sprachvorpruefung

- Szenario: Ein Nutzer sendet einen Text in `de`, `fr`, `en` oder in einer schlecht erkennbaren Mischform.
- Stimulus: Start eines Analyse-Runs über API oder UI.
- Erwartung: Das System erkennt unterstützte Sprachen lokal mit Confidence-Wert; bei `confidence < 0.80` oder nicht unterstützter Sprache endet der Run explizit als `failed`.
- Nachweis: Backend-Tests für Sprachdetektion, Workflow und API.

## QS6: Reale Providerintegration ohne Netz in Tests

- Szenario: Die produktive Analyse soll OpenAI verwenden, während Testläufe offline und reproduzierbar bleiben.
- Stimulus: Konfiguration von `SCM_ANALYSIS_PROVIDER=openai` im Laufzeitsystem bzw. Fake-Adapter in Tests.
- Erwartung: Der Produktionspfad verwendet den OpenAI-Adapter und fordert den aktiven SCM-Vertrag aus Prompt und Schema an; Tests bleiben ohne externe Netzaufrufe stabil.
- Nachweis: Adapter- und App-Factory-Tests mit injizierten Fakes sowie dokumentierte Laufzeitkonfiguration.

## QS7: Begrenzte Weitergabe sensibler Freitexte

- Szenario: Ein Nutzer erfasst einen problemnahen Freitext, der personenbezogene oder anderweitig sensible Angaben enthalten kann.
- Stimulus: Der Analyse-Run wird über API oder UI gestartet.
- Erwartung: Das System behandelt `input_text` als potenziell sensibel, dokumentiert die externe Provider-Weitergabe als bewusste Betriebsannahme und beschränkt die gespeicherten Nachweise auf Input, Analyse, Metadaten und Validierungsreport ohne zusätzliche stille Anreicherung.
- Nachweis: Datenmodell `runs`, API-Detailabruf, Betriebsdokumentation und Architekturkapitel zu Laufzeit- und Datenschutzannahmen.

## QS8: Verständlichkeit als KI-gestützte Analysehilfe

- Szenario: Ein Nutzer, Maintainer oder Stakeholder betrachtet ein Analyseergebnis und leitet daraus weitere Diskussionen ab.
- Stimulus: Ein gespeicherter Run wird in UI, API oder Dokumentation erklärt.
- Erwartung: Das System bleibt als KI-gestützte Analysehilfe verständlich und wird nicht als Wahrheitsmaschine beschrieben; Unsicherheit, Modellbezug und die Nicht-Ziele der fachlichen Bewertung bleiben nachvollziehbar.
- Nachweis: PRD-Nicht-Ziele, API-Vertrag, persistierte Run-Metadaten und arc42-Kapitel zu Qualitätszielen, Governance und Risiken.

## QS9: Erklärbarer Audit-Pfad pro gespeichertem Run

- Szenario: Ein Maintainer untersucht nachträglich, weshalb ein bestimmter Run zustande kam oder weshalb er fehlgeschlagen ist.
- Stimulus: Ein gespeicherter Run wird über API oder Datenbank mit seinem Detailkontext geöffnet.
- Erwartung: Der Run lässt sich mindestens über `input_text`, `analysis_json`, `validation_report`, `model_id`, `prompt_version`, `run_status`, `validation_status` und bekannte Audit-Lücken erklären, sodass der Interpretationsrahmen sichtbar bleibt.
- Nachweis: Persistenzmodell `runs`, Detailansicht der Analyse-Runs, Dokumentation zu Audit-Grenzen und gezielte Persistenztests.
