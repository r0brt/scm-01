# Lösungsstrategie

## Kernstrategie

1. Zuerst ein modularer Monolith für schnelle, konsistente und betrieblich einfache Umsetzung.
2. Contract-First-JSON-Schema für Analyseausgaben.
3. Analyse-Payloads strikt validieren und nur gültige Payloads als `completed` persistieren; Validierungsfehler bleiben als explizite `failed` Runs nachvollziehbar.
4. Unveränderliche Run-Datensätze mit vollständiger Traceability persistieren.

Diese Kernstrategie verfolgt einen pragmatischen Mittelweg. Das System soll robust genug sein, um Verträge, Persistenz und Provider-Grenzen nachvollziehbar abzubilden. Gleichzeitig bleibt es klein genug, damit Implementierung, Testen und Dokumentation in einem Solo-Projekt beherrschbar bleiben.

Als Erweiterungspunkt ist eine begrenzte Repair-Logik für ungültige Modellausgaben vorbereitet. Sie ist jedoch nicht Teil des aktiven Standardpfads und wird deshalb nicht als tragender Pfeiler der aktuellen Kernstrategie behandelt.

## Strategische Leitgedanken

Die Lösungsstrategie stützt sich auf vier zentrale Leitgedanken:

- Erst Verträge, dann Komfort: Formal kontrollierbare Payloads und klare Fehlersemantik sind wichtiger als möglichst flexible Ausgabeformen.
- Lokale Reproduzierbarkeit vor operativer Vollreife: Der MVP priorisiert einen sauber nachvollziehbaren Entwicklungs- und Zielbetrieb über Docker Compose, nicht ein vollständiges Produktionssetup.
- Austauschbare KI-Integration statt direkter Anbieterbindung: Der Provider bleibt hinter einem Adapter-Port, damit Stub-, Test- und OpenAI-Pfad voneinander getrennt bleiben.
- Sichtbare Grenzen statt impliziter Annahmen: Datenschutz, Governance, Audit-Lücken und Betriebsgrenzen werden dokumentiert, nicht versteckt.

## Reliability und Traceability

Jeder Analyse-Run speichert mindestens:

- `prompt_version`
- `model_id`
- `correlation_id`
- `validation_report`
- `detected_language` und `language_confidence`
- `run_status`
- `validation_status`
- `error_code` (bei Fehlschlag)
- `created_at`

Stille Fallback-Heuristiken sind nicht erlaubt.

Diese Traceability-Felder sind kein Selbstzweck. Sie bilden die minimale technische Grundlage dafür, dass ein gespeicherter Run später erklärt, geprüft und von anderen Artefakten wie PRD, arc42, API-Vertrag und Testnachweisen in Beziehung gesetzt werden kann.

## Warum diese Strategie zum Projekt passt

Die gewählte Strategie passt zum Projekt, weil sie die wichtigsten Spannungen des Vorhabens direkt adressiert:

- LLM-Nutzung erzeugt Unsicherheit; deshalb wird die Ausgabe strikt validiert.
- Dokumentations- und Nachvollziehbarkeitskontext verlangen Transparenz; deshalb werden Metadaten und Architekturentscheidungen konsequent mitgeführt.
- Der verteilte Mindestbetrieb soll sichtbar sein, ohne unnötig in Microservices auszuufern; deshalb bleibt die Laufzeit bei `frontend`, `api` und `db` im Compose-Setup.

Die Lösungsstrategie ist damit auf einen kontrollierbaren, prüfbaren und sauber dokumentierten MVP ausgerichtet, nicht auf vorgezogene Produktionskomplexität.
