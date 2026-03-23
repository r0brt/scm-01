# ADR-0004: LLM-Adapter und Prompt-Versionierung

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Providerzugriff wird hinter einem expliziten Adapter-Port gekapselt. Prompt-Dateien werden versioniert unter `prompts/v*/` abgelegt; der aktuelle Produktivpfad verwendet `prompts/v2/analysis.md`. Jeder Run persistiert `model_id` und `prompt_version`.

## Kontext

Die Analyseerzeugung ist modellabhaengig und soll spaeter mit einem echten Provider verbunden werden, ohne API, Validierung oder Persistenz direkt an einen einzelnen Anbieter zu koppeln. Gleichzeitig muss die Herkunft eines erzeugten Analyse-Runs nachvollziehbar bleiben.

## Konsequenzen

Positiv:

- Stub-, Test- und spaetere Provider-Implementierungen bleiben austauschbar.
- Prompt- und Modellherkunft eines Runs ist auditierbar.
- Tests koennen komplett ohne Netz laufen.

Negativ:

- Zusätzliche Abstraktionsebene im Backend.
- Ein echter Provideradapter muss spaeter noch separat operationalisiert werden.

## Betrachtete Alternativen

- Direkte OpenAI-Aufrufe im Workflow-Code.
- Prompts inline im Code statt versionierten Dateien.
- Keine Persistenz von Prompt- oder Modellmetadaten.

## Begründung

Der Adapter-Port ist die passende technische Grenze fuer Zuverlaessigkeit, Testbarkeit und spaetere Evolvierbarkeit. Prompt-Versionierung und persistierte Traceability-Felder machen Analyseergebnisse nachvollziehbar, ohne die restliche Architektur an einen Provider zu koppeln.
