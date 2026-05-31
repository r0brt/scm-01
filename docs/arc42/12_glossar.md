# Glossar

Dieses Glossar bündelt zentrale Projektbegriffe, damit PRD, arc42, ADRs und Implementierung konsistent über dieselben Konzepte sprechen.

## Begriffe

- Analyse-Run: Ein einzelner gespeicherter Verarbeitungslauf für einen eingegebenen Problemtext inklusive Analyseergebnis, Validierungsreport und Metadaten.
- API-Fehlervertrag: Einheitliche Struktur für technische und fachliche Fehlerantworten mit `code`, `message`, `details` und `correlation_id`.
- Audit-Lücke: Bekannte Grenze der Nachvollziehbarkeit, an der ein Run nicht jeden technischen oder organisatorischen Kontext vollständig erklären kann.
- Bounded Repair: Strikt begrenzter Reparaturmechanismus für formal ungültige Modell-Ausgaben; im Projektkontext maximal zwei Versuche.
- Compose-Zielbetrieb: Der lokal reproduzierbare verteilte Mindestbetrieb über die Container `frontend`, `api` und `db`.
- Contract-First: Vorgehen, bei dem Schema, Struktur und Schnittstellen vor oder mindestens gemeinsam mit der eigentlichen Implementierung festgelegt werden.
- LLM-Adapter: Abstraktionsschicht zwischen Anwendungscode und konkretem KI-Anbieter wie OpenAI oder Stub-Implementierungen.
- Prompt-Version: Versionierte Kennzeichnung der fachlichen Prompt-Grundlage eines Analyse-Runs.
- SCM-Vertrag: Der fachliche und technische Analysevertrag mit den sechs festen Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz`.
- Stub-Pfad: Lokaler oder testbezogener Analysepfad ohne externen Provider-Aufruf.
- Traceability: Nachvollziehbarkeit eines Runs über gespeicherte Metadaten, Validierungsartefakte und dokumentierte Architekturgrenzen.
- Validierungsreport: Strukturierter technischer Prüfpfad eines Runs über Schema-, Modell- und gegebenenfalls Sprachprüfungen.
