# ADR-0004: LLM-Adapter und Prompt-Versionierung

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Providerzugriff wird hinter einem expliziten Adapter-Port gekapselt. Prompt-Dateien werden versioniert unter `prompts/v*/` abgelegt; der aktuelle Produktivpfad verwendet `prompts/v2/analysis.md`. Jeder Run persistiert `model_id` und `prompt_version`.

## Kontext

Die Analyseerzeugung ist modellabhängig und mit Stub-, Test- und OpenAI-Pfad bewusst hinter derselben Schnittstelle gekapselt. API, Validierung und Persistenz sollen nicht direkt an einen einzelnen Anbieter gekoppelt werden. Gleichzeitig muss die Herkunft eines erzeugten Analyse-Runs nachvollziehbar bleiben.

## Konsequenzen

Positiv:

- Stub-, Test- und OpenAI-Implementierungen bleiben austauschbar.
- Prompt- und Modellherkunft eines Runs ist auditierbar.
- Tests können komplett ohne Netz laufen.

Negativ:

- Zusätzliche Abstraktionsebene im Backend.
- Der OpenAI-Pfad benötigt gültige Runtime-Konfiguration und bleibt von externer Provider-Verfügbarkeit abhängig.

## Betrachtete Alternativen

- Direkte OpenAI-Aufrufe im Workflow-Code.
- Prompts inline im Code statt versionierten Dateien.
- Keine Persistenz von Prompt- oder Modellmetadaten.

## Begründung

Der Adapter-Port ist die passende technische Grenze für Zuverlässigkeit, Testbarkeit und spätere Evolvierbarkeit. Prompt-Versionierung und persistierte Traceability-Felder machen Analyseergebnisse nachvollziehbar, ohne die restliche Architektur an einen Provider zu koppeln.
