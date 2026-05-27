# 04 Lösungsstrategie

## Kernstrategie

1. Zuerst ein modularer Monolith für schnelle, konsistente und betrieblich einfache Umsetzung.
2. Contract-First-JSON-Schema für Analyseausgaben.
3. Schema-Validierung strikt vor Persistenz.
4. Begrenzte Repair-Logik fuer ungueltige Modellausgaben ist als Guardrail vorbereitet (max. 2 Retries), im aktuellen Standardpfad aber noch nicht aktiv verdrahtet.
5. Unveränderliche Run-Datensätze mit vollständiger Traceability persistieren.

Diese Kernstrategie verfolgt einen bewusst pragmatischen Mittelweg: Das System soll technisch robust genug sein, um Verträge, Persistenz und Provider-Grenzen nachvollziehbar abzubilden, gleichzeitig aber klein genug bleiben, damit Implementierung, Testen und Dokumentation in einem Solo-Projekt beherrschbar bleiben.

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
- `run_status`
- `validation_status`
- `error_code` (bei Fehlschlag)

Stille Fallback-Heuristiken sind nicht erlaubt.

Diese Traceability-Felder sind kein Selbstzweck. Sie bilden die minimale technische Grundlage dafür, dass ein gespeicherter Run später erklärt, geprüft und von anderen Artefakten wie PRD, arc42, API-Vertrag und Testnachweisen in Beziehung gesetzt werden kann.

## Warum diese Strategie zum Projekt passt

Die gewählte Strategie passt zum Projekt, weil sie die wichtigsten Spannungen des Vorhabens direkt adressiert:

- LLM-Nutzung erzeugt Unsicherheit; deshalb wird die Ausgabe strikt validiert.
- Dokumentations- und Bewertungskontext verlangen Nachvollziehbarkeit; deshalb werden Metadaten und Architekturentscheidungen konsequent mitgeführt.
- Der verteilte Mindestbetrieb soll sichtbar sein, ohne unnötig in Microservices auszuufern; deshalb bleibt die Laufzeit bei `frontend`, `api` und `db` im Compose-Setup.

Die Lösungsstrategie ist damit weniger auf maximale technische Raffinesse ausgerichtet als auf einen kontrollierbaren, prüfbaren und sauber dokumentierten MVP.
